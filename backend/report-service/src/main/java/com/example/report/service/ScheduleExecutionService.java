package com.example.report.service;

import com.example.report.authz.AuthzMeResponse;
import com.example.report.export.CsvStreamingExporter;
import com.example.report.export.ExcelStreamingExporter;
import com.example.report.query.QueryEngine;
import com.example.report.query.SqlBuilder;
import com.example.report.registry.ReportDefinition;
import com.example.report.registry.ReportRegistry;
import com.example.report.repository.ReportScheduleRepository;
import com.example.report.repository.ScheduleExecutionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.scheduling.support.CronExpression;
import org.springframework.stereotype.Service;

import java.io.FileOutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.Map;

/**
 * Checks enabled schedules every minute and generates report exports
 * when the cron expression matches. Uses distributed locking to prevent
 * duplicate execution across instances.
 */
@Service
public class ScheduleExecutionService {

    private static final Logger log = LoggerFactory.getLogger(ScheduleExecutionService.class);

    private final ReportScheduleRepository scheduleRepository;
    private final ScheduleExecutionRepository executionRepository;
    private final ReportRegistry reportRegistry;
    private final QueryEngine queryEngine;
    private final NamedParameterJdbcTemplate mssqlJdbc;
    private final ExecutionLockService lockService;
    private final NotificationService notificationService;

    @Value("${report.schedule.enabled:true}")
    private boolean enabled;

    @Value("${report.schedule.export-dir:/tmp/report-exports}")
    private String exportDir;

    public ScheduleExecutionService(
            ReportScheduleRepository scheduleRepository,
            ScheduleExecutionRepository executionRepository,
            ReportRegistry reportRegistry,
            QueryEngine queryEngine,
            NamedParameterJdbcTemplate mssqlJdbc,
            ExecutionLockService lockService,
            NotificationService notificationService) {
        this.scheduleRepository = scheduleRepository;
        this.executionRepository = executionRepository;
        this.reportRegistry = reportRegistry;
        this.queryEngine = queryEngine;
        this.mssqlJdbc = mssqlJdbc;
        this.lockService = lockService;
        this.notificationService = notificationService;
    }

    @Scheduled(cron = "0 * * * * *") // every minute
    public void executeSchedules() {
        if (!enabled) return;
        if (!lockService.tryAcquire("schedule-execution", 55)) {
            log.debug("Schedule execution skipped — another instance holds the lock");
            return;
        }

        try {
            List<Map<String, Object>> schedules = scheduleRepository.findAllEnabled();
            if (schedules.isEmpty()) return;

            LocalDateTime now = LocalDateTime.now();

            for (Map<String, Object> schedule : schedules) {
                try {
                    if (shouldRun(schedule, now)) {
                        executeSchedule(schedule);
                    }
                } catch (Exception e) {
                    log.warn("Schedule execution failed for id={}: {}", schedule.get("id"), e.getMessage());
                }
            }
        } catch (Exception e) {
            log.error("Schedule execution cycle failed: {}", e.getMessage(), e);
        } finally {
            lockService.release("schedule-execution");
        }
    }

    private boolean shouldRun(Map<String, Object> schedule, LocalDateTime now) {
        String cronStr = (String) schedule.get("cron");
        String timezone = (String) schedule.get("timezone");
        if (cronStr == null || cronStr.isBlank()) return false;

        try {
            // Convert 5-field user cron to 6-field Spring cron (prepend seconds=0)
            String springCron = cronStr.trim().split("\\s+").length == 5
                    ? "0 " + cronStr.trim()
                    : cronStr.trim();

            CronExpression cron = CronExpression.parse(springCron);
            ZoneId zone = timezone != null ? ZoneId.of(timezone) : ZoneId.of("Europe/Istanbul");
            LocalDateTime zoned = now.atZone(ZoneId.systemDefault()).withZoneSameInstant(zone).toLocalDateTime();

            // Check if the previous scheduled time falls within the last minute
            LocalDateTime prev = cron.next(zoned.minusMinutes(1));
            if (prev == null) return false;

            return !prev.isAfter(zoned);
        } catch (Exception e) {
            log.warn("Invalid cron expression '{}' for schedule {}: {}", cronStr, schedule.get("id"), e.getMessage());
            return false;
        }
    }

    private void executeSchedule(Map<String, Object> schedule) throws Exception {
        String scheduleId = (String) schedule.get("id");
        String reportKey = (String) schedule.get("reportKey");
        String format = (String) schedule.getOrDefault("format", "excel");

        ReportDefinition def = reportRegistry.get(reportKey);
        if (def == null) {
            log.warn("Report definition not found for schedule reportKey={}", reportKey);
            return;
        }

        // Create execution log entry
        Map<String, Object> execLog = executionRepository.save(scheduleId, reportKey, format);
        String logId = (String) execLog.get("id");

        try {
            // System auth for export (superAdmin bypasses RLS)
            AuthzMeResponse systemAuth = AuthzMeResponse.systemExecution();
            SqlBuilder.BuiltQuery exportQuery = queryEngine.buildExportQuery(def, systemAuth, Map.of(), List.of());

            // Ensure export directory exists
            Path exportPath = Path.of(exportDir);
            Files.createDirectories(exportPath);

            String fileName = reportKey + "-" + System.currentTimeMillis() + ("csv".equals(format) ? ".csv" : ".xlsx");
            Path filePath = exportPath.resolve(fileName);

            // Generate export file
            try (FileOutputStream fos = new FileOutputStream(filePath.toFile())) {
                List<String> columns = def.columns().stream().map(c -> c.field()).toList();
                if ("csv".equals(format)) {
                    CsvStreamingExporter.export(mssqlJdbc, exportQuery, columns, def.title(), fos);
                } else {
                    ExcelStreamingExporter.export(mssqlJdbc, exportQuery, columns, def.title(), fos);
                }
            }

            executionRepository.markCompleted(logId, filePath.toString());
            scheduleRepository.updateLastRun(scheduleId, OffsetDateTime.now());

            // Send email to all recipients
            @SuppressWarnings("unchecked")
            List<String> recipients = (List<String>) schedule.getOrDefault("recipients", List.of());
            for (String recipient : recipients) {
                notificationService.sendScheduleEmail(recipient, reportKey, filePath.toString());
            }

            log.info("Schedule executed: report={} format={} file={} recipients={}", reportKey, format, filePath, recipients.size());
        } catch (Exception e) {
            executionRepository.markFailed(logId, e.getMessage());
            log.error("Schedule execution failed: report={} error={}", reportKey, e.getMessage());
            throw e;
        }
    }
}
