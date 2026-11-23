import { describe, it, expect } from "vitest";
import { overlaps, hasConflict, getMaxDuration } from "./scheduling";

const task = (id, date, start, duration) => ({
  id,
  scheduled_date: date,
  start_time: start,
  duration_mins: duration,
});

describe("overlaps", () => {
  it("is false when blocks only touch", () => {
    expect(overlaps(540, 60, 600, 60)).toBe(false);
  });
  it("is true for a partial overlap", () => {
    expect(overlaps(540, 60, 570, 60)).toBe(true);
  });
  it("is true when one block contains the other", () => {
    expect(overlaps(540, 180, 570, 30)).toBe(true);
  });
});

describe("hasConflict", () => {
  const tasks = [task("a", "2026-11-23", "09:00:00", 60)];

  it("detects a clash on the same day", () => {
    expect(hasConflict(tasks, "2026-11-23", 570, 60, "b")).toBe(true);
  });
  it("ignores other days", () => {
    expect(hasConflict(tasks, "2026-11-24", 570, 60, "b")).toBe(false);
  });
  it("ignores the task being moved", () => {
    expect(hasConflict(tasks, "2026-11-23", 540, 60, "a")).toBe(false);
  });
});

describe("getMaxDuration", () => {
  it("stops at the next task", () => {
    const a = task("a", "2026-11-23", "09:00:00", 60);
    const b = task("b", "2026-11-23", "11:00:00", 60);
    expect(getMaxDuration([a, b], a)).toBe(120);
  });
  it("stops at the end of the grid when nothing follows", () => {
    const a = task("a", "2026-11-23", "21:00:00", 60);
    expect(getMaxDuration([a], a)).toBe(120); // 21:00 to 23:00
  });
});
