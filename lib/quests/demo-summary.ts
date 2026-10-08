import { QuestSummarySchema } from "./schema";

// Fixed presentation data, deliberately unrelated to live session timing.
export function createDemoSummary(completedTasks: number) {
  return QuestSummarySchema.parse({
    totalDurationMs: 1_385_000,
    activeScreenMs: 51_000,
    estimatedAwayMs: 1_334_000,
    awayRatio: 1_334_000 / 1_385_000,
    completedTasks,
  });
}
