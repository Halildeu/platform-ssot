package com.example.report.query;

import com.example.report.registry.ReportDefinition;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;

/**
 * Builds SQL queries for report definitions, supporting:
 * <ul>
 *   <li>Single-schema flat queries</li>
 *   <li>Multi-year UNION ALL queries (per-branch filter pushdown)</li>
 *   <li>BRANCH_UNION_THEN_OUTER queryShape — multi-year UNION ALL wrapped in
 *       outer projection/window query (used by muavin for global running balance).
 *       Filter pushdown is intentionally <strong>disabled</strong> in this mode so
 *       the window function sees the full row set; AG Grid filters are applied
 *       in the outer wrapper's WHERE clause instead.</li>
 * </ul>
 *
 * <p>The {@code effectiveSourceQuery} and {@code effectiveOuterQuery} parameters
 * are resolved by the caller (typically {@code ReportRegistry#getEffectiveSourceQuery}
 * and {@code ReportRegistry#getEffectiveOuterQuery}) so that file-based SQL refs
 * are hydrated before reaching the builder.
 */
public class SqlBuilder {

    public record BuiltQuery(String sql, MapSqlParameterSource params) {}

    private final FilterTranslator filterTranslator = new FilterTranslator();
    private final SortTranslator sortTranslator = new SortTranslator();

    // ── Single-schema queries (original behavior) ──────────────────────

    public BuiltQuery buildDataQuery(ReportDefinition def,
                                      List<String> visibleColumns,
                                      Map<String, Object> agGridFilter,
                                      List<Map<String, String>> sortModel,
                                      String rlsWhereClause,
                                      MapSqlParameterSource rlsParams,
                                      int page,
                                      int pageSize) {
        return buildDataQuery(def, null, null, null, visibleColumns, agGridFilter, sortModel,
                rlsWhereClause, rlsParams, page, pageSize);
    }

    public BuiltQuery buildCountQuery(ReportDefinition def,
                                       Map<String, Object> agGridFilter,
                                       List<String> visibleColumns,
                                       String rlsWhereClause,
                                       MapSqlParameterSource rlsParams) {
        return buildCountQuery(def, null, null, null, agGridFilter, visibleColumns,
                rlsWhereClause, rlsParams);
    }

    public BuiltQuery buildExportQuery(ReportDefinition def,
                                        List<String> visibleColumns,
                                        Map<String, Object> agGridFilter,
                                        List<Map<String, String>> sortModel,
                                        String rlsWhereClause,
                                        MapSqlParameterSource rlsParams,
                                        int maxRows) {
        return buildExportQuery(def, null, null, null, visibleColumns, agGridFilter, sortModel,
                rlsWhereClause, rlsParams, maxRows);
    }

    // ── Multi-schema queries (no hydration; legacy callers) ───────────

    public BuiltQuery buildDataQuery(ReportDefinition def,
                                      YearlySchemaResolver.ResolvedSchemas resolvedSchemas,
                                      List<String> visibleColumns,
                                      Map<String, Object> agGridFilter,
                                      List<Map<String, String>> sortModel,
                                      String rlsWhereClause,
                                      MapSqlParameterSource rlsParams,
                                      int page,
                                      int pageSize) {
        return buildDataQuery(def, null, null, resolvedSchemas, visibleColumns, agGridFilter,
                sortModel, rlsWhereClause, rlsParams, page, pageSize);
    }

    public BuiltQuery buildCountQuery(ReportDefinition def,
                                       YearlySchemaResolver.ResolvedSchemas resolvedSchemas,
                                       Map<String, Object> agGridFilter,
                                       List<String> visibleColumns,
                                       String rlsWhereClause,
                                       MapSqlParameterSource rlsParams) {
        return buildCountQuery(def, null, null, resolvedSchemas, agGridFilter, visibleColumns,
                rlsWhereClause, rlsParams);
    }

    public BuiltQuery buildExportQuery(ReportDefinition def,
                                        YearlySchemaResolver.ResolvedSchemas resolvedSchemas,
                                        List<String> visibleColumns,
                                        Map<String, Object> agGridFilter,
                                        List<Map<String, String>> sortModel,
                                        String rlsWhereClause,
                                        MapSqlParameterSource rlsParams,
                                        int maxRows) {
        return buildExportQuery(def, null, null, resolvedSchemas, visibleColumns, agGridFilter,
                sortModel, rlsWhereClause, rlsParams, maxRows);
    }

    // ── Hydrated queries (file-based SQL + outer wrapper support) ─────

