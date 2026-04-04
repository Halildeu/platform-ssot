package com.example.report.service;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * Row-based distributed lock using PostgreSQL.
 * Prevents duplicate execution of alerts/schedules across multiple instances.
 */
@Service
public class ExecutionLockService {

    private static final Logger log = LoggerFactory.getLogger(ExecutionLockService.class);
    private final NamedParameterJdbcTemplate jdbc;
    private final String instanceId = UUID.randomUUID().toString().substring(0, 8);

    public ExecutionLockService(@Qualifier("pgJdbc") NamedParameterJdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    /**
     * Try to acquire a lock. Returns true if acquired, false if already held by another instance.
     */
    public boolean tryAcquire(String lockName, int ttlSeconds) {
        // Clean expired locks first
        jdbc.update(
                "DELETE FROM execution_locks WHERE lock_name = :name AND expires_at < NOW()",
                new MapSqlParameterSource("name", lockName)
        );

        try {
            int inserted = jdbc.update(
                    """
                    INSERT INTO execution_locks (lock_name, locked_by, locked_at, expires_at)
                    VALUES (:name, :lockedBy, NOW(), NOW() + :ttl * INTERVAL '1 second')
                    ON CONFLICT (lock_name) DO NOTHING
                    """,
                    new MapSqlParameterSource("name", lockName)
                            .addValue("lockedBy", instanceId)
                            .addValue("ttl", ttlSeconds)
            );
            if (inserted > 0) {
                log.debug("Lock acquired: {} by {}", lockName, instanceId);
                return true;
            }
            log.debug("Lock already held: {}", lockName);
            return false;
        } catch (Exception e) {
            log.warn("Failed to acquire lock {}: {}", lockName, e.getMessage());
            return false;
        }
    }

    /**
     * Release a lock held by this instance.
     */
    public void release(String lockName) {
        jdbc.update(
                "DELETE FROM execution_locks WHERE lock_name = :name AND locked_by = :lockedBy",
                new MapSqlParameterSource("name", lockName).addValue("lockedBy", instanceId)
        );
        log.debug("Lock released: {} by {}", lockName, instanceId);
    }
}
