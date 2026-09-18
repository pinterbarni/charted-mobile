export const KEYCLOAK_URL = 'https://sso.charted.hu/realms/charted';
export const CLIENT_ID = 'charted-mobile';
export const REDIRECT_SCHEME = 'charted';
export const REDIRECT_PATH = 'redirect';

export const KEYCLOAK_ENDPOINTS = {
  TOKEN: `${KEYCLOAK_URL}/protocol/openid-connect/token`,
  LOGOUT: `${KEYCLOAK_URL}/protocol/openid-connect/logout`,
} as const;

export const KEYCLOAK_SCOPES = ['openid', 'profile', 'email', 'offline_access'] as const;

export const KEYCLOAK_HTTP = {
  METHOD: 'POST',
  CONTENT_TYPE: 'application/x-www-form-urlencoded',
  HEADER: 'Content-Type',
} as const;
