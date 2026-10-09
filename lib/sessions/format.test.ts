import { describe, expect, it } from "vitest";
import { formatDuration } from "./format";

describe("duration formatting", () => {
  it.each([
    [-1, "00:00"],
    [0, "00:00"],
    [61_000, "01:01"],
    [3_661_000, "1:01:01"],
  ])("formats %i ms as %s", (milliseconds, expected) => {
    expect(formatDuration(milliseconds)).toBe(expected);
  });
});
