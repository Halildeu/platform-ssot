package com.example.report.query;

import com.example.report.registry.ColumnDefinition;
import com.example.report.registry.ReportDefinition;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/**
 * Tests for {@link SqlBuilder} BRANCH_UNION_THEN_OUTER queryShape and
 * {@code {schema}}/{@code {companySchema}}/{@code {companyId}} placeholder
 * substitution (Codex 019df4ed iter-4 absorb).
 */
class SqlBuilderBranchUnionThenOuterTest {

    private final SqlBuilder builder = new SqlBuilder();

    private ReportDefinition muavinDef() {
        return new ReportDefinition(
                "fin-muhasebe-detay",
                "3.0",
                "Muavin",
                "Test",
                "Finans",
                "ACCOUNT_CARD_ROWS",
                "workcube_mikrolink_2026_35",
                "yearly",
                "action_date",
                null,                                  // sourceQuery null (file-based)
                "sql/fin-muhasebe-detay.branch.sql",   // sourceQueryFile
                "sql/fin-muhasebe-detay.outer.sql",    // outerQueryFile
                "BRANCH_UNION_THEN_OUTER",             // queryShape
                List.of(
                        new ColumnDefinition("account_code", "Hesap Kodu", "text", 140, false, false, false),
                        new ColumnDefinition("bakiye_tl", "Bakiye TL", "number", 140, false, false, false)
                ),
                "account_code",
                "ASC",
                null);
    }

    @Test
    @DisplayName("BRANCH_UNION_THEN_OUTER: outer wraps multi-year UNION ALL with {inner} replaced")
    void outerWrapperReplacesInnerPlaceholder() {
        String branchSql = "SELECT 1 AS account_code FROM [{schema}].[ACCOUNT_CARD_ROWS]";
        String outerSql = "SELECT q.account_code FROM (\n{inner}\n) AS q";

        YearlySchemaResolver.ResolvedSchemas resolved = new YearlySchemaResolver.ResolvedSchemas(
                List.of("workcube_mikrolink_2024_35", "workcube_mikrolink_2025_35"),
                "workcube_mikrolink_35");

        SqlBuilder.BuiltQuery built = builder.buildDataQuery(
                muavinDef(),
                branchSql,
                outerSql,
                resolved,
                List.of("account_code"),
                Map.of(),
                List.of(),
                "",
                new MapSqlParameterSource(),
                1, 50);

        String sql = built.sql();
        // Outer wrapper applied
        assertThat(sql).contains("FROM (SELECT q.account_code FROM (");
        // Both year branches present
        assertThat(sql).contains("[workcube_mikrolink_2024_35].[ACCOUNT_CARD_ROWS]");
        assertThat(sql).contains("[workcube_mikrolink_2025_35].[ACCOUNT_CARD_ROWS]");
        // UNION ALL between branches
        assertThat(sql).contains("UNION ALL");
        // Year aliases used (y0, y1)
        assertThat(sql).contains(") AS y0");
        assertThat(sql).contains(") AS y1");
        // Inner placeholder consumed (no leftover)
        assertThat(sql).doesNotContain("{inner}");
        // Outer wrapper alias
        assertThat(sql).contains(") AS _src");
        // Pagination
        assertThat(sql).contains("OFFSET :_offset ROWS FETCH NEXT :_pageSize ROWS ONLY");
    }

    @Test
    @DisplayName("{schema} placeholder replaced per yearly branch")
    void schemaPlaceholderPerBranch() {
        String branchSql = "SELECT * FROM [{schema}].[T]";
        String outerSql = "SELECT * FROM (\n{inner}\n) q";
        YearlySchemaResolver.ResolvedSchemas resolved = new YearlySchemaResolver.ResolvedSchemas(
                List.of("schema_a", "schema_b"),
                "company_schema");

        SqlBuilder.BuiltQuery built = builder.buildDataQuery(
                muavinDef(), branchSql, outerSql, resolved,
                List.of("account_code"), Map.of(), List.of(),
                "", new MapSqlParameterSource(), 1, 10);

        String sql = built.sql();
        assertThat(sql).contains("[schema_a].[T]");
        assertThat(sql).contains("[schema_b].[T]");
        assertThat(sql).doesNotContain("{schema}");
    }

    @Test
    @DisplayName("{companySchema} placeholder replaced uniformly across all branches")
    void companySchemaPlaceholderReplaced() {
        String branchSql = "SELECT 1 FROM [{schema}].[T] LEFT JOIN [{companySchema}].[Z] ON 1=1";
        String outerSql = "SELECT * FROM (\n{inner}\n) q";
        YearlySchemaResolver.ResolvedSchemas resolved = new YearlySchemaResolver.ResolvedSchemas(
                List.of("y_2026"),
                "workcube_mikrolink_35");

        SqlBuilder.BuiltQuery built = builder.buildDataQuery(
                muavinDef(), branchSql, outerSql, resolved,
                List.of("account_code"), Map.of(), List.of(),
                "", new MapSqlParameterSource(), 1, 10);

        String sql = built.sql();
        assertThat(sql).contains("[workcube_mikrolink_35].[Z]");
        assertThat(sql).doesNotContain("{companySchema}");
        assertThat(sql).doesNotContain("[].[");
    }

