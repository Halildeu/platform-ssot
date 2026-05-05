package com.example.report.access;

import com.example.report.authz.AuthzMeResponse;
import com.example.report.registry.AccessConfig;
import com.example.report.registry.ColumnDefinition;
import com.example.report.registry.ReportDefinition;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Codex iter-8 REVISE absorb (Issue #3): hidden/exportOnly enforcement in ColumnFilter.
 *
 * <p>Visibility matrix:
 * <ul>
 *   <li>hidden=false, exportOnly=false → grid YES, export YES (default)</li>
 *   <li>hidden=false, exportOnly=true  → grid YES, export YES</li>
 *   <li>hidden=true,  exportOnly=true  → grid NO,  export YES (audit-only)</li>
 *   <li>hidden=true,  exportOnly=false → grid NO,  export NO  (debug-only)</li>
 * </ul>
 */
class ColumnFilterHiddenExportOnlyTest {

    private final ColumnFilter columnFilter = new ColumnFilter();

    private static AuthzMeResponse superAdmin() {
        AuthzMeResponse a = new AuthzMeResponse();
        a.setSuperAdmin(true);
        return a;
    }

    private static AuthzMeResponse user(List<String> permissions) {
        AuthzMeResponse a = new AuthzMeResponse();
        a.setSuperAdmin(false);
        a.setPermissions(permissions);
        return a;
    }

    private static ReportDefinition defWithCols(List<ColumnDefinition> cols) {
        return new ReportDefinition(
                "test", "v1", "Test", "desc", "cat",
                "TBL", "dbo", "static", null, "SELECT 1",
                cols, "id", "ASC", null);
    }

    private static ReportDefinition defWithColsAndAccess(List<ColumnDefinition> cols, AccessConfig access) {
        return new ReportDefinition(
                "test", "v1", "Test", "desc", "cat",
                "TBL", "dbo", "static", null, "SELECT 1",
                cols, "id", "ASC", access);
    }

    @Test
    @DisplayName("getVisibleColumns excludes hidden=true columns")
    void visibleExcludesHidden() {
        ReportDefinition def = defWithCols(List.of(
                new ColumnDefinition("a", "A", "text", 100, false, false, false), // visible
                new ColumnDefinition("b", "B", "text", 100, false, true, true),   // hidden+exportOnly
                new ColumnDefinition("c", "C", "text", 100, false, true, false), // hidden+debug
                new ColumnDefinition("d", "D", "text", 100, false, false, true)  // visible+exportOnly
        ));

        List<String> visible = columnFilter.getVisibleColumns(def, superAdmin());

        assertThat(visible).containsExactly("a", "d");
    }

    @Test
    @DisplayName("getVisibleColumnDefinitions excludes hidden=true columns")
    void visibleDefsExcludesHidden() {
        ReportDefinition def = defWithCols(List.of(
                new ColumnDefinition("a", "A", "text", 100, false, false, false),
                new ColumnDefinition("b", "B", "text", 100, false, true, true),
                new ColumnDefinition("c", "C", "text", 100, false, true, false)
        ));

        List<ColumnDefinition> visible = columnFilter.getVisibleColumnDefinitions(def, superAdmin());

        assertThat(visible).extracting(ColumnDefinition::field).containsExactly("a");
    }

    @Test
    @DisplayName("getExportColumns includes visible AND hidden+exportOnly, excludes hidden+debug")
    void exportIncludesAuditExcludesDebug() {
        ReportDefinition def = defWithCols(List.of(
                new ColumnDefinition("a", "A", "text", 100, false, false, false), // grid YES, export YES
                new ColumnDefinition("b", "B", "text", 100, false, true, true),   // grid NO,  export YES
                new ColumnDefinition("c", "C", "text", 100, false, true, false), // grid NO,  export NO
                new ColumnDefinition("d", "D", "text", 100, false, false, true)  // grid YES, export YES
        ));

        List<String> export = columnFilter.getExportColumns(def, superAdmin());

        assertThat(export).containsExactly("a", "b", "d");
        assertThat(export).doesNotContain("c");
    }

    @Test
    @DisplayName("hidden=false columns are visible in both grid and export by default")
    void allVisibleByDefault() {
        ReportDefinition def = defWithCols(List.of(
                new ColumnDefinition("a", "A", "text", 100, false, false, false),
                new ColumnDefinition("b", "B", "text", 100, false, false, false)
        ));

        assertThat(columnFilter.getVisibleColumns(def, superAdmin())).containsExactly("a", "b");
        assertThat(columnFilter.getExportColumns(def, superAdmin())).containsExactly("a", "b");
    }

    @Test
    @DisplayName("RBAC restriction takes precedence — hidden by RBAC excluded from BOTH grid and export")
    void rbacRestrictionPrecedence() {
        AccessConfig access = new AccessConfig(
                "REPORT_VIEW", "fin",
                Map.of("PII_VIEW", List.of("salary")),
                null);

        ReportDefinition def = defWithColsAndAccess(List.of(
                new ColumnDefinition("id", "ID", "number", 100, false, false, false),
                new ColumnDefinition("salary", "Salary", "number", 100, false, false, true)
        ), access);

        AuthzMeResponse noPii = user(List.of("REPORT_VIEW"));

        // Without PII_VIEW, salary is hidden everywhere even though hidden=false
        assertThat(columnFilter.getVisibleColumns(def, noPii)).containsExactly("id");
        assertThat(columnFilter.getExportColumns(def, noPii)).containsExactly("id");
    }

    @Test
    @DisplayName("RBAC restriction does not apply to super-admin")
    void rbacBypassedForSuperAdmin() {
        AccessConfig access = new AccessConfig(
                "REPORT_VIEW", "fin",
                Map.of("PII_VIEW", List.of("salary")),
                null);

        ReportDefinition def = defWithColsAndAccess(List.of(
                new ColumnDefinition("id", "ID", "number", 100, false, false, false),
                new ColumnDefinition("salary", "Salary", "number", 100, false, false, false)
        ), access);

        // Super-admin sees everything
        assertThat(columnFilter.getVisibleColumns(def, superAdmin())).containsExactly("id", "salary");
        assertThat(columnFilter.getExportColumns(def, superAdmin())).containsExactly("id", "salary");
    }

    @Test
    @DisplayName("Backward-compat 5-arg ColumnDefinition defaults hidden=false, exportOnly=false")
    void backwardCompatColumnDefaults() {
        ColumnDefinition col = new ColumnDefinition("x", "X", "text", 100, false);
        assertThat(col.hidden()).isFalse();
        assertThat(col.exportOnly()).isFalse();

        ReportDefinition def = defWithCols(List.of(col));
        assertThat(columnFilter.getVisibleColumns(def, superAdmin())).containsExactly("x");
        assertThat(columnFilter.getExportColumns(def, superAdmin())).containsExactly("x");
    }

    @Test
    @DisplayName("All-hidden+debug report → empty grid AND empty export")
    void allHiddenDebugEmpty() {
        ReportDefinition def = defWithCols(List.of(
                new ColumnDefinition("a", "A", "text", 100, false, true, false),
                new ColumnDefinition("b", "B", "text", 100, false, true, false)
        ));

        assertThat(columnFilter.getVisibleColumns(def, superAdmin())).isEmpty();
        assertThat(columnFilter.getExportColumns(def, superAdmin())).isEmpty();
    }

    @Test
    @DisplayName("All-hidden+exportOnly report → empty grid, full export (audit-only report)")
    void allHiddenExportOnly() {
        ReportDefinition def = defWithCols(List.of(
                new ColumnDefinition("a", "A", "text", 100, false, true, true),
                new ColumnDefinition("b", "B", "text", 100, false, true, true)
        ));

        assertThat(columnFilter.getVisibleColumns(def, superAdmin())).isEmpty();
        assertThat(columnFilter.getExportColumns(def, superAdmin())).containsExactly("a", "b");
    }
}
