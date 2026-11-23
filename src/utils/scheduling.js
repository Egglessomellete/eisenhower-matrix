import { END_HOUR, timeToMinutes } from "./timeCalculations";

// Do two time ranges overlap? Touching ends (9:00-10:00 and 10:00-11:00) do not.
export function overlaps(startA, durA, startB, durB) {
  return startA < startB + durB && startB < startA + durA;
}

// Would a block starting at `startMinutes` collide with a task already on that day?
// `ignoreId` is the task being moved, so it never conflicts with itself.
export function hasConflict(tasks, dateStr, startMinutes, durationMins, ignoreId) {
  return tasks.some(
    (t) =>
      t.id !== ignoreId &&
      t.scheduled_date === dateStr &&
      overlaps(
        startMinutes,
        durationMins,
        timeToMinutes(t.start_time),
        t.duration_mins,
      ),
  );
}

// The longest this task can be before it hits the next task or the end of the grid.
export function getMaxDuration(dayTasks, task) {
  const start = timeToMinutes(task.start_time);
  const nextStarts = dayTasks
    .filter((t) => t.id !== task.id)
    .map((t) => timeToMinutes(t.start_time))
    .filter((s) => s > start)
    .map((s) => s - start);
  return Math.min(...nextStarts, END_HOUR * 60 - start);
}
