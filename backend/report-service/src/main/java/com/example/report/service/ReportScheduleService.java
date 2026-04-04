package com.example.report.service;

import com.example.report.repository.ReportScheduleRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

@Service
public class ReportScheduleService {

    private static final Logger log = LoggerFactory.getLogger(ReportScheduleService.class);

    private final ReportScheduleRepository scheduleRepository;

    public ReportScheduleService(ReportScheduleRepository scheduleRepository) {
        this.scheduleRepository = scheduleRepository;
    }

    public Optional<Map<String, Object>> findByReportKey(String reportKey) {
        return scheduleRepository.findByReportKey(reportKey);
    }

    public Map<String, Object> create(String reportKey, Map<String, Object> body) {
        body.put("reportKey", reportKey);
        Map<String, Object> saved = scheduleRepository.save(body);
        log.info("Schedule created for report={} cron={}", reportKey, body.get("cron"));
        return saved;
    }

    public boolean update(String scheduleId, Map<String, Object> body) {
        boolean updated = scheduleRepository.update(scheduleId, body);
        if (updated) {
            log.info("Schedule updated scheduleId={}", scheduleId);
        }
        return updated;
    }

    public boolean delete(String scheduleId) {
        boolean deleted = scheduleRepository.delete(scheduleId);
        if (deleted) {
            log.info("Schedule deleted scheduleId={}", scheduleId);
        }
        return deleted;
    }
}