    public BuiltQuery buildDataQuery(ReportDefinition def,
                                      String effectiveSourceQuery,
                                      String effectiveOuterQuery,
                                      YearlySchemaResolver.ResolvedSchemas resolvedSchemas,
                                      List<String> visibleColumns,
                                      Map<String, Object> agGridFilter,
                                      List<Map<String, String>> sortModel,
                                      String rlsWhereClause,
                                      MapSqlParameterSource rlsParams,
                                      int page,
                                      int pageSize) {
        Set<String> allowedCols = Set.copyOf(visibleColumns);
        String selectCols = visibleColumns.stream()
                .map(c -> "[" + c + "]")
                .collect(Collectors.joining(", "));

        MapSqlParameterSource params = new MapSqlParameterSource();
        FilterTranslator.FilterResult filterResult = filterTranslator.translate(agGridFilter, allowedCols);

        String fromClause = buildFromClause(def, effectiveSourceQuery, effectiveOuterQuery,
                resolvedSchemas, selectCols,
                rlsWhereClause, rlsParams, filterResult, params);

        StringBuilder sql = new StringBuilder();
        sql.append("SELECT ").append(selectCols);
        sql.append(" FROM ").append(fromClause);

        String orderBy = sortTranslator.translate(sortModel, allowedCols, def.defaultSort(), def.defaultSortDirection());
        if (orderBy != null) {
            sql.append(" ORDER BY ").append(orderBy);
        } else {
            sql.append(" ORDER BY (SELECT NULL)");
        }

        int offset = (page - 1) * pageSize;
        sql.append(" OFFSET :_offset ROWS FETCH NEXT :_pageSize ROWS ONLY");
        params.addValue("_offset", offset);
        params.addValue("_pageSize", pageSize);

        return new BuiltQuery(sql.toString(), params);
    }

    public BuiltQuery buildCountQuery(ReportDefinition def,
                                       String effectiveSourceQuery,
                                       String effectiveOuterQuery,
                                       YearlySchemaResolver.ResolvedSchemas resolvedSchemas,
                                       Map<String, Object> agGridFilter,
                                       List<String> visibleColumns,
                                       String rlsWhereClause,
                                       MapSqlParameterSource rlsParams) {
        Set<String> allowedCols = Set.copyOf(visibleColumns);
        MapSqlParameterSource params = new MapSqlParameterSource();
        FilterTranslator.FilterResult filterResult = filterTranslator.translate(agGridFilter, allowedCols);

        // For count, we just need * from the union
        String fromClause = buildFromClause(def, effectiveSourceQuery, effectiveOuterQuery,
                resolvedSchemas, "*",
                rlsWhereClause, rlsParams, filterResult, params);

        StringBuilder sql = new StringBuilder();
        sql.append("SELECT COUNT(*) FROM ").append(fromClause);

        return new BuiltQuery(sql.toString(), params);
    }

    public BuiltQuery buildExportQuery(ReportDefinition def,
                                        String effectiveSourceQuery,
                                        String effectiveOuterQuery,
                                        YearlySchemaResolver.ResolvedSchemas resolvedSchemas,
                                        List<String> visibleColumns,
                                        Map<String, Object> agGridFilter,
                                        List<Map<String, String>> sortModel,
                                        String rlsWhereClause,
                                        MapSqlParameterSource rlsParams,
                                        int maxRows) {
        Set<String> allowedCols = Set.copyOf(visibleColumns);
        String selectCols = visibleColumns.stream()
                .map(c -> "[" + c + "]")
                .collect(Collectors.joining(", "));

        MapSqlParameterSource params = new MapSqlParameterSource();
        FilterTranslator.FilterResult filterResult = filterTranslator.translate(agGridFilter, allowedCols);

        String fromClause = buildFromClause(def, effectiveSourceQuery, effectiveOuterQuery,
                resolvedSchemas, selectCols,
                rlsWhereClause, rlsParams, filterResult, params);

        StringBuilder sql = new StringBuilder();
        sql.append("SELECT TOP(:_maxRows) ").append(selectCols);
        sql.append(" FROM ").append(fromClause);
        params.addValue("_maxRows", maxRows);

        String orderBy = sortTranslator.translate(sortModel, allowedCols, def.defaultSort(), def.defaultSortDirection());
        if (orderBy != null) {
            sql.append(" ORDER BY ").append(orderBy);
        }

        return new BuiltQuery(sql.toString(), params);
    }

    // ── Internal helpers ───────────────────────────────────────────────

    /**
     * Returns the source query to use, falling back to {@link ReportDefinition#sourceQuery()}
     * if no hydrated string was provided.
     */
    private String resolveSourceQuery(ReportDefinition def, String effectiveSourceQuery) {
        if (effectiveSourceQuery != null && !effectiveSourceQuery.isBlank()) {
            return effectiveSourceQuery;
        }
        return def.sourceQuery();
    }

