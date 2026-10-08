import { buildQuestPrompt } from "../../prompts/quest";
import type { QuestInput } from "../quests/schema";
import type { QuestModel } from "./quest-model";
import { extractGoogleInteractionText, GoogleInteractionError } from "./google-interactions";

const DEFAULT_BASE_URL = "https://generativelanguage.googleapis.com/v1beta";
const DEFAULT_MODEL = "gemma-4-26b-a4b-it";
const TIMEOUT_MS = 20_000;

export type GoogleGemmaConfig = {
  apiKey?: string;
  baseUrl?: string;
  model?: string;
  fetchImpl?: typeof fetch;
};

export type GoogleGemmaFailureCode =
  | "configuration_missing"
  | "timeout"
  | "network_failure"
  | "http_failure"
  | "response_json_failure";

export class GoogleGemmaError extends Error {
  constructor(public readonly code: GoogleGemmaFailureCode) {
    super(code);
    this.name = "GoogleGemmaError";
  }
}

export class GoogleGemmaModel implements QuestModel {
  private readonly apiKey: string | undefined;
  private readonly baseUrl: string;
  private readonly model: string;
  private readonly fetchImpl: typeof fetch;

  constructor(config: GoogleGemmaConfig = {}) {
    this.apiKey = config.apiKey ?? process.env.GEMMA_API_KEY;
    this.baseUrl = (config.baseUrl ?? process.env.GEMMA_BASE_URL ?? DEFAULT_BASE_URL).replace(/\/$/, "");
    this.model = config.model ?? process.env.GEMMA_MODEL ?? DEFAULT_MODEL;
    this.fetchImpl = config.fetchImpl ?? fetch;
  }

  async generateQuest(input: QuestInput): Promise<string> {
    if (!this.apiKey) throw new GoogleGemmaError("configuration_missing");

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
          input: buildQuestPrompt(input),
          store: false,
          generation_config: { thinking_level: "minimal" },
        }),
        signal: controller.signal,
      });

      if (!response.ok) throw new GoogleGemmaError("http_failure");
      let payload: unknown;
      try {
        payload = await response.json();
      } catch {
        throw new GoogleGemmaError("response_json_failure");
      }
      return extractGoogleInteractionText(payload);
    } catch (error) {
      if (error instanceof GoogleGemmaError || error instanceof GoogleInteractionError) throw error;
      if (controller.signal.aborted) throw new GoogleGemmaError("timeout");
      throw new GoogleGemmaError("network_failure");
    } finally {
      clearTimeout(timeout);
    }
  }
}
