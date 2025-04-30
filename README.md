
# Board Game Inventory Manager

A full-stack web application for managing board game inventory and inspection status for a board game store. Built with React, TypeScript, Tailwind CSS, and Supabase.

## Features

- Admin login with email/password authentication
- Board game listing and management
- Detailed game inspection tracking
- Dashboard showing games needing attention
- Protected routes for authenticated users only

## Tech Stack

- Frontend: React with TypeScript
- Styling: Tailwind CSS with shadcn/ui components
- State Management: React Context API
- Backend & Authentication: Supabase
- Routing: React Router

## Supabase Setup

For full functionality, you need to connect this project to Supabase:

1. Click the green Supabase button in the Lovable interface
2. Connect to a new or existing Supabase project
3. Create the required tables in your Supabase project:

```sql
create table
  public.games (
    id uuid not null default uuid_generate_v4(),
    created_at timestamp with time zone not null default now(),
    name text not null,
    inspected_at timestamp with time zone not null default now(),
    inspected_by text not null,
    has_manual boolean not null default true,
    component_status text not null default '상'::text,
    needs_reorder boolean not null default false,
    missing_components text not null default '',
    constraint games_pkey primary key (id),
    constraint games_component_status_check check ((component_status = ANY (ARRAY['상'::text, '중'::text, '하'::text])))
  ) tablespace pg_default;

-- Set up Row Level Security
alter table public.games enable row level security;

-- Create policy to allow authenticated users to read games
create policy "Allow authenticated users to read games"
on public.games for select
to authenticated
using (true);

-- Create policy to allow authenticated users to insert games
create policy "Allow authenticated users to insert games"
on public.games for insert
to authenticated
with check (true);

-- Create policy to allow authenticated users to update games
create policy "Allow authenticated users to update games"
on public.games for update
to authenticated
using (true);
```

4. Set up authentication in your Supabase project:
   - Go to Authentication > Settings
   - Enable Email provider
   - Configure email templates and settings as desired
   - Create an admin user via the Supabase dashboard or through signup

## Development Notes

- This project was built with Lovable, a full-stack AI development platform
- The current implementation includes temporary mock data that will be replaced by real Supabase data once connected
- All routes except the login page are protected and require authentication

## Demo Access

For demo purposes, you can use these credentials:
- Email: admin@example.com
- Password: password

*Note: These credentials will only work with the mock authentication. You'll need to set up real credentials in Supabase.*
