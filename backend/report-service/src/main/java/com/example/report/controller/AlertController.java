package com.example.report.controller;

import com.example.report.repository.AlertEventRepository;
import com.example.report.service.AlertEvaluationService;
import com.example.report.service.AlertRuleService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/alerts")
public class AlertController {

    private final AlertRuleService alertService;
    private final AlertEventRepository eventRepository;
    private final AlertEvaluationService evaluationService;

    public AlertController(AlertRuleService alertService, AlertEventRepository eventRepository,
                           AlertEvaluationService evaluationService) {
        this.alertService = alertService;
        this.eventRepository = eventRepository;
        this.evaluationService = evaluationService;
    }

    @GetMapping("/{reportKey}")
    public ResponseEntity<List<Map<String, Object>>> listRules(@PathVariable String reportKey) {
        return ResponseEntity.ok(alertService.listByReportKey(reportKey));
    }

    @PostMapping("/{reportKey}")
    public ResponseEntity<Map<String, Object>> createRule(
            @PathVariable String reportKey,
            @RequestBody Map<String, Object> body) {
        Map<String, Object> saved = alertService.create(reportKey, body);
        return ResponseEntity.status(201).body(saved);
    }

    @PutMapping("/rule/{ruleId}")
    public ResponseEntity<Void> updateRule(
            @PathVariable String ruleId,
            @RequestBody Map<String, Object> body) {
        boolean updated = alertService.update(ruleId, body);
        return updated ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/rule/{ruleId}")
    public ResponseEntity<Void> deleteRule(@PathVariable String ruleId) {
        boolean deleted = alertService.delete(ruleId);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

    @GetMapping("/{reportKey}/events")
    public ResponseEntity<List<Map<String, Object>>> listEvents(
            @PathVariable String reportKey,
            @RequestParam(defaultValue = "50") int limit) {
        return ResponseEntity.ok(eventRepository.findByReportKey(reportKey, limit));
    }

    @PutMapping("/event/{eventId}/acknowledge")
    public ResponseEntity<Void> acknowledgeEvent(@PathVariable String eventId) {
        boolean ack = eventRepository.acknowledge(eventId);
        return ack ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }

    @PostMapping("/{reportKey}/test")
    public ResponseEntity<Map<String, Object>> dryRunAlert(
            @PathVariable String reportKey,
            @RequestBody Map<String, Object> ruleSpec) {
        Map<String, Object> result = evaluationService.dryRun(reportKey, ruleSpec);
        return ResponseEntity.ok(result);
    }
}
