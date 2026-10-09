import type { VerificationResult } from "../quests/schema";

export const VERIFICATION_CONFIDENCE_THRESHOLD = 0.75;

export function classifyVerification(result: VerificationResult): "verified" | "uncertain" {
  return result.verified && result.confidence >= VERIFICATION_CONFIDENCE_THRESHOLD
    ? "verified"
    : "uncertain";
}
