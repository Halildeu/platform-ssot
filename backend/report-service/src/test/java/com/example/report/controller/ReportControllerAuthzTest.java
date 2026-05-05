package com.example.report.controller;

import com.example.report.access.ReportAccessEvaluator;
import com.example.report.access.ColumnFilter;
import com.example.report.access.RowFilterInjector;
import com.example.report.audit.ReportAuditClient;
import com.example.report.authz.AuthzMeResponse;
import com.example.report.authz.PermissionResolver;
import com.example.report.authz.ScopeSummaryDto;
import com.example.report.query.QueryEngine;
import com.example.report.query.ReportSchemaResolutionException;
import com.example.report.query.YearlySchemaResolver;
import com.example.report.registry.AccessConfig;
import com.example.report.registry.ColumnDefinition;
import com.example.report.registry.ReportDefinition;
import com.example.report.registry.ReportRegistry;
import com.example.report.repository.CustomReportRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Tests for ReportController authorization enforcement.
 * CNS-006 R16: CRUD endpoints require REPORT_MANAGE or ownership.
 * CNS-006 R17: Custom report list filters by access_config.reportGroup.
 */
@ExtendWith(MockitoExtension.class)
@org.mockito.junit.jupiter.MockitoSettings(strictness = org.mockito.quality.Strictness.LENIENT)
class ReportControllerAuthzTest {

    @Mock private PermissionResolver permissionResolver;
    @Mock private CustomReportRepository customReportRepository;
    @Mock private ReportRegistry reportRegistry;
    private ReportController controller;

    @BeforeEach
    void setUp() {
        when(reportRegistry.getAll()).thenReturn(List.of());
        controller = new ReportController(
                reportRegistry,
                customReportRepository,
                permissionResolver,
                new ReportAccessEvaluator(),
                null, // columnFilter
                null, // queryEngine
                mock(com.example.report.audit.ReportAuditClient.class),
                new com.fasterxml.jackson.databind.ObjectMapper()
        );
    }

    // ---- R16: CRUD authorization ----

    @Test
    void createCustomReport_withoutReportManage_denied() {
        AuthzMeResponse authz = authzWith(false, List.of("REPORT_VIEW"), null);
        when(permissionResolver.getAuthzMe(any())).thenReturn(authz);

        assertThrows(ResponseStatusException.class, () ->
                controller.createCustomReport(new HashMap<>(Map.of("key", "test")), testJwt("user1")));
    }

    @Test
    void createCustomReport_withReportManage_allowed() {
        AuthzMeResponse authz = authzWith(false, List.of("REPORT_VIEW", "REPORT_MANAGE"), null);
        when(permissionResolver.getAuthzMe(any())).thenReturn(authz);
        when(customReportRepository.save(any())).thenReturn(new HashMap<>(Map.of("key", "test")));

        var response = controller.createCustomReport(new HashMap<>(Map.of("key", "test")), testJwt("user1"));
        assertEquals(201, response.getStatusCode().value());
    }

    @Test
    void createCustomReport_superAdmin_allowed() {
        AuthzMeResponse authz = authzWith(true, List.of(), null);
        when(permissionResolver.getAuthzMe(any())).thenReturn(authz);
        when(customReportRepository.save(any())).thenReturn(new HashMap<>(Map.of("key", "test")));

        var response = controller.createCustomReport(new HashMap<>(Map.of("key", "test")), testJwt("admin"));
        assertEquals(201, response.getStatusCode().value());
    }

    @Test
    void updateCustomReport_notOwnerNoManage_denied() {
        AuthzMeResponse authz = authzWith(false, List.of("REPORT_VIEW"), null);
        when(permissionResolver.getAuthzMe(any())).thenReturn(authz);
        when(customReportRepository.findByKey("test")).thenReturn(
                Optional.of(Map.of("createdBy", "other-user")));

        assertThrows(ResponseStatusException.class, () ->
                controller.updateCustomReport("test", Map.of(), testJwt("user1")));
    }

    @Test
    void updateCustomReport_owner_allowed() {
        AuthzMeResponse authz = authzWith(false, List.of("REPORT_VIEW"), null);
        authz.setUserId("user1");
        when(permissionResolver.getAuthzMe(any())).thenReturn(authz);
        when(customReportRepository.findByKey("test")).thenReturn(
                Optional.of(Map.of("createdBy", "user1")));
        when(customReportRepository.update(eq("test"), any())).thenReturn(new HashMap<>(Map.of("key", "test")));

        var response = controller.updateCustomReport("test", new HashMap<>(), testJwt("user1"));
        assertEquals(200, response.getStatusCode().value());
    }

