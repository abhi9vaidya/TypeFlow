import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from './useAuthStore';
import { RealtimeChannel } from '@supabase/supabase-js';
import { generateWords } from '@/utils/words';

export interface Room {
  id: string;
  host_id: string;
  code: string;
  status: 'lobby' | 'countdown' | 'racing' | 'finished';
  mode: string;
  config: Record<string, unknown>;
  target_text: string;
  starts_at: string | null;
  is_private: boolean;
}

export interface Participant {
  room_id: string;
  user_id: string;
  progress: number;
  wpm: number;
  is_ready: boolean;
  finished_at: string | null;
  profile?: {
    nickname: string;
    avatar_url: string;
  };
}

interface MultiplayerState {
  room: Room | null;
  participants: Participant[];
  isLoading: boolean;
  error: string | null;
  subscription: RealtimeChannel | null;
  
  // Actions
  createRoom: (isPrivate?: boolean) => Promise<string | null>;
  joinRoom: (code: string) => Promise<boolean>;
  leaveRoom: () => Promise<void>;
  setReady: (isReady: boolean) => Promise<void>;
  updateProgress: (progress: number, wpm: number) => Promise<void>;
  startRace: () => Promise<void>;
  finishRace: () => Promise<void>;
  updateRoomStatus: (status: Room['status']) => Promise<void>;
  subscribeToRoom: (roomId: string) => void;
  unsubscribeFromRoom: () => void;
}

export const useMultiplayerStore = create<MultiplayerState>((set, get) => ({
  room: null,
  participants: [],
  isLoading: false,
  error: null,
  subscription: null,

  createRoom: async (isPrivate = false) => {
    const { user, profile } = useAuthStore.getState();
    if (!user || !profile) return null;

    set({ isLoading: true, error: null });
    
    // Generate a random 6-character room code
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    // Get text for the race
    const targetText = generateWords(25).join(" "); 

    try {
      const { data: room, error: roomError } = await supabase
        .from('rooms')
        .insert({
          host_id: user.id,
          code,
          target_text: targetText,
          is_private: isPrivate,
          status: 'lobby'
        })
        .select()
        .single();

      if (roomError) throw roomError;

      // Join the room as host
      const { error: partError } = await supabase
        .from('room_participants')
        .upsert({
          room_id: room.id,
          user_id: user.id,
          is_ready: true,
          progress: 0,
          wpm: 0
        });

      if (partError) throw partError;

      set({ room, isLoading: false });
      return code;
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
      return null;
    }
  },

  joinRoom: async (code: string) => {
    const { user, profile } = useAuthStore.getState();
    if (!user || !profile) return false;

    set({ isLoading: true, error: null });

    try {
      const { data: room, error: roomError } = await supabase
        .from('rooms')
        .select('*')
        .eq('code', code.toUpperCase())
        .single();

      if (roomError) throw new Error('Room not found');
      if (room.status !== 'lobby' && room.status !== 'countdown') {
        // Allow joining if race just started but not finished?
        // For now, strict lobby only
        if (room.status !== 'racing') throw new Error('Race already in progress');
      }

      // Check if already a participant to preserve state
      const { data: existing } = await supabase
        .from('room_participants')
        .select('is_ready')
        .eq('room_id', room.id)
        .eq('user_id', user.id)
        .maybeSingle();

      const { error: partError } = await supabase
        .from('room_participants')
        .upsert({
          room_id: room.id,
          user_id: user.id,
          is_ready: existing?.is_ready ?? (room.host_id === user.id),
          progress: 0,
          wpm: 0
        });

      if (partError) throw partError;

      set({ room, isLoading: false });
      return true;
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
      return false;
    }
  },

  leaveRoom: async () => {
    const { room } = get();
    const { user } = useAuthStore.getState();
    if (!room || !user) return;

    await supabase
      .from('room_participants')
      .delete()
      .eq('room_id', room.id)
      .eq('user_id', user.id);

    // If host leaves, maybe close room? (Simplification: just leave for now)
    
    set({ room: null, participants: [] });
  },

  setReady: async (isReady: boolean) => {
    const { room } = get();
    const { user } = useAuthStore.getState();
    if (!room || !user) return;

    await supabase
      .from('room_participants')
      .update({ is_ready: isReady })
      .eq('room_id', room.id)
      .eq('user_id', user.id);
  },

  updateProgress: async (progress: number, wpm: number) => {
    const { room } = get();
    const { user } = useAuthStore.getState();
    if (!room || !user || room.status !== 'racing') return;

    // Use a throttled update or just regular update since it's realtime
    await supabase
      .from('room_participants')
      .update({ progress, wpm })
      .eq('room_id', room.id)
      .eq('user_id', user.id);
  },

  startRace: async () => {
    const { room } = get();
    const { user } = useAuthStore.getState();
    if (!room || room.host_id !== user?.id) return;

    // Set starts_at to 5 seconds from now
    const startsAt = new Date(Date.now() + 5000).toISOString();

    await supabase
      .from('rooms')
      .update({ 
        status: 'countdown',
        starts_at: startsAt 
      })
      .eq('id', room.id);
  },

  finishRace: async () => {
    const { room } = get();
    const { user } = useAuthStore.getState();
    if (!room || !user) return;

    await supabase
      .from('room_participants')
      .update({ 
        finished_at: new Date().toISOString(),
        progress: 100
      })
      .eq('room_id', room.id)
      .eq('user_id', user.id);
  },

  updateRoomStatus: async (status: Room['status']) => {
    const { room } = get();
    const { user } = useAuthStore.getState();
    if (!room || room.host_id !== user?.id) return;

    await supabase
      .from('rooms')
      .update({ status })
      .eq('id', room.id);
  },

  subscribeToRoom: (roomId: string) => {
    const { subscription } = get();
    if (subscription) subscription.unsubscribe();

    // Initial fetch of participants
    const fetchParticipants = async () => {
      const { data, error } = await supabase
        .from('room_participants')
        .select('*, profile:profiles(nickname, avatar_url)')
        .eq('room_id', roomId);
      
      if (!error) set({ participants: data });
    };

    fetchParticipants();

    const channel = supabase
      .channel(`room:${roomId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'rooms', filter: `id=eq.${roomId}` },
        (payload) => {
          set({ room: payload.new as Room });
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'room_participants', filter: `room_id=eq.${roomId}` },
        () => {
          // Add a small delay to ensure DB consistency before refetching
          setTimeout(fetchParticipants, 100);
        }
      )
      .subscribe();

    set({ subscription: channel });
  },

  unsubscribeFromRoom: () => {
    const { subscription } = get();
    if (subscription) {
      subscription.unsubscribe();
      set({ subscription: null, room: null, participants: [] });
    }
  }
}));
