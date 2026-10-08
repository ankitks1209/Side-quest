import type { QuestInput } from "../quests/schema";

export interface QuestModel {
  generateQuest(input: QuestInput): Promise<string>;
}
