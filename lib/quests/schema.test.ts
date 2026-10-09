import { describe, expect, it } from "vitest";
import { mockQuests, selectMockQuest } from "./fixtures";
import { QuestInputSchema, QuestSchema, VerificationResultSchema } from "./schema";

describe("quest contracts", () => {
  const base = mockQuests[0];
  it("accepts a valid 2-task quest", () => expect(QuestSchema.safeParse({ ...base, tasks: base.tasks.slice(0, 2) }).success).toBe(true));
  it("accepts a valid 3-task quest", () => expect(QuestSchema.safeParse(base).success).toBe(true));
  it("rejects no tasks", () => expect(QuestSchema.safeParse({ ...base, tasks: [] }).success).toBe(false));
  it("rejects more than 3 tasks", () => expect(QuestSchema.safeParse({ ...base, tasks: [...base.tasks, base.tasks[1]] }).success).toBe(false));
  it("rejects unsupported primitives", () => expect(QuestSchema.safeParse({ ...base, tasks: [{ ...base.tasks[0], primitive: "CLIMB" }, base.tasks[1]] }).success).toBe(false));
  it.each([{ durationMinutes: 20 }, { mood: "party" }, { environment: "railway" }])("rejects invalid input %j", (invalid) => {
    expect(QuestSchema.safeParse({ ...base, ...invalid }).success).toBe(false);
    expect(QuestInputSchema.safeParse({ ...base, ...invalid }).success).toBe(false);
  });
  it.each([undefined, "", "   "])("requires a nonblank photo verification criterion (%j)", (verificationCriterion) => {
    expect(QuestSchema.safeParse({ ...base, tasks: [{ ...base.tasks[0], verificationCriterion }, base.tasks[1]] }).success).toBe(false);
  });
  it("allows self-report tasks without a criterion", () => expect(QuestSchema.safeParse(base).success).toBe(true));
  it("requires exactly one photo task", () => {
    expect(QuestSchema.safeParse({ ...base, tasks: base.tasks.slice(1) }).success).toBe(false);
    expect(QuestSchema.safeParse({ ...base, tasks: [base.tasks[0], { ...base.tasks[0], id: "another-photo" }] }).success).toBe(false);
  });
  it("rejects duplicate IDs", () => expect(QuestSchema.safeParse({ ...base, tasks: [base.tasks[0], { ...base.tasks[1], id: base.tasks[0].id }] }).success).toBe(false));
  it("validates all three curated fixtures", () => mockQuests.forEach((quest) => expect(QuestSchema.safeParse(quest).success).toBe(true)));
  it("bounds verification confidence and reason length", () => {
    expect(VerificationResultSchema.safeParse({ verified: true, confidence: 0.5, reason: "Visible." }).success).toBe(true);
    expect(VerificationResultSchema.safeParse({ verified: true, confidence: -0.1, reason: "Visible." }).success).toBe(false);
    expect(VerificationResultSchema.safeParse({ verified: true, confidence: 1.1, reason: "Visible." }).success).toBe(false);
    expect(VerificationResultSchema.safeParse({ verified: true, confidence: 0.5, reason: "x".repeat(301) }).success).toBe(false);
  });
  it("adapts location-specific copy for other environments", () => {
    const cityNotice = selectMockQuest({ durationMinutes: 15, mood: "notice", environment: "city" });
    expect(cityNotice.intro).not.toMatch(/park/i);
    expect(cityNotice.tasks[0].instruction).toContain("public footpath");
    const parkExplore = selectMockQuest({ durationMinutes: 15, mood: "explore", environment: "park" });
    expect(parkExplore.intro).not.toMatch(/streets/i);
    expect(parkExplore.tasks[0].instruction).toContain("public park path");
  });
  it("preserves input and validates every setup combination", () => {
    for (const durationMinutes of [15, 30, 60] as const)
      for (const mood of ["explore", "relax", "move", "notice"] as const)
        for (const environment of ["city", "park", "anywhere"] as const) {
          const input = { durationMinutes, mood, environment };
          const quest = selectMockQuest(input);
          expect(QuestSchema.safeParse(quest).success).toBe(true);
          expect({ durationMinutes: quest.durationMinutes, mood: quest.mood, environment: quest.environment }).toEqual(input);
          if (mood === "move") expect(quest.tasks.some((task) => task.primitive === "WALK_DURATION")).toBe(true);
        }
  });
});
