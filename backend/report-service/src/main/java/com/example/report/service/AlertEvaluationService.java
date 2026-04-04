package com.example.report.service;

import com.example.report.authz.AuthzMeResponse;
import com.example.report.query.QueryEngine;
import com.example.report.registry.ReportDefinition;
import com.example.report.registry.ReportRegistry;
import com.example.report.repository.AlertEventRepository;
import com.example.report.repository.AlertRuleRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * Periodically evaluates enabled alert rules against live report data.
 * Uses scoped execution auth (synthetic AuthzMeResponse with superAdmin=true)
 * and distributed locking to prevent duplicate execution across instances.
 */
@Service
public class AlertEvaluationService {

    private static final Logger log = LoggerFactory.getLogger(AlertEvaluationService.class);
    private final ExecutorService executor = Executors.newVirtualThreadPerTaskExecutor();

    private final AlertRuleRepository alertRepository;
    private final AlertEventRepository eventRepository;
    private final ReportRegistry reportRegistry;
    private final QueryEngine queryEngine;
    private final NamedParameterJdbcTemplate mssqlJdbc;
    private final ExecutionLockService lockService;
    private final NotificationService notificationService;

    @Value("${report.alert.enabled:true}")
    private boolean enabled;

    public AlertEvaluationService(
            AlertRuleRepository alertRepository,
            AlertEventRepository eventRepository,
            ReportRegistry reportRegistry,
            QueryEngine queryEngine,
            NamedParameterJdbcTemplate mssqlJdbc,
            ExecutionLockService lockService,
            NotificationService notificationService) {
        this.alertRepository = alertRepository;
        this.eventRepository = eventRepository;
        this.reportRegistry = reportRegistry;
        this.queryEngine = queryEngine;
        this.mssqlJdbc = mssqlJdbc;
        this.lockService = lockService;
        this.notificationService = notificationService;
    }

    @Scheduled(fixedDelayString = "${report.alert.evaluation-interval-ms:300000}")
    public void evaluateAlerts() {
        if (!enabled) return;
        if (!lockService.tryAcquire("alert-evaluation", 290)) {
            log.debug("Alert evaluation skipped — another instance holds the lock");
            return;
        }

        try {
            List<Map<String, Object>> rules = alertRepository.findAllEnabled();
            if (rules.isEmpty()) {
                log.debug("No enabled alert rules found");
                return;
            }

            log.info("Evaluating {} alert rules", rules.size());

            // Group by reportKey to avoid redundant queries
            Map<String, List<Map<String, Object>>> grouped = new LinkedHashMap<>();
            for (Map<String, Object> rule : rules) {
                grouped.computeIfAbsent((String) rule.get("reportKey"), k -> new ArrayList<>()).add(rule);
            }

            // Evaluate each group in parallel using virtual threads
            List<CompletableFuture<Void>> futures = grouped.entrySet().stream()
                    .map(entry -> CompletableFuture.runAsync(
                            () -> evaluateRulesForReport(entry.getKey(), entry.getValue()), executor))
                    .toList();

            futures.forEach(CompletableFuture::join);
            log.info("Alert evaluation cycle completed for {} reports", grouped.size());
        } catch (Exception e) {
            log.error("Alert evaluation cycle failed: {}", e.getMessage(), e);
        } finally {
            lockService.release("alert-evaluation");
        }
    }

    private void evaluateRulesForReport(String reportKey, List<Map<String, Object>> rules) {
        try {
            ReportDefinition def = reportRegistry.get(reportKey);
            if (def == null) {
                log.warn("Report definition not found for key={}", reportKey);
                return;
            }

            // Synthetic scoped execution auth — superAdmin to bypass RLS for alert evaluation
            AuthzMeResponse systemAuth = AuthzMeResponse.systemExecution();

            for (Map<String, Object> rule : rules) {
                try {
                    evaluateSingleRule(rule, def, systemAuth);
                } catch (Exception e) {
                    log.warn("Alert rule evaluation failed ruleId={}: {}", rule.get("id"), e.getMessage());
                }
            }
        } catch (Exception e) {
            log.warn("Failed to evaluate rules for report={}: {}", reportKey, e.getMessage());
        }
    }

