import { z } from "zod";
import { VerificationResultSchema } from "../quests/schema";

export const EvidenceVerificationResponseSchema = z.object({
  result: VerificationResultSchema,
  status: z.enum(["verified", "uncertain"]),
});

export type EvidenceVerificationResponse = z.infer<typeof EvidenceVerificationResponseSchema>;
export type EvidenceCompletionStatus = "verified" | "not_verified" | "verification_unavailable";
