import { QuestSchema, type Quest, type QuestInput } from "./schema";
import { validateQuestSafety } from "./safety";

export type ApprovalFailureCode = "json" | "schema" | "input_mismatch" | "safety";
export type QuestApprovalResult =
  | { approved: true; quest: Quest }
  | { approved: false; code: ApprovalFailureCode };

function extractJsonCandidate(rawText: string): string | null {
  const trimmed = rawText.trim();
  if (!trimmed) return null;
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  return fenced ? fenced[1].trim() : trimmed;
}

export function validateQuestMatchesInput(quest: Quest, input: QuestInput): boolean {
  return quest.durationMinutes === input.durationMinutes
    && quest.mood === input.mood
    && quest.environment === input.environment;
}

export function approveQuestCandidate(rawText: string, input: QuestInput): QuestApprovalResult {
  const candidate = extractJsonCandidate(rawText);
  if (!candidate) return { approved: false, code: "json" };

  let value: unknown;
  try {
    value = JSON.parse(candidate);
  } catch {
    return { approved: false, code: "json" };
  }

  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return { approved: false, code: "json" };
  }
  const parsed = QuestSchema.safeParse(value);
  if (!parsed.success) return { approved: false, code: "schema" };
  if (!validateQuestMatchesInput(parsed.data, input)) {
    return { approved: false, code: "input_mismatch" };
  }
  if (!validateQuestSafety(parsed.data).safe) {
    return { approved: false, code: "safety" };
  }
  return { approved: true, quest: parsed.data };
}
