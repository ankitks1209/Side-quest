import { z } from "zod";

const TextContentSchema = z.object({
  type: z.literal("text"),
  text: z.string(),
});

const StepSchema = z.object({
  type: z.string(),
  content: z.array(z.unknown()).optional(),
});

const InteractionSchema = z.object({
  status: z.string(),
  steps: z.array(StepSchema).optional(),
});

export type GoogleInteractionFailureCode =
  | "malformed_response"
  | "non_completed_status"
  | "missing_model_output"
  | "empty_model_output";

export class GoogleInteractionError extends Error {
  constructor(public readonly code: GoogleInteractionFailureCode) {
    super(code);
    this.name = "GoogleInteractionError";
  }
}

export function extractGoogleInteractionText(value: unknown): string {
  const parsed = InteractionSchema.safeParse(value);
  if (!parsed.success) throw new GoogleInteractionError("malformed_response");
  if (parsed.data.status !== "completed") {
    throw new GoogleInteractionError("non_completed_status");
  }

  const modelOutputs = (parsed.data.steps ?? []).filter(
    (step) => step.type === "model_output",
  );
  const finalOutput = modelOutputs.at(-1);
  if (!finalOutput) throw new GoogleInteractionError("missing_model_output");

  const text = (finalOutput.content ?? [])
    .flatMap((block) => {
      const result = TextContentSchema.safeParse(block);
      return result.success && result.data.text.trim().length > 0 ? [result.data.text] : [];
    })
    .join("")
    .trim();

  if (!text) throw new GoogleInteractionError("empty_model_output");
  return text;
}
