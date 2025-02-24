-- Create schema
CREATE SCHEMA IF NOT EXISTS app_private;

-- Create content table in public schema
CREATE TABLE public.content (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    status TEXT NOT NULL CHECK (status IN ('draft', 'published', 'archived')),
    type TEXT NOT NULL CHECK (type IN ('post', 'page', 'document', 'template')),
    content TEXT,
    author_id BIGINT REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.content ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations for service role
CREATE POLICY "Allow all operations for service role"
ON public.content
FOR ALL
USING (true)
WITH CHECK (true); 