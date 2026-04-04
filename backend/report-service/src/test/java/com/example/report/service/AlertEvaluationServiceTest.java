package com.example.report.service;

import com.example.report.authz.AuthzMeResponse;
import com.example.report.query.QueryEngine;
import com.example.report.query.SqlBuilder;
import com.example.report.registry.ReportDefinition;
import com.example.report.registry.ReportRegistry;
import com.example.report.repository.AlertEventRepository;
import com.example.report.repository.AlertRuleRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;

import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AlertEvaluationServiceTest {

    @Mock AlertRuleRepository alertRepository;
    @Mock AlertEventRepository eventRepository;
    @Mock ReportRegistry reportRegistry;
    @Mock QueryEngine queryEngine;
    @Mock NamedParameterJdbcTemplate mssqlJdbc;
    @Mock ExecutionLockService lockService;
    @Mock NotificationService notificationService;

    AlertEvaluationService service;

    @BeforeEach
    void setUp() {
        service = new AlertEvaluationService(
                alertRepository, eventRepository, reportRegistry,
                queryEngine, mssqlJdbc, lockService, notificationService);
    }

    @Nested
    class DryRun {

        @Test
        void returnsTriggeredWhenConditionMet() {
            when(reportRegistry.get("test-report")).thenReturn(mock(ReportDefinition.class));
            SqlBuilder.BuiltQuery builtQuery = new SqlBuilder.BuiltQuery("SELECT 1", new MapSqlParameterSource());
            when(queryEngine.buildExportQuery(any(), any(), any(), any())).thenReturn(builtQuery);
            when(mssqlJdbc.queryForObject(anyString(), any(MapSqlParameterSource.class), eq(BigDecimal.class)))
                    .thenReturn(new BigDecimal("150"));

            Map<String, Object> spec = Map.of(
                    "field", "salary",
                    "condition", "gt",
                    "threshold", "100"
            );

            Map<String, Object> result = service.dryRun("test-report", spec);

            assertTrue((Boolean) result.get("triggered"));
            assertEquals(new BigDecimal("150"), result.get("currentValue"));
            assertTrue(((String) result.get("reason")).contains("TRIGGERED"));
            assertTrue((Boolean) result.get("dryRun"));
        }

        @Test
        void returnsNotTriggeredWhenConditionNotMet() {
            when(reportRegistry.get("test-report")).thenReturn(mock(ReportDefinition.class));
            SqlBuilder.BuiltQuery builtQuery = new SqlBuilder.BuiltQuery("SELECT 1", new MapSqlParameterSource());
            when(queryEngine.buildExportQuery(any(), any(), any(), any())).thenReturn(builtQuery);
            when(mssqlJdbc.queryForObject(anyString(), any(MapSqlParameterSource.class), eq(BigDecimal.class)))
                    .thenReturn(new BigDecimal("50"));

            Map<String, Object> spec = Map.of(
                    "field", "salary",
                    "condition", "gt",
                    "threshold", "100"
            );

            Map<String, Object> result = service.dryRun("test-report", spec);

            assertFalse((Boolean) result.get("triggered"));
            assertTrue(((String) result.get("reason")).contains("OK"));
        }

        @Test
        void returnsErrorWhenReportNotFound() {
            when(reportRegistry.get("nonexistent")).thenReturn(null);

            Map<String, Object> spec = Map.of(
                    "field", "salary",
                    "condition", "gt",
                    "threshold", "100"
            );

            Map<String, Object> result = service.dryRun("nonexistent", spec);

            assertFalse((Boolean) result.get("triggered"));
            assertEquals("Report definition not found", result.get("error"));
        }

        @Test
        void handlesNullValueGracefully() {
            when(reportRegistry.get("test-report")).thenReturn(mock(ReportDefinition.class));
            SqlBuilder.BuiltQuery builtQuery = new SqlBuilder.BuiltQuery("SELECT 1", new MapSqlParameterSource());
            when(queryEngine.buildExportQuery(any(), any(), any(), any())).thenReturn(builtQuery);
            when(mssqlJdbc.queryForObject(anyString(), any(MapSqlParameterSource.class), eq(BigDecimal.class)))
                    .thenReturn(null);

            Map<String, Object> spec = Map.of(
                    "field", "salary",
                    "condition", "gt",
                    "threshold", "100"
            );

            Map<String, Object> result = service.dryRun("test-report", spec);

            assertFalse((Boolean) result.get("triggered"));
            assertEquals("No value returned for field", result.get("reason"));
        }

        @Test
        void supportsLtCondition() {
            when(reportRegistry.get("r")).thenReturn(mock(ReportDefinition.class));
            SqlBuilder.BuiltQuery bq = new SqlBuilder.BuiltQuery("SELECT 1", new MapSqlParameterSource());
            when(queryEngine.buildExportQuery(any(), any(), any(), any())).thenReturn(bq);
            when(mssqlJdbc.queryForObject(anyString(), any(MapSqlParameterSource.class), eq(BigDecimal.class)))
                    .thenReturn(new BigDecimal("5"));

            Map<String, Object> result = service.dryRun("r", Map.of("field", "x", "condition", "lt", "threshold", "10"));
            assertTrue((Boolean) result.get("triggered"));
        }

        @Test
        void supportsEqCondition() {
            when(reportRegistry.get("r")).thenReturn(mock(ReportDefinition.class));
            SqlBuilder.BuiltQuery bq = new SqlBuilder.BuiltQuery("SELECT 1", new MapSqlParameterSource());
            when(queryEngine.buildExportQuery(any(), any(), any(), any())).thenReturn(bq);
            when(mssqlJdbc.queryForObject(anyString(), any(MapSqlParameterSource.class), eq(BigDecimal.class)))
                    .thenReturn(new BigDecimal("42"));

            Map<String, Object> result = service.dryRun("r", Map.of("field", "x", "condition", "eq", "threshold", "42"));
            assertTrue((Boolean) result.get("triggered"));
        }

        @Test
        void unknownConditionDoesNotTrigger() {
            when(reportRegistry.get("r")).thenReturn(mock(ReportDefinition.class));
            SqlBuilder.BuiltQuery bq = new SqlBuilder.BuiltQuery("SELECT 1", new MapSqlParameterSource());
            when(queryEngine.buildExportQuery(any(), any(), any(), any())).thenReturn(bq);
            when(mssqlJdbc.queryForObject(anyString(), any(MapSqlParameterSource.class), eq(BigDecimal.class)))
                    .thenReturn(new BigDecimal("100"));

            Map<String, Object> result = service.dryRun("r", Map.of("field", "x", "condition", "anomaly", "threshold", "50"));
            assertFalse((Boolean) result.get("triggered"));
        }
    }

    @Nested
    class SystemExecution {
        @Test
        void systemExecutionAuthIsSuperAdmin() {
            AuthzMeResponse auth = AuthzMeResponse.systemExecution();
            assertTrue(auth.isSuperAdmin());
            assertEquals("system:alert-scheduler", auth.getUserId());
            assertTrue(auth.hasPermission("REPORT_VIEW"));
            assertTrue(auth.hasPermission("REPORT_EXPORT"));
        }
    }
}
