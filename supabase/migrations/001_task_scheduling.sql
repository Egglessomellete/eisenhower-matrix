-- Scheduling columns. All nullable, so existing tasks stay valid (unscheduled).
alter table public.tasks
  add column scheduled_date date,
  add column start_time     time,
  add column duration_mins  integer;

-- A task is either fully scheduled or not scheduled at all.
alter table public.tasks
  add constraint tasks_schedule_all_or_none check (
    (scheduled_date is null and start_time is null and duration_mins is null)
    or
    (scheduled_date is not null and start_time is not null
      and duration_mins between 15 and 720)
  );

-- Makes "my tasks for this week" lookups fast.
create index tasks_user_date_idx
  on public.tasks (user_id, scheduled_date);