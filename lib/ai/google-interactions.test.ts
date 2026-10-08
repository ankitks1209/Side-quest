import { describe, expect, it } from "vitest";
import { extractGoogleInteractionText, GoogleInteractionError } from "./google-interactions";

const completed = (steps: unknown[]) => ({ status: "completed", steps });
const output = (...texts: string[]) => ({
  type: "model_output",
  content: texts.map((text) => ({ type: "text", text })),
});

describe("Google Interactions response extraction", () => {
  it("extracts a completed model output", () => {
    expect(extractGoogleInteractionText(completed([output("quest json")]))).toBe("quest json");
  });

  it("uses the last model_output step", () => {
    expect(extractGoogleInteractionText(completed([output("old"), { type: "thought" }, output("new")]))).toBe("new");
  });

  it("concatenates non-empty text blocks in order", () => {
    expect(extractGoogleInteractionText(completed([output("{", " ", "}")]))).toBe("{}");
  });

  it.each([
    "queued", "in_progress", "requires_action", "failed", "cancelled",
    "incomplete", "budget_exceeded", "future_status",
  ])("rejects non-completed status %s", (status) => {
    expect(() => extractGoogleInteractionText({ status, steps: [output("ignored")] }))
      .toThrowError(new GoogleInteractionError("non_completed_status"));
  });

  it("rejects a missing status", () => {
    expect(() => extractGoogleInteractionText({ steps: [output("ignored")] }))
      .toThrowError(new GoogleInteractionError("malformed_response"));
  });

  it("rejects missing steps or model output", () => {
    expect(() => extractGoogleInteractionText({ status: "completed" })).toThrow("missing_model_output");
    expect(() => extractGoogleInteractionText(completed([{ type: "thought" }]))).toThrow("missing_model_output");
  });

  it("rejects an empty final model output", () => {
    expect(() => extractGoogleInteractionText(completed([output("valid"), output("  ")]))).toThrow("empty_model_output");
  });
});
