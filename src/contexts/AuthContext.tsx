import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (provider: 'google' | 'github') => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user for demo - will be replaced with real auth later
const DEMO_USER: User = {
  id: 'demo-user-1',
  name: 'Demo User',
  email: 'demo@palette.app',
  avatar: undefined,
  createdAt: new Date(),
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored session
    const storedUser = localStorage.getItem('palette-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (provider: 'google' | 'github') => {
    setIsLoading(true);
    // Simulate login delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newUser = {
      ...DEMO_USER,
      id: `user-${Date.now()}`,
      name: provider === 'google' ? 'Google User' : 'GitHub User',
      email: provider === 'google' ? 'user@gmail.com' : 'user@github.com',
    };
    
    setUser(newUser);
    localStorage.setItem('palette-user', JSON.stringify(newUser));
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('palette-user');
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isLoading, 
        isAuthenticated: !!user, 
        login, 
        logout 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
