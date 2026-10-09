import { describe, expect, it, vi } from "vitest";
import type { EvidenceVerifier, EvidenceVerificationInput } from "@/lib/ai/evidence-verifier";
import { classifyVerification, VERIFICATION_CONFIDENCE_THRESHOLD } from "./policy";
import { EvidenceVerificationResponseSchema } from "./schema";
import { verifyEvidence } from "./verification";

const input: EvidenceVerificationInput = { imageBytes: new Uint8Array([1]), mimeType: "image/jpeg", instruction: "task", verificationCriterion: "criterion" };
const raw = (verified: boolean, confidence: number) => JSON.stringify({ verified, confidence, reason: "Visible evidence assessed." });
function sequence(...values: Array<string | Error>): EvidenceVerifier & { verify: ReturnType<typeof vi.fn> } {
  const verify = vi.fn(async () => {
    const value = values.shift();
    if (value instanceof Error) throw value;
    if (value === undefined) throw new Error("unexpected_call");
    return value;
  });
  return { verify };
}

describe("evidence verification policy", () => {
  it("centralizes the 0.75 confidence boundary", () => {
    expect(VERIFICATION_CONFIDENCE_THRESHOLD).toBe(0.75);
    expect(classifyVerification({ verified: true, confidence: 0.9, reason: "yes" })).toBe("verified");
    expect(classifyVerification({ verified: true, confidence: 0.74, reason: "low" })).toBe("uncertain");
    expect(classifyVerification({ verified: false, confidence: 0.95, reason: "no" })).toBe("uncertain");
    expect(classifyVerification({ verified: false, confidence: 0.2, reason: "no" })).toBe("uncertain");
  });

  it("does not retry valid uncertain output", async () => {
    const verifier = sequence(raw(false, 0.4));
    await expect(verifyEvidence(input, verifier)).resolves.toMatchObject({ status: "uncertain" });
    expect(verifier.verify).toHaveBeenCalledTimes(1);
  });

  it("retries one technical or malformed failure then succeeds", async () => {
    const verifier = sequence(new Error("timeout"), raw(true, 0.9));
    await expect(verifyEvidence(input, verifier)).resolves.toMatchObject({ status: "verified" });
    expect(verifier.verify).toHaveBeenCalledTimes(2);
    const malformed = sequence("not-json", raw(true, 0.9));
    await expect(verifyEvidence(input, malformed)).resolves.toMatchObject({ status: "verified" });
    expect(malformed.verify).toHaveBeenCalledTimes(2);
  });

  it("fails after exactly two technical failures", async () => {
    const verifier = sequence(new Error("one"), new Error("two"));
    await expect(verifyEvidence(input, verifier)).rejects.toThrow("evidence_verification_unavailable");
    expect(verifier.verify).toHaveBeenCalledTimes(2);
  });

  it("validates server and client response shape", () => {
    expect(EvidenceVerificationResponseSchema.safeParse({ result: JSON.parse(raw(true, 0.9)), status: "verified" }).success).toBe(true);
    expect(EvidenceVerificationResponseSchema.safeParse({ result: {}, status: "verified" }).success).toBe(false);
    expect(EvidenceVerificationResponseSchema.safeParse({ result: JSON.parse(raw(true, 0.9)), status: "maybe" }).success).toBe(false);
  });
});
