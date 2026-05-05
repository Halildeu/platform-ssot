package com.example.report.controller;

import com.example.report.query.ReportSchemaResolutionException;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ReportExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(ReportExceptionHandler.class);

    @ExceptionHandler(ReportSchemaResolutionException.class)
    public ResponseEntity<Map<String, Object>> handleReportSchemaResolution(
            ReportSchemaResolutionException ex) {
        String traceId = resolveTraceId();

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("error", ex.errorCode());
        body.put("message", ex.reason());
        body.put("status", ex.httpStatus().value());
        body.put("meta", Map.of("traceId", traceId));

        log.warn("report_schema_resolution status={} error={} traceId={} message={}",
                ex.httpStatus().value(), ex.errorCode(), traceId, ex.reason());
        return ResponseEntity.status(ex.httpStatus()).body(body);
    }

    private String resolveTraceId() {
        String existing = MDC.get("traceId");
        if (existing != null && !existing.isBlank()) {
            return existing;
        }
        String generated = UUID.randomUUID().toString();
        MDC.put("traceId", generated);
        return generated;
    }
}
