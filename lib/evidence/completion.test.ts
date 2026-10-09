import { describe, expect, it } from "vitest";
import { createCompletedTaskIds } from "./completion";

describe("evidence completion", () => {
  it("counts a verified photo task", () => {
    expect(createCompletedTaskIds("photo", ["self"], "verified")).toEqual(["photo", "self"]);
  });

  it.each(["not_verified", "verification_unavailable"] as const)("allows %s without counting the photo", (status) => {
    expect(createCompletedTaskIds("photo", ["self"], status)).toEqual(["self"]);
  });
});
