package com.example.report.controller;

import com.example.report.repository.ScheduleExecutionRepository;
import com.example.report.service.ReportScheduleService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/schedules")
public class ScheduleController {

    private final ReportScheduleService scheduleService;
    private final ScheduleExecutionRepository executionRepository;

    public ScheduleController(ReportScheduleService scheduleService, ScheduleExecutionRepository executionRepository) {
        this.scheduleService = scheduleService;
        this.executionRepository = executionRepository;
    }

    @GetMapping("/{reportKey}")
    public ResponseEntity<Map<String, Object>> getSchedule(@PathVariable String reportKey) {
        return scheduleService.findByReportKey(reportKey)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{reportKey}")
    public ResponseEntity<Map<String, Object>> createSchedule(
            @PathVariable String reportKey,
            @RequestBody Map<String, Object> body) {
        Map<String, Object> saved = scheduleService.create(reportKey, body);
        return ResponseEntity.status(201).body(saved);
    }

    @PutMapping("/{scheduleId}")
    public ResponseEntity<Void> updateSchedule(
            @PathVariable String scheduleId,
            @RequestBody Map<String, Object> body) {
        boolean updated = scheduleService.update(scheduleId, body);
        return updated ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{scheduleId}")
    public ResponseEntity<Void> deleteSchedule(@PathVariable String scheduleId) {
        boolean deleted = scheduleService.delete(scheduleId);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

    @GetMapping("/{reportKey}/history")
    public ResponseEntity<List<Map<String, Object>>> getHistory(
            @PathVariable String reportKey,
            @RequestParam(defaultValue = "20") int limit) {
        return ResponseEntity.ok(executionRepository.findByReportKey(reportKey, limit));
    }
}
