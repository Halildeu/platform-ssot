package com.example.report.query;

import com.example.report.authz.AuthzMeResponse;
import com.example.report.registry.ColumnDefinition;
import com.example.report.registry.ReportDefinition;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;

import java.util.List;
import java.util.Map;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

/**
 * Tests for {@link YearlySchemaResolver} companySchema resolution
 * (Codex 019df4ed iter-4 absorb).
 *
 * <p>The base resolver's {@link YearlySchemaResolver#getAvailableSchemas()} is
 * a {@link org.springframework.cache.annotation.Cacheable Cacheable} method
 * backed by sys.schemas; we override it via subclass to bypass jdbc entirely.
 */
class YearlySchemaResolverCompanySchemaTest {

    private NamedParameterJdbcTemplate jdbc;
    private YearlySchemaResolver resolver;

    @BeforeEach
    void setUp() {
        jdbc = mock(NamedParameterJdbcTemplate.class);
        // No jdbc stubbing needed — getAvailableSchemas() is overridden below.
        resolver = new YearlySchemaResolver(jdbc) {
            @Override
            public Set<String> getAvailableSchemas() {
                // Bypass @Cacheable for tests
                return Set.of(
                        "workcube_mikrolink_2024_35",
                        "workcube_mikrolink_2025_35",
                        "workcube_mikrolink_2026_35",
                        "workcube_mikrolink_35",
                        "workcube_mikrolink_2026_1",
                        "workcube_mikrolink_1"
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

    @Test
    @DisplayName("Single COMPANY scope: companySchema resolved as workcube_mikrolink_{companyId}")
    void singleCompanyScope_companySchemaResolved() {
        AuthzMeResponse authz = mock(AuthzMeResponse.class);
        when(authz.getScopeRefIds("COMPANY")).thenReturn(Set.of("35"));

        YearlySchemaResolver.ResolvedSchemas resolved = resolver.resolve(
                yearlyReport(), authz, Map.of());

        assertNotNull(resolved.companySchema());
        assertEquals("workcube_mikrolink_35", resolved.companySchema());
        assertTrue(resolved.hasCompanySchema());
    }

    @Test
    @DisplayName("Multiple COMPANY scope: companySchema null (ambiguous)")
    void multipleCompanyScope_companySchemaNull() {
        AuthzMeResponse authz = mock(AuthzMeResponse.class);
        when(authz.getScopeRefIds("COMPANY")).thenReturn(Set.of("35", "1"));

        YearlySchemaResolver.ResolvedSchemas resolved = resolver.resolve(
                yearlyReport(), authz, Map.of());

        assertNull(resolved.companySchema(),
                "companySchema must be null when multiple companies are in scope");
        assertFalse(resolved.hasCompanySchema());
    }

    @Test
    @DisplayName("No COMPANY scope: companySchema null, falls back to base sourceSchema")
    void noCompanyScope_fallback() {
        AuthzMeResponse authz = mock(AuthzMeResponse.class);
        when(authz.getScopeRefIds("COMPANY")).thenReturn(Set.of());

        YearlySchemaResolver.ResolvedSchemas resolved = resolver.resolve(
                yearlyReport(), authz, Map.of());

        // sourceSchema "workcube_mikrolink_2026_35" → 2-part pattern fails extractCompanyFromSchema
        // So no company inferred, falls back to base schema list
        assertEquals(List.of("workcube_mikrolink_2026_35"), resolved.schemas());
    }

    @Test
    @DisplayName("Backward-compat 1-arg constructor: companySchema null")
    void backwardCompatConstructor() {
        YearlySchemaResolver.ResolvedSchemas r = new YearlySchemaResolver.ResolvedSchemas(
                List.of("schema1", "schema2"));
        assertNull(r.companySchema());
        assertFalse(r.hasCompanySchema());
        assertFalse(r.isSingle());
    }

    @Test
    @DisplayName("isSingle and hasCompanySchema work together")
    void recordHelpers() {
        YearlySchemaResolver.ResolvedSchemas single = new YearlySchemaResolver.ResolvedSchemas(
                List.of("schema1"), "workcube_mikrolink_35");
        assertTrue(single.isSingle());
        assertTrue(single.hasCompanySchema());

        YearlySchemaResolver.ResolvedSchemas multi = new YearlySchemaResolver.ResolvedSchemas(
                List.of("s1", "s2"), null);
        assertFalse(multi.isSingle());
        assertFalse(multi.hasCompanySchema());
    }

    @Test
    @DisplayName("Single company, company-only schema missing in DB: companySchema null")
    void companyOnlySchemaMissing() {
        AuthzMeResponse authz = mock(AuthzMeResponse.class);
        when(authz.getScopeRefIds("COMPANY")).thenReturn(Set.of("99")); // no _99 in available set

        YearlySchemaResolver.ResolvedSchemas resolved = resolver.resolve(
                yearlyReport(), authz, Map.of());

        // _99 yearly schemas missing too — falls back, but companySchema explicitly null
        assertNull(resolved.companySchema());
    }
}
