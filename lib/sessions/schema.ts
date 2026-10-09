import { z } from "zod";
import { QuestSchema, QuestSessionSchema } from "../quests/schema";

export const ActiveSessionRecordSchema = z.object({
  version: z.literal(1),
  quest: QuestSchema,
  questSession: QuestSessionSchema,
  phase: z.enum(["active", "evidence"]),
  visibleSegmentStartedAt: z.number().int().nonnegative().nullable(),
}).superRefine((record, context) => {
  if (record.quest.id !== record.questSession.questId) {
    context.addIssue({ code: "custom", path: ["questSession", "questId"], message: "Session quest must match the persisted quest." });
  }
  if (record.questSession.completedAt !== undefined) {
    context.addIssue({ code: "custom", path: ["questSession", "completedAt"], message: "An active session cannot already be complete." });
  }
});

export type ActiveSessionRecord = z.infer<typeof ActiveSessionRecordSchema>;
