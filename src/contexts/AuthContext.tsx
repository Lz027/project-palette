import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User as SupabaseUser } from '@supabase/supabase-js';

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

// Detect if running in Capacitor native app
const isNative = () => {
  return typeof (window as any).Capacitor !== 'undefined' && 
         (window as any).Capacitor.isNativePlatform();
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const transformUser = (supabaseUser: SupabaseUser): User => ({
    id: supabaseUser.id,
    name: supabaseUser.user_metadata?.full_name || 
          supabaseUser.user_metadata?.name || 
          supabaseUser.email?.split('@')[0] || 'User',
    email: supabaseUser.email || '',
    avatar: supabaseUser.user_metadata?.avatar_url,
    createdAt: new Date(supabaseUser.created_at),
  });

  // Handle deep links for native auth
  useEffect(() => {
    if (!isNative()) return;

    // Listen for app url open (deep link)
    const handleDeepLink = (event: any) => {
      const url = event.detail?.url || event.url;
      if (url && url.includes('auth/callback')) {
        // Extract tokens from URL and set session
        const params = new URLSearchParams(url.split('?')[1]);
        const access_token = params.get('access_token');
        const refresh_token = params.get('refresh_token');
        
        if (access_token && refresh_token) {
          supabase.auth.setSession({
            access_token,
            refresh_token
          });
        }
      }
    };

    // Capacitor App plugin listener
    const setupDeepLink = async () => {
      const { App } = await import('@capacitor/app');
      App.addListener('appUrlOpen', handleDeepLink);
    };

    setupDeepLink();

    return () => {
      // Cleanup
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!isMounted) return;
        
        if (session?.user) {
          setUser(transformUser(session.user));
        } else {
          setUser(null);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (isMounted) {
        if (session?.user) {
          setUser(transformUser(session.user));
        }
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (provider: 'google' | 'github') => {
    setIsLoading(true);
    
    try {
      const native = isNative();
      console.log('Login mode:', native ? 'native' : 'web');
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: native 
            ? 'io.palette.app://auth/callback'
            : `${window.location.origin}/auth/callback`,
          skipBrowserRedirect: native,
        },
      });
      
      if (error) {
        console.error('Login error:', error);
      }
    } catch (err) {
      console.error('Login exception:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const uploadAvatar = async (file: File): Promise<string | null> => {
    if (!user) return null;
    
    const filePath = `${user.id}/${Date.now()}.${file.name.split('.').pop()}`;
    
    const { error } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true });
    
    if (error) {
      console.error('Upload error:', error);
      return null;
    }
    
    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);
    
    await supabase
      .from('profiles')
      .update({ avatar_url: publicUrl })
      .eq('user_id', user.id);
    
    setUser(prev => prev ? { ...prev, avatar: publicUrl } : null);
    
    return publicUrl;
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isLoading, 
        isAuthenticated: !!user, 
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