    /**
     * Replaces {@code {schema}}, {@code {companySchema}}, and {@code {companyId}}
     * placeholders in the raw SQL.
     * <ul>
     *   <li>{@code {schema}} → yearly schema (workcube_mikrolink_{YYYY}_{companyId})</li>
     *   <li>{@code {companySchema}} → company-only schema (workcube_mikrolink_{companyId})
     *       or empty string if unresolved (multi-company scope or missing).</li>
     *   <li>{@code {companyId}} → numeric company id parsed from companySchema, or
     *       "0" if unresolved (queries should treat 0 as no-match, not all-match).</li>
     * </ul>
     * Caller is responsible for ensuring the SQL handles missing values gracefully.
     */
    private String applyTemplates(String rawSql, String schema, String companySchema) {
        String result = rawSql.replace("{schema}", schema);
        result = result.replace("{companySchema}", companySchema != null ? companySchema : "");
        String companyId = extractCompanyIdFromCompanySchema(companySchema);
        result = result.replace("{companyId}", companyId != null ? companyId : "0");
        return result;
    }

    /**
     * Extracts the numeric company id from a company-only schema name.
     * "workcube_mikrolink_35" → "35"; null or non-matching pattern → null.
     */
    private String extractCompanyIdFromCompanySchema(String companySchema) {
        if (companySchema == null) {
            return null;
        }
        String prefix = "workcube_mikrolink_";
        if (companySchema.startsWith(prefix)) {
            String suffix = companySchema.substring(prefix.length());
            if (suffix.matches("\\d+")) {
                return suffix;
            }
        }
        return null;
    }

    /**
     * Builds the FROM clause. Three modes:
     * <ol>
     *   <li>Single-schema or non-yearly: flat {@code [schema].[table]} or
     *       {@code (sourceQuery) AS _src}.</li>
     *   <li>Multi-year, no outer wrapper: per-branch UNION ALL with filter pushdown.</li>
     *   <li>BRANCH_UNION_THEN_OUTER: raw multi-year UNION ALL inside outer wrapper,
     *       no filter pushdown (filters applied at outer wrapper's WHERE).</li>
     * </ol>
     */
    private String buildFromClause(ReportDefinition def,
                                   String effectiveSourceQuery,
                                   String effectiveOuterQuery,
                                   YearlySchemaResolver.ResolvedSchemas resolvedSchemas,
                                   String selectCols,
                                   String rlsWhereClause,
                                   MapSqlParameterSource rlsParams,
                                   FilterTranslator.FilterResult filterResult,
                                   MapSqlParameterSource params) {

        boolean isMultiSchema = resolvedSchemas != null && !resolvedSchemas.isSingle();
        boolean useOuterWrapper = def.isBranchUnionThenOuter()
                && effectiveOuterQuery != null
                && !effectiveOuterQuery.isBlank();
        String companySchema = (resolvedSchemas != null) ? resolvedSchemas.companySchema() : null;

        // ── Mode 3: BRANCH_UNION_THEN_OUTER ──
        if (useOuterWrapper && isMultiSchema) {
            return buildBranchUnionThenOuter(def, effectiveSourceQuery, effectiveOuterQuery,
                    resolvedSchemas, companySchema,
                    rlsWhereClause, rlsParams, filterResult, params);
        }
        if (useOuterWrapper && !isMultiSchema) {
            // Single-year outer wrapper: still apply outer transform but no UNION
            String singleSchema = (resolvedSchemas != null && !resolvedSchemas.schemas().isEmpty())
                    ? resolvedSchemas.schemas().get(0)
                    : def.sourceSchema();
            String resolvedQuery = applyTemplates(resolveSourceQuery(def, effectiveSourceQuery),
                    singleSchema, companySchema);
            String inner = "        SELECT * FROM (" + resolvedQuery + ") AS y0";
            String outerWrapped = effectiveOuterQuery.replace("{inner}", inner);
            StringBuilder sb = new StringBuilder();
            sb.append("(").append(outerWrapped).append(") AS _src WHERE 1=1");
            appendWhereFilters(sb, rlsWhereClause, rlsParams, filterResult, params);
            return sb.toString();
        }

        // ── Mode 1: Single schema (no outer wrapper) ──
        if (!isMultiSchema) {
            String schema = (resolvedSchemas != null && !resolvedSchemas.schemas().isEmpty())
                    ? resolvedSchemas.schemas().get(0)
                    : def.sourceSchema();

            StringBuilder sb = new StringBuilder();
            if (def.hasSourceQuery() || (effectiveSourceQuery != null && !effectiveSourceQuery.isBlank())) {
                String resolvedQuery = applyTemplates(resolveSourceQuery(def, effectiveSourceQuery),
                        schema, companySchema);
                sb.append("(").append(resolvedQuery).append(") AS _src");
            } else {
                sb.append("[").append(schema).append("].[").append(def.source()).append("] WITH (NOLOCK)");
            }
            sb.append(" WHERE 1=1");
            appendWhereFilters(sb, rlsWhereClause, rlsParams, filterResult, params);
            return sb.toString();
        }

        // ── Mode 2: Multi-schema UNION ALL with per-branch filter pushdown ──
        StringBuilder union = new StringBuilder();
        union.append("(\n");

        List<String> schemas = resolvedSchemas.schemas();
        for (int i = 0; i < schemas.size(); i++) {
            if (i > 0) {
                union.append("\n  UNION ALL\n");
            }
            union.append("  SELECT ").append(selectCols);
            if (def.hasSourceQuery() || (effectiveSourceQuery != null && !effectiveSourceQuery.isBlank())) {
                String resolvedQuery = applyTemplates(resolveSourceQuery(def, effectiveSourceQuery),
                        schemas.get(i), companySchema);
                union.append(" FROM (").append(resolvedQuery).append(") AS _src");
            } else {
                union.append(" FROM [").append(schemas.get(i)).append("].[").append(def.source()).append("] WITH (NOLOCK)");
            }
            union.append(" WHERE 1=1");
            // Push down RLS and filters into each branch
            appendWhereFiltersInline(union, rlsWhereClause, filterResult);
        }

        union.append("\n) AS _u");

        // Merge params once (same params apply to all branches via named parameters)
        if (rlsParams != null) {
            mergeParams(params, rlsParams);
        }
        if (!filterResult.whereClause().isBlank()) {
            mergeParams(params, filterResult.params());
        }

        return union.toString();
    }

