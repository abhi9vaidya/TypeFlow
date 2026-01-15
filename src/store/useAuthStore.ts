import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

export interface Profile {
  id: string;
  nickname: string;
  avatar_url: string | null;
  bio: string | null;
  wpm_best: number;
  tests_completed: number;
}

interface AuthState {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setProfile: (profile: Profile | null) => void;
  signOut: () => Promise<void>;
  checkUser: () => Promise<void>;
  fetchProfile: (userId: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  isLoading: true,
  setUser: (user) => {
    set({ user, isLoading: false });
    if (user) {
      get().fetchProfile(user.id);
    } else {
      set({ profile: null });
    }
  },
  setProfile: (profile) => set({ profile }),
  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, profile: null });
  },
  fetchProfile: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      set({ profile: data });
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  },
  checkUser: async () => {
    set({ isLoading: true });
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user ?? null;
      set({ user, isLoading: false });
      if (user) {
        await get().fetchProfile(user.id);
      }
    } catch (error) {
      console.error('AuthStore: Error checking session', error);
      set({ user: null, profile: null, isLoading: false });
    }
  },
}));
