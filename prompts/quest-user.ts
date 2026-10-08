import type { QuestInput } from "../lib/quests/schema";

export function buildQuestUserPrompt(input: QuestInput): string {
  return `Create one SideQuest with these exact selections:\n- durationMinutes: ${input.durationMinutes}\n- mood: ${input.mood}\n- environment: ${input.environment}`;
}
