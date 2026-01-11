import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  signOut: () => Promise<void>;
  checkUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  setUser: (user) => {
    set({ user, isLoading: false });
  },
  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null });
  },
  checkUser: async () => {
    set({ isLoading: true });
    try {
      const { data: { session } } = await supabase.auth.getSession();
      set({ user: session?.user ?? null, isLoading: false });
    } catch (error) {
      console.error('AuthStore: Error checking session', error);
      set({ user: null, isLoading: false });
    }
  },
}));
