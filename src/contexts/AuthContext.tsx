import React, { createContext, useContext, useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: Date;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (provider: 'google' | 'github') => Promise<void>;
  logout: () => Promise<void>;
  uploadAvatar: (file: File) => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // AUTO LOGIN FOR EXAM - BYPASSES ALL AUTH
  const [user] = useState<User>({
    id: 'exam-user-123',
    name: 'Ahmed Baghni',
    email: 'ahmed@palette.app',
    avatar: undefined,
    createdAt: new Date(),
  });
  const [isLoading] = useState(false);

  const login = async () => {
    // Already logged in for exam
    console.log('Auto-login active');
  };

  const logout = async () => {
    // Disabled for exam
    console.log('Logout disabled for exam');
  };

  const uploadAvatar = async (): Promise<string | null> => {
    // Mock for exam
    return null;
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isLoading, 
        isAuthenticated: true, 
        login, 
        logout,
        uploadAvatar,
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
