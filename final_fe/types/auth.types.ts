export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  idToken?: string;
}

export enum AuthStatus {
  Loading = 'loading',
  Authenticated = 'authenticated',
  Unauthenticated = 'unauthenticated',
}
