-- ============================================================
-- 001_profiles_roles.sql
-- Konstwiavniw — Distenksyon kont Elèv vs Admin
-- ============================================================
-- Supabase Auth deja jere tab "auth.users" (imèl, modpas ansekirite,
-- hashing, sesyon). Tab sa a se yon EXTENSION ki ajoute enfo
-- espesifik a platfòm nou an (wòl, non).

create type user_role as enum ('student', 'admin');

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role user_role not null default 'student',
  created_at timestamptz not null default now()
);

-- Lè yon moun kreye kont (sign up), yon "trigger" otomatikman
-- kreye pwofil li ak wòl 'student' pa defo.
-- AUCUN moun pa ka kreye yon kont 'admin' apati fòm piblik la —
-- yon admin dwe pwomouve manyèlman (SQL oswa Admin Dashboard pita).

create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, new.raw_user_meta_data->>'full_name', 'student');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Row Level Security: chak itilizatè ka wè/modifye SÈLMAN pwòp pwofil li.
alter table public.profiles enable row level security;

create policy "Itilizatè ka wè pwòp pwofil li"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Itilizatè ka modifye pwòp pwofil li"
  on public.profiles for update
  using (auth.uid() = id);

-- Admin yo ka wè tout pwofil (itil pita pou Admin Dashboard).
create policy "Admin ka wè tout pwofil"
  on public.profiles for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );
