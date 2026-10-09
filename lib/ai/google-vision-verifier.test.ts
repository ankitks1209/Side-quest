import { describe, expect, it, vi } from "vitest";
import { GoogleVisionVerifier } from "./google-vision-verifier";
import type { EvidenceVerificationInput } from "./evidence-verifier";

const input: EvidenceVerificationInput = {
  imageBytes: new Uint8Array([0xff, 0xd8, 0xff]),
  mimeType: "image/jpeg",
  instruction: "Find a pattern.",
  verificationCriterion: "A pattern is visible.",
};

describe("GoogleVisionVerifier", () => {
  it("sends one stateless image request and returns final ordered text", async () => {
    const fetchMock = vi.fn<typeof fetch>(async () => new Response(JSON.stringify({
      status: "completed",
      steps: [
        { type: "model_output", content: [{ type: "text", text: "old" }] },
        { type: "model_output", content: [{ type: "text", text: "{\"verified\":" }, { type: "text", text: "true}" }] },
      ],
    })));
    const verifier = new GoogleVisionVerifier({ apiKey: "secret", baseUrl: "https://example.test/v1beta/", model: "gemini-3.7-flash", fetchImpl: fetchMock });
    await expect(verifier.verify(input)).resolves.toBe('{"verified":true}');
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://example.test/v1beta/interactions");
    expect(init?.headers).toEqual({ "Content-Type": "application/json", "x-goog-api-key": "secret" });
    const body = JSON.parse(String(init?.body)) as Record<string, unknown>;
    expect(body).toMatchObject({ model: "gemini-3.7-flash", store: false });
    expect(JSON.stringify(body)).not.toContain("secret");
    expect(body).not.toHaveProperty("previous_interaction_id");
  });

  it.each(["queued", "in_progress", "requires_action", "failed", "cancelled", "incomplete", "unknown"])("rejects %s", async (status) => {
    const fetchMock = vi.fn<typeof fetch>(async () => new Response(JSON.stringify({ status })));
    await expect(new GoogleVisionVerifier({ apiKey: "key", fetchImpl: fetchMock }).verify(input)).rejects.toThrow("non_completed_status");
  });

  it("rejects missing status, model output, HTTP errors and invalid JSON", async () => {
    for (const response of [
      new Response(JSON.stringify({ steps: [] })),
      new Response(JSON.stringify({ status: "completed", steps: [] })),
      new Response("no", { status: 503 }),
      new Response("not json"),
    ]) {
      const fetchMock = vi.fn<typeof fetch>(async () => response);
      await expect(new GoogleVisionVerifier({ apiKey: "key", fetchImpl: fetchMock }).verify(input)).rejects.toThrow();
    }
  });
});
