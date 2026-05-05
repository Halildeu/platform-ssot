package com.example.report.query;

import com.example.report.authz.AuthzMeResponse;
import com.example.report.authz.ScopeSummaryDto;
import com.example.report.registry.ColumnDefinition;
import com.example.report.registry.ReportDefinition;
import java.util.List;
import java.util.Map;
import java.util.Set;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;

/**
 * Tests for {@link YearlySchemaResolver} company selection and companySchema resolution.
 */
class YearlySchemaResolverCompanySchemaTest {

    private YearlySchemaResolver resolver;

    @BeforeEach
    void setUp() {
        NamedParameterJdbcTemplate jdbc = mock(NamedParameterJdbcTemplate.class);
        resolver = new YearlySchemaResolver(jdbc) {
            @Override
            public Set<String> getAvailableSchemas() {
                return Set.of(
                        "workcube_mikrolink_2026_1",
                        "workcube_mikrolink_1",
                        "workcube_mikrolink_2026_35",
                        "workcube_mikrolink_35"
                );
            }
        };
    }

    private ReportDefinition yearlyReport() {
        return new ReportDefinition(
                "test", "1.0", "Test", "Desc", "Cat",
                "ACCOUNT_CARD_ROWS",
                "workcube_mikrolink_2026_35",
                "yearly",
                "action_date",
                "SELECT 1 FROM [{schema}].[ACCOUNT_CARD_ROWS]",
                List.of(new ColumnDefinition("c", "C", "text", 100, false)),
                "c", "ASC",
                null);
    }

    private Map<String, Object> year2026Filter() {
        return Map.of("action_date", Map.of("type", "equals", "filter", "2026-01-01"));
    }

    @Test
    @DisplayName("X-Company-Id present and in COMPANY scope: header company is used")
    void headerInScope_resolvesRequestedCompany() {
        YearlySchemaResolver.ResolvedSchemas resolved = resolver.resolve(
                yearlyReport(),
                userWithCompanyScopes("35", "1"),
                year2026Filter(),
                35L);

        assertEquals(List.of("workcube_mikrolink_2026_35"), resolved.schemas());
        assertEquals("workcube_mikrolink_35", resolved.companySchema());
        assertTrue(resolved.hasCompanySchema());
    }

    @Test
    @DisplayName("X-Company-Id present and outside COMPANY scope: 403")
    void headerOutsideScope_throws403() {
        var ex = assertThrows(
                ReportSchemaResolutionException.UnauthorizedCompanyException.class,
                () -> resolver.resolve(yearlyReport(), userWithCompanyScopes("1"), year2026Filter(), 35L));

        assertEquals(403, ex.getStatusCode().value());
    }

    @Test
    @DisplayName("X-Company-Id present for superAdmin with empty allowedScopes: requested company is used")
    void superAdminWithHeader_resolvesRequestedCompany() {
        YearlySchemaResolver.ResolvedSchemas resolved = resolver.resolve(
                yearlyReport(),
                superAdmin(),
                year2026Filter(),
                1L);

        assertEquals(List.of("workcube_mikrolink_2026_1"), resolved.schemas());
        assertEquals("workcube_mikrolink_1", resolved.companySchema());
    }

    @Test
    @DisplayName("X-Company-Id present but company schema missing: 400")
    void headerSchemaMissing_throws400() {
        var ex = assertThrows(
                ReportSchemaResolutionException.CompanySchemaNotFoundException.class,
                () -> resolver.resolve(yearlyReport(), superAdmin(), year2026Filter(), 99L));

        assertEquals(400, ex.getStatusCode().value());
    }

    @Test
    @DisplayName("No X-Company-Id and single allowed COMPANY scope: auto-select that company")
    void noHeaderSingleCompanyScope_autoSelects() {
        YearlySchemaResolver.ResolvedSchemas resolved = resolver.resolve(
                yearlyReport(),
                userWithCompanyScopes("1"),
                year2026Filter(),
                null);

        assertEquals(List.of("workcube_mikrolink_2026_1"), resolved.schemas());
        assertEquals("workcube_mikrolink_1", resolved.companySchema());
    }

    @Test
    @DisplayName("No X-Company-Id and multiple allowed COMPANY scopes: 400 selection required")
    void noHeaderMultipleCompanyScopes_throws400() {
        var ex = assertThrows(
                ReportSchemaResolutionException.MissingCompanyHeaderException.class,
                () -> resolver.resolve(yearlyReport(), userWithCompanyScopes("1", "35"), year2026Filter(), null));

        assertEquals(400, ex.getStatusCode().value());
    }

    @Test
    @DisplayName("No X-Company-Id and superAdmin: 400 explicit company required")
    void noHeaderSuperAdmin_throws400() {
        var ex = assertThrows(
                ReportSchemaResolutionException.MissingCompanyHeaderException.class,
                () -> resolver.resolve(yearlyReport(), superAdmin(), year2026Filter(), null));

        assertEquals(400, ex.getStatusCode().value());
    }

    @Test
    @DisplayName("No X-Company-Id and no COMPANY scope: 400 explicit company required")
    void noHeaderNoCompanyScope_throws400() {
        var ex = assertThrows(
                ReportSchemaResolutionException.MissingCompanyHeaderException.class,
                () -> resolver.resolve(yearlyReport(), userWithCompanyScopes(), year2026Filter(), null));

        assertEquals(400, ex.getStatusCode().value());
    }

    @Test
    @DisplayName("Backward-compat 1-arg constructor: companySchema null")
    void backwardCompatConstructor() {
        YearlySchemaResolver.ResolvedSchemas r = new YearlySchemaResolver.ResolvedSchemas(
                List.of("schema1", "schema2"));
        assertFalse(r.hasCompanySchema());
        assertFalse(r.isSingle());
    }

    private static AuthzMeResponse superAdmin() {
        var authz = new AuthzMeResponse();
        authz.setSuperAdmin(true);
        authz.setUserId("admin");
        authz.setAllowedScopes(List.of());
        return authz;
    }

    private static AuthzMeResponse userWithCompanyScopes(String... companyIds) {
        var authz = new AuthzMeResponse();
        authz.setSuperAdmin(false);
        authz.setPermissions(List.of("REPORT_VIEW"));
        authz.setUserId("user");
        authz.setAllowedScopes(
                java.util.Arrays.stream(companyIds)
                        .map(id -> new ScopeSummaryDto("COMPANY", id))
                        .toList());
        return authz;
    }
}