    @Test
    void deleteCustomReport_notOwnerNoManage_denied() {
        AuthzMeResponse authz = authzWith(false, List.of("REPORT_VIEW"), null);
        when(permissionResolver.getAuthzMe(any())).thenReturn(authz);
        when(customReportRepository.findByKey("test")).thenReturn(
                Optional.of(Map.of("createdBy", "other-user")));

        assertThrows(ResponseStatusException.class, () ->
                controller.deleteCustomReport("test", testJwt("user1")));
    }

    @Test
    void getHistory_withoutReportView_denied() {
        AuthzMeResponse authz = authzWith(false, List.of(), null);
        when(permissionResolver.getAuthzMe(any())).thenReturn(authz);

        assertThrows(ResponseStatusException.class, () ->
                controller.getReportHistory("test", testJwt("user1")));
    }

    @Test
    void getHistory_withReportView_allowed() {
        AuthzMeResponse authz = authzWith(false, List.of("REPORT_VIEW"), null);
        when(permissionResolver.getAuthzMe(any())).thenReturn(authz);
        when(customReportRepository.getVersionHistory("test")).thenReturn(List.of());

        var response = controller.getReportHistory("test", testJwt("user1"));
        assertEquals(200, response.getStatusCode().value());
    }

    // ---- R17: Custom report access_config filtering ----

    @Test
    void listReports_customReportWithReportGroup_filteredByAuthz() {
        // User has FINANCE_REPORTS but not HR_REPORTS
        AuthzMeResponse authz = authzWith(false, List.of("REPORT_VIEW"),
                Map.of("FINANCE_REPORTS", "ALLOW"));
        when(permissionResolver.getAuthzMe(any())).thenReturn(authz);

        Map<String, Object> finReport = new LinkedHashMap<>();
        finReport.put("key", "custom-fin");
        finReport.put("title", "Finance Custom");
        finReport.put("description", "desc");
        finReport.put("category", "Finance");
        finReport.put("accessConfig", Map.of("reportGroup", "FINANCE_REPORTS"));

        Map<String, Object> hrReport = new LinkedHashMap<>();
        hrReport.put("key", "custom-hr");
        hrReport.put("title", "HR Custom");
        hrReport.put("description", "desc");
        hrReport.put("category", "HR");
        hrReport.put("accessConfig", Map.of("reportGroup", "HR_REPORTS"));

        when(customReportRepository.findAll()).thenReturn(List.of(finReport, hrReport));

        var response = controller.listReports(testJwt("user1"));
        var reports = response.getBody();
        assertNotNull(reports);
        // Only FINANCE custom report should be visible (HR filtered out)
        assertTrue(reports.stream().anyMatch(r -> "custom-fin".equals(r.key())));
        assertFalse(reports.stream().anyMatch(r -> "custom-hr".equals(r.key())));
    }

    @Test
    void listReports_customReportNoAccessConfig_allowedWithReportView() {
        AuthzMeResponse authz = authzWith(false, List.of("REPORT_VIEW"), Map.of());
        when(permissionResolver.getAuthzMe(any())).thenReturn(authz);

        Map<String, Object> noAccessReport = new LinkedHashMap<>();
        noAccessReport.put("key", "custom-open");
        noAccessReport.put("title", "Open Report");
        noAccessReport.put("description", "desc");
        noAccessReport.put("category", "General");

        when(customReportRepository.findAll()).thenReturn(List.of(noAccessReport));

        var response = controller.listReports(testJwt("user1"));
        var reports = response.getBody();
        assertNotNull(reports);
        assertTrue(reports.stream().anyMatch(r -> "custom-open".equals(r.key())));
    }

    // ---- Muavin v3 company selection contract ----

    @Test
    void getData_superAdminWithoutCompanyHeader_400() {
        ReportController dataController = dataControllerFor(authzWithScopes(true, List.of(), List.of()),
                Set.of("workcube_mikrolink_2026_1", "workcube_mikrolink_1"),
                mock(NamedParameterJdbcTemplate.class));

        var ex = assertThrows(ReportSchemaResolutionException.MissingCompanyHeaderException.class, () ->
                dataController.getData("yearly", 1, 50, null, null, null, testJwt("admin")));

        assertEquals(400, ex.getStatusCode().value());
    }

    @Test
    void getData_companyHeaderOutsideScope_403() {
        ReportController dataController = dataControllerFor(authzWithScopes(false, List.of("REPORT_VIEW"), List.of("1")),
                Set.of("workcube_mikrolink_2026_35", "workcube_mikrolink_35"),
                mock(NamedParameterJdbcTemplate.class));

        var ex = assertThrows(ReportSchemaResolutionException.UnauthorizedCompanyException.class, () ->
                dataController.getData("yearly", 1, 50, null, null, 35L, testJwt("user1")));

        assertEquals(403, ex.getStatusCode().value());
    }

