// ============================================================
// AgriGuard AI — Centralized Authentication Context (Cognito)
// ============================================================

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import type { User } from '../types';
import { cognitoAuth, formatCognitoError } from '../services/cognitoAuth';
import { authService } from '../services/authService';

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  signup: (name: string, email: string, phone: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  confirmForgotPassword: (email: string, code: string, newPassword: string) => Promise<void>;
  verifyEmail: (code: string, email?: string) => Promise<void>;
  resendVerificationCode: (email?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize session on mount
  useEffect(() => {
    async function initAuth() {
      try {
        const tokens = cognitoAuth.getStoredTokens();
        if (tokens?.idToken) {
          // Check if token is expired
          if (tokens.expiresAt && tokens.expiresAt < Date.now()) {
            if (tokens.refreshToken) {
              try {
                const refreshed = await cognitoAuth.refreshSession(tokens.refreshToken);
                const restoredUser = cognitoAuth.getUserFromToken(refreshed.idToken);
                setUser(restoredUser);
              } catch (refreshErr) {
                console.warn('Session refresh failed, clearing tokens:', refreshErr);
                cognitoAuth.clearStoredTokens();
                setUser(null);
              }
            } else {
              cognitoAuth.clearStoredTokens();
              setUser(null);
            }
          } else {
            // Valid token
            const restoredUser = cognitoAuth.getUserFromToken(tokens.idToken);
            setUser(restoredUser);
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        cognitoAuth.clearStoredTokens();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    initAuth();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const loggedUser = await authService.login(email, password);
      setUser(loggedUser);
      return loggedUser;
    } catch (err) {
      const friendlyMsg = formatCognitoError(err);
      throw new Error(friendlyMsg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signup = useCallback(async (name: string, email: string, phone: string, password: string) => {
    setIsLoading(true);
    try {
      await authService.signup(name, email, phone, password);
    } catch (err) {
      const friendlyMsg = formatCognitoError(err);
      throw new Error(friendlyMsg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await authService.logout();
    } catch (err) {
      console.warn('Logout warning:', err);
    } finally {
      setUser(null);
      setIsLoading(false);
    }
  }, []);

  const forgotPassword = useCallback(async (email: string) => {
    setIsLoading(true);
    try {
      await authService.forgotPassword(email);
    } catch (err) {
      const friendlyMsg = formatCognitoError(err);
      throw new Error(friendlyMsg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const confirmForgotPassword = useCallback(async (email: string, code: string, newPassword: string) => {
    setIsLoading(true);
    try {
      await authService.confirmForgotPassword(email, code, newPassword);
    } catch (err) {
      const friendlyMsg = formatCognitoError(err);
      throw new Error(friendlyMsg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const verifyEmail = useCallback(async (code: string, email?: string) => {
    setIsLoading(true);
    try {
      await authService.verifyEmail(code, email);
    } catch (err) {
      const friendlyMsg = formatCognitoError(err);
      throw new Error(friendlyMsg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resendVerificationCode = useCallback(async (email?: string) => {
    setIsLoading(true);
    try {
      await authService.resendVerificationCode(email);
    } catch (err) {
      const friendlyMsg = formatCognitoError(err);
      throw new Error(friendlyMsg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        forgotPassword,
        confirmForgotPassword,
        verifyEmail,
        resendVerificationCode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