    @Test
    @DisplayName("{companyId} placeholder extracted from companySchema and replaced as numeric")
    void companyIdPlaceholderReplaced() {
        String branchSql = "SELECT * FROM T WHERE OUR_COMPANY_ID = {companyId}";
        String outerSql = "SELECT * FROM (\n{inner}\n) q";
        YearlySchemaResolver.ResolvedSchemas resolved = new YearlySchemaResolver.ResolvedSchemas(
                List.of("y_2026"),
                "workcube_mikrolink_35");

        SqlBuilder.BuiltQuery built = builder.buildDataQuery(
                muavinDef(), branchSql, outerSql, resolved,
                List.of("account_code"), Map.of(), List.of(),
                "", new MapSqlParameterSource(), 1, 10);

        String sql = built.sql();
        assertThat(sql).contains("OUR_COMPANY_ID = 35");
        assertThat(sql).doesNotContain("{companyId}");
    }

    @Test
    @DisplayName("Missing companySchema with {companyId}: fail-closed")
    void missingCompanySchemaForCompanyIdThrows() {
        String branchSql = "SELECT 1 FROM T WHERE COMPANY_ID = {companyId}";
        String outerSql = "SELECT * FROM (\n{inner}\n) q";
        YearlySchemaResolver.ResolvedSchemas resolved = new YearlySchemaResolver.ResolvedSchemas(
                List.of("y_2026"),
                null); // companySchema null

        assertThatThrownBy(() -> builder.buildDataQuery(
                muavinDef(), branchSql, outerSql, resolved,
                List.of("account_code"), Map.of(), List.of(),
                "", new MapSqlParameterSource(), 1, 10))
                .isInstanceOf(ReportSchemaResolutionException.class)
                .hasMessageContaining("companySchema is required");
    }

    @Test
    @DisplayName("Missing companySchema with {companySchema}: fail-closed instead of producing [].[TABLE]")
    void missingCompanySchemaForCompanySchemaThrows() {
        String branchSql = "SELECT 1 FROM [{companySchema}].[SETUP_PROCESS_CAT]";
        String outerSql = "SELECT * FROM (\n{inner}\n) q";
        YearlySchemaResolver.ResolvedSchemas resolved = new YearlySchemaResolver.ResolvedSchemas(
                List.of("y_2026"),
                null);

        assertThatThrownBy(() -> builder.buildDataQuery(
                muavinDef(), branchSql, outerSql, resolved,
                List.of("account_code"), Map.of(), List.of(),
                "", new MapSqlParameterSource(), 1, 10))
                .isInstanceOf(ReportSchemaResolutionException.class)
                .hasMessageContaining("companySchema is required");
    }

    @Test
    @DisplayName("Unresolved known placeholders in generated SQL are rejected")
    void unresolvedPlaceholderThrows() {
        String branchSql = "SELECT 1 AS account_code";
        String outerSql = "SELECT * FROM (\n{inner}\n) q WHERE q.company_id = {companyId}";
        YearlySchemaResolver.ResolvedSchemas resolved = new YearlySchemaResolver.ResolvedSchemas(
                List.of("y_2026"),
                "workcube_mikrolink_35");

        assertThatThrownBy(() -> builder.buildDataQuery(
                muavinDef(), branchSql, outerSql, resolved,
                List.of("account_code"), Map.of(), List.of(),
                "", new MapSqlParameterSource(), 1, 10))
                .isInstanceOf(ReportSchemaResolutionException.class)
                .hasMessageContaining("Unresolved SQL template placeholder");
    }

    @Test
    @DisplayName("BRANCH_UNION_THEN_OUTER without filters: no WHERE pushdown into branches")
    void noFilterPushdownInBranches() {
        String branchSql = "SELECT 1 FROM [{schema}].[T]";
        String outerSql = "SELECT * FROM (\n{inner}\n) q";
        YearlySchemaResolver.ResolvedSchemas resolved = new YearlySchemaResolver.ResolvedSchemas(
                List.of("y_2024", "y_2025"),
                "company_schema");

        SqlBuilder.BuiltQuery built = builder.buildDataQuery(
                muavinDef(), branchSql, outerSql, resolved,
                List.of("account_code"), Map.of(), List.of(),
                "", new MapSqlParameterSource(), 1, 10);

        String sql = built.sql();
        // The branches should not get filter pushdown — UNION ALL'da WHERE 1=1 yok
        // Sadece outer'da WHERE 1=1 olur (sonunda)
        long whereCount = sql.lines().filter(l -> l.contains("WHERE 1=1")).count();
        assertThat(whereCount).as("Outer WHERE only, no branch-level WHERE 1=1").isEqualTo(1);
    }

    @Test
    @DisplayName("Without queryShape=BRANCH_UNION_THEN_OUTER, falls back to legacy multi-schema UNION")
    void legacyMultiSchemaFallback() {
        ReportDefinition legacy = new ReportDefinition(
                "test", "1.0", "Legacy", "Desc", "Cat",
                "TBL", "dbo", "yearly", null,
                "SELECT 1 FROM [{schema}].[TBL]", null, null, null, // no outerQueryFile
                List.of(new ColumnDefinition("c", "C", "text", 100, false)),
                "c", "ASC", null);

        YearlySchemaResolver.ResolvedSchemas resolved = new YearlySchemaResolver.ResolvedSchemas(
                List.of("y_2024", "y_2025"), null);

        SqlBuilder.BuiltQuery built = builder.buildDataQuery(
                legacy, null, null, resolved,
                List.of("c"), Map.of(), List.of(),
                "", new MapSqlParameterSource(), 1, 10);

        String sql = built.sql();
        // Legacy path: per-branch UNION ALL with WHERE 1=1 inside each branch
        assertThat(sql).contains("UNION ALL");
        assertThat(sql).contains(") AS _u");
        assertThat(sql).doesNotContain("AS y0"); // year alias only in BRANCH_UNION_THEN_OUTER
    }
}
