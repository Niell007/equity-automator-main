-- Enable required extensions
create extension if not exists "plpgsql";

-- Create function to execute SQL with proper permissions
create or replace function public.exec_sql(sql_string text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  execute sql_string;
end;
$$;

-- Grant execute permission to authenticated users
grant execute on function public.exec_sql(text) to authenticated; 