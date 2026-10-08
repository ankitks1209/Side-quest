import { describe, expect, it } from "vitest";
import { DEFAULT_INPUT, selectMockQuest } from "./fixtures";
import { QuestGenerationResponseSchema } from "./generation-schema";

describe("quest generation response boundary", () => {
  const quest = selectMockQuest(DEFAULT_INPUT);
  it("accepts a valid quest and source", () => {
    expect(QuestGenerationResponseSchema.safeParse({ quest, source: "gemma" }).success).toBe(true);
  });
  it("rejects a malformed response", () => {
    expect(QuestGenerationResponseSchema.safeParse({ result: quest }).success).toBe(false);
  });
  it("rejects an invalid quest inside the response", () => {
    expect(QuestGenerationResponseSchema.safeParse({ quest: { ...quest, tasks: [] }, source: "fallback" }).success).toBe(false);
  });
});
