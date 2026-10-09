import type { EvidenceVerifier, EvidenceVerificationInput } from "../ai/evidence-verifier";
import { approveVerificationCandidate } from "./approval";
import { classifyVerification } from "./policy";
import { EvidenceVerificationResponseSchema, type EvidenceVerificationResponse } from "./schema";

export class EvidenceVerificationError extends Error {
  constructor() {
    super("evidence_verification_unavailable");
    this.name = "EvidenceVerificationError";
  }
}

export async function verifyEvidence(
  input: EvidenceVerificationInput,
  verifier: EvidenceVerifier,
): Promise<EvidenceVerificationResponse> {
  for (let attempt = 1; attempt <= 2; attempt += 1) {
    try {
      const result = approveVerificationCandidate(await verifier.verify(input));
      if (!result) throw new EvidenceVerificationError();
      return EvidenceVerificationResponseSchema.parse({ result, status: classifyVerification(result) });
    } catch {
      if (attempt === 2) throw new EvidenceVerificationError();
    }
  }
  throw new EvidenceVerificationError();
}
