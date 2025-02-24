import { useEffect, useCallback } from 'react';
import { subscribeToTable, subscribeToPresence } from '@/lib/supabase';

type TableName = 'content' | 'media' | 'audit_logs' | 'roles';

export function useRealtimeSubscription(
  table: TableName,
  callback: (payload: any) => void,
  enabled: boolean = true
) {
  useEffect(() => {
    if (!enabled) return;
    
    const unsubscribe = subscribeToTable(table, callback);
    return () => unsubscribe();
  }, [table, callback, enabled]);
}

export function useRealtimeRecord(
  table: TableName,
  recordId: string,
  callback: (payload: any) => void,
  enabled: boolean = true
) {
  useEffect(() => {
    if (!enabled || !recordId) return;
    
    const unsubscribe = subscribeToTable(table, callback, {
      column: 'id',
      value: recordId
    });
    return () => unsubscribe();
  }, [table, recordId, callback, enabled]);
}

export function usePresence(
  channelName: string,
  callback: (payload: any) => void,
  enabled: boolean = true
) {
  useEffect(() => {
    if (!enabled || !channelName) return;
    
    const unsubscribe = subscribeToPresence(channelName, callback);
    return () => unsubscribe();
  }, [channelName, callback, enabled]);
}

// Custom hook for syncing data changes
export function useRealtimeSync<T extends { id: string }>(
  table: TableName,
  data: T[],
  setData: (data: T[]) => void,
  enabled: boolean = true
) {
  const handleRealtimeChanges = useCallback((payload: any) => {
    const { eventType, new: newRecord, old: oldRecord } = payload;
    
    setData((currentData) => {
      switch (eventType) {
        case 'INSERT':
          return [...currentData, newRecord];
        
        case 'UPDATE':
          return currentData.map((item) =>
            item.id === newRecord.id ? { ...item, ...newRecord } : item
          );
        
        case 'DELETE':
          return currentData.filter((item) => item.id !== oldRecord.id);
        
        default:
          return currentData;
      }
    });
  }, [setData]);

  useRealtimeSubscription(table, handleRealtimeChanges, enabled);
} 