    /**
     * Builds the BRANCH_UNION_THEN_OUTER FROM clause:
     *
     * <pre>
     * (&lt;outerTemplate with {inner} replaced by:
     *   SELECT * FROM (&lt;branch_2024 sql&gt;) AS y0
     *   UNION ALL
     *   SELECT * FROM (&lt;branch_2025 sql&gt;) AS y1
     *   ...
     * &gt;) AS _src WHERE 1=1 AND &lt;rls&gt; AND &lt;filters&gt;
     * </pre>
     *
     * <p>Filters are NOT pushed into branches (window function needs full row set).
     */
    private String buildBranchUnionThenOuter(ReportDefinition def,
                                             String effectiveSourceQuery,
                                             String effectiveOuterQuery,
                                             YearlySchemaResolver.ResolvedSchemas resolvedSchemas,
                                             String companySchema,
                                             String rlsWhereClause,
                                             MapSqlParameterSource rlsParams,
                                             FilterTranslator.FilterResult filterResult,
                                             MapSqlParameterSource params) {

        List<String> schemas = resolvedSchemas.schemas();
        String rawBranchSql = resolveSourceQuery(def, effectiveSourceQuery);

        StringBuilder inner = new StringBuilder();
        for (int i = 0; i < schemas.size(); i++) {
            if (i > 0) {
                inner.append("\n        UNION ALL\n");
            }
            String resolvedBranch = applyTemplates(rawBranchSql, schemas.get(i), companySchema);
            inner.append("        SELECT * FROM (").append(resolvedBranch).append(") AS y").append(i);
        }

        String outerWrapped = effectiveOuterQuery.replace("{inner}", inner.toString());

        StringBuilder sb = new StringBuilder();
        sb.append("(").append(outerWrapped).append(") AS _src WHERE 1=1");
        appendWhereFilters(sb, rlsWhereClause, rlsParams, filterResult, params);
        return sb.toString();
    }

    /** Append WHERE fragments and merge params (for single-schema and outer-wrapped paths). */
    private void appendWhereFilters(StringBuilder sql,
                                    String rlsWhereClause,
                                    MapSqlParameterSource rlsParams,
                                    FilterTranslator.FilterResult filterResult,
                                    MapSqlParameterSource params) {
        if (rlsWhereClause != null && !rlsWhereClause.isBlank()) {
            sql.append(" AND ").append(rlsWhereClause);
            if (rlsParams != null) {
                mergeParams(params, rlsParams);
            }
        }
        if (!filterResult.whereClause().isBlank()) {
            sql.append(" AND ").append(filterResult.whereClause());
            mergeParams(params, filterResult.params());
        }
    }

    /** Append WHERE fragments inline (no param merge — done once for UNION). */
    private void appendWhereFiltersInline(StringBuilder sql,
                                          String rlsWhereClause,
                                          FilterTranslator.FilterResult filterResult) {
        if (rlsWhereClause != null && !rlsWhereClause.isBlank()) {
            sql.append(" AND ").append(rlsWhereClause);
        }
        if (!filterResult.whereClause().isBlank()) {
            sql.append(" AND ").append(filterResult.whereClause());
        }
    }

    @SuppressWarnings("unchecked")
    private void mergeParams(MapSqlParameterSource target, MapSqlParameterSource source) {
        Map<String, Object> sourceValues = source.getValues();
        sourceValues.forEach(target::addValue);
    }
}
