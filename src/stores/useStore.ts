import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { realtime } from '@/lib/realtime';
import type { Database } from '@/types/database';

type Content = Database['public']['Tables']['content']['Row'];
type Media = Database['public']['Tables']['media']['Row'];

interface AppState {
  content: Content[];
  media: Media[];
  activeUsers: Record<string, any>;
  isLoading: boolean;
  error: string | null;
  
  // Content actions
  fetchContent: () => Promise<void>;
  updateContent: (id: string, data: Partial<Content>) => Promise<void>;
  deleteContent: (id: string) => Promise<void>;
  
  // Media actions
  fetchMedia: () => Promise<void>;
  updateMedia: (id: string, data: Partial<Media>) => Promise<void>;
  deleteMedia: (id: string) => Promise<void>;
  
  // Real-time presence
  updatePresence: (presence: Record<string, any>) => void;
}

export const useStore = create<AppState>((set, get) => ({
  content: [],
  media: [],
  activeUsers: {},
  isLoading: false,
  error: null,

  // Content actions
  fetchContent: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ content: data || [] });

      // Subscribe to content changes
      realtime.subscribe('content', (payload) => {
        const { eventType, new: newRecord, old: oldRecord } = payload;
        const content = get().content;

        switch (eventType) {
          case 'INSERT':
            set({ content: [newRecord, ...content] });
            break;
          case 'UPDATE':
            set({
              content: content.map(item => 
                item.id === newRecord.id ? newRecord : item
              )
            });
            break;
          case 'DELETE':
            set({
              content: content.filter(item => item.id !== oldRecord.id)
            });
            break;
        }
      });

    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  updateContent: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('content')
        .update(data)
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteContent: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('content')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  // Media actions
  fetchMedia: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('media')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ media: data || [] });

      // Subscribe to media changes
      realtime.subscribe('media', (payload) => {
        const { eventType, new: newRecord, old: oldRecord } = payload;
        const media = get().media;

        switch (eventType) {
          case 'INSERT':
            set({ media: [newRecord, ...media] });
            break;
          case 'UPDATE':
            set({
              media: media.map(item => 
                item.id === newRecord.id ? newRecord : item
              )
            });
            break;
          case 'DELETE':
            set({
              media: media.filter(item => item.id !== oldRecord.id)
            });
            break;
        }
      });

    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  updateMedia: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('media')
        .update(data)
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteMedia: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('media')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  // Real-time presence
  updatePresence: (presence) => {
    set({ activeUsers: presence });
  },
})); 