import { z } from "zod";
import { QUEST_PRIMITIVES } from "./primitives";

export const QuestDurationSchema = z.union([z.literal(15), z.literal(30), z.literal(60)]);
export const QuestMoodSchema = z.enum(["explore", "relax", "move", "notice"]);
export const QuestEnvironmentSchema = z.enum(["city", "park", "anywhere"]);
export const QuestPrimitiveSchema = z.enum(QUEST_PRIMITIVES);
const nonblank = z.string().trim().min(1);

export const QuestInputSchema = z.object({
  durationMinutes: QuestDurationSchema,
  mood: QuestMoodSchema,
  environment: QuestEnvironmentSchema,
});

export const QuestTaskSchema = z.object({
  id: nonblank,
  primitive: QuestPrimitiveSchema,
  instruction: nonblank,
  verificationRequired: z.boolean(),
  verificationCriterion: nonblank.optional(),
}).superRefine((task, context) => {
  if (task.verificationRequired && !task.verificationCriterion) {
    context.addIssue({ code: "custom", path: ["verificationCriterion"], message: "A photo task needs a verification criterion." });
  }
});

export const QuestSchema = QuestInputSchema.extend({
  id: nonblank,
  title: nonblank,
  intro: nonblank,
  tasks: z.array(QuestTaskSchema).min(2).max(3),
}).superRefine((quest, context) => {
  if (quest.tasks.filter((task) => task.verificationRequired).length !== 1) {
    context.addIssue({ code: "custom", path: ["tasks"], message: "Exactly one task requires photo verification." });
  }
  if (new Set(quest.tasks.map((task) => task.id)).size !== quest.tasks.length) {
    context.addIssue({ code: "custom", path: ["tasks"], message: "Task IDs must be unique." });
  }
});

export const VerificationResultSchema = z.object({
  verified: z.boolean(), confidence: z.number().min(0).max(1), reason: nonblank,
});
export const QuestSessionSchema = z.object({
  questId: nonblank,
  startedAt: z.number().int().nonnegative(),
  completedAt: z.number().int().nonnegative().optional(),
  activeScreenMs: z.number().nonnegative(),
  completedTaskIds: z.array(nonblank),
  verificationResults: z.record(z.string(), VerificationResultSchema),
});
export const QuestSummarySchema = z.object({
  totalDurationMs: z.number().nonnegative(), activeScreenMs: z.number().nonnegative(),
  estimatedAwayMs: z.number().nonnegative(), awayRatio: z.number().min(0).max(1),
  completedTasks: z.number().int().nonnegative(), xp: z.number().int().nonnegative().optional(),
});
export type QuestDuration = z.infer<typeof QuestDurationSchema>;
export type QuestMood = z.infer<typeof QuestMoodSchema>;
export type QuestEnvironment = z.infer<typeof QuestEnvironmentSchema>;
export type QuestPrimitive = z.infer<typeof QuestPrimitiveSchema>;
export type QuestInput = z.infer<typeof QuestInputSchema>;
export type QuestTask = z.infer<typeof QuestTaskSchema>;
export type Quest = z.infer<typeof QuestSchema>;
export type VerificationResult = z.infer<typeof VerificationResultSchema>;
export type QuestSession = z.infer<typeof QuestSessionSchema>;
export type QuestSummary = z.infer<typeof QuestSummarySchema>;
