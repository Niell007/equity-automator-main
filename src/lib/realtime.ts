import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from './supabase';

type SubscriptionCallback = (payload: any) => void;
type TableName = 'content' | 'media' | 'audit_logs' | 'roles';

class RealtimeManager {
  private channels: Map<string, RealtimeChannel> = new Map();
  private subscriptions: Map<string, Set<SubscriptionCallback>> = new Map();

  // Subscribe to table changes
  subscribe(table: TableName, callback: SubscriptionCallback): () => void {
    const channelId = `realtime:${table}`;
    
    if (!this.channels.has(channelId)) {
      const channel = supabase.channel(channelId)
        .on('postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: table
          },
          (payload) => {
            const callbacks = this.subscriptions.get(channelId);
            callbacks?.forEach(cb => cb(payload));
          }
        )
        .subscribe();

      this.channels.set(channelId, channel);
      this.subscriptions.set(channelId, new Set());
    }

    this.subscriptions.get(channelId)?.add(callback);

    // Return unsubscribe function
    return () => {
      const callbacks = this.subscriptions.get(channelId);
      callbacks?.delete(callback);

      if (callbacks?.size === 0) {
        const channel = this.channels.get(channelId);
        channel?.unsubscribe();
        this.channels.delete(channelId);
        this.subscriptions.delete(channelId);
      }
    };
  }

  // Subscribe to specific record changes
  subscribeToRecord(table: TableName, recordId: string, callback: SubscriptionCallback): () => void {
    const channelId = `realtime:${table}:${recordId}`;
    
    if (!this.channels.has(channelId)) {
      const channel = supabase.channel(channelId)
        .on('postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: table,
            filter: `id=eq.${recordId}`
          },
          (payload) => {
            const callbacks = this.subscriptions.get(channelId);
            callbacks?.forEach(cb => cb(payload));
          }
        )
        .subscribe();

      this.channels.set(channelId, channel);
      this.subscriptions.set(channelId, new Set());
    }

    this.subscriptions.get(channelId)?.add(callback);

    return () => {
      const callbacks = this.subscriptions.get(channelId);
      callbacks?.delete(callback);

      if (callbacks?.size === 0) {
        const channel = this.channels.get(channelId);
        channel?.unsubscribe();
        this.channels.delete(channelId);
        this.subscriptions.delete(channelId);
      }
    };
  }

  // Subscribe to presence updates
  subscribeToPresence(channelName: string, callback: SubscriptionCallback): () => void {
    const channel = supabase.channel(channelName, {
      config: {
        presence: {
          key: supabase.auth.getUser().then(({ data }) => data.user?.id || 'anonymous'),
        },
      },
    });

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        callback({ type: 'sync', state });
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        callback({ type: 'join', key, newPresences });
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        callback({ type: 'leave', key, leftPresences });
      })
      .subscribe();

    this.channels.set(channelName, channel);

    return () => {
      channel.unsubscribe();
      this.channels.delete(channelName);
    };
  }

  // Cleanup all subscriptions
  cleanup(): void {
    this.channels.forEach(channel => channel.unsubscribe());
    this.channels.clear();
    this.subscriptions.clear();
  }
}

export const realtime = new RealtimeManager(); 