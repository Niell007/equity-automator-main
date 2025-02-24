-- Create notification queue table
CREATE TABLE app_private.notification_queue (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    notification_id uuid NOT NULL REFERENCES app_private.notifications(id) ON DELETE CASCADE,
    attempts int DEFAULT 0 NOT NULL,
    max_attempts int DEFAULT 3 NOT NULL,
    next_attempt_at timestamptz DEFAULT now() NOT NULL,
    last_error text,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL,
    CONSTRAINT valid_attempts CHECK (attempts <= max_attempts)
);

-- Create index for queue processing
CREATE INDEX idx_notification_queue_next_attempt 
ON app_private.notification_queue(next_attempt_at) 
WHERE attempts < max_attempts;

-- Create function to add notifications to queue
CREATE OR REPLACE FUNCTION app_private.enqueue_notification()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO app_private.notification_queue (notification_id)
    VALUES (NEW.id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically enqueue notifications
CREATE TRIGGER enqueue_notification_trigger
    AFTER INSERT ON app_private.notifications
    FOR EACH ROW
    EXECUTE FUNCTION app_private.enqueue_notification();

-- Update notification processing function
CREATE OR REPLACE FUNCTION app_private.process_notification()
RETURNS TRIGGER AS $$
BEGIN
    -- Update notification status
    UPDATE app_private.notifications
    SET status = 
        CASE 
            WHEN NEW.attempts >= NEW.max_attempts THEN 'failed'
            WHEN NEW.attempts < NEW.max_attempts THEN 'processing'
        END,
    error_details = 
        CASE 
            WHEN NEW.attempts >= NEW.max_attempts THEN NEW.last_error
            ELSE NULL
        END,
    processed_at = now()
    WHERE id = NEW.notification_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for queue processing
CREATE TRIGGER process_notification_queue_trigger
    AFTER UPDATE ON app_private.notification_queue
    FOR EACH ROW
    EXECUTE FUNCTION app_private.process_notification();

-- Grant necessary permissions
GRANT ALL ON app_private.notification_queue TO service_role; 