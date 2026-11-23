-- 002: semester, subjects, timetable, holidays, attendance logs.
-- Run once in the Supabase SQL Editor.

create table public.semesters (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null,
  start_date date not null,
  end_date date not null,
  default_target_percent integer not null default 75
    check (default_target_percent between 1 and 100),
  created_at timestamptz not null default now(),
  constraint semester_dates_ok check (end_date > start_date)
);

create table public.subjects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  semester_id uuid not null references public.semesters(id) on delete cascade,
  name text not null,
  code text,
  target_percent integer check (target_percent between 1 and 100), -- null = use semester default
  color text not null default '#3b82f6',
  archived boolean not null default false, -- hide instead of delete, so history survives
  created_at timestamptz not null default now()
);

-- Weekly recurring class. day_of_week: 1 = Monday ... 7 = Sunday (ISO).
create table public.timetable_rules (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  subject_id uuid not null references public.subjects(id) on delete cascade,
  day_of_week smallint not null check (day_of_week between 1 and 7),
  start_time time not null,
  end_time time not null,
  room text,
  faculty text,
  created_at timestamptz not null default now(),
  constraint rule_times_ok check (end_time > start_time),
  constraint rule_unique unique (user_id, subject_id, day_of_week, start_time)
);

create table public.holidays (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  date date not null,
  label text not null,
  type text not null default 'holiday',
  created_at timestamptz not null default now(),
  constraint holiday_unique unique (user_id, date)
);

-- One row per class occurrence the user has marked. Unmarked classes have no row.
-- Rows keep their own date and time, so history survives timetable edits.
create table public.attendance_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  subject_id uuid not null references public.subjects(id) on delete restrict,
  rule_id uuid references public.timetable_rules(id) on delete set null,
  class_date date not null,
  start_time time not null,
  status text not null default 'unknown'
    check (status in ('present', 'absent', 'unknown')),
  is_cancelled boolean not null default false,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint attendance_one_per_class
    unique (user_id, subject_id, class_date, start_time)
);

-- At most one attendance reminder task per subject.
alter table public.tasks
  add column attendance_subject_id uuid references public.subjects(id) on delete cascade;

create unique index tasks_one_attendance_reminder_idx
  on public.tasks (user_id, attendance_subject_id)
  where attendance_subject_id is not null;

create index subjects_semester_idx on public.subjects (semester_id);
create index timetable_rules_user_day_idx on public.timetable_rules (user_id, day_of_week);
create index attendance_logs_lookup_idx
  on public.attendance_logs (user_id, subject_id, class_date);

-- Security: every table gets RLS, one "own rows only" policy, and the Data API grant.
do $$
declare t text;
begin
  foreach t in array array['semesters','subjects','timetable_rules','holidays','attendance_logs']
  loop
    execute format('alter table public.%I enable row level security', t);
    execute format(
      'create policy "Users manage own %s" on public.%I for all to authenticated
         using ((select auth.uid()) = user_id)
         with check ((select auth.uid()) = user_id)', t, t);
    execute format(
      'grant select, insert, update, delete on table public.%I to authenticated', t);
  end loop;
end $$;
