package com.example.report.repository;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.OffsetDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Repository
public class AlertEventRepository {

    private final NamedParameterJdbcTemplate jdbc;

    public AlertEventRepository(@Qualifier("pgJdbc") NamedParameterJdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public Map<String, Object> save(Map<String, Object> event) {
        String sql = """
                INSERT INTO alert_events (rule_id, report_key, field, current_value, threshold, condition, dedupe_key)
                VALUES (:ruleId::uuid, :reportKey, :field, :currentValue, :threshold, :condition, :dedupeKey)
                RETURNING *
                """;
        MapSqlParameterSource params = new MapSqlParameterSource();
        params.addValue("ruleId", event.get("ruleId"));
        params.addValue("reportKey", event.get("reportKey"));
        params.addValue("field", event.get("field"));
        params.addValue("currentValue", event.get("currentValue"));
        params.addValue("threshold", event.get("threshold"));
        params.addValue("condition", event.get("condition"));
        params.addValue("dedupeKey", event.get("dedupeKey"));

        List<Map<String, Object>> results = jdbc.query(sql, params, this::mapRow);
        return results.isEmpty() ? event : results.get(0);
    }

    public List<Map<String, Object>> findByReportKey(String reportKey, int limit) {
        return jdbc.query(
                "SELECT * FROM alert_events WHERE report_key = :reportKey ORDER BY triggered_at DESC LIMIT :limit",
                new MapSqlParameterSource("reportKey", reportKey).addValue("limit", limit),
                this::mapRow
        );
    }

    public boolean acknowledge(String eventId) {
        return jdbc.update(
                "UPDATE alert_events SET acknowledged = true WHERE id = :id::uuid",
                new MapSqlParameterSource("id", eventId)
        ) > 0;
    }

    public boolean existsByDedupeKey(String dedupeKey) {
        Integer count = jdbc.queryForObject(
                "SELECT COUNT(*) FROM alert_events WHERE dedupe_key = :key",
                new MapSqlParameterSource("key", dedupeKey),
                Integer.class
        );
        return count != null && count > 0;
    }

    private Map<String, Object> mapRow(ResultSet rs, int rowNum) throws SQLException {
        Map<String, Object> row = new LinkedHashMap<>();
        row.put("id", rs.getString("id"));
        row.put("ruleId", rs.getString("rule_id"));
        row.put("reportKey", rs.getString("report_key"));
        row.put("field", rs.getString("field"));
        row.put("currentValue", rs.getBigDecimal("current_value"));
        row.put("threshold", rs.getBigDecimal("threshold"));
        row.put("condition", rs.getString("condition"));
        row.put("triggeredAt", rs.getObject("triggered_at", OffsetDateTime.class));
        row.put("acknowledged", rs.getBoolean("acknowledged"));
        row.put("notificationSent", rs.getBoolean("notification_sent"));
        row.put("dedupeKey", rs.getString("dedupe_key"));
        return row;
    }
}
