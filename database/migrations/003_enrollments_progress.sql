-- ============================================================
-- 003_enrollments_progress.sql
-- Konstwiavniw — Enskripsyon Elèv ak Swivi Pwogrè
-- ============================================================

create table if not exists public.enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  enrolled_at timestamptz not null default now(),
  unique (user_id, course_id) -- yon elèv pa ka enskri de fwa nan menm kou
);

create table if not exists public.lesson_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  completed boolean not null default false,
  completed_at timestamptz,
  unique (user_id, lesson_id)
);

-- ------------------------------------------------------------
-- Vi (view) ki kalkile pousantaj pwogrè yon elèv nan yon kou —
-- itilize dirèkteman pa Student Dashboard la.
-- ------------------------------------------------------------
create or replace view public.course_progress as
select
  e.user_id,
  e.course_id,
  count(distinct l.id) as total_lessons,
  count(distinct lp.lesson_id) filter (where lp.completed) as completed_lessons,
  round(
    100.0 * count(distinct lp.lesson_id) filter (where lp.completed)
    / nullif(count(distinct l.id), 0)
  ) as percent_complete
from public.enrollments e
join public.modules m on m.course_id = e.course_id
join public.lessons l on l.module_id = m.id
left join public.lesson_progress lp
  on lp.lesson_id = l.id and lp.user_id = e.user_id
group by e.user_id, e.course_id;

-- ------------------------------------------------------------
-- Row Level Security
-- ------------------------------------------------------------
alter table public.enrollments    enable row level security;
alter table public.lesson_progress enable row level security;

-- Yon elèv ka wè/kreye SÈLMAN pwòp enskripsyon li.
create policy "Elèv wè pwòp enskripsyon"
  on public.enrollments for select
  using (auth.uid() = user_id);

create policy "Elèv enskri tèt li"
  on public.enrollments for insert
  with check (auth.uid() = user_id);

-- Yon elèv ka wè/modifye SÈLMAN pwòp pwogrè li — JANM pwogrè lòt moun.
create policy "Elèv wè pwòp pwogrè"
  on public.lesson_progress for select
  using (auth.uid() = user_id);

create policy "Elèv modifye pwòp pwogrè"
  on public.lesson_progress for insert
  with check (auth.uid() = user_id);

create policy "Elèv aktyalize pwòp pwogrè"
  on public.lesson_progress for update
  using (auth.uid() = user_id);

-- Admin ka wè TOUT enskripsyon ak TOUT pwogrè (pou estatistik & jesyon elèv),
-- men PA KA modifye pwogrè yon elèv — sa rete yon dwa elèv la sèlman.
create policy "Admin wè tout enskripsyon"
  on public.enrollments for select
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

create policy "Admin wè tout pwogrè"
  on public.lesson_progress for select
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));
