package com.example.report.repository;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.OffsetDateTime;
import java.util.*;

@Repository
public class CustomDashboardRepository {

    private final NamedParameterJdbcTemplate jdbc;
    private final ObjectMapper mapper;

    public CustomDashboardRepository(@Qualifier("pgJdbc") NamedParameterJdbcTemplate jdbc,
                                      ObjectMapper mapper) {
        this.jdbc = jdbc;
        this.mapper = mapper;
    }

    public List<Map<String, Object>> findAll() {
        return jdbc.query(
                "SELECT * FROM custom_dashboards ORDER BY created_at DESC",
                new MapSqlParameterSource(),
                this::mapRow
        );
    }

    public Optional<Map<String, Object>> findByKey(String key) {
        List<Map<String, Object>> results = jdbc.query(
                "SELECT * FROM custom_dashboards WHERE key = :key",
                new MapSqlParameterSource("key", key),
                this::mapRow
        );
        return results.isEmpty() ? Optional.empty() : Optional.of(results.get(0));
    }

    public Map<String, Object> save(Map<String, Object> dashboard) {
        String sql = """
                INSERT INTO custom_dashboards (key, title, description, widgets, layout, created_by)
                VALUES (:key, :title, :description, :widgets::jsonb, :layout::jsonb, :createdBy)
                RETURNING *
                """;
        MapSqlParameterSource params = buildParams(dashboard);
        List<Map<String, Object>> results = jdbc.query(sql, params, this::mapRow);
        return results.isEmpty() ? dashboard : results.get(0);
    }

    public Map<String, Object> update(String key, Map<String, Object> dashboard) {
        String sql = """
                UPDATE custom_dashboards SET
                    title = COALESCE(:title, title),
                    description = COALESCE(:description, description),
                    widgets = COALESCE(:widgets::jsonb, widgets),
                    layout = COALESCE(:layout::jsonb, layout),
                    updated_at = NOW()
                WHERE key = :key
                RETURNING *
                """;
        MapSqlParameterSource params = buildParams(dashboard);
        params.addValue("key", key);
        List<Map<String, Object>> results = jdbc.query(sql, params, this::mapRow);
        return results.isEmpty() ? dashboard : results.get(0);
    }

    public boolean delete(String key) {
        return jdbc.update(
                "DELETE FROM custom_dashboards WHERE key = :key",
                new MapSqlParameterSource("key", key)
        ) > 0;
    }

    private MapSqlParameterSource buildParams(Map<String, Object> dashboard) {
        MapSqlParameterSource params = new MapSqlParameterSource();
        params.addValue("key", dashboard.get("key"));
        params.addValue("title", dashboard.get("title"));
        params.addValue("description", dashboard.get("description"));
        params.addValue("widgets", toJson(dashboard.get("widgets")));
        params.addValue("layout", toJson(dashboard.get("layout")));
        params.addValue("createdBy", dashboard.getOrDefault("createdBy", "system"));
        return params;
    }

    private Map<String, Object> mapRow(ResultSet rs, int rowNum) throws SQLException {
        Map<String, Object> row = new LinkedHashMap<>();
        row.put("id", rs.getString("id"));
        row.put("key", rs.getString("key"));
        row.put("title", rs.getString("title"));
        row.put("description", rs.getString("description"));
        row.put("widgets", parseJson(rs.getString("widgets")));
        row.put("layout", parseJson(rs.getString("layout")));
        row.put("createdBy", rs.getString("created_by"));
        row.put("createdAt", rs.getObject("created_at", OffsetDateTime.class));
        row.put("updatedAt", rs.getObject("updated_at", OffsetDateTime.class));
        return row;
    }

    private String toJson(Object obj) {
        if (obj == null) return "{}";
        try { return mapper.writeValueAsString(obj); }
        catch (JsonProcessingException e) { return "{}"; }
    }

    private Object parseJson(String json) {
        if (json == null || json.isBlank()) return null;
        try { return mapper.readValue(json, Object.class); }
        catch (JsonProcessingException e) { return json; }
    }
}
