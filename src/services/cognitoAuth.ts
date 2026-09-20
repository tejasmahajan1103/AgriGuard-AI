// ============================================================
// AgriGuard AI — AWS Cognito Identity Provider Service
// Direct Cognito REST API integration for in-app authentication
// ============================================================

import {
  COGNITO_IDP_ENDPOINT,
  COGNITO_CLIENT_ID,
} from '../config/cognito';
import type { User } from '../types';

export interface CognitoTokens {
  accessToken: string;
  idToken: string;
  refreshToken?: string;
  expiresAt: number; // timestamp in ms
}

export interface CognitoAuthResponse {
  user: User;
  tokens: CognitoTokens;
}

const TOKENS_STORAGE_KEY = 'agriguard_cognito_tokens';
const PENDING_EMAIL_STORAGE_KEY = 'agriguard_pending_email';

/**
 * Decode JWT payload safely without external dependencies
 */
export function parseJwtPayload(token: string): Record<string, any> | null {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Failed to parse JWT payload', error);
    return null;
  }
}

/**
 * Translate Cognito raw error exceptions into friendly user messages
 */
export function formatCognitoError(error: any): string {
  if (!error) return 'An unexpected error occurred. Please try again.';

  const message = error.message || error.toString();
  const errorType = error.__type || error.code || error.name || '';

  if (errorType.includes('NotAuthorizedException')) {
    if (message.includes('Incorrect username or password')) {
      return 'Incorrect email or password. Please check your credentials.';
    }
    if (message.includes('User is disabled')) {
      return 'This account has been disabled. Please contact support.';
    }
    return 'Incorrect email or password. Please try again.';
  }

  if (errorType.includes('UserNotFoundException')) {
    return 'No account found with this email address.';
  }

  if (errorType.includes('UsernameExistsException')) {
    return 'An account with this email already exists. Please sign in instead.';
  }

  if (errorType.includes('UserNotConfirmedException')) {
    return 'Your email has not been verified yet. Please enter the 6-digit verification code sent to your email.';
  }

  if (errorType.includes('CodeMismatchException')) {
    return 'Incorrect verification code. Please check your email and try again.';
  }

  if (errorType.includes('ExpiredCodeException')) {
    return 'This verification code has expired. Please click "Resend" to get a new code.';
  }

  if (errorType.includes('InvalidPasswordException')) {
    return 'Password must be at least 8 characters and include uppercase, lowercase, numbers, and special characters.';
  }

  if (errorType.includes('InvalidParameterException')) {
    if (message.includes('email')) {
      return 'Please enter a valid email address.';
    }
    if (message.includes('phone')) {
      return 'Please enter a valid phone number (e.g. +91 98765 43210).';
    }
    return 'Please check your information and try again.';
  }

  if (errorType.includes('LimitExceededException') || errorType.includes('TooManyRequestsException')) {
    return 'Too many attempts. Please wait a few minutes before trying again.';
  }

  if (errorType.includes('ResourceNotFoundException')) {
    return 'Authentication service configuration error. Please verify AWS settings.';
  }

  if (message.includes('Failed to fetch') || message.includes('NetworkError')) {
    return 'Network connection error. Please check your internet connection and try again.';
  }

  return message || 'Authentication failed. Please try again.';
}

/**
 * Make a direct POST request to AWS Cognito Identity Provider service
 */
async function callCognitoIdp<T = any>(action: string, params: Record<string, any>): Promise<T> {
  const response = await fetch(COGNITO_IDP_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-amz-json-1.1',
      'X-Amz-Target': `AWSCognitoIdentityProviderService.${action}`,
    },
    body: JSON.stringify(params),
  });

  const data = await response.json();

  if (!response.ok) {
    const error: any = new Error(data.message || data.Message || 'Cognito API error');
    error.__type = data.__type || action;
    error.code = data.code || data.__type;
    throw error;
  }

  return data;
}

