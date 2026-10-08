import { z } from "zod";
import { QuestSchema } from "./schema";

export const QuestGenerationResponseSchema = z.object({
  quest: QuestSchema,
  source: z.enum(["gemma", "fallback"]),
});

export type QuestGenerationResponse = z.infer<typeof QuestGenerationResponseSchema>;
