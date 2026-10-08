import type { QuestModel } from "@/lib/ai/quest-model";
import { approveQuestCandidate } from "./approval";
import { selectMockQuest } from "./fixtures";
import { QuestGenerationResponseSchema, type QuestGenerationResponse } from "./generation-schema";
import type { Quest, QuestInput } from "./schema";

type FallbackSelector = (input: QuestInput) => Quest;

export class QuestGenerationError extends Error {
  constructor() {
    super("quest_generation_unavailable");
    this.name = "QuestGenerationError";
  }
}

function event(name: string, details: Record<string, string | number> = {}) {
  console.info("[sidequest:generation]", name, details);
}

function failureCode(error: unknown): string {
  if (error instanceof Error && "code" in error && typeof error.code === "string") return error.code;
  return error instanceof Error ? error.name : "unknown_provider_failure";
}

export async function generateApprovedQuest(
  input: QuestInput,
  model: QuestModel,
  fallbackSelector: FallbackSelector = selectMockQuest,
): Promise<QuestGenerationResponse> {
  event("generation_started");
  for (let attempt = 1; attempt <= 2; attempt += 1) {
    event("attempt_started", { attempt });
    try {
      const rawText = await model.generateQuest(input);
      const approval = approveQuestCandidate(rawText, input);
      if (approval.approved) {
        event("request_succeeded", { attempt, source: "gemma" });
        return QuestGenerationResponseSchema.parse({ quest: approval.quest, source: "gemma" });
      }
      event("candidate_rejected", { attempt, reason: approval.code });
    } catch (error) {
      event("provider_attempt_failed", { attempt, reason: failureCode(error) });
    }
    if (attempt === 1) event("retry_started", { attempt: 2 });
  }

  event("fallback_selected");
  try {
    const fallback = fallbackSelector(input);
    const approval = approveQuestCandidate(JSON.stringify(fallback), input);
    if (!approval.approved) {
      event("fallback_rejected", { reason: approval.code });
      throw new QuestGenerationError();
    }
    event("request_succeeded", { source: "fallback" });
    return QuestGenerationResponseSchema.parse({ quest: approval.quest, source: "fallback" });
  } catch (error) {
    if (!(error instanceof QuestGenerationError)) event("fallback_rejected");
    throw new QuestGenerationError();
  }
}
