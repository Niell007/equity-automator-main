export interface Role {
  id: string;
  name: string;
  description: string | null;
  permissions: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  role_id: string | null;
  full_name: string | null;
  avatar_url: string | null;
  status: string;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Content {
  id: string;
  title: string;
  slug: string;
  content: string | null;
  status: 'draft' | 'published' | 'archived';
  type: 'post' | 'page' | 'document' | 'template';
  metadata: Record<string, any>;
  author_id: string | null;
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

export interface Media {
  id: string;
  filename: string;
  filepath: string;
  filesize: number;
  mimetype: string;
  metadata: Record<string, any>;
  uploaded_by: string | null;
  content_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface AuditLog {
  id: string;
  user_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string;
  old_data: Record<string, any> | null;
  new_data: Record<string, any> | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      roles: Role;
      content: Content;
      media: Media;
      audit_logs: AuditLog;
    };
    Views: {
      [key: string]: unknown;
    };
    Functions: {
      handle_user_update: (args: { id: string }) => AuditLog;
    };
  };
} 