    @Test
    void getData_superAdminWithCompanyHeader_successAndSubstitutesCompanyId() {
        NamedParameterJdbcTemplate jdbc = mock(NamedParameterJdbcTemplate.class);
        when(jdbc.queryForList(anyString(), any(MapSqlParameterSource.class)))
                .thenReturn(List.of(Map.of("id", 1)));
        when(jdbc.queryForObject(anyString(), any(MapSqlParameterSource.class), eq(Long.class)))
                .thenReturn(1L);

        ReportController dataController = dataControllerFor(authzWithScopes(true, List.of(), List.of()),
                Set.of("workcube_mikrolink_2026_1", "workcube_mikrolink_1"),
                jdbc);

        String filter2026 = "{\"action_date\":{\"type\":\"equals\",\"filter\":\"2026-01-01\"}}";
        var response = dataController.getData("yearly", 1, 50, null, filter2026, 1L, testJwt("admin"));

        assertEquals(200, response.getStatusCode().value());
        org.mockito.ArgumentCaptor<String> sqlCaptor = org.mockito.ArgumentCaptor.forClass(String.class);
        verify(jdbc).queryForList(sqlCaptor.capture(), any(MapSqlParameterSource.class));
        assertTrue(sqlCaptor.getValue().contains("COMPANY_ID = 1"));
        assertFalse(sqlCaptor.getValue().contains("{companyId}"));
    }

    // ---- Helpers ----

    private static AuthzMeResponse authzWith(boolean superAdmin,
                                              List<String> permissions,
                                              Map<String, String> reports) {
        var authz = new AuthzMeResponse();
        authz.setSuperAdmin(superAdmin);
        authz.setPermissions(permissions);
        authz.setReports(reports);
        authz.setUserId("test-user");
        return authz;
    }

    private static AuthzMeResponse authzWithScopes(boolean superAdmin,
                                                    List<String> permissions,
                                                    List<String> companyIds) {
        var authz = authzWith(superAdmin, permissions, Map.of());
        authz.setAllowedScopes(companyIds.stream()
                .map(id -> new ScopeSummaryDto("COMPANY", id))
                .toList());
        return authz;
    }

    private ReportController dataControllerFor(AuthzMeResponse authz,
                                               Set<String> availableSchemas,
                                               NamedParameterJdbcTemplate jdbc) {
        PermissionResolver resolverClient = mock(PermissionResolver.class);
        when(resolverClient.getAuthzMe(any())).thenReturn(authz);

        ReportRegistry registry = mock(ReportRegistry.class);
        when(registry.get("yearly")).thenReturn(Optional.of(yearlyReport()));
        when(registry.getEffectiveSourceQuery(any()))
                .thenReturn("SELECT 1 AS id FROM [{schema}].[ACCOUNT_CARD_ROWS] WHERE COMPANY_ID = {companyId}");
        when(registry.getEffectiveOuterQuery(any())).thenReturn(null);

        ColumnFilter columnFilter = mock(ColumnFilter.class);
        when(columnFilter.getVisibleColumns(any(), any())).thenReturn(List.of("id"));

        RowFilterInjector rowFilterInjector = mock(RowFilterInjector.class);
        when(rowFilterInjector.buildRlsClause(any(), any()))
                .thenReturn(new RowFilterInjector.RlsResult(null, null));

        YearlySchemaResolver schemaResolver = new YearlySchemaResolver(jdbc) {
            @Override
            public Set<String> getAvailableSchemas() {
                return availableSchemas;
            }
        };

        QueryEngine queryEngine = new QueryEngine(jdbc, columnFilter, rowFilterInjector, schemaResolver, registry);

        return new ReportController(
                registry,
                mock(CustomReportRepository.class),
                resolverClient,
                new ReportAccessEvaluator(),
                columnFilter,
                queryEngine,
                mock(ReportAuditClient.class),
                new com.fasterxml.jackson.databind.ObjectMapper()
        );
    }

    private static ReportDefinition yearlyReport() {
        return new ReportDefinition(
                "yearly",
                "1",
                "Yearly Report",
                "desc",
                "category",
                "ACCOUNT_CARD_ROWS",
                "workcube_mikrolink_2026_1",
                "yearly",
                "action_date",
                null,
                List.of(new ColumnDefinition("id", "ID", "number", 100, false)),
                "id",
                "ASC",
                new AccessConfig(null, null, null, null));
    }

    private static Jwt testJwt(String username) {
        return Jwt.withTokenValue("test-token")
                .header("alg", "RS256")
                .claim("preferred_username", username)
                .claim("sub", username)
                .claim("email", username + "@example.com")
                .issuedAt(Instant.now())
                .expiresAt(Instant.now().plusSeconds(3600))
                .build();
    }
}
