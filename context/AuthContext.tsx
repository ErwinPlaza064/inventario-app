"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  token: string | null;
  username: string | null;
  login: (token: string, username: string) => void;
  updateUser: (username: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const savedToken = localStorage.getItem('it_suite_token');
    const savedUser = localStorage.getItem('it_suite_user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUsername(savedUser);
    }
    setLoading(false);
  }, []);

  const login = (newToken: string, newUser: string) => {
    localStorage.setItem('it_suite_token', newToken);
    localStorage.setItem('it_suite_user', newUser);
    setToken(newToken);
    setUsername(newUser);
    router.push('/');
  };

  const updateUser = (newUser: string) => {
    localStorage.setItem('it_suite_user', newUser);
    setUsername(newUser);
  };

  const logout = () => {
    localStorage.removeItem('it_suite_token');
    localStorage.removeItem('it_suite_user');
    setToken(null);
    setUsername(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ token, username, login, logout, updateUser, isAuthenticated: !!token, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
