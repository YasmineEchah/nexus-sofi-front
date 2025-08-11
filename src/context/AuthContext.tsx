import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api, setApiBaseUrl } from '@/lib/api';

export type AuthState = {
  user?: any;
  magasins?: any[];
  token?: string;
};

type AuthContextType = AuthState & {
  login: (login: string, password: string) => Promise<void>;
  logout: () => void;
  setBaseUrl: (url: string) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>(() => {
    try {
      const stored = localStorage.getItem('AUTH');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem('AUTH', JSON.stringify(state));
  }, [state]);

  const login = async (login: string, password: string) => {
    const res = await api.login({ login, password });
    const token = (res?.data?.token || res?.token || res?.data?.jwt) as string | undefined;
    const magasins = (res?.data?.magasins || res?.magasins || []) as any[];
    const user = res?.data?.user || res?.user || res;
    setState({ user, magasins, token });
  };

  const logout = () => setState({});

  const setBaseUrl = (url: string) => setApiBaseUrl(url);

  const value = useMemo(() => ({ ...state, login, logout, setBaseUrl }), [state]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
