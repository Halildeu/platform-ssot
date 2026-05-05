package com.example.report.query;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

/**
 * Fail-closed exception for report schema/company selection failures.
 */
public class ReportSchemaResolutionException extends ResponseStatusException {

    private final HttpStatus httpStatus;
    private final String reason;

    public ReportSchemaResolutionException(HttpStatus httpStatus, String reason) {
        super(httpStatus, reason);
        this.httpStatus = httpStatus;
        this.reason = reason;
    }

    public HttpStatus httpStatus() {
        return httpStatus;
    }

    public String reason() {
        return reason;
    }

    public String errorCode() {
        return getClass().getSimpleName();
    }

    public static final class MissingCompanyHeaderException extends ReportSchemaResolutionException {
        public MissingCompanyHeaderException(String reportKey, String detail) {
            super(HttpStatus.BAD_REQUEST,
                    "X-Company-Id header is required for report " + reportKey + ": " + detail);
        }
    }

    public static final class UnauthorizedCompanyException extends ReportSchemaResolutionException {
        public UnauthorizedCompanyException(String reportKey, Long requestedCompanyId) {
            super(HttpStatus.FORBIDDEN,
                    "Company " + requestedCompanyId + " is outside the allowed COMPANY scope for report " + reportKey);
        }
    }

    public static final class CompanySchemaNotFoundException extends ReportSchemaResolutionException {
        public CompanySchemaNotFoundException(String reportKey, Long companyId, String schemaName) {
            super(HttpStatus.BAD_REQUEST,
                    "Company schema not found for report " + reportKey
                            + ", companyId=" + companyId
                            + ", schema=" + schemaName);
        }
    }
}
