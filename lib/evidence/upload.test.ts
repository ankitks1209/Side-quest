import { describe, expect, it } from "vitest";
import { MAX_EVIDENCE_IMAGE_BYTES, validateEvidenceFormData } from "./upload";

const signatures = {
  "image/jpeg": [0xff, 0xd8, 0xff, 0x00],
  "image/png": [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a],
  "image/webp": [0x52, 0x49, 0x46, 0x46, 0, 0, 0, 0, 0x57, 0x45, 0x42, 0x50],
} as const;

function form(type: keyof typeof signatures, bytes: readonly number[] = signatures[type]) {
  const data = new FormData();
  data.set("image", new File([new Uint8Array(bytes)], "evidence", { type }));
  data.set("instruction", "Find a pattern.");
  data.set("verificationCriterion", "A repeating pattern is visible.");
  return data;
}

describe("evidence upload validation", () => {
  it.each(Object.keys(signatures) as Array<keyof typeof signatures>)("accepts genuine %s", async (type) => {
    await expect(validateEvidenceFormData(form(type))).resolves.toMatchObject({ mimeType: type });
  });

  it("rejects unsupported and missing images", async () => {
    const unsupported = form("image/jpeg");
    unsupported.set("image", new File(["GIF89a"], "image.gif", { type: "image/gif" }));
    await expect(validateEvidenceFormData(unsupported)).rejects.toThrow("unsupported_image");
    await expect(validateEvidenceFormData(new FormData())).rejects.toThrow("invalid_image");
  });

  it("rejects MIME/signature mismatches and fake images", async () => {
    await expect(validateEvidenceFormData(form("image/jpeg", signatures["image/png"]))).rejects.toThrow("image_signature_mismatch");
    await expect(validateEvidenceFormData(form("image/jpeg", [1, 2, 3]))).rejects.toThrow("image_signature_mismatch");
  });

  it("rejects oversized images", async () => {
    const data = form("image/jpeg", new Array(MAX_EVIDENCE_IMAGE_BYTES + 1).fill(0xff));
    await expect(validateEvidenceFormData(data)).rejects.toThrow("image_too_large");
  });

  it.each([
    ["instruction", ""],
    ["instruction", "x".repeat(501)],
    ["verificationCriterion", ""],
    ["verificationCriterion", "x".repeat(501)],
  ])("rejects invalid %s", async (field, value) => {
    const data = form("image/png");
    data.set(field, value);
    await expect(validateEvidenceFormData(data)).rejects.toThrow();
  });
});
