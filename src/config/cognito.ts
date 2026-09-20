// ============================================================
// AgriGuard AI — AWS Cognito Configuration & OIDC Setup
// ============================================================

export const AWS_REGION = import.meta.env.VITE_AWS_REGION || 'eu-north-1';
export const COGNITO_USER_POOL_ID = import.meta.env.VITE_COGNITO_USER_POOL_ID || 'eu-north-1_fNtOtUyY9';
export const COGNITO_CLIENT_ID = import.meta.env.VITE_COGNITO_CLIENT_ID || '498cji7ce5g4g7fufbc9156kfo';
export const COGNITO_REDIRECT_URI = import.meta.env.VITE_COGNITO_REDIRECT_URI || (typeof window !== 'undefined' ? `${window.location.origin}/` : 'http://localhost:5173/');
export const COGNITO_LOGOUT_URI = import.meta.env.VITE_COGNITO_LOGOUT_URI || (typeof window !== 'undefined' ? `${window.location.origin}/` : 'http://localhost:5173/');

export const COGNITO_AUTHORITY = `https://cognito-idp.${AWS_REGION}.amazonaws.com/${COGNITO_USER_POOL_ID}`;
export const COGNITO_IDP_ENDPOINT = `https://cognito-idp.${AWS_REGION}.amazonaws.com/`;

/**
 * OIDC Configuration for react-oidc-context / oidc-client-ts
 */
export const oidcConfig = {
  authority: COGNITO_AUTHORITY,
  client_id: COGNITO_CLIENT_ID,
  redirect_uri: COGNITO_REDIRECT_URI,
  post_logout_redirect_uri: COGNITO_LOGOUT_URI,
  response_type: 'code',
  scope: 'openid email',
  automaticSilentRenew: true,
  loadUserInfo: true,
};
