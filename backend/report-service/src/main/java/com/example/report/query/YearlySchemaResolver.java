package com.example.report.query;

import com.example.report.authz.AuthzMeResponse;
import com.example.report.registry.ReportDefinition;
import java.time.LocalDate;
import java.time.Year;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Component;

/**
 * Resolves year-based schema names for Workcube multi-tenant structure.
 *
 * <p>Two schema namespaces are supported:
 * <ol>
 *   <li>Yearly per-company: {@code workcube_mikrolink_{YYYY}_{companyId}}</li>
 *   <li>Company-only (no year): {@code workcube_mikrolink_{companyId}} —
 *       used by tables that aren't partitioned annually (e.g. SETUP_PROCESS_CAT,
 *       CREDIT_CARD_BANK_EXPENSE, TAHAKKUK_PLAN).</li>
 * </ol>
 *
 * <p>Caches available schema names from sys.schemas to avoid repeated lookups.
 * Extracts date ranges from AG Grid filters to determine which year schemas to query.
 */
@Component
public class YearlySchemaResolver {

    private static final Logger log = LoggerFactory.getLogger(YearlySchemaResolver.class);

    private final NamedParameterJdbcTemplate jdbc;

    public YearlySchemaResolver(NamedParameterJdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    /**
     * Resolved schemas for a yearly report.
     *
     * @param schemas       list of yearly schemas to query, e.g.
     *                      {@code [workcube_mikrolink_2024_35, workcube_mikrolink_2025_35]}
     * @param companySchema the company-only schema name, e.g.
     *                      {@code workcube_mikrolink_35}, or null when multiple
     *                      companies are in scope (ambiguous).
     */
    public record ResolvedSchemas(List<String> schemas, String companySchema) {
        /** Backward-compat constructor (no companySchema). */
        public ResolvedSchemas(List<String> schemas) {
            this(schemas, null);
        }

        public boolean isSingle() {
            return schemas.size() == 1;
        }

        public boolean hasCompanySchema() {
            return companySchema != null && !companySchema.isBlank();
        }
    }

    /**
     * Resolve which year schemas to query for a yearly report.
     *
     * @param def           report definition (must have isYearlySchema() == true)
     * @param authz         user's authz context (for extracting companyId from COMPANY scope)
     * @param agGridFilter  AG Grid filter model (may contain date range on yearColumn)
     * @return resolved schema names that actually exist in the database
     */
    @Deprecated(forRemoval = false)
    public ResolvedSchemas resolve(ReportDefinition def, AuthzMeResponse authz,
                                   Map<String, Object> agGridFilter) {
        return resolve(def, authz, agGridFilter, null);
    }

    /**
     * Resolve yearly and company-only Workcube schemas for a single selected company.
     *
     * <p>Company selection is fail-closed:
     * <ul>
     *   <li>{@code X-Company-Id} present: super-admin may select it, normal users
     *       must also have that COMPANY scope.</li>
     *   <li>{@code X-Company-Id} absent: a normal user with exactly one COMPANY scope
     *       is auto-selected; multi-company and super-admin users must be explicit.</li>
     * </ul>
     */
    public ResolvedSchemas resolve(ReportDefinition def,
                                   AuthzMeResponse authz,
                                   Map<String, Object> agGridFilter,
                                   Long requestedCompanyId) {
        if (!def.isYearlySchema()) {
            return new ResolvedSchemas(List.of(def.sourceSchema()), null);
        }

        long companyId = resolveCompanyId(def, authz, requestedCompanyId);

        // Extract year range from date filters
        int[] yearRange = extractYearRange(def.yearColumn(), agGridFilter);
        int startYear = yearRange[0];
        int endYear = yearRange[1];

        // Get all available schemas from cache
        Set<String> available = getAvailableSchemas();

        String companySchema = "workcube_mikrolink_" + companyId;
        if (!available.contains(companySchema.toLowerCase(Locale.ROOT))) {
            throw new ReportSchemaResolutionException.CompanySchemaNotFoundException(
                    def.key(), companyId, companySchema);
        }

        // Build schema list for the selected company and requested year range.
        List<String> resolved = new ArrayList<>();
        for (int year = startYear; year <= endYear; year++) {
            String schema = "workcube_mikrolink_" + year + "_" + companyId;
            if (available.contains(schema.toLowerCase(Locale.ROOT))) {
                resolved.add(schema);
            } else {
                log.debug("Schema not found: {}", schema);
            }
        }

        if (resolved.isEmpty()) {
            String expected = "workcube_mikrolink_" + startYear + "_" + companyId
                    + (startYear == endYear ? "" : "..workcube_mikrolink_" + endYear + "_" + companyId);
            throw new ReportSchemaResolutionException.CompanySchemaNotFoundException(
                    def.key(), companyId, expected);
        }

        log.debug("Resolved {} schemas for report {}: {} (companySchema={})",
                resolved.size(), def.key(), resolved, companySchema);
        return new ResolvedSchemas(resolved, companySchema);
    }

    private long resolveCompanyId(ReportDefinition def, AuthzMeResponse authz, Long requestedCompanyId) {
        boolean superAdmin = authz != null && authz.isSuperAdmin();
        Set<String> allowedCompanyIds = authz != null ? authz.getScopeRefIds("COMPANY") : Set.of();

        if (requestedCompanyId != null) {
            if (requestedCompanyId <= 0) {
                throw new ReportSchemaResolutionException.CompanySchemaNotFoundException(
                        def.key(), requestedCompanyId, "workcube_mikrolink_" + requestedCompanyId);
            }
            String requested = String.valueOf(requestedCompanyId);
            if (!superAdmin && !allowedCompanyIds.contains(requested)) {
                throw new ReportSchemaResolutionException.UnauthorizedCompanyException(
                        def.key(), requestedCompanyId);
            }
            return requestedCompanyId;
        }

        if (superAdmin) {
            throw new ReportSchemaResolutionException.MissingCompanyHeaderException(
                    def.key(), "superAdmin users must select a company explicitly");
        }

        if (allowedCompanyIds.size() == 1) {
            String onlyCompany = allowedCompanyIds.iterator().next();
            try {
                long parsed = Long.parseLong(onlyCompany);
                if (parsed > 0) {
                    return parsed;
                }
            } catch (NumberFormatException ignored) {
                // handled by fail-closed error below
            }
            throw new ReportSchemaResolutionException.MissingCompanyHeaderException(
                    def.key(), "single COMPANY scope is not a numeric company id: " + onlyCompany);
        }

        if (allowedCompanyIds.size() > 1) {
            throw new ReportSchemaResolutionException.MissingCompanyHeaderException(
                    def.key(), "multiple COMPANY scopes are available, company selection is required");
        }

        throw new ReportSchemaResolutionException.MissingCompanyHeaderException(
                def.key(), "no COMPANY scope is available");
    }

    /**
     * Extract year range from AG Grid date filters on the yearColumn.
     * Returns [startYear, endYear]. Defaults to current year if no date filter found.
     */
    private int[] extractYearRange(String yearColumn, Map<String, Object> agGridFilter) {
        int currentYear = Year.now().getValue();

        if (yearColumn == null || yearColumn.isBlank() || agGridFilter == null || agGridFilter.isEmpty()) {
            // No date column or no filters — default to current year only
            return new int[]{currentYear, currentYear};
        }

        Object filterModel = agGridFilter.get(yearColumn);
        if (!(filterModel instanceof Map<?, ?> filterMap)) {
            // No filter on yearColumn — check all date-type filters for year hints
            return extractYearRangeFromAnyDateFilter(agGridFilter, currentYear);
        }

        return extractYearFromFilterMap(filterMap, currentYear);
    }

    @SuppressWarnings("unchecked")
    private int[] extractYearFromFilterMap(Map<?, ?> filterMap, int currentYear) {
        String type = (String) filterMap.get("type");
        if (type == null) {
            return new int[]{currentYear, currentYear};
        }

        return switch (type) {
            case "inRange" -> {
                int fromYear = parseYearFromDateString(filterMap.get("filter"), currentYear);
                int toYear = parseYearFromDateString(filterMap.get("filterTo"), currentYear);
                yield new int[]{Math.min(fromYear, toYear), Math.max(fromYear, toYear)};
            }
            case "equals" -> {
                int year = parseYearFromDateString(filterMap.get("filter"), currentYear);
                yield new int[]{year, year};
            }
            case "greaterThan", "greaterThanOrEqual" -> {
                int fromYear = parseYearFromDateString(filterMap.get("filter"), currentYear);
                yield new int[]{fromYear, currentYear};
            }
            case "lessThan", "lessThanOrEqual" -> {
                int toYear = parseYearFromDateString(filterMap.get("filter"), currentYear);
                // Go back max 5 years for open-ended "less than" filters
                yield new int[]{Math.max(toYear - 5, 2020), toYear};
            }
            case "notBlank" -> {
                // All data — go back 5 years
                yield new int[]{currentYear - 5, currentYear};
            }
            default -> new int[]{currentYear, currentYear};
        };
    }

    /**
     * If no filter on yearColumn specifically, scan all date filters for year hints.
     */
    private int[] extractYearRangeFromAnyDateFilter(Map<String, Object> agGridFilter, int currentYear) {
        int minYear = currentYear;
        int maxYear = currentYear;

        for (Map.Entry<String, Object> entry : agGridFilter.entrySet()) {
            if (!(entry.getValue() instanceof Map<?, ?> filterMap)) continue;
            String filterType = (String) filterMap.get("filterType");
            if (!"date".equals(filterType)) continue;

            int[] range = extractYearFromFilterMap(filterMap, currentYear);
            minYear = Math.min(minYear, range[0]);
            maxYear = Math.max(maxYear, range[1]);
        }

        return new int[]{minYear, maxYear};
    }

    /**
     * Parse year from an AG Grid date filter value.
     * AG Grid sends dates as "YYYY-MM-DD" strings.
     */
    private int parseYearFromDateString(Object dateValue, int fallback) {
        if (dateValue == null) return fallback;
        String s = dateValue.toString().trim();
        if (s.length() >= 4) {
            try {
                return Integer.parseInt(s.substring(0, 4));
            } catch (NumberFormatException e) {
                // ignore
            }
        }
        return fallback;
    }

    /**
     * Cached: returns all schema names in the database (lowercase).
     * Queried from sys.schemas which is very fast on SQL Server.
     */
    @Cacheable(value = "yearlySchemas", key = "'all'")
    public Set<String> getAvailableSchemas() {
        log.info("Loading available schemas from sys.schemas...");
        List<String> schemas = jdbc.getJdbcTemplate().queryForList(
                "SELECT name FROM sys.schemas WHERE name LIKE 'workcube_mikrolink%'",
                String.class);
        Set<String> result = schemas.stream()
                .map(s -> s.toLowerCase(Locale.ROOT))
                .collect(Collectors.toSet());
        log.info("Found {} workcube schemas", result.size());
        return result;
    }
}
