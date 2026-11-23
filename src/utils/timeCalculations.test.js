import { describe, it, expect } from "vitest";
import {
  timeToMinutes,
  minutesToTime,
  minutesToTop,
  topToMinutes,
  durationToHeight,
  snapMinutes,
  clampStart,
} from "./timeCalculations";

describe("time calculations", () => {
  it("converts time strings to minutes", () => {
    expect(timeToMinutes("14:30:00")).toBe(870);
    expect(timeToMinutes("09:05")).toBe(545);
  });

  it("converts minutes back to a time string", () => {
    expect(minutesToTime(870)).toBe("14:30:00");
    expect(minutesToTime(545)).toBe("09:05:00");
  });

  it("maps minutes to pixels", () => {
    expect(minutesToTop(360)).toBe(0);
    expect(minutesToTop(540)).toBe(180);
  });

  it("maps pixels back to minutes", () => {
    expect(topToMinutes(180)).toBe(540);
  });

  it("converts duration to height", () => {
    expect(durationToHeight(90)).toBe(90);
  });

  it("snaps to the nearest step", () => {
    expect(snapMinutes(487)).toBe(480);
    expect(snapMinutes(488)).toBe(495);
    expect(snapMinutes(500, 30)).toBe(510);
  });

  it("keeps a block inside the grid", () => {
    expect(clampStart(300, 60)).toBe(360); // too early -> 6:00 AM
    expect(clampStart(600, 60)).toBe(600); // fine as it is
    expect(clampStart(1400, 60)).toBe(1320); // too late -> ends at 11 PM
  });
});
