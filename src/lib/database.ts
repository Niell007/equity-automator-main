import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Roles
export const getRoles = async () => {
  const { data, error } = await supabase.from('roles').select('*');
  if (error) throw error;
  return data;
};

export const getRoleById = async (id: string) => {
  const { data, error } = await supabase.from('roles').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
};

// Content
export const getContent = async (type?: string, status?: string) => {
  let query = supabase.from('content').select('*');
  if (type) query = query.eq('type', type);
  if (status) query = query.eq('status', status);
  const { data, error } = await query;
  if (error) throw error;
  return data;
};

export const getContentById = async (id: string) => {
  const { data, error } = await supabase.from('content').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
};

export const createContent = async (content: Partial<Database['public']['Tables']['content']>) => {
  const { data, error } = await supabase.from('content').insert(content).select().single();
  if (error) throw error;
  return data;
};

export const updateContent = async (id: string, content: Partial<Database['public']['Tables']['content']>) => {
  const { data, error } = await supabase.from('content').update(content).eq('id', id).select().single();
  if (error) throw error;
  return data;
};

// Media
export const getMedia = async (contentId?: string) => {
  let query = supabase.from('media').select('*');
  if (contentId) query = query.eq('content_id', contentId);
  const { data, error } = await query;
  if (error) throw error;
  return data;
};

export const getMediaById = async (id: string) => {
  const { data, error } = await supabase.from('media').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
};

export const createMedia = async (media: Partial<Database['public']['Tables']['media']>) => {
  const { data, error } = await supabase.from('media').insert(media).select().single();
  if (error) throw error;
  return data;
};

export const updateMedia = async (id: string, media: Partial<Database['public']['Tables']['media']>) => {
  const { data, error } = await supabase.from('media').update(media).eq('id', id).select().single();
  if (error) throw error;
  return data;
};

// Audit Logs
export const getAuditLogs = async (entityType?: string, entityId?: string) => {
  let query = supabase.from('audit_logs').select('*');
  if (entityType) query = query.eq('entity_type', entityType);
  if (entityId) query = query.eq('entity_id', entityId);
  const { data, error } = await query;
  if (error) throw error;
  return data;
};

export const getAuditLogById = async (id: string) => {
  const { data, error } = await supabase.from('audit_logs').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
}; 