---
globs: backend/*-service/**
---
# Spring Boot Service Rules

- Pattern: Controller → Service → Repository → Model/Entity → DTO
- DTOs for API input/output, never expose entities directly
- Validation: Jakarta Bean Validation on DTOs (@Valid, @NotNull, etc.)
- Exception handling: @RestControllerAdvice with structured error response
- Security: JWT via Spring Security, permission-service for authorization
- Eureka registration: each service registers with discovery-server
- Health: Spring Actuator `/actuator/health` endpoint
- Profiles: default (docker), local (direct run), test
- Lombok: @Data, @Builder, @AllArgsConstructor for boilerplate reduction
