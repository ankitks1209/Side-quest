import { afterEach, describe, expect, it, vi } from "vitest";
import type { QuestModel } from "@/lib/ai/quest-model";
import { GoogleGemmaModel } from "../ai/google-gemma-model";
import { approveQuestCandidate } from "./approval";
import { DEFAULT_INPUT, selectMockQuest } from "./fixtures";
import { generateApprovedQuest, QuestGenerationError } from "./generation";

const safeQuest = selectMockQuest(DEFAULT_INPUT);
const safeRaw = JSON.stringify(safeQuest);
const unsafeRaw = JSON.stringify({
  ...safeQuest,
  tasks: [{ ...safeQuest.tasks[0], instruction: "Climb a wall." }, ...safeQuest.tasks.slice(1)],
});

function sequenceModel(...results: Array<string | Error>): QuestModel & { generateQuest: ReturnType<typeof vi.fn> } {
  const generateQuest = vi.fn(async () => {
    const result = results.shift();
    if (result instanceof Error) throw result;
    if (result === undefined) throw new Error("unexpected_extra_call");
    return result;
  });
  return { generateQuest };
}

describe("quest generation orchestration", () => {
  afterEach(() => vi.restoreAllMocks());

  it.each([
    ["provider", new Error("provider"), safeRaw],
    ["response parse", "bad json", safeRaw],
    ["schema", "{}", safeRaw],
    ["safety", unsafeRaw, safeRaw],
  ])("retries once after a %s failure", async (_name, first, second) => {
    vi.spyOn(console, "info").mockImplementation(() => undefined);
    const model = sequenceModel(first, second);
    await expect(generateApprovedQuest(DEFAULT_INPUT, model)).resolves.toMatchObject({ source: "gemma" });
    expect(model.generateQuest).toHaveBeenCalledTimes(2);
  });

  it("falls back after two provider failures", async () => {
    vi.spyOn(console, "info").mockImplementation(() => undefined);
    const model = sequenceModel(new Error("one"), new Error("two"));
    const result = await generateApprovedQuest(DEFAULT_INPUT, model);
    expect(result.source).toBe("fallback");
    expect(model.generateQuest).toHaveBeenCalledTimes(2);
    expect(approveQuestCandidate(JSON.stringify(result.quest), DEFAULT_INPUT).approved).toBe(true);
  });

  it("treats queued as a failed attempt and retries", async () => {
    vi.spyOn(console, "info").mockImplementation(() => undefined);
    const fetchMock = vi.fn<typeof fetch>()
      .mockResolvedValueOnce(new Response(JSON.stringify({ status: "queued" })))
      .mockResolvedValueOnce(new Response(JSON.stringify({
        status: "completed",
        steps: [{ type: "model_output", content: [{ type: "text", text: safeRaw }] }],
      })));
    const model = new GoogleGemmaModel({ apiKey: "key", fetchImpl: fetchMock });
    await expect(generateApprovedQuest(DEFAULT_INPUT, model)).resolves.toMatchObject({ source: "gemma" });
    expect(fetchMock).toHaveBeenCalledTimes(2);
    for (const [, init] of fetchMock.mock.calls) {
      expect(JSON.parse(String(init?.body))).toMatchObject({ store: false });
    }
  });

  it("falls back after two approval failures", async () => {
    vi.spyOn(console, "info").mockImplementation(() => undefined);
    const model = sequenceModel("bad", unsafeRaw);
    await expect(generateApprovedQuest(DEFAULT_INPUT, model)).resolves.toMatchObject({ source: "fallback" });
    expect(model.generateQuest).toHaveBeenCalledTimes(2);
  });

  it("returns a hard error only when fallback approval fails", async () => {
    vi.spyOn(console, "info").mockImplementation(() => undefined);
    const model = sequenceModel(new Error("one"), new Error("two"));
    const invalidFallback = () => ({ ...safeQuest, tasks: [{ ...safeQuest.tasks[0], instruction: "Climb a wall." }, ...safeQuest.tasks.slice(1)] });
    await expect(generateApprovedQuest(DEFAULT_INPUT, model, invalidFallback)).rejects.toBeInstanceOf(QuestGenerationError);
    expect(model.generateQuest).toHaveBeenCalledTimes(2);
  });
});
