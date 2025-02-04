import React, { createContext, useContext, useState, useCallback } from 'react';
import { authService } from '../services/api/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (name: string, email: string) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (name: string, email: string) => {
    try {
      setError(null);
      await authService.login({ name, email });
      setIsAuthenticated(true);
    } catch (err) {
      setError('Login failed. Please check your credentials and try again.');
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
      setIsAuthenticated(false);
    } catch (err) {
      setError('Logout failed. Please try again.');
      throw err;
    }
  }, []);

  const value = {
    isAuthenticated,
    login,
    logout,
    error
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
