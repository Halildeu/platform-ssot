package com.example.report.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ExecutionLockServiceTest {

    @Mock NamedParameterJdbcTemplate jdbc;

    ExecutionLockService lockService;

    @BeforeEach
    void setUp() {
        lockService = new ExecutionLockService(jdbc);
    }

    @Test
    void acquireReturnsTrueWhenInsertSucceeds() {
        // Clean expired locks
        when(jdbc.update(contains("DELETE FROM execution_locks"), any(MapSqlParameterSource.class)))
                .thenReturn(0);
        // Insert succeeds (1 row inserted)
        when(jdbc.update(contains("INSERT INTO execution_locks"), any(MapSqlParameterSource.class)))
                .thenReturn(1);

        boolean acquired = lockService.tryAcquire("test-lock", 60);
        assertTrue(acquired);
    }

    @Test
    void acquireReturnsFalseWhenLockAlreadyHeld() {
        when(jdbc.update(contains("DELETE FROM execution_locks"), any(MapSqlParameterSource.class)))
                .thenReturn(0);
        // ON CONFLICT DO NOTHING — 0 rows inserted
        when(jdbc.update(contains("INSERT INTO execution_locks"), any(MapSqlParameterSource.class)))
                .thenReturn(0);

        boolean acquired = lockService.tryAcquire("test-lock", 60);
        assertFalse(acquired);
    }

    @Test
    void acquireReturnsFalseOnException() {
        when(jdbc.update(contains("DELETE FROM execution_locks"), any(MapSqlParameterSource.class)))
                .thenReturn(0);
        when(jdbc.update(contains("INSERT INTO execution_locks"), any(MapSqlParameterSource.class)))
                .thenThrow(new RuntimeException("DB error"));

        boolean acquired = lockService.tryAcquire("test-lock", 60);
        assertFalse(acquired);
    }

    @Test
    void releaseDeletesLockForThisInstance() {
        lockService.release("test-lock");

        ArgumentCaptor<MapSqlParameterSource> captor = ArgumentCaptor.forClass(MapSqlParameterSource.class);
        verify(jdbc).update(contains("DELETE FROM execution_locks WHERE lock_name"), captor.capture());

        MapSqlParameterSource params = captor.getValue();
        assertEquals("test-lock", params.getValue("name"));
        assertNotNull(params.getValue("lockedBy"));
    }

    @Test
    void ttlIsPassedToInsertQuery() {
        when(jdbc.update(contains("DELETE"), any(MapSqlParameterSource.class))).thenReturn(0);
        when(jdbc.update(contains("INSERT"), any(MapSqlParameterSource.class))).thenReturn(1);

        lockService.tryAcquire("my-lock", 300);

        ArgumentCaptor<MapSqlParameterSource> captor = ArgumentCaptor.forClass(MapSqlParameterSource.class);
        verify(jdbc).update(contains("INSERT INTO execution_locks"), captor.capture());
        assertEquals(300, captor.getValue().getValue("ttl"));
    }
}
