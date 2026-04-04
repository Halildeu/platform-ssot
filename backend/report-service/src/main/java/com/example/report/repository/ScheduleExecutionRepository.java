package com.example.report.repository;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.OffsetDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Repository
public class ScheduleExecutionRepository {

    private final NamedParameterJdbcTemplate jdbc;

    public ScheduleExecutionRepository(@Qualifier("pgJdbc") NamedParameterJdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public Map<String, Object> save(String scheduleId, String reportKey, String format) {
        String sql = """
                INSERT INTO schedule_execution_log (schedule_id, report_key, status, format)
                VALUES (:scheduleId::uuid, :reportKey, 'running', :format)
                RETURNING *
                """;
        MapSqlParameterSource params = new MapSqlParameterSource();
        params.addValue("scheduleId", scheduleId);
        params.addValue("reportKey", reportKey);
        params.addValue("format", format);

        List<Map<String, Object>> results = jdbc.query(sql, params, this::mapRow);
        return results.isEmpty() ? Map.of() : results.get(0);
    }

    public void markCompleted(String logId, String filePath) {
        jdbc.update(
                "UPDATE schedule_execution_log SET status = 'completed', file_path = :filePath, completed_at = NOW() WHERE id = :id::uuid",
                new MapSqlParameterSource("id", logId).addValue("filePath", filePath)
        );
    }

    public void markFailed(String logId, String errorMessage) {
        jdbc.update(
                "UPDATE schedule_execution_log SET status = 'failed', error_message = :error, completed_at = NOW() WHERE id = :id::uuid",
                new MapSqlParameterSource("id", logId).addValue("error", errorMessage)
        );
    }

    public List<Map<String, Object>> findByScheduleId(String scheduleId, int limit) {
        return jdbc.query(
                "SELECT * FROM schedule_execution_log WHERE schedule_id = :scheduleId::uuid ORDER BY started_at DESC LIMIT :limit",
                new MapSqlParameterSource("scheduleId", scheduleId).addValue("limit", limit),
                this::mapRow
        );
    }

    public List<Map<String, Object>> findByReportKey(String reportKey, int limit) {
        return jdbc.query(
                "SELECT * FROM schedule_execution_log WHERE report_key = :reportKey ORDER BY started_at DESC LIMIT :limit",
                new MapSqlParameterSource("reportKey", reportKey).addValue("limit", limit),
                this::mapRow
        );
    }

    private Map<String, Object> mapRow(ResultSet rs, int rowNum) throws SQLException {
        Map<String, Object> row = new LinkedHashMap<>();
        row.put("id", rs.getString("id"));
        row.put("scheduleId", rs.getString("schedule_id"));
        row.put("reportKey", rs.getString("report_key"));
        row.put("status", rs.getString("status"));
        row.put("format", rs.getString("format"));
        row.put("filePath", rs.getString("file_path"));
        row.put("errorMessage", rs.getString("error_message"));
        row.put("startedAt", rs.getObject("started_at", OffsetDateTime.class));
        row.put("completedAt", rs.getObject("completed_at", OffsetDateTime.class));
        return row;
    }
}
