import { QuestInputSchema, type QuestInput } from "../quests/schema";
const KEY = "sidequest:setup:v1";
export function loadPreferences(): { input: QuestInput | null; warning: string | null } {
  try {
    const stored = localStorage.getItem(KEY);
    if (!stored) return { input: null, warning: null };
    const parsed = QuestInputSchema.safeParse(JSON.parse(stored));
    return parsed.success ? { input: parsed.data, warning: null }
      : { input: null, warning: "Saved choices could not be read. Choose them again below." };
  } catch {
    return { input: null, warning: "Saved choices are unavailable. You can still take a SideQuest." };
  }
}
export function savePreferences(input: QuestInput): string | null {
  try {
    localStorage.setItem(KEY, JSON.stringify(QuestInputSchema.parse(input)));
    return null;
  } catch {
    return "Your choices could not be saved on this device. Your quest still works.";
  }
}
