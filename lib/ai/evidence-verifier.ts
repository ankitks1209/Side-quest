export type EvidenceVerificationInput = {
  imageBytes: Uint8Array;
  mimeType: "image/jpeg" | "image/png" | "image/webp";
  instruction: string;
  verificationCriterion: string;
};

export interface EvidenceVerifier {
  verify(input: EvidenceVerificationInput): Promise<string>;
}
