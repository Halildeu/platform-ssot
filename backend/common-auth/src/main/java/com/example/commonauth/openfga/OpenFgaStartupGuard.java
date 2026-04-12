package com.example.commonauth.openfga;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.Set;

/**
 * Startup guard: warns when OpenFGA is disabled in non-local profiles.
 * In non-local/non-dev environments, running without OpenFGA means
 * all authorization checks return true (fail-open), which is a security risk.
 */
@Component
public class OpenFgaStartupGuard implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(OpenFgaStartupGuard.class);
    private static final Set<String> DEV_PROFILES = Set.of("local", "dev", "test", "conntest");

    private final OpenFgaProperties properties;
    private final Environment environment;

    public OpenFgaStartupGuard(OpenFgaProperties properties, Environment environment) {
        this.properties = properties;
        this.environment = environment;
    }

    @Override
    public void run(ApplicationArguments args) {
        boolean isDevProfile = Arrays.stream(environment.getActiveProfiles())
                .anyMatch(DEV_PROFILES::contains);

        if (isDevProfile) {
            return;
        }

        if (!properties.isEnabled()) {
            log.error("SECURITY WARNING: OpenFGA is DISABLED in non-dev profile {}. "
                    + "All authorization checks will return true (fail-open). "
                    + "Set ERP_OPENFGA_ENABLED=true with valid store/model IDs for production.",
                    Arrays.toString(environment.getActiveProfiles()));
        }

        if (properties.isEnabled()) {
            String storeId = properties.getStoreId();
            String modelId = properties.getModelId();
            if (storeId == null || storeId.isBlank() || modelId == null || modelId.isBlank()) {
                log.error("SECURITY WARNING: OpenFGA is enabled but store-id or model-id is blank. "
                        + "Authorization will fail. Set ERP_OPENFGA_STORE_ID and ERP_OPENFGA_MODEL_ID.");
            }
        }
    }
}
