package com.example.report.registry;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.regex.Pattern;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.stereotype.Component;
import org.springframework.util.StreamUtils;

@Component
public class ReportRegistry {

    private static final Logger log = LoggerFactory.getLogger(ReportRegistry.class);
    private static final Pattern SAFE_IDENTIFIER = Pattern.compile("^[a-zA-Z_][a-zA-Z0-9_.]*$");

    /**
     * SQL file path whitelist. Relative paths only; no traversal, no absolute,
     * no scheme prefix. Subdirectory must be {@code sql/}.
     */
    private static final Pattern SAFE_SQL_FILE_PATH = Pattern.compile(
            "^sql/[a-zA-Z0-9][a-zA-Z0-9_.\\-]*\\.sql$");

    private static final Pattern UNSAFE_SQL = Pattern.compile(
            "(?i)\\b(DROP|DELETE|UPDATE|INSERT|EXEC|EXECUTE|xp_|sp_|ALTER|CREATE|TRUNCATE|MERGE)\\b");

    private final ConcurrentHashMap<String, ReportDefinition> definitions = new ConcurrentHashMap<>();
    /** Cache of hydrated SQL content (sourceQueryFile + outerQueryFile) per report key. */
    private final ConcurrentHashMap<String, String> hydratedSourceSql = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, String> hydratedOuterSql = new ConcurrentHashMap<>();

    private final ObjectMapper objectMapper;
    private final String definitionsPath;

    public ReportRegistry(ObjectMapper objectMapper,
                          @Value("${report.definitions-path:classpath:reports/}") String definitionsPath) {
        this.objectMapper = objectMapper;
        this.definitionsPath = definitionsPath;
    }

    @PostConstruct
    public void loadDefinitions() {
        try {
            PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();
            String pattern = definitionsPath.endsWith("/") ? definitionsPath + "*.json" : definitionsPath + "/*.json";
            Resource[] resources = resolver.getResources(pattern);

            for (Resource resource : resources) {
                try {
                    ReportDefinition def = objectMapper.readValue(resource.getInputStream(), ReportDefinition.class);
                    validate(def);
                    hydrateSqlFiles(def);
                    definitions.put(def.key(), def);
                    log.info("Loaded report definition: {} ({})", def.key(), def.title());
                } catch (Exception e) {
                    log.error("Failed to load report definition from {}: {}", resource.getFilename(), e.getMessage());
                }
            }

            log.info("Report registry initialized with {} definitions", definitions.size());
        } catch (IOException e) {
            log.warn("Could not scan report definitions directory: {}", e.getMessage());
        }
    }

    public Optional<ReportDefinition> get(String key) {
        return Optional.ofNullable(definitions.get(key));
    }

    public Collection<ReportDefinition> getAll() {
        return definitions.values();
    }

    public List<String> getCategories() {
        return definitions.values().stream()
                .map(ReportDefinition::category)
                .distinct()
                .sorted()
                .toList();
    }

    /**
     * Returns the effective source query for the report.
     * <p>If a {@code sourceQueryFile} was configured, returns the hydrated content;
     * otherwise returns the inline {@link ReportDefinition#sourceQuery()}.
     * Returns null if neither is configured.
     */
    public String getEffectiveSourceQuery(ReportDefinition def) {
        String hydrated = hydratedSourceSql.get(def.key());
        if (hydrated != null) {
            return hydrated;
        }
        return def.sourceQuery();
    }

    /**
     * Returns the effective outer query (post-union projection/window) for the report,
     * or null if {@code outerQueryFile} was not configured.
     */
    public String getEffectiveOuterQuery(ReportDefinition def) {
        return hydratedOuterSql.get(def.key());
    }

    private void validate(ReportDefinition def) {
        if (def.source() != null && !def.source().isBlank() && !SAFE_IDENTIFIER.matcher(def.source()).matches()) {
            throw new IllegalArgumentException(
                    "Report source '" + def.source() + "' contains unsafe characters. Only alphanumeric, underscore, and dot allowed.");
        }
        if (!SAFE_IDENTIFIER.matcher(def.sourceSchema()).matches()) {
            throw new IllegalArgumentException(
                    "Report sourceSchema '" + def.sourceSchema() + "' contains unsafe characters. Only alphanumeric, underscore, and dot allowed.");
        }
        // Inline sourceQuery is checked here. File-based queries are checked in hydrateSqlFiles().
        if (def.sourceQuery() != null && !def.sourceQuery().isBlank()) {
            if (UNSAFE_SQL.matcher(def.sourceQuery()).find()) {
                throw new IllegalArgumentException(
                        "Report sourceQuery in '" + def.key() + "' contains unsafe SQL keywords.");
            }
        }
        // Validate query file paths up front (defense-in-depth before classpath read).
        validateSqlFilePath(def.key(), "sourceQueryFile", def.sourceQueryFile());
        validateSqlFilePath(def.key(), "outerQueryFile", def.outerQueryFile());
        for (ColumnDefinition col : def.columns()) {
            if (!SAFE_IDENTIFIER.matcher(col.field()).matches()) {
                throw new IllegalArgumentException(
                        "Column field '" + col.field() + "' in report '" + def.key() + "' contains unsafe characters.");
            }
        }
    }

    private void validateSqlFilePath(String reportKey, String fieldName, String path) {
        if (path == null || path.isBlank()) {
            return;
        }
        if (path.contains("..") || path.startsWith("/") || path.contains(":")) {
            throw new IllegalArgumentException(
                    "Report '" + reportKey + "' " + fieldName + " path '" + path
                            + "' is not allowed (no traversal, absolute, or scheme).");
        }
        if (!SAFE_SQL_FILE_PATH.matcher(path).matches()) {
            throw new IllegalArgumentException(
                    "Report '" + reportKey + "' " + fieldName + " path '" + path
                            + "' must match: sql/<filename>.sql");
        }
    }

    /**
     * Loads SQL files referenced by {@link ReportDefinition#sourceQueryFile()} and
     * {@link ReportDefinition#outerQueryFile()} from classpath:reports/.
     * Validates content with {@link #UNSAFE_SQL}.
     */
    private void hydrateSqlFiles(ReportDefinition def) throws IOException {
        if (def.hasSourceQueryFile()) {
            String content = readSqlFile(def.key(), "sourceQueryFile", def.sourceQueryFile());
            if (UNSAFE_SQL.matcher(content).find()) {
                throw new IllegalArgumentException(
                        "Report '" + def.key() + "' sourceQueryFile content contains unsafe SQL keywords.");
            }
            hydratedSourceSql.put(def.key(), content);
        }
        if (def.hasOuterQueryFile()) {
            String content = readSqlFile(def.key(), "outerQueryFile", def.outerQueryFile());
            if (UNSAFE_SQL.matcher(content).find()) {
                throw new IllegalArgumentException(
                        "Report '" + def.key() + "' outerQueryFile content contains unsafe SQL keywords.");
            }
            hydratedOuterSql.put(def.key(), content);
        }
    }

    private String readSqlFile(String reportKey, String fieldName, String path) throws IOException {
        // Only one supported root: classpath:reports/<path>
        ClassPathResource resource = new ClassPathResource("reports/" + path);
        if (!resource.exists()) {
            throw new IllegalArgumentException(
                    "Report '" + reportKey + "' " + fieldName + " not found on classpath: reports/" + path);
        }
        try (var in = resource.getInputStream()) {
            return StreamUtils.copyToString(in, StandardCharsets.UTF_8);
        }
    }
}
