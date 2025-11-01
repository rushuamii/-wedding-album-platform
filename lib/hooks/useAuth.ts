"use client";

import { useState, useEffect } from 'react';
import { JWTPayload, decodeToken } from '@/lib/auth/jwt';

interface AuthState {
  token: string | null;
  user: JWTPayload | null;
  loading: boolean;
  isAuthenticated: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    token: null,
    user: null,
    loading: true,
    isAuthenticated: false,
  });

  // Load token from localStorage on mount
  useEffect(() => {
    const initAuth = () => {
      const token = localStorage.getItem('authToken');
      
      if (token) {
        const user = decodeToken(token);
        setAuthState({
          token,
          user,
          loading: false,
          isAuthenticated: !!user,
        });
      } else {
        setAuthState({
          token: null,
          user: null,
          loading: false,
          isAuthenticated: false,
        });
      }
    };

    // Small delay to ensure localStorage is ready
    const timer = setTimeout(initAuth, 100);
    return () => clearTimeout(timer);
  }, []);

  const login = (token: string, user: JWTPayload) => {
    localStorage.setItem('authToken', token);
    setAuthState({
      token,
      user,
      loading: false,
      isAuthenticated: true,
    });
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setAuthState({
      token: null,
      user: null,
      loading: false,
      isAuthenticated: false,
    });
  };

  return {
    ...authState,
    login,
    logout,
  };
}
