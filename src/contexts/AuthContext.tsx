import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';

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
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const transformUser = (supabaseUser: SupabaseUser): User => {
    return {
      id: supabaseUser.id,
      name: supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'User',
      email: supabaseUser.email || '',
      avatar: supabaseUser.user_metadata?.avatar_url,
      createdAt: new Date(supabaseUser.created_at),
    };
  };

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    return data;
  };

  const createProfile = async (supabaseUser: SupabaseUser) => {
    const { error } = await supabase
      .from('profiles')
      .insert({
        user_id: supabaseUser.id,
        display_name: supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name,
        email: supabaseUser.email,
        avatar_url: supabaseUser.user_metadata?.avatar_url,
      });
    
    if (error && error.code !== '23505') { // Ignore duplicate key errors
      console.error('Error creating profile:', error);
    }
  };

  useEffect(() => {
    let mounted = true;

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        try {
          if (session?.user) {
            const transformedUser = transformUser(session.user);
            
            // Try to get profile with avatar (don't block on this)
            try {
              const profile = await fetchProfile(session.user.id);
              if (profile?.avatar_url) {
                transformedUser.avatar = profile.avatar_url;
              }
            } catch (e) {
              console.error('Error fetching profile:', e);
            }
            
            if (mounted) setUser(transformedUser);
            
            // Create profile if signing in for first time (don't await)
            if (event === 'SIGNED_IN') {
              createProfile(session.user).catch(console.error);
            }
          } else {
            if (mounted) setUser(null);
          }
        } catch (error) {
          console.error('Auth state change error:', error);
        } finally {
          if (mounted) setIsLoading(false);
        }
      }
    );

    // THEN check for existing session
    const initSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Get session error:', error);
          if (mounted) setIsLoading(false);
          return;
        }
        
        if (session?.user) {
          const transformedUser = transformUser(session.user);
          
          // Try to get profile with avatar
          try {
            const profile = await fetchProfile(session.user.id);
            if (profile?.avatar_url) {
              transformedUser.avatar = profile.avatar_url;
            }
          } catch (e) {
            console.error('Error fetching profile:', e);
          }
          
          if (mounted) setUser(transformedUser);
        }
      } catch (error) {
        console.error('Session initialization error:', error);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    initSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (provider: 'google' | 'github') => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin,
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

    const fileExt = file.name.split('.').pop();
    const filePath = `${user.id}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    // Update profile with new avatar URL
    await supabase
      .from('profiles')
      .update({ avatar_url: publicUrl })
      .eq('user_id', user.id);

    // Update local user state
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
