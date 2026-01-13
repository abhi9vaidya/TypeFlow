import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { useAuthStore, Profile } from './useAuthStore';

interface FriendActivity {
  id: string;
  user_id: string;
  type: 'test_completed' | 'achievement_unlocked';
  data: Record<string, unknown>;
  created_at: string;
  profile?: Profile;
}

interface FriendsState {
  following: Profile[];
  followers: Profile[];
  activityFeed: FriendActivity[];
  isLoading: boolean;
  
  // Actions
  fetchFollowing: () => Promise<void>;
  fetchFollowers: () => Promise<void>;
  followUser: (userId: string) => Promise<void>;
  unfollowUser: (userId: string) => Promise<void>;
  fetchActivityFeed: () => Promise<void>;
  isFollowing: (userId: string) => boolean;
}

export const useFriendsStore = create<FriendsState>((set, get) => ({
  following: [],
  followers: [],
  activityFeed: [],
  isLoading: false,

  fetchFollowing: async () => {
    const { user } = useAuthStore.getState();
    if (!user) return;

    const { data, error } = await supabase
      .from('follows')
      .select('following_id, profiles!follows_following_id_fkey(*)')
      .eq('follower_id', user.id);

    if (error) console.error(error);
    else set({ following: (data as unknown as { profiles: Profile }[]).map(d => d.profiles) });
  },

  fetchFollowers: async () => {
    const { user } = useAuthStore.getState();
    if (!user) return;

    const { data, error } = await supabase
      .from('follows')
      .select('follower_id, profiles!follows_follower_id_fkey(*)')
      .eq('following_id', user.id);

    if (error) console.error(error);
    else set({ followers: (data as unknown as { profiles: Profile }[]).map(d => d.profiles) });
  },

  followUser: async (userId: string) => {
    const { user } = useAuthStore.getState();
    if (!user) return;

    const { error } = await supabase
      .from('follows')
      .insert({ follower_id: user.id, following_id: userId });

    if (error) console.error(error);
    else await get().fetchFollowing();
  },

  unfollowUser: async (userId: string) => {
    const { user } = useAuthStore.getState();
    if (!user) return;

    const { error } = await supabase
      .from('follows')
      .delete()
      .eq('follower_id', user.id)
      .eq('following_id', userId);

    if (error) console.error(error);
    else await get().fetchFollowing();
  },

  isFollowing: (userId: string) => {
    return get().following.some(f => f.id === userId);
  },

  fetchActivityFeed: async () => {
    const { following } = get();
    const followingIds = following.map(f => f.id);
    if (followingIds.length === 0) return;

    const { data, error } = await supabase
      .from('test_results')
      .select('*, profiles(*)')
      .in('user_id', followingIds)
      .order('timestamp', { ascending: false })
      .limit(20);

    if (error) console.error(error);
    else {
      interface ActivityData {
        id: string;
        user_id: string;
        wpm: number;
        accuracy: number;
        mode: string;
        timestamp: string;
        profiles: Profile;
      }
      const activities: FriendActivity[] = (data as unknown as ActivityData[]).map(d => ({
        id: d.id,
        user_id: d.user_id,
        type: 'test_completed',
        data: { wpm: d.wpm, accuracy: d.accuracy, mode: d.mode } as Record<string, unknown>,
        created_at: d.timestamp,
        profile: d.profiles
      }));
      set({ activityFeed: activities });
    }
  }
}));
