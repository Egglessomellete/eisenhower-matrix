const EPS = 1e-9; // guards against floating point error, e.g. 0.75 * 20

// Only held classes marked present or absent count. Unknown and cancelled never do.
export function countLogs(logs) {
  let present = 0;
  let absent = 0;
  for (const log of logs) {
    if (log.is_cancelled) continue;
    if (log.status === "present") present++;
    else if (log.status === "absent") absent++;
  }
  return { present, absent };
}

// Attendance % = present / held * 100, or null when nothing has been held yet.
export function attendancePercent(present, absent) {
  const held = present + absent;
  if (held === 0) return null;
  return (present / held) * 100;
}

// How many future classes can be skipped and still stay at or above the target.
// present / (held + K) >= T   =>   K = floor(present / T - held)
export function safeSkips({ present, absent, targetPercent, remaining }) {
  const held = present + absent;
  const t = targetPercent / 100;
  if (t <= 0) return remaining;
  const raw = Math.floor(present / t - held + EPS);
  return Math.max(0, Math.min(raw, remaining));
}

// How many classes in a row must be attended to get back to the target.
// (present + N) / (held + N) >= T   =>   N = ceil((T * held - present) / (1 - T))
// Returns Infinity when it is mathematically impossible (100% target after an absence).
export function mustAttend({ present, absent, targetPercent }) {
  const held = present + absent;
  const t = targetPercent / 100;
  if (held === 0) return 0;
  if (present / held >= t - EPS) return 0;
  if (t >= 1) return Infinity;
  return Math.ceil((t * held - present) / (1 - t) - EPS);
}

// "none" = grey, "safe" = green, "near" = amber (within 5 points), "below" = red.
export function attendanceStatus(percent, targetPercent) {
  if (percent === null) return "none";
  if (percent < targetPercent) return "below";
  if (percent < targetPercent + 5) return "near";
  return "safe";
}