    private void evaluateSingleRule(Map<String, Object> rule, ReportDefinition def, AuthzMeResponse auth) {
        String ruleId = (String) rule.get("id");
        String field = (String) rule.get("field");
        String condition = (String) rule.get("condition");
        BigDecimal threshold = (BigDecimal) rule.get("threshold");
        int cooldownMinutes = rule.get("cooldownMinutes") != null ? (int) rule.get("cooldownMinutes") : 60;

        // Cooldown check — skip if recently triggered
        OffsetDateTime lastTriggered = (OffsetDateTime) rule.get("lastTriggeredAt");
        if (lastTriggered != null && lastTriggered.plus(cooldownMinutes, ChronoUnit.MINUTES).isAfter(OffsetDateTime.now())) {
            log.debug("Rule {} in cooldown, skipping", ruleId);
            return;
        }

        // Build and execute a simple aggregate query for the field
        BigDecimal currentValue = queryFieldValue(def, field, auth);
        if (currentValue == null) {
            log.debug("No value returned for rule {} field={}", ruleId, field);
            return;
        }

        boolean triggered = evaluateCondition(currentValue, condition, threshold);
        if (!triggered) return;

        // Dedupe check
        String dedupeKey = ruleId + ":" + field + ":" + currentValue.toPlainString();
        if (eventRepository.existsByDedupeKey(dedupeKey)) {
            log.debug("Duplicate alert suppressed for rule {} dedupeKey={}", ruleId, dedupeKey);
            return;
        }

        // Record event
        Map<String, Object> event = new LinkedHashMap<>();
        event.put("ruleId", ruleId);
        event.put("reportKey", rule.get("reportKey"));
        event.put("field", field);
        event.put("currentValue", currentValue);
        event.put("threshold", threshold);
        event.put("condition", condition);
        event.put("dedupeKey", dedupeKey);

        eventRepository.save(event);
        alertRepository.updateLastTriggered(ruleId, OffsetDateTime.now());

        log.info("Alert triggered: rule={} field={} value={} {} threshold={}",
                ruleId, field, currentValue, condition, threshold);

        // Send notifications to configured channels
        @SuppressWarnings("unchecked")
        List<String> channels = (List<String>) rule.getOrDefault("channels", List.of());
        String reportKey = (String) rule.get("reportKey");
        for (String channel : channels) {
            if ("email".equals(channel)) {
                notificationService.sendAlertEmail(
                        (String) rule.getOrDefault("createdBy", ""), reportKey, field, condition, currentValue, threshold);
            } else if (channel != null && channel.startsWith("http")) {
                notificationService.sendWebhook(channel, event);
            }
        }
    }

    private BigDecimal queryFieldValue(ReportDefinition def, String field, AuthzMeResponse auth) {
        try {
            // Build a minimal query: SELECT TOP 1 {field} FROM {source}
            var builtQuery = queryEngine.buildExportQuery(def, auth, Map.of(), List.of());
            String minimalSql = String.format(
                    "SELECT TOP 1 [%s] FROM (%s) AS _alert WHERE [%s] IS NOT NULL ORDER BY [%s] DESC",
                    field, builtQuery.sql(), field, field
            );
            return mssqlJdbc.queryForObject(minimalSql, builtQuery.params(), BigDecimal.class);
        } catch (Exception e) {
            log.debug("Query failed for field={}: {}", field, e.getMessage());
            return null;
        }
    }

    /**
     * Dry-run: evaluate a rule without side-effects (no event saved, no notification sent).
     * Returns a result map with currentValue, triggered, and evaluation details.
     */
    public Map<String, Object> dryRun(String reportKey, Map<String, Object> ruleSpec) {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("reportKey", reportKey);
        result.put("dryRun", true);

        String field = (String) ruleSpec.get("field");
        String condition = (String) ruleSpec.get("condition");
        Object thresholdObj = ruleSpec.get("threshold");
        BigDecimal threshold = thresholdObj != null ? new BigDecimal(thresholdObj.toString()) : null;

        result.put("field", field);
        result.put("condition", condition);
        result.put("threshold", threshold);

        try {
            ReportDefinition def = reportRegistry.get(reportKey);
            if (def == null) {
                result.put("error", "Report definition not found");
                result.put("triggered", false);
                return result;
            }

            AuthzMeResponse systemAuth = AuthzMeResponse.systemExecution();
            BigDecimal currentValue = queryFieldValue(def, field, systemAuth);

            result.put("currentValue", currentValue);

            if (currentValue == null) {
                result.put("triggered", false);
                result.put("reason", "No value returned for field");
            } else {
                boolean triggered = evaluateCondition(currentValue, condition, threshold);
                result.put("triggered", triggered);
                result.put("reason", triggered
                        ? String.format("%s %s %s → TRIGGERED", currentValue, condition, threshold)
                        : String.format("%s %s %s → OK", currentValue, condition, threshold));
            }
        } catch (Exception e) {
            result.put("triggered", false);
            result.put("error", e.getMessage());
        }

        return result;
    }

    private boolean evaluateCondition(BigDecimal current, String condition, BigDecimal threshold) {
        if (threshold == null) return false;
        return switch (condition) {
            case "gt" -> current.compareTo(threshold) > 0;
            case "lt" -> current.compareTo(threshold) < 0;
            case "eq" -> current.compareTo(threshold) == 0;
            default -> false; // change/anomaly not yet implemented
        };
    }
}
