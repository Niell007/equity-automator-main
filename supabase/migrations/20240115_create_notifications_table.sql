-- Create notifications table
create table if not exists public.notifications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  type text not null,
  message text not null,
  read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add RLS policies
alter table public.notifications enable row level security;

-- Users can only see their own notifications
create policy "Users can view own notifications"
  on notifications for select
  using (auth.uid() = user_id);

-- Users can only update their own notifications (e.g., marking as read)
create policy "Users can update own notifications"
  on notifications for update
  using (auth.uid() = user_id);

-- System can create notifications for any user
create policy "System can create notifications"
  on notifications for insert
  with check (true);

-- Create updated_at trigger
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

-- Add trigger to update updated_at timestamp
create trigger set_updated_at
  before update on public.notifications
  for each row
  execute function public.handle_updated_at(); 