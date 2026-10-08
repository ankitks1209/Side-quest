import { describe, expect, it } from "vitest";
import { approveQuestCandidate } from "./approval";
import { DEFAULT_INPUT, selectMockQuest } from "./fixtures";

const quest = selectMockQuest(DEFAULT_INPUT);
const raw = (value: unknown) => JSON.stringify(value);

describe("quest candidate approval", () => {
  it("accepts plain and fenced safe JSON", () => {
    expect(approveQuestCandidate(raw(quest), DEFAULT_INPUT)).toMatchObject({ approved: true });
    expect(approveQuestCandidate(`\n\`\`\`json\n${raw(quest)}\n\`\`\`\n`, DEFAULT_INPUT)).toMatchObject({ approved: true });
    expect(approveQuestCandidate(`\`\`\`\n${raw(quest)}\n\`\`\``, DEFAULT_INPUT)).toMatchObject({ approved: true });
  });

  it.each(["", "{bad", "[]", "null", "42"])("rejects invalid JSON candidate %j", (candidate) => {
    expect(approveQuestCandidate(candidate, DEFAULT_INPUT)).toEqual({ approved: false, code: "json" });
  });

  it.each([
    ["invalid primitive", { ...quest, tasks: [{ ...quest.tasks[0], primitive: "CLIMB" }, quest.tasks[1]] }],
    ["invalid task count", { ...quest, tasks: [quest.tasks[0]] }],
    ["zero photo tasks", { ...quest, tasks: quest.tasks.map((task) => ({ ...task, verificationRequired: false })) }],
    ["multiple photo tasks", { ...quest, tasks: quest.tasks.map((task) => ({ ...task, verificationRequired: true, verificationCriterion: "Visible." })) }],
    ["missing criterion", { ...quest, tasks: [{ ...quest.tasks[0], verificationCriterion: undefined }, ...quest.tasks.slice(1)] }],
  ])("rejects schema failure: %s", (_name, candidate) => {
    expect(approveQuestCandidate(raw(candidate), DEFAULT_INPUT)).toEqual({ approved: false, code: "schema" });
  });

  it.each([
    ["duration", { ...quest, durationMinutes: 30 }],
    ["mood", { ...quest, mood: "relax" }],
    ["environment", { ...quest, environment: "park" }],
  ])("rejects requested %s mismatch", (_name, candidate) => {
    expect(approveQuestCandidate(raw(candidate), DEFAULT_INPUT)).toEqual({ approved: false, code: "input_mismatch" });
  });

  it("rejects a deterministic safety failure", () => {
    const unsafe = { ...quest, tasks: [{ ...quest.tasks[0], instruction: "Climb a wall." }, ...quest.tasks.slice(1)] };
    expect(approveQuestCandidate(raw(unsafe), DEFAULT_INPUT)).toEqual({ approved: false, code: "safety" });
  });
});
