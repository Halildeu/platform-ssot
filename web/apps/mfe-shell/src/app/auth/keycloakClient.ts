import Keycloak from 'keycloak-js';
import { authConfig } from './auth-config';

// STORY-0034: FE Keycloak / OIDC Integration
const keycloak = new Keycloak({
  url: authConfig.keycloak.url,
  realm: authConfig.keycloak.realm,
  clientId: authConfig.keycloak.clientId,
});

export default keycloak;
