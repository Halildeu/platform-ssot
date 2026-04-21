package com.example.variant.authz;

import com.example.commonauth.AuthorizationContext;
import org.junit.jupiter.api.Test;
import org.springframework.security.oauth2.jwt.Jwt;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class VariantAuthorizationServiceImplTest {

    @Test
    void buildsContextWithPermissionsAndProjects() {
        CountingStubClient client = new CountingStubClient();
        client.setResponse(buildAuthzMeResponse());

        VariantAuthorizationServiceImpl service = new VariantAuthorizationServiceImpl(client, Duration.ofSeconds(1));

        Jwt jwt = Jwt.withTokenValue("t")
                .header("alg", "RS256")
                .subject("42")
                .claim("email", "u@example.com")
                .claim("permissions", List.of("VARIANTS_READ"))
                .issuedAt(Instant.now())
                .expiresAt(Instant.now().plusSeconds(60))
                .build();

        AuthorizationContext ctx = service.buildContext(jwt);
        assertEquals(42L, ctx.getUserId());
        assertTrue(ctx.hasPermission("VARIANTS_READ"));
        assertThat(ctx.getAllowedProjectIds()).containsExactlyInAnyOrder(101L, 102L);
        assertEquals(1, client.callCount.get());

        // cache hit should not call client again
        service.buildContext(jwt);
        assertEquals(1, client.callCount.get());
    }

    @Test
    void buildsContextFromAuthServiceStyleJwtClaims() {
        CountingStubClient client = new CountingStubClient();
        client.setResponse(new AuthzMeResponse());

        VariantAuthorizationServiceImpl service = new VariantAuthorizationServiceImpl(client, Duration.ofSeconds(1));

        Jwt jwt = Jwt.withTokenValue("t")
                .header("alg", "RS256")
                .subject("admin@example.com")
                .claim("uid", 1201)
                .claim("email", "admin@example.com")
                .claim("role", "ADMIN")
                .claim("permissions", List.of("audit-read"))
                .issuedAt(Instant.now())
                .expiresAt(Instant.now().plusSeconds(60))
                .build();

        AuthorizationContext ctx = service.buildContext(jwt);
        assertEquals(1201L, ctx.getUserId());
        assertThat(ctx.getEmail()).isEqualTo("admin@example.com");
        assertThat(ctx.getRoles()).contains("ADMIN");
        assertThat(ctx.isAdmin()).isTrue();
    }

    @Test
    void fallsBackToAuthzMeUserIdAndRolesWhenJwtCarriesOnlyIdentityClaims() {
        CountingStubClient client = new CountingStubClient();
        AuthzMeResponse response = new AuthzMeResponse();
        response.setUserId("2");
        response.setRoles(List.of("ADMIN"));
        response.setPermissions(List.of("VARIANTS_READ", "MANAGE_GLOBAL_VARIANTS"));
        client.setResponse(response);

        VariantAuthorizationServiceImpl service = new VariantAuthorizationServiceImpl(client, Duration.ofSeconds(1));

        Jwt jwt = Jwt.withTokenValue("t")
                .header("alg", "RS256")
                .subject("4d844c0f-2c3e-4fc0-b4f2-4ed72d7ee316")
                .claim("email", "testuser@testai.acik.com")
                .issuedAt(Instant.now())
                .expiresAt(Instant.now().plusSeconds(60))
                .build();

        AuthorizationContext ctx = service.buildContext(jwt);

        assertThat(ctx.getUserId()).isEqualTo(2L);
        assertThat(ctx.getEmail()).isEqualTo("testuser@testai.acik.com");
        assertThat(ctx.getRoles()).contains("ADMIN");
        assertThat(ctx.isAdmin()).isTrue();
        assertThat(ctx.getPermissions()).contains("VARIANTS_READ", "MANAGE_GLOBAL_VARIANTS");
    }

    private AuthzMeResponse buildAuthzMeResponse() {
        AuthzMeResponse response = new AuthzMeResponse();
        response.setUserId("42");
        // Permissions now come from authz service (ADR-003: JWT is identity-only)
        response.setPermissions(List.of("VARIANTS_READ"));
        response.setAllowedScopes(List.of(
                new ScopeSummaryDto("PROJECT", "101"),
                new ScopeSummaryDto("PROJECT", "102")
        ));
        return response;
    }

    private static class CountingStubClient extends PermissionServiceAuthzClient {
        private final AtomicInteger callCount = new AtomicInteger(0);
        private AuthzMeResponse response = new AuthzMeResponse();

        CountingStubClient() {
            super(org.springframework.web.reactive.function.client.WebClient.builder());
        }

        void setResponse(AuthzMeResponse response) {
            this.response = response;
        }

        @Override
        public AuthzMeResponse getAuthzMe(String bearerToken) {
            callCount.incrementAndGet();
            return response;
        }
    }
}
