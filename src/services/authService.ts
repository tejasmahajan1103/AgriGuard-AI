// ============================================================
// AgriGuard AI — Auth Service (Connected to Amazon Cognito)
// ============================================================

import { cognitoAuth, type CognitoTokens } from './cognitoAuth';
import type { User } from '../types';

export const authService = {
  /**
   * Log in user via Amazon Cognito
   */
  async login(email: string, password: string): Promise<User> {
    const { user } = await cognitoAuth.signIn(email, password);
    return user;
  },

  /**
   * Register new user in Amazon Cognito
   */
  async signup(name: string, email: string, phone: string, password: string): Promise<void> {
    await cognitoAuth.signUp({ name, email, phone, password });
  },

  /**
   * Confirm sign-up verification code
   */
  async verifyEmail(code: string, email?: string): Promise<void> {
    const targetEmail = email || cognitoAuth.getPendingEmail();
    if (!targetEmail) {
      throw new Error('Email is required for verification.');
    }
    await cognitoAuth.confirmSignUp({ email: targetEmail, code });
  },

  /**
   * Resend verification code
   */
  async resendVerificationCode(email?: string): Promise<void> {
    const targetEmail = email || cognitoAuth.getPendingEmail();
    if (!targetEmail) {
      throw new Error('Email is required to resend verification code.');
    }
    await cognitoAuth.resendConfirmationCode(targetEmail);
  },

  /**
   * Request password reset code
   */
  async forgotPassword(email: string): Promise<void> {
    await cognitoAuth.forgotPassword(email);
  },

  /**
   * Complete password reset with code and new password
   */
  async confirmForgotPassword(email: string, code: string, newPassword: string): Promise<void> {
    await cognitoAuth.confirmForgotPassword({ email, code, newPassword });
  },

  /**
   * Sign out and clear session tokens
   */
  async logout(): Promise<void> {
    const tokens = cognitoAuth.getStoredTokens();
    await cognitoAuth.signOut(tokens?.accessToken);
  },

  /**
   * Retrieve current stored tokens
   */
  getTokens(): CognitoTokens | null {
    return cognitoAuth.getStoredTokens();
  },

  /**
   * Get pending signup email
   */
  getPendingEmail(): string {
    return cognitoAuth.getPendingEmail();
  },

  /**
   * Set pending signup email
   */
  setPendingEmail(email: string): void {
    cognitoAuth.setPendingEmail(email);
  },
};
