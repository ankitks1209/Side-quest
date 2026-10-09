import { buildEvidenceVerificationPrompt } from "../../prompts/evidence-verification";
import { extractGoogleInteractionText, GoogleInteractionError } from "./google-interactions";
import type { EvidenceVerifier, EvidenceVerificationInput } from "./evidence-verifier";

const DEFAULT_BASE_URL = "https://generativelanguage.googleapis.com/v1beta";
const DEFAULT_MODEL = "gemini-3.7-flash";
const TIMEOUT_MS = 20_000;

export type GoogleVisionConfig = {
  apiKey?: string;
  baseUrl?: string;
  model?: string;
  fetchImpl?: typeof fetch;
};

export type GoogleVisionFailureCode =
  | "configuration_missing"
  | "timeout"
  | "network_failure"
  | "http_failure"
  | "response_json_failure";

export class GoogleVisionError extends Error {
  constructor(public readonly code: GoogleVisionFailureCode) {
    super(code);
    this.name = "GoogleVisionError";
  }
}

export class GoogleVisionVerifier implements EvidenceVerifier {
  private readonly apiKey: string | undefined;
  private readonly baseUrl: string;
  private readonly model: string;
  private readonly fetchImpl: typeof fetch;

  constructor(config: GoogleVisionConfig = {}) {
    this.apiKey = config.apiKey ?? process.env.GEMMA_API_KEY;
    this.baseUrl = (config.baseUrl ?? process.env.GEMMA_BASE_URL ?? DEFAULT_BASE_URL).replace(/\/$/, "");
    this.model = config.model ?? process.env.VISION_MODEL ?? DEFAULT_MODEL;
    this.fetchImpl = config.fetchImpl ?? fetch;
  }

  async verify(input: EvidenceVerificationInput): Promise<string> {
    if (!this.apiKey) throw new GoogleVisionError("configuration_missing");

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      const response = await this.fetchImpl(`${this.baseUrl}/interactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": this.apiKey,
        },
        body: JSON.stringify({
          model: this.model,
          store: false,
          input: [
            { type: "text", text: buildEvidenceVerificationPrompt(input.instruction, input.verificationCriterion) },
            { type: "image", data: Buffer.from(input.imageBytes).toString("base64"), mime_type: input.mimeType },
          ],
        }),
        signal: controller.signal,
      });
      if (!response.ok) throw new GoogleVisionError("http_failure");
      let payload: unknown;
      try {
        payload = await response.json();
      } catch {
        throw new GoogleVisionError("response_json_failure");
      }
      return extractGoogleInteractionText(payload);
    } catch (error) {
      if (error instanceof GoogleVisionError || error instanceof GoogleInteractionError) throw error;
      if (controller.signal.aborted) throw new GoogleVisionError("timeout");
      throw new GoogleVisionError("network_failure");
    } finally {
      clearTimeout(timeout);
    }
  }
}