export const cognitoAuth = {
  /**
   * Register a new user in AWS Cognito
   */
  async signUp(params: {
    name: string;
    email: string;
    phone?: string;
    password: string;
  }): Promise<{ userSub: string; userConfirmed: boolean }> {
    const userAttributes = [
      { Name: 'email', Value: params.email.trim() },
      { Name: 'name', Value: params.name.trim() },
    ];

    if (params.phone && params.phone.trim()) {
      // Basic format normalization for E.164 if possible
      let formattedPhone = params.phone.trim().replace(/\s+/g, '');
      if (!formattedPhone.startsWith('+')) {
        formattedPhone = `+${formattedPhone}`;
      }
      userAttributes.push({ Name: 'phone_number', Value: formattedPhone });
    }

    const result = await callCognitoIdp('SignUp', {
      ClientId: COGNITO_CLIENT_ID,
      Username: params.email.trim().toLowerCase(),
      Password: params.password,
      UserAttributes: userAttributes,
    });

    // Save pending email for verification
    sessionStorage.setItem(PENDING_EMAIL_STORAGE_KEY, params.email.trim().toLowerCase());

    return {
      userSub: result.UserSub,
      userConfirmed: result.UserConfirmed,
    };
  },

  /**
   * Confirm email verification code
   */
  async confirmSignUp(params: { email: string; code: string }): Promise<void> {
    await callCognitoIdp('ConfirmSignUp', {
      ClientId: COGNITO_CLIENT_ID,
      Username: params.email.trim().toLowerCase(),
      ConfirmationCode: params.code.trim(),
    });
    sessionStorage.removeItem(PENDING_EMAIL_STORAGE_KEY);
  },

  /**
   * Resend confirmation code
   */
  async resendConfirmationCode(email: string): Promise<void> {
    await callCognitoIdp('ResendConfirmationCode', {
      ClientId: COGNITO_CLIENT_ID,
      Username: email.trim().toLowerCase(),
    });
  },

  /**
   * Sign in using USER_PASSWORD_AUTH flow
   */
  async signIn(email: string, password: string): Promise<CognitoAuthResponse> {
    const result = await callCognitoIdp('InitiateAuth', {
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: COGNITO_CLIENT_ID,
      AuthParameters: {
        USERNAME: email.trim().toLowerCase(),
        PASSWORD: password,
      },
    });

    if (!result.AuthenticationResult) {
      if (result.ChallengeName) {
        throw new Error(`Authentication challenge required: ${result.ChallengeName}`);
      }
      throw new Error('Authentication failed. No tokens returned.');
    }

    const authResult = result.AuthenticationResult;
    const tokens: CognitoTokens = {
      accessToken: authResult.AccessToken,
      idToken: authResult.IdToken,
      refreshToken: authResult.RefreshToken,
      expiresAt: Date.now() + (authResult.ExpiresIn || 3600) * 1000,
    };

    // Store tokens locally
    this.storeTokens(tokens);

    // Build User object from IdToken claims
    const user = this.getUserFromToken(tokens.idToken, email);
    return { user, tokens };
  },

  /**
   * Refresh session tokens using RefreshToken
   */
  async refreshSession(refreshToken: string): Promise<CognitoTokens> {
    const result = await callCognitoIdp('InitiateAuth', {
      AuthFlow: 'REFRESH_TOKEN_AUTH',
      ClientId: COGNITO_CLIENT_ID,
      AuthParameters: {
        REFRESH_TOKEN: refreshToken,
      },
    });

    if (!result.AuthenticationResult) {
      throw new Error('Token refresh failed');
    }

    const authResult = result.AuthenticationResult;
    const existingTokens = this.getStoredTokens();

    const newTokens: CognitoTokens = {
      accessToken: authResult.AccessToken,
      idToken: authResult.IdToken,
      refreshToken: authResult.RefreshToken || refreshToken || existingTokens?.refreshToken,
      expiresAt: Date.now() + (authResult.ExpiresIn || 3600) * 1000,
    };

    this.storeTokens(newTokens);
    return newTokens;
  },

  /**
   * Request password reset code
   */
  async forgotPassword(email: string): Promise<void> {
    await callCognitoIdp('ForgotPassword', {
      ClientId: COGNITO_CLIENT_ID,
      Username: email.trim().toLowerCase(),
    });
  },

  /**
   * Confirm password reset with code and new password
   */
  async confirmForgotPassword(params: {
    email: string;
    code: string;
    newPassword: string;
  }): Promise<void> {
    await callCognitoIdp('ConfirmForgotPassword', {
      ClientId: COGNITO_CLIENT_ID,
      Username: params.email.trim().toLowerCase(),
      ConfirmationCode: params.code.trim(),
      Password: params.newPassword,
    });
  },

  /**
   * Sign out globally from Cognito and clear local session
   */
  async signOut(accessToken?: string): Promise<void> {
    if (accessToken) {
      try {
        await callCognitoIdp('GlobalSignOut', {
          AccessToken: accessToken,
        });
      } catch (err) {
        // Ignore token expiry error on signout
        console.warn('GlobalSignOut warning:', err);
      }
    }
    this.clearStoredTokens();
  },

  /**
   * Extract User entity from IdToken
   */
  getUserFromToken(idToken: string, fallbackEmail = ''): User {
    const payload = parseJwtPayload(idToken);
    const email = payload?.email || fallbackEmail || 'user@agriguard.ai';
    const name = payload?.name || payload?.['cognito:username'] || email.split('@')[0] || 'User';
    const sub = payload?.sub || 'cognito-user';

    return {
      id: sub,
      name,
      email,
      phone: payload?.phone_number || '',
      avatar: '',
      farmCount: 3,
      cropCount: 5,
      createdAt: payload?.iat ? new Date(payload.iat * 1000).toISOString() : new Date().toISOString(),
    };
  },

  /**
   * Token storage utilities
   */
  storeTokens(tokens: CognitoTokens): void {
    try {
      localStorage.setItem(TOKENS_STORAGE_KEY, JSON.stringify(tokens));
    } catch (e) {
      console.error('Failed to store tokens in localStorage', e);
    }
  },

  getStoredTokens(): CognitoTokens | null {
    try {
      const raw = localStorage.getItem(TOKENS_STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  clearStoredTokens(): void {
    try {
      localStorage.removeItem(TOKENS_STORAGE_KEY);
      sessionStorage.removeItem(PENDING_EMAIL_STORAGE_KEY);
    } catch (e) {
      console.error('Failed to clear tokens', e);
    }
  },

  getPendingEmail(): string {
    return sessionStorage.getItem(PENDING_EMAIL_STORAGE_KEY) || '';
  },

  setPendingEmail(email: string): void {
    sessionStorage.setItem(PENDING_EMAIL_STORAGE_KEY, email.trim().toLowerCase());
  },
};
