-- ============================================================
-- 002_courses_content.sql
-- Konstwiavniw — Kou → Modil → Leson → Resous
-- ============================================================

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  description text,
  category text,
  icon text default '📘',
  is_published boolean not null default false,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.modules (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  position int not null default 0,
  created_at timestamptz not null default now()
);

create type lesson_type as enum ('video', 'pdf', 'text');

create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.modules(id) on delete cascade,
  title text not null,
  type lesson_type not null default 'video',
  video_url text,
  duration_seconds int,
  position int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.resources (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid references public.lessons(id) on delete cascade,
  course_id uuid references public.courses(id) on delete cascade,
  title text not null,
  file_url text not null,
  file_type text, -- 'pdf' | 'zip' | 'mp4' ...
  file_size_kb int,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- Row Level Security
-- ------------------------------------------------------------
alter table public.courses   enable row level security;
alter table public.modules   enable row level security;
alter table public.lessons   enable row level security;
alter table public.resources enable row level security;

-- Tout moun (elèv konekte) ka LI sèlman kou ki pibliye.
create policy "Tout moun ka li kou pibliye"
  on public.courses for select
  using (is_published = true);

create policy "Tout moun ka li modil kou pibliye"
  on public.modules for select
  using (exists (select 1 from public.courses c where c.id = course_id and c.is_published = true));

create policy "Tout moun ka li leson kou pibliye"
  on public.lessons for select
  using (exists (
    select 1 from public.modules m join public.courses c on c.id = m.course_id
    where m.id = module_id and c.is_published = true
  ));

create policy "Tout moun ka li resous kou pibliye"
  on public.resources for select
  using (
    course_id in (select id from public.courses where is_published = true)
    or lesson_id in (
      select l.id from public.lessons l
      join public.modules m on m.id = l.module_id
      join public.courses c on c.id = m.course_id
      where c.is_published = true
    )
  );

-- SÈLMAN admin ka kreye/modifye/efase kontni (kou, modil, leson, resous).
create policy "Admin jere kou"
  on public.courses for all
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'))
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

create policy "Admin jere modil"
  on public.modules for all
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'))
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

create policy "Admin jere leson"
  on public.lessons for all
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'))
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

create policy "Admin jere resous"
  on public.resources for all
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'))
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));
