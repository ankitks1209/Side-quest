import type { QuestInput } from "../lib/quests/schema";
import { QUEST_SYSTEM_PROMPT } from "./quest-system";
import { buildQuestUserPrompt } from "./quest-user";

export function buildQuestPrompt(input: QuestInput): string {
  return `${QUEST_SYSTEM_PROMPT}\n\n${buildQuestUserPrompt(input)}`;
}
