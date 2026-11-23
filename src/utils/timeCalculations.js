export const START_HOUR = 6; // the grid starts at 6:00 AM
export const END_HOUR = 23; // the grid ends at 11:00 PM
export const HOUR_HEIGHT = 60; // pixels per hour
const PX_PER_MIN = HOUR_HEIGHT / 60;

// "14:30:00" or "14:30" -> 870 (minutes since midnight)
export function timeToMinutes(time) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

// 870 -> "14:30:00" (the format Postgres uses for a time column)
export function minutesToTime(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}:00`;
}

// minutes since midnight -> pixels from the top of the grid
export function minutesToTop(minutes) {
  return (minutes - START_HOUR * 60) * PX_PER_MIN;
}

// pixels from the top of the grid -> minutes since midnight
export function topToMinutes(top) {
  return top / PX_PER_MIN + START_HOUR * 60;
}

// duration in minutes -> block height in pixels
export function durationToHeight(durationMins) {
  return durationMins * PX_PER_MIN;
}

// round to the nearest step, 15 minutes by default
export function snapMinutes(minutes, step = 15) {
  return Math.round(minutes / step) * step;
}

// keep a block of `durationMins` fully inside the visible grid
export function clampStart(startMinutes, durationMins) {
  const min = START_HOUR * 60;
  const max = END_HOUR * 60 - durationMins;
  return Math.max(min, Math.min(startMinutes, max));
}
