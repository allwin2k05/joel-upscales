import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthUser {
  id: string;
  email?: string;
  name?: string;
  role?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoggedIn: boolean;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  favorites: string[];
  toggleFavorite: (movieId: string) => void;
  isFavorite: (movieId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);

  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'allwinjoel2k05@gmail.com';

  useEffect(() => {
    // If Supabase is configured, use its session and auth listener
    if (isSupabaseConfigured() && supabase) {
      // Get initial session
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session && session.user) {
          setUser({
            id: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
            role: session.user.email === adminEmail ? 'admin' : 'user',
          });
        } else {
          setUser(null);
        }
        setLoading(false);
      });

      // Listen to auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (session && session.user) {
          setUser({
            id: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
            role: session.user.email === adminEmail ? 'admin' : 'user',
          });
        } else {
          setUser(null);
        }
        setLoading(false);
      });

      return () => {
        subscription.unsubscribe();
      };
    } else {
      // Fallback mode: Check local storage for mock session
      const currentUserStr = localStorage.getItem('currentUser');
      if (currentUserStr) {
        try {
          const parsed = JSON.parse(currentUserStr);
          setUser({
            id: 'mock-admin-id',
            email: adminEmail,
            name: parsed.name || 'Joel',
            role: 'admin',
          });
        } catch (e) {
          localStorage.removeItem('currentUser');
        }
      }
      setLoading(false);
    }
  }, [adminEmail]);

  // Synchronize favorites from Supabase or Local Storage when user session changes
  useEffect(() => {
    const loadFavorites = async () => {
      if (!user) {
        setFavorites([]);
        return;
      }

      // Check if Supabase is active
      if (isSupabaseConfigured() && supabase) {
        try {
          const { data, error } = await supabase
            .from('user_favorites')
            .select('movie_id');
          
          if (error) throw error;
          
          if (data) {
            setFavorites(data.map(item => item.movie_id));
          }
        } catch (e) {
          console.error('Error fetching favorites from Supabase:', e);
        }
      } else {
        // Fallback: local storage
        const key = `favorites_${user.email || user.id}`;
        const stored = localStorage.getItem(key);
        if (stored) {
          try {
            setFavorites(JSON.parse(stored));
          } catch (e) {
            setFavorites([]);
          }
        } else {
          setFavorites([]);
        }
      }
    };

    loadFavorites();
  }, [user]);

  const toggleFavorite = async (movieId: string) => {
    if (!user) return;

    const isFav = favorites.includes(movieId);

    // Update local state immediately (Optimistic UI update)
    setFavorites(prev => isFav ? prev.filter(id => id !== movieId) : [...prev, movieId]);

    if (isSupabaseConfigured() && supabase) {
      try {
        if (isFav) {
          // Remove from Supabase
          const { error } = await supabase
            .from('user_favorites')
            .delete()
            .eq('user_id', user.id)
            .eq('movie_id', movieId);
          
          if (error) throw error;
        } else {
          // Add to Supabase
          const { error } = await supabase
            .from('user_favorites')
            .insert({ user_id: user.id, movie_id: movieId });
          
          if (error) throw error;
        }
      } catch (e) {
        console.error('Error updating favorite in Supabase:', e);
        // Rollback state on error
        setFavorites(prev => isFav ? [...prev, movieId] : prev.filter(id => id !== movieId));
      }
    } else {
      // Fallback: local storage
      const key = `favorites_${user.email || user.id}`;
      const updated = isFav
        ? favorites.filter(id => id !== movieId)
        : [...favorites, movieId];
      localStorage.setItem(key, JSON.stringify(updated));
    }
  };

  const isFavorite = (movieId: string) => {
    return favorites.includes(movieId);
  };

  const signIn = async (emailOrUsername: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    try {
      const cleanUsername = emailOrUsername.toLowerCase().trim();
      
      if (isSupabaseConfigured() && supabase) {
        // Automatically map username "joel" or "allwin" to the admin email for ease of login
        const targetEmail = (cleanUsername === 'joel' || cleanUsername === 'allwin')
          ? adminEmail
          : emailOrUsername.trim();

        const { data, error } = await supabase.auth.signInWithPassword({
          email: targetEmail,
          password,
        });

        if (error) throw error;

        if (data.user) {
          setUser({
            id: data.user.id,
            email: data.user.email,
            name: data.user.user_metadata?.name || (cleanUsername === 'allwin' ? 'Allwin' : 'Joel'),
            role: data.user.email === adminEmail ? 'admin' : 'user',
          });
        }
        setLoading(false);
        return { success: true };
      } else {
        // Fallback validation: Accept "joel", "allwin" or admin email with password "12345"
        if ((cleanUsername === 'joel' || cleanUsername === 'allwin' || cleanUsername === adminEmail) && password === '12345') {
          const displayName = cleanUsername === 'allwin' ? 'Allwin' : 'Joel';
          const mockUser = { username: cleanUsername, name: displayName };
          localStorage.setItem('currentUser', JSON.stringify(mockUser));
          
          setUser({
            id: 'mock-admin-id',
            email: adminEmail,
            name: displayName,
            role: 'admin',
          });
          
          // Dispatch storage event to alert other tabs/components
          window.dispatchEvent(new Event('storage'));
          setLoading(false);
          return { success: true };
        } else {
          setLoading(false);
          return { success: false, error: 'Invalid credentials. Access Denied.' };
        }
      }
    } catch (err: any) {
      setLoading(false);
      return { success: false, error: err.message || 'An error occurred during authentication' };
    }
  };

  const signUp = async (email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    try {
      if (isSupabaseConfigured() && supabase) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name: name,
            }
          }
        });

        if (error) throw error;

        if (data.user) {
          setUser({
            id: data.user.id,
            email: data.user.email,
            name: data.user.user_metadata?.name || name || 'User',
            role: data.user.email === adminEmail ? 'admin' : 'user',
          });
        }
        setLoading(false);
        return { success: true };
      } else {
        // Fallback Mock Sign Up
        const mockUser = { username: email.split('@')[0], name };
        localStorage.setItem('currentUser', JSON.stringify(mockUser));
        
        setUser({
          id: 'mock-user-' + Math.random().toString(36).substring(2, 9),
          email,
          name,
          role: email === adminEmail ? 'admin' : 'user',
        });
        
        window.dispatchEvent(new Event('storage'));
        setLoading(false);
        return { success: true };
      }
    } catch (err: any) {
      setLoading(false);
      return { success: false, error: err.message || 'An error occurred during registration' };
    }
  };

  const signOut = async () => {
    setLoading(true);
    if (isSupabaseConfigured() && supabase) {
      await supabase.auth.signOut();
    } else {
      localStorage.removeItem('currentUser');
      window.dispatchEvent(new Event('storage'));
    }
    setUser(null);
    setLoading(false);
  };

  const isLoggedIn = !!user;
  const isAdmin = user?.role === 'admin' || user?.email === adminEmail;

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, isAdmin, loading, signIn, signUp, signOut, favorites, toggleFavorite, isFavorite }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
