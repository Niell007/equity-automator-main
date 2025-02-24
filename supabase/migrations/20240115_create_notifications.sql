-- Create notifications schema
CREATE SCHEMA IF NOT EXISTS app_private;
CREATE SCHEMA IF NOT EXISTS app_public;

-- Create notifications table in private schema
CREATE TABLE app_private.notifications (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type text NOT NULL CHECK (type IN ('chat', 'instruction')),
    message text NOT NULL,
    response text,
    status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    metadata jsonb DEFAULT '{}'::jsonb,
    error_details text,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL,
    processed_at timestamptz
);

-- Create public view for user access
CREATE VIEW app_public.notifications AS
SELECT 
    id,
    user_id,
    type,
    message,
    response,
    status,
    metadata,
    created_at,
    updated_at,
    processed_at
FROM app_private.notifications;

-- Set up RLS policies
ALTER TABLE app_private.notifications ENABLE ROW LEVEL SECURITY;

-- Only allow service role to insert
CREATE POLICY notifications_insert ON app_private.notifications 
    FOR INSERT 
    TO service_role 
    WITH CHECK (true);

-- Only allow service role to update
CREATE POLICY notifications_update ON app_private.notifications 
    FOR UPDATE 
    TO service_role 
    USING (true);

-- Allow users to read their own notifications through the public view
CREATE POLICY notifications_select ON app_public.notifications 
    FOR SELECT 
    TO authenticated 
    USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION app_private.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON app_private.notifications
    FOR EACH ROW
    EXECUTE FUNCTION app_private.set_updated_at();

-- Create notification processing function
CREATE OR REPLACE FUNCTION app_private.process_notification()
RETURNS TRIGGER AS $$
BEGIN
    -- Set status to processing
    UPDATE app_private.notifications
    SET status = 'processing',
        processed_at = now()
    WHERE id = NEW.id;
    
    -- Here we could add additional processing logic
    -- For now, we'll just mark it as completed
    UPDATE app_private.notifications
    SET status = 'completed'
    WHERE id = NEW.id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER process_notification_trigger
    AFTER INSERT ON app_private.notifications
    FOR EACH ROW
    EXECUTE FUNCTION app_private.process_notification();

-- Create indexes for better performance
CREATE INDEX idx_notifications_user_id ON app_private.notifications(user_id);
CREATE INDEX idx_notifications_status ON app_private.notifications(status);
CREATE INDEX idx_notifications_created_at ON app_private.notifications(created_at);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA app_public TO authenticated;
GRANT SELECT ON app_public.notifications TO authenticated;
GRANT ALL ON app_private.notifications TO service_role; 