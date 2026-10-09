import { VerificationResultSchema, type VerificationResult } from "../quests/schema";

function extractJsonCandidate(rawText: string): string | null {
  const trimmed = rawText.trim();
  if (!trimmed) return null;
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  return fenced ? fenced[1].trim() : trimmed;
}

export function approveVerificationCandidate(rawText: string): VerificationResult | null {
  const candidate = extractJsonCandidate(rawText);
  if (!candidate) return null;
  try {
    const parsed = VerificationResultSchema.safeParse(JSON.parse(candidate));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}
