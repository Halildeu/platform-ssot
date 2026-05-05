package com.example.report.access;

import com.example.report.authz.AuthzMeResponse;
import com.example.report.registry.ColumnDefinition;
import com.example.report.registry.ReportDefinition;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import org.springframework.stereotype.Component;

/**
 * Resolves the visible/exportable column projection for a report based on:
 * <ol>
 *   <li>Per-permission column restrictions in {@link ReportDefinition#access()} (RBAC).</li>
 *   <li>Static {@link ColumnDefinition#hidden()} / {@link ColumnDefinition#exportOnly()}
 *       flags in the JSON manifest.</li>
 * </ol>
 *
 * <p>Visibility matrix:
 * <table>
 *   <tr><th>hidden</th><th>exportOnly</th><th>grid</th><th>export</th></tr>
 *   <tr><td>false</td> <td>false</td>     <td>YES</td> <td>YES</td></tr>
 *   <tr><td>false</td> <td>true</td>      <td>YES</td> <td>YES</td></tr>
 *   <tr><td>true</td>  <td>true</td>      <td>NO</td>  <td>YES</td></tr>
 *   <tr><td>true</td>  <td>false</td>     <td>NO</td>  <td>NO  (debug-only)</td></tr>
 * </table>
 *
 * <p>RBAC restrictions take precedence; a column hidden by RBAC is hidden everywhere.
 */
@Component
public class ColumnFilter {

    public List<String> getVisibleColumns(ReportDefinition def, AuthzMeResponse authz) {
        Set<String> rbacHidden = getRbacHiddenColumns(def, authz);
        return def.columns().stream()
                .filter(col -> !rbacHidden.contains(col.field()))
                .filter(col -> !col.hidden())
                .map(ColumnDefinition::field)
                .toList();
    }

    public List<ColumnDefinition> getVisibleColumnDefinitions(ReportDefinition def, AuthzMeResponse authz) {
        Set<String> rbacHidden = getRbacHiddenColumns(def, authz);
        return def.columns().stream()
                .filter(col -> !rbacHidden.contains(col.field()))
                .filter(col -> !col.hidden())
                .toList();
    }

    /**
     * Returns the columns that should appear in CSV/XLSX export output.
     * Includes:
     * <ul>
     *   <li>hidden=false columns (unconditionally exported)</li>
     *   <li>hidden=true + exportOnly=true columns (audit fields exposed only via export)</li>
     * </ul>
     * Excludes:
     * <ul>
     *   <li>RBAC-restricted columns (per-permission)</li>
     *   <li>hidden=true + exportOnly=false (debug-only — never reach the wire)</li>
     * </ul>
     */
    public List<String> getExportColumns(ReportDefinition def, AuthzMeResponse authz) {
        Set<String> rbacHidden = getRbacHiddenColumns(def, authz);
        return def.columns().stream()
                .filter(col -> !rbacHidden.contains(col.field()))
                .filter(col -> !col.hidden() || col.exportOnly())
                .map(ColumnDefinition::field)
                .toList();
    }

    private Set<String> getRbacHiddenColumns(ReportDefinition def, AuthzMeResponse authz) {
        Set<String> hidden = new HashSet<>();

        if (authz == null || authz.isSuperAdmin() || def.access() == null) {
            return hidden;
        }

        Map<String, List<String>> restrictions = def.access().columnRestrictions();
        if (restrictions == null || restrictions.isEmpty()) {
            return hidden;
        }

        for (Map.Entry<String, List<String>> entry : restrictions.entrySet()) {
            String requiredPermission = entry.getKey();
            List<String> restrictedColumns = entry.getValue();

            if (!authz.hasPermission(requiredPermission)) {
                hidden.addAll(restrictedColumns);
            }
        }

        return hidden;
    }
}
