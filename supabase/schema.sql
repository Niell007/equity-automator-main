-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create schemas
CREATE SCHEMA IF NOT EXISTS app_private;
CREATE SCHEMA IF NOT EXISTS app_public;

-- Create roles table
CREATE TABLE IF NOT EXISTS app_public.roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    permissions JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create users table
CREATE TABLE IF NOT EXISTS app_public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role_id UUID REFERENCES app_public.roles(id) ON DELETE SET NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(100),
    avatar_url TEXT,
    status VARCHAR(20) DEFAULT 'active',
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create content table
CREATE TABLE IF NOT EXISTS app_public.content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    content TEXT,
    metadata JSONB DEFAULT '{}',
    author_id UUID REFERENCES app_public.users(id) ON DELETE SET NULL,
    status VARCHAR(20) DEFAULT 'draft',
    type VARCHAR(50) DEFAULT 'post',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS app_public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES app_public.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info',
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create notification queue table
CREATE TABLE IF NOT EXISTS app_private.notification_queue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    notification_id UUID REFERENCES app_public.notifications(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'pending',
    attempts INTEGER DEFAULT 0,
    last_attempt_at TIMESTAMPTZ,
    next_attempt_at TIMESTAMPTZ,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create audit logs table
CREATE TABLE IF NOT EXISTS app_public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES app_public.users(id) ON DELETE SET NULL,
    action VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON app_public.users(email);
CREATE INDEX IF NOT EXISTS idx_content_author ON app_public.content(author_id);
CREATE INDEX IF NOT EXISTS idx_content_status ON app_public.content(status);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON app_public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notification_queue_status ON app_private.notification_queue(status);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON app_public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON app_public.audit_logs(entity_type, entity_id);

-- Add RLS policies
ALTER TABLE app_public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_public.content ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY users_select ON app_public.users
    FOR SELECT TO authenticated
    USING (true);

CREATE POLICY users_update ON app_public.users
    FOR UPDATE TO authenticated
    USING (id = auth.uid())
    WITH CHECK (id = auth.uid());

-- Content policies
CREATE POLICY content_select ON app_public.content
    FOR SELECT TO authenticated
    USING (status = 'published' OR author_id = auth.uid());

CREATE POLICY content_insert ON app_public.content
    FOR INSERT TO authenticated
    WITH CHECK (author_id = auth.uid());

CREATE POLICY content_update ON app_public.content
    FOR UPDATE TO authenticated
    USING (author_id = auth.uid())
    WITH CHECK (author_id = auth.uid());

-- Notifications policies
CREATE POLICY notifications_select ON app_public.notifications
    FOR SELECT TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY notifications_insert ON app_public.notifications
    FOR INSERT TO authenticated
    WITH CHECK (user_id = auth.uid());

-- Functions for automatic timestamps
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON app_public.users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_content_updated_at
    BEFORE UPDATE ON app_public.content
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_notifications_updated_at
    BEFORE UPDATE ON app_public.notifications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_notification_queue_updated_at
    BEFORE UPDATE ON app_private.notification_queue
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();