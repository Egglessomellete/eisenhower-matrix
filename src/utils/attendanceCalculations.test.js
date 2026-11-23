import { describe, it, expect } from "vitest";
import {
  countLogs,
  attendancePercent,
  safeSkips,
  mustAttend,
  attendanceStatus,
} from "./attendanceCalculations";

describe("countLogs", () => {
  it("ignores unknown and cancelled classes", () => {
    const logs = [
      { status: "present", is_cancelled: false },
      { status: "absent", is_cancelled: false },
      { status: "unknown", is_cancelled: false },
      { status: "present", is_cancelled: true },
    ];
    expect(countLogs(logs)).toEqual({ present: 1, absent: 1 });
  });
});

describe("attendancePercent", () => {
  it("calculates 75%", () => expect(attendancePercent(15, 5)).toBe(75));
  it("is 100% with zero absences", () => expect(attendancePercent(10, 0)).toBe(100));
  it("is null when nothing was held", () => expect(attendancePercent(0, 0)).toBeNull());
});

describe("safeSkips", () => {
  const base = { targetPercent: 75, remaining: 50 };
  it("is 4 at 90% (18 of 20)", () =>
    expect(safeSkips({ ...base, present: 18, absent: 2 })).toBe(4));
  it("is 0 exactly at the target", () =>
    expect(safeSkips({ ...base, present: 15, absent: 5 })).toBe(0));
  it("is 0 below the target", () =>
    expect(safeSkips({ ...base, present: 13, absent: 7 })).toBe(0));
  it("is 3 with zero absences (10 of 10)", () =>
    expect(safeSkips({ ...base, present: 10, absent: 0 })).toBe(3));
  it("is 0 when nothing was held", () =>
    expect(safeSkips({ ...base, present: 0, absent: 0 })).toBe(0));
  it("never exceeds the remaining classes", () =>
    expect(safeSkips({ ...base, present: 18, absent: 2, remaining: 2 })).toBe(2));
  it("is 0 when no classes remain", () =>
    expect(safeSkips({ ...base, present: 18, absent: 2, remaining: 0 })).toBe(0));
  it("is 0 with a 100% target", () =>
    expect(safeSkips({ present: 18, absent: 2, targetPercent: 100, remaining: 50 })).toBe(0));
});

describe("mustAttend", () => {
  it("is 8 at 65% (13 of 20) with a 75% target", () =>
    expect(mustAttend({ present: 13, absent: 7, targetPercent: 75 })).toBe(8));
  it("is 0 when already above the target", () =>
    expect(mustAttend({ present: 18, absent: 2, targetPercent: 75 })).toBe(0));
  it("is 0 when nothing was held", () =>
    expect(mustAttend({ present: 0, absent: 0, targetPercent: 75 })).toBe(0));
  it("is impossible for a 100% target after an absence", () =>
    expect(mustAttend({ present: 9, absent: 1, targetPercent: 100 })).toBe(Infinity));
  it("is 0 for a 100% target with no absences", () =>
    expect(mustAttend({ present: 10, absent: 0, targetPercent: 100 })).toBe(0));
});

describe("attendanceStatus", () => {
  it("maps percentages to a colour state", () => {
    expect(attendanceStatus(null, 75)).toBe("none");
    expect(attendanceStatus(68, 75)).toBe("below");
    expect(attendanceStatus(77, 75)).toBe("near");
    expect(attendanceStatus(91, 75)).toBe("safe");
  });
});
