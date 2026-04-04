package com.example.report.service;

import com.example.report.repository.AlertRuleRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class AlertRuleService {

    private static final Logger log = LoggerFactory.getLogger(AlertRuleService.class);

    private final AlertRuleRepository alertRepository;

    public AlertRuleService(AlertRuleRepository alertRepository) {
        this.alertRepository = alertRepository;
    }

    public List<Map<String, Object>> listByReportKey(String reportKey) {
        return alertRepository.findByReportKey(reportKey);
    }

    public Map<String, Object> create(String reportKey, Map<String, Object> body) {
        body.put("reportKey", reportKey);
        Map<String, Object> saved = alertRepository.save(body);
        log.info("Alert rule created for report={} field={}", reportKey, body.get("field"));
        return saved;
    }

    public boolean update(String ruleId, Map<String, Object> body) {
        boolean updated = alertRepository.update(ruleId, body);
        if (updated) {
            log.info("Alert rule updated ruleId={}", ruleId);
        }
        return updated;
    }

    public boolean delete(String ruleId) {
        boolean deleted = alertRepository.delete(ruleId);
        if (deleted) {
            log.info("Alert rule deleted ruleId={}", ruleId);
        }
        return deleted;
    }
}
