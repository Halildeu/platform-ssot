package com.example.report.query;

import com.example.report.access.ColumnFilter;
import com.example.report.access.RowFilterInjector;
import com.example.report.authz.AuthzMeResponse;
import com.example.report.registry.ReportDefinition;
import com.example.report.registry.ReportRegistry;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class QueryEngine {

    private static final Logger log = LoggerFactory.getLogger(QueryEngine.class);

    private final NamedParameterJdbcTemplate jdbc;
    private final ColumnFilter columnFilter;
    private final RowFilterInjector rowFilterInjector;
    private final YearlySchemaResolver yearlySchemaResolver;
    private final ReportRegistry reportRegistry;
    private final SqlBuilder sqlBuilder = new SqlBuilder();

    @Value("${report.query.max-export-rows:500000}")
    private int maxExportRows;

    public QueryEngine(NamedParameterJdbcTemplate jdbc,
                       ColumnFilter columnFilter,
                       RowFilterInjector rowFilterInjector,
                       YearlySchemaResolver yearlySchemaResolver,
                       ReportRegistry reportRegistry) {
        this.jdbc = jdbc;
        this.columnFilter = columnFilter;
        this.rowFilterInjector = rowFilterInjector;
        this.yearlySchemaResolver = yearlySchemaResolver;
        this.reportRegistry = reportRegistry;
    }

    public record PagedData(List<Map<String, Object>> items, long total, int page, int pageSize) {}

    public PagedData executeQuery(ReportDefinition def,
                                   AuthzMeResponse authz,
                                   Map<String, Object> agGridFilter,
                                   List<Map<String, String>> sortModel,
                                   int page,
                                   int pageSize) {
        return executeQuery(def, authz, agGridFilter, sortModel, page, pageSize, null);
    }

    public PagedData executeQuery(ReportDefinition def,
                                   AuthzMeResponse authz,
                                   Map<String, Object> agGridFilter,
                                   List<Map<String, String>> sortModel,
                                   int page,
                                   int pageSize,
                                   Long requestedCompanyId) {
        List<String> visibleColumns = columnFilter.getVisibleColumns(def, authz);
        RowFilterInjector.RlsResult rls = rowFilterInjector.buildRlsClause(def, authz);

        // Resolve year schemas for yearly reports
        YearlySchemaResolver.ResolvedSchemas schemas = resolveSchemas(def, authz, agGridFilter, requestedCompanyId);

        // Resolve hydrated (file-based) source/outer SQL via registry; nulls fall back to def.sourceQuery() inside builder.
        String effectiveSourceQuery = reportRegistry.getEffectiveSourceQuery(def);
        String effectiveOuterQuery = reportRegistry.getEffectiveOuterQuery(def);

        SqlBuilder.BuiltQuery dataQuery = sqlBuilder.buildDataQuery(
                def, effectiveSourceQuery, effectiveOuterQuery, schemas, visibleColumns,
                agGridFilter, sortModel, rls.whereClause(), rls.params(), page, pageSize);

        log.debug("Report query [{}]: {}", def.key(), dataQuery.sql());

        List<Map<String, Object>> items = jdbc.queryForList(dataQuery.sql(), dataQuery.params());

        long total = getCount(def, schemas, agGridFilter, visibleColumns, rls,
                effectiveSourceQuery, effectiveOuterQuery);

        return new PagedData(items, total, page, pageSize);
    }

    public SqlBuilder.BuiltQuery buildExportQuery(ReportDefinition def,
                                                    AuthzMeResponse authz,
                                                    Map<String, Object> agGridFilter,
                                                    List<Map<String, String>> sortModel) {
        return buildExportQuery(def, authz, agGridFilter, sortModel, null);
    }

    public SqlBuilder.BuiltQuery buildExportQuery(ReportDefinition def,
                                                    AuthzMeResponse authz,
                                                    Map<String, Object> agGridFilter,
                                                    List<Map<String, String>> sortModel,
                                                    Long requestedCompanyId) {
        List<String> visibleColumns = columnFilter.getExportColumns(def, authz);
        RowFilterInjector.RlsResult rls = rowFilterInjector.buildRlsClause(def, authz);

        YearlySchemaResolver.ResolvedSchemas schemas = resolveSchemas(def, authz, agGridFilter, requestedCompanyId);

        String effectiveSourceQuery = reportRegistry.getEffectiveSourceQuery(def);
        String effectiveOuterQuery = reportRegistry.getEffectiveOuterQuery(def);

        return sqlBuilder.buildExportQuery(
                def, effectiveSourceQuery, effectiveOuterQuery, schemas, visibleColumns,
                agGridFilter, sortModel, rls.whereClause(), rls.params(), maxExportRows);
    }

    public List<String> getVisibleColumns(ReportDefinition def, AuthzMeResponse authz) {
        return columnFilter.getVisibleColumns(def, authz);
    }

    /**
     * Returns the columns destined for export output (includes hidden + exportOnly columns,
     * excludes hidden + non-exportOnly debug columns). Used by the export controller so that
     * audit-only fields (e.g. kur_tarihi, kur_id, kur_yas_gun) reach the CSV/XLSX file.
     */
    public List<String> getExportColumns(ReportDefinition def, AuthzMeResponse authz) {
        return columnFilter.getExportColumns(def, authz);
    }

    private YearlySchemaResolver.ResolvedSchemas resolveSchemas(ReportDefinition def,
                                                                  AuthzMeResponse authz,
                                                                  Map<String, Object> agGridFilter,
                                                                  Long requestedCompanyId) {
        if (!def.isYearlySchema()) {
            return null; // SqlBuilder will use def.sourceSchema() directly
        }
        return yearlySchemaResolver.resolve(def, authz, agGridFilter, requestedCompanyId);
    }

    private long getCount(ReportDefinition def,
                          YearlySchemaResolver.ResolvedSchemas schemas,
                          Map<String, Object> agGridFilter,
                          List<String> visibleColumns,
                          RowFilterInjector.RlsResult rls,
                          String effectiveSourceQuery,
                          String effectiveOuterQuery) {
        try {
            SqlBuilder.BuiltQuery countQuery = sqlBuilder.buildCountQuery(
                    def, effectiveSourceQuery, effectiveOuterQuery, schemas,
                    agGridFilter, visibleColumns, rls.whereClause(), rls.params());
            Long count = jdbc.queryForObject(countQuery.sql(), countQuery.params(), Long.class);
            return count != null ? count : -1;
        } catch (Exception e) {
            log.warn("Count query failed for report {}: {}", def.key(), e.getMessage());
            return -1;
        }
    }
}
