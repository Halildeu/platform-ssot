package com.example.report.registry;

import java.util.List;

/**
 * Report definition loaded from JSON manifest.
 *
 * <p>Source query forms (in resolution priority order):
 * <ol>
 *   <li>{@link #sourceQueryFile()} — path to .sql file under classpath:reports/sql/
 *       (preferred for large queries; avoids 6000+ char escaped strings in JSON).</li>
 *   <li>{@link #sourceQuery()} — inline SQL string (legacy / small queries).</li>
 *   <li>{@link #source()} — bare table name (built into SELECT * FROM [schema].[source]).</li>
 * </ol>
 *
 * <p>Optional {@link #outerQueryFile()} wraps the inner branch-union with an outer
 * projection/window query (used by muavin-style reports needing global running balance
 * across multiple yearly schemas).
 *
 * <p>{@link #queryShape()} hints the builder how to compose inner+outer:
 * <ul>
 *   <li>{@code BRANCH_UNION_THEN_OUTER} — multi-year UNION ALL inside outer wrapper</li>
 *   <li>(default null) — legacy single-schema or per-branch behavior</li>
 * </ul>
 */
public record ReportDefinition(
        String key,
        String version,
        String title,
        String description,
        String category,
        String source,
        String sourceSchema,
        String schemaMode,
        String yearColumn,
        String sourceQuery,
        String sourceQueryFile,
        String outerQueryFile,
        String queryShape,
        List<ColumnDefinition> columns,
        String defaultSort,
        String defaultSortDirection,
        AccessConfig access
) {
    public ReportDefinition {
        if (key == null || key.isBlank()) {
            throw new IllegalArgumentException("Report key must not be blank");
        }
        if ((source == null || source.isBlank())
                && (sourceQuery == null || sourceQuery.isBlank())
                && (sourceQueryFile == null || sourceQueryFile.isBlank())) {
            throw new IllegalArgumentException(
                    "Report must have one of: source (table), sourceQuery (inline SQL), or sourceQueryFile (.sql file ref)");
        }
        if (sourceSchema == null || sourceSchema.isBlank()) {
            sourceSchema = "dbo";
        }
        if (schemaMode == null || schemaMode.isBlank()) {
            schemaMode = "static";
        }
        if (columns == null || columns.isEmpty()) {
            throw new IllegalArgumentException("Report must have at least one column");
        }
        if (defaultSortDirection == null || defaultSortDirection.isBlank()) {
            defaultSortDirection = "ASC";
        }
    }

    public boolean isYearlySchema() {
        return "yearly".equals(schemaMode);
    }

    /** Returns true if any inline or file-based source query is configured. */
    public boolean hasSourceQuery() {
        return (sourceQuery != null && !sourceQuery.isBlank())
                || (sourceQueryFile != null && !sourceQueryFile.isBlank());
    }

    public boolean hasOuterQueryFile() {
        return outerQueryFile != null && !outerQueryFile.isBlank();
    }

    public boolean hasSourceQueryFile() {
        return sourceQueryFile != null && !sourceQueryFile.isBlank();
    }

    /** True if shape requires inner branch-union wrapped by outer projection/window. */
    public boolean isBranchUnionThenOuter() {
        return "BRANCH_UNION_THEN_OUTER".equals(queryShape);
    }

    /**
     * Backward-compat constructor (14 args) for callers that build ReportDefinition
     * programmatically without the new file-based-SQL fields. Defaults
     * {@code sourceQueryFile}, {@code outerQueryFile}, {@code queryShape} to null.
     * Jackson uses the canonical 17-arg constructor when JSON has the new fields.
     */
    public ReportDefinition(
            String key,
            String version,
            String title,
            String description,
            String category,
            String source,
            String sourceSchema,
            String schemaMode,
            String yearColumn,
            String sourceQuery,
            List<ColumnDefinition> columns,
            String defaultSort,
            String defaultSortDirection,
            AccessConfig access) {
        this(key, version, title, description, category, source, sourceSchema, schemaMode,
                yearColumn, sourceQuery, null, null, null,
                columns, defaultSort, defaultSortDirection, access);
    }
}
