import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, SessionInfo, Currency } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatPrice: (amount: number) => string;
  login: (username: string, pass: string) => Promise<boolean>;
  register: (username: string, email: string, pass: string, fullName?: string) => Promise<boolean>;
  logout: () => void;
  sessionInfo: SessionInfo | null;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>({
    username: 'sai',
    email: 'sai@example.com',
    full_name: 'Sai Krishna',
  });
  const [token, setToken] = useState<string | null>('token-sai-demo-session');
  const [currency, setCurrency] = useState<Currency>('INR');
  const [sessionInfo, setSessionInfo] = useState<SessionInfo | null>(null);

  // Exchange rate for conversion: 1 USD = 83 INR (matches project doc)
  const EXCHANGE_RATE = 83.0;

  const formatPrice = (amount: number) => {
    if (currency === 'USD') {
      const usdVal = (amount / EXCHANGE_RATE).toFixed(2);
      return `$${usdVal}`;
    }
    return `₹${Math.round(amount).toLocaleString('en-IN')}`;
  };

  const refreshSession = async () => {
    try {
      const res = await fetch('/api/session-info', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const data = await res.json();
        setSessionInfo(data);
        if (data.user) {
          setUser(data.user);
        }
      }
    } catch (err) {
      console.error('Error fetching session info:', err);
    }
  };

  useEffect(() => {
    refreshSession();
  }, [token]);

  const login = async (username: string, pass: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password: pass }),
      });
      if (res.ok) {
        const data = await res.json();
        setToken(data.access_token);
        setUser(data.user);
        return true;
      }
      return false;
    } catch {
      // Fallback local auth
      setUser({ username, email: `${username}@example.com`, full_name: username });
      setToken(`token-${username}-${Date.now()}`);
      return true;
    }
  };

  const register = async (username: string, email: string, pass: string, fullName?: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password: pass, full_name: fullName }),
      });
      if (res.ok) {
        const data = await res.json();
        setToken(data.access_token);
        setUser(data.user);
        return true;
      }
      return false;
    } catch {
      setUser({ username, email, full_name: fullName || username });
      setToken(`token-${username}-${Date.now()}`);
      return true;
    }
  };

  const logout = () => {
    if (token) {
      fetch('/api/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {});
    }
    setUser(null);
    setToken(null);
    setSessionInfo(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        currency,
        setCurrency,
        formatPrice,
        login,
        register,
        logout,
        sessionInfo,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
