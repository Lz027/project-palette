// AuthContext.tsx - Exam version with auto-login
import React, { createContext, useContext, useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: false,
  isAuthenticated: true, // Auto-authenticated for exam
  login: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Auto-login for exam - no Supabase needed
  const [user] = useState<User>({
    id: 'exam-user',
    name: 'Student',
    email: 'student@exam.com',
  });
  const [isLoading] = useState(false);

  const login = async () => {};
  const logout = async () => {};

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      isAuthenticated: true, 
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
