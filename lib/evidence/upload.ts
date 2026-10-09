import type { EvidenceVerificationInput } from "../ai/evidence-verifier";

export const MAX_EVIDENCE_IMAGE_BYTES = 5 * 1024 * 1024;
export const MAX_EVIDENCE_TEXT_LENGTH = 500;
const MIME_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
type EvidenceMimeType = (typeof MIME_TYPES)[number];

export class EvidenceUploadError extends Error {
  constructor(public readonly code: string) {
    super(code);
    this.name = "EvidenceUploadError";
  }
}

function matchesSignature(bytes: Uint8Array, mimeType: EvidenceMimeType): boolean {
  if (mimeType === "image/jpeg") return bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (mimeType === "image/png") {
    const png = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
    return bytes.length >= png.length && png.every((value, index) => bytes[index] === value);
  }
  return bytes.length >= 12
    && String.fromCharCode(...bytes.slice(0, 4)) === "RIFF"
    && String.fromCharCode(...bytes.slice(8, 12)) === "WEBP";
}

function requiredText(value: FormDataEntryValue | null, code: string): string {
  if (typeof value !== "string") throw new EvidenceUploadError(code);
  const text = value.trim();
  if (!text || text.length > MAX_EVIDENCE_TEXT_LENGTH) throw new EvidenceUploadError(code);
  return text;
}

export async function validateEvidenceFormData(formData: FormData): Promise<EvidenceVerificationInput> {
  const image = formData.get("image");
  if (!(image instanceof File) || image.size === 0) throw new EvidenceUploadError("invalid_image");
  if (image.size > MAX_EVIDENCE_IMAGE_BYTES) throw new EvidenceUploadError("image_too_large");
  if (!MIME_TYPES.includes(image.type as EvidenceMimeType)) throw new EvidenceUploadError("unsupported_image");

  const mimeType = image.type as EvidenceMimeType;
  const imageBytes = new Uint8Array(await image.arrayBuffer());
  if (!matchesSignature(imageBytes, mimeType)) throw new EvidenceUploadError("image_signature_mismatch");

  return {
    imageBytes,
    mimeType,
    instruction: requiredText(formData.get("instruction"), "invalid_instruction"),
    verificationCriterion: requiredText(formData.get("verificationCriterion"), "invalid_criterion"),
  };
}
