import { addDays, format, startOfWeek } from "date-fns";

// The seven days (Monday to Sunday) of the week containing `date`
export function getWeekDays(date = new Date()) {
  const monday = startOfWeek(date, { weekStartsOn: 1 });
  return Array.from({ length: 7 }, (_, i) => addDays(monday, i));
}

// "2026-11-23" in the user's LOCAL time zone.
// Don't use toISOString() for this: it converts to UTC and can return yesterday's date in India.
export function toDateString(date) {
  return format(date, "yyyy-MM-dd");
}
