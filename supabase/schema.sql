-- Run this file in Supabase Dashboard -> SQL Editor -> New query.
-- It creates the data model for the public blog and private author dashboard.

create extension if not exists "pgcrypto";

create type public.post_status as enum ('draft', 'published');

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  created_at timestamptz not null default now()
);

create table public.tags (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  created_at timestamptz not null default now()
);

create table public.posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references auth.users(id) on delete cascade,
  category_id uuid references public.categories(id) on delete set null,
  title text not null,
  slug text not null unique,
  excerpt text,
  content jsonb not null default '{"type":"doc","content":[]}'::jsonb,
  content_text text not null default '',
  cover_image_url text,
  cover_image_alt text,
  status public.post_status not null default 'draft',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint published_posts_need_a_date check (
    (status = 'draft' and published_at is null) or
    (status = 'published' and published_at is not null)
  )
);

create table public.post_tags (
  post_id uuid not null references public.posts(id) on delete cascade,
  tag_id uuid not null references public.tags(id) on delete cascade,
  primary key (post_id, tag_id)
);

create table public.media_assets (
  id uuid primary key default gen_random_uuid(),
  uploaded_by uuid not null references auth.users(id) on delete cascade,
  cloudinary_public_id text not null unique,
  secure_url text not null,
  alt_text text,
  width integer,
  height integer,
  created_at timestamptz not null default now()
);

create index posts_public_listing_index on public.posts (status, published_at desc);
create index posts_category_index on public.posts (category_id);
create index posts_author_index on public.posts (author_id);

create or replace function public.set_updated_at()
returns trigger language plpgsql security invoker as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger posts_set_updated_at
before update on public.posts
for each row execute function public.set_updated_at();

alter table public.categories enable row level security;
alter table public.tags enable row level security;
alter table public.posts enable row level security;
alter table public.post_tags enable row level security;
alter table public.media_assets enable row level security;

-- Anyone can read public published content.
create policy "Published posts are publicly readable" on public.posts
for select using (status = 'published' or auth.uid() = author_id);

create policy "Published categories are publicly readable" on public.categories
for select using (true);

create policy "Published tags are publicly readable" on public.tags
for select using (true);

create policy "Published post tags are publicly readable" on public.post_tags
for select using (true);

-- An authenticated author can manage only their own posts and media.
create policy "Authors create their own posts" on public.posts
for insert to authenticated with check (auth.uid() = author_id);
create policy "Authors update their own posts" on public.posts
for update to authenticated using (auth.uid() = author_id) with check (auth.uid() = author_id);
create policy "Authors delete their own posts" on public.posts
for delete to authenticated using (auth.uid() = author_id);

create policy "Authors create media" on public.media_assets
for insert to authenticated with check (auth.uid() = uploaded_by);
create policy "Authors read their own media" on public.media_assets
for select to authenticated using (auth.uid() = uploaded_by);
create policy "Authors update their own media" on public.media_assets
for update to authenticated using (auth.uid() = uploaded_by) with check (auth.uid() = uploaded_by);
create policy "Authors delete their own media" on public.media_assets
for delete to authenticated using (auth.uid() = uploaded_by);

-- Seed the categories used by the frontend.
insert into public.categories (name, slug) values
  ('Developer Tools', 'developer-tools'),
  ('Backend', 'backend'),
  ('DevOps', 'devops'),
  ('Full Stack', 'full-stack'),
  ('Problem Solving', 'problem-solving')
on conflict (slug) do nothing;
