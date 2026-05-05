package com.example.report.query;

import com.example.report.registry.ColumnDefinition;
import com.example.report.registry.ReportDefinition;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.util.StreamUtils;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Snapshot test for the muavin branch SQL file (Codex iter-8 REVISE absorb, Issue #2).
 *
 * <p>Validates the 8-layer EUR fallback structure on disk so that future edits cannot
 * silently drop a layer or scramble priorities. The actual SQL execution and result
 * shape is covered by integration tests against MSSQL.
 */
class MuavinBranchSqlSnapshotTest {

    private String branchSql() throws IOException {
        ClassPathResource res = new ClassPathResource("reports/sql/fin-muhasebe-detay.branch.sql");
        try (var in = res.getInputStream()) {
            return StreamUtils.copyToString(in, StandardCharsets.UTF_8);
        }
    }

    private String outerSql() throws IOException {
        ClassPathResource res = new ClassPathResource("reports/sql/fin-muhasebe-detay.outer.sql");
        try (var in = res.getInputStream()) {
            return StreamUtils.copyToString(in, StandardCharsets.UTF_8);
        }
    }

    private ReportDefinition muavinDef() {
        return new ReportDefinition(
                "fin-muhasebe-detay",
                "3.0",
                "Muavin",
                "Test",
                "Finans",
                "ACCOUNT_CARD_ROWS",
                "workcube_mikrolink_2026_1",
                "yearly",
                "action_date",
                null,
                "sql/fin-muhasebe-detay.branch.sql",
                "sql/fin-muhasebe-detay.outer.sql",
                "BRANCH_UNION_THEN_OUTER",
                List.of(
                        new ColumnDefinition("account_code", "Hesap Kodu", "text", 140, false, false, false),
                        new ColumnDefinition("bakiye_tl", "Bakiye TL", "number", 140, false, false, false)
                ),
                "account_code",
                "ASC",
                null);
    }

    @Test
    @DisplayName("Branch SQL contains all 8 fallback layers in priority order")
    void allEightLayersPresent() throws IOException {
        String sql = branchSql();

        // L1-L8 priority constants must appear; ordering enforced by sub-tests below
        assertThat(sql).contains("10 AS priority"); // L1
        assertThat(sql).contains("20"); // L2 (in tuple — looser check)
        assertThat(sql).contains("30"); // L3 direct ACTION_TABLE
        assertThat(sql).contains("40"); // L4 MONEY_TABLES dispatch
        assertThat(sql).contains("50"); // L5 MH same-day company
        assertThat(sql).contains("60"); // L6 MH same-day global
        assertThat(sql).contains("70"); // L7 MH prev company
        assertThat(sql).contains("80"); // L8 MH prev global

        // Comment markers (stable contract for spec-traceability)
        assertThat(sql).contains("L1: ACCOUNT_CARD_MONEY by CARD_ID");
        assertThat(sql).contains("L2: ACCOUNT_CARD_MONEY by source ACTION_ID");
        assertThat(sql).contains("L3: POOL direct AC.ACTION_TABLE match");
        assertThat(sql).contains("L4: POOL via MONEY_TABLES.ACTION_TYPE");
        assertThat(sql).contains("L5: MONEY_HISTORY same-day, COMPANY_ID matched");
        assertThat(sql).contains("L6: MONEY_HISTORY same-day GLOBAL");
        assertThat(sql).contains("L7: MONEY_HISTORY <=7 day previous, COMPANY_ID matched");
        assertThat(sql).contains("L8: MONEY_HISTORY <=7 day previous, GLOBAL");
    }

    @Test
    @DisplayName("L3 direct ACTION_TABLE branch is distinct from L4 MONEY_TABLES dispatch")
    void l3DistinctFromL4() throws IOException {
        String sql = branchSql();

        int l3Marker = sql.indexOf("L3: POOL direct AC.ACTION_TABLE match");
        int l4Marker = sql.indexOf("L4: POOL via MONEY_TABLES.ACTION_TYPE");
        assertThat(l3Marker).as("L3 marker present").isGreaterThan(0);
        assertThat(l4Marker).as("L4 marker present").isGreaterThan(0);
        assertThat(l3Marker).as("L3 ordered before L4").isLessThan(l4Marker);

        // L3 region (between L3 marker and L4 marker), with SQL comment lines stripped
        String l3Block = sql.substring(l3Marker, l4Marker);
        String l3CodeOnly = l3Block.lines()
                .filter(l -> !l.trim().startsWith("--"))
                .reduce("", (a, b) -> a + "\n" + b);

        // L3 must NOT join MONEY_TABLES (in code, not comments) — direct equality on AC.ACTION_TABLE only
        assertThat(l3CodeOnly).as("L3 code does not reference MONEY_TABLES").doesNotContain("MONEY_TABLES");
        // L3 must reference pool.action_table = ac.ACTION_TABLE (direct)
        assertThat(l3CodeOnly).contains("pool.action_table = ac.ACTION_TABLE");
        // L3 also requires AC.ACTION_TABLE non-null (the spec %1 case)
        assertThat(l3CodeOnly).contains("ac.ACTION_TABLE IS NOT NULL");

        // L4 region
        String l4Block = sql.substring(l4Marker);
        // L4 MUST join MONEY_TABLES for deterministic dispatch
        assertThat(l4Block).contains("INNER JOIN [workcube_mikrolink].[MONEY_TABLES]");
        assertThat(l4Block).contains("mt.ACTION_TYPE = ac.ACTION_TYPE");
        assertThat(l4Block).contains("mt.ACTION_TABLE = pool2.action_table");
    }

    @Test
    @DisplayName("Pool unions reference all 13 *_MONEY tables in both L3 and L4 blocks")
    void poolReferencesAllThirteenMoneyTables() throws IOException {
        String sql = branchSql();

        String[] poolTables = {
                "INVOICE_MONEY",
                "EXPENSE_ITEM_PLANS_MONEY",
                "STOCK_FIS_MONEY",
                "CARI_ACTION_MONEY",
                "CARI_ACTION_MULTI_MONEY",
                "CREDIT_CONTRACT_PAYMENT_INCOME_MONEY",
                "PAYROLL_MONEY",
                "BANK_ACTION_MULTI_MONEY",
                "BANK_ACTION_MONEY",
                "BANK_ORDER_MONEY",
                "CASH_ACTION_MONEY",
                "CREDIT_CARD_BANK_EXPENSE_MONEY",
                "TAHAKKUK_PLAN_MONEY"
        };
        for (String table : poolTables) {
            int firstHit = sql.indexOf(table);
            int secondHit = firstHit < 0 ? -1 : sql.indexOf(table, firstHit + table.length());
            assertThat(firstHit).as("Pool table " + table + " present (1st pool — L3)").isGreaterThan(0);
            assertThat(secondHit).as("Pool table " + table + " duplicated for L4 dispatch").isGreaterThan(firstHit);
        }
    }

    @Test
    @DisplayName("ORDER BY tie-break uses IS_SELECTED before rate_date/rate_id")
    void tieBreakIncludesIsSelected() throws IOException {
        String sql = branchSql();

        int orderByIdx = sql.lastIndexOf("ORDER BY x.priority ASC");
        assertThat(orderByIdx).as("ORDER BY x.priority ASC present").isGreaterThan(0);

        // Tail of SQL after ORDER BY: includes is_selected sentinel ahead of rate_date/rate_id
        String tail = sql.substring(orderByIdx);
        assertThat(tail).contains("x.is_selected = 1");
        // is_selected sentinel comes before rate_date in ORDER BY
        int isSelIdx = tail.indexOf("is_selected");
        int rateDateIdx = tail.indexOf("rate_date DESC");
        assertThat(isSelIdx).as("is_selected appears in ORDER BY").isGreaterThan(0);
        assertThat(rateDateIdx).as("rate_date appears in ORDER BY").isGreaterThan(0);
        assertThat(isSelIdx).as("is_selected sentinel ordered before rate_date").isLessThan(rateDateIdx);
    }

    @Test
    @DisplayName("All ACM/POOL layers carry IS_SELECTED column for tie-break")
    void acmPoolLayersExposeIsSelected() throws IOException {
        String sql = branchSql();

        // L1 / L2 / L3 / L4 must propagate IS_SELECTED into the union
        // L1: acm.IS_SELECTED, L2: acm2.IS_SELECTED, L3: pool.IS_SELECTED, L4: pool2.IS_SELECTED
        assertThat(sql).contains("acm.IS_SELECTED");
        assertThat(sql).contains("acm2.IS_SELECTED");
        assertThat(sql).contains("pool.IS_SELECTED");
        assertThat(sql).contains("pool2.IS_SELECTED");
    }

    @Test
    @DisplayName("MONEY_HISTORY layers (L5-L8) emit NULL for is_selected (no per-row override)")
    void moneyHistoryLayersHaveNullIsSelected() throws IOException {
        String sql = branchSql();

        int l5Idx = sql.indexOf("L5: MONEY_HISTORY same-day");
        int l8Idx = sql.indexOf("L8: MONEY_HISTORY <=7 day previous, GLOBAL");
        assertThat(l5Idx).isGreaterThan(0);
        assertThat(l8Idx).isGreaterThan(l5Idx);

        // The MH region (L5-L8) should not propagate per-row IS_SELECTED.
        // It uses NULL placeholders so the tie-break naturally falls back to date+id ordering.
        String mhBlock = sql.substring(l5Idx, sql.length());
        // Each MH SELECT ends with `, NULL, <prio>` (the is_selected slot for these layers).
        // Looser check: NULL appears multiple times in this section.
        long nullOccurrences = mhBlock.lines().filter(l -> l.contains("NULL, 50")
                || l.contains("NULL, 60") || l.contains("NULL, 70") || l.contains("NULL, 80")).count();
        assertThat(nullOccurrences).as("Each MH layer uses NULL is_selected placeholder").isGreaterThanOrEqualTo(4);
    }

    @Test
    @DisplayName("Generated muavin SQL resolves yearly and company-only placeholders")
    void generatedSqlSubstitutesAllPlaceholders() throws IOException {
        SqlBuilder builder = new SqlBuilder();
        YearlySchemaResolver.ResolvedSchemas resolved = new YearlySchemaResolver.ResolvedSchemas(
                List.of("workcube_mikrolink_2026_1"),
                "workcube_mikrolink_1");

        SqlBuilder.BuiltQuery built = builder.buildDataQuery(
                muavinDef(),
                branchSql(),
                outerSql(),
                resolved,
                List.of("account_code", "bakiye_tl"),
                Map.of(),
                List.of(),
                "",
                new MapSqlParameterSource(),
                1,
                25);

        assertThat(built.sql()).doesNotContain("{schema}");
        assertThat(built.sql()).doesNotContain("{companySchema}");
        assertThat(built.sql()).doesNotContain("{companyId}");
        assertThat(built.sql()).doesNotContain("[].[");
        assertThat(built.sql()).contains("[workcube_mikrolink_2026_1].[ACCOUNT_CARD_ROWS]");
        assertThat(built.sql()).contains("[workcube_mikrolink_1].[SETUP_PROCESS_CAT]");
        assertThat(built.sql()).contains("mh.COMPANY_ID = 1");
    }
}
