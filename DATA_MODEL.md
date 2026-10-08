# Domain and persistence contract

Runtime authority: lib/quests/schema.ts; TypeScript types are inferred from Zod.

| Type | Fields / values |
| --- | --- |
| QuestDuration | 15 · 30 · 60 |
| QuestMood | explore · relax · move · notice |
| QuestEnvironment | city · park · anywhere |
| QuestPrimitive | PHOTO_OBJECT · FIND_NATURE · OBSERVE_PATTERN · OBSERVE_COLOR · COMPARE · LISTEN · WALK_DURATION · REFLECT |
| QuestInput | durationMinutes, mood, environment |
| QuestTask | id, primitive, instruction, verificationRequired, verificationCriterion? (required and nonblank if verificationRequired) |
| Quest | id, title, intro, durationMinutes, mood, environment, tasks (2–3) |
| VerificationResult | verified: boolean, confidence: 0–1, reason: nonblank string |
| QuestSession | questId, startedAt (epoch ms), completedAt? (epoch ms), activeScreenMs, completedTaskIds, verificationResults (task-ID → VerificationResult) |
| QuestSummary | totalDurationMs, activeScreenMs, estimatedAwayMs, awayRatio (0–1), completedTasks (count), xp? |

Quest/task IDs are nonblank; task IDs must be unique within a quest. Exactly one task requires photo verification. Schema checks structure, not full safety or semantic compatibility. All mock inputs are parsed; fixture selection preserves duration/mood/environment and approved primitives.

V1 persistence is localStorage only. Plan 1 persists validated QuestInput preferences under a versioned key, never photos. Flow state and local photo previews are ephemeral; reload returns to Landing. Storage failure leaves the flow usable and gives a friendly warning.

No User/Profile/Auth entity. No cloud synchronization. No real visibility/session tracker yet. Plan 1 verification and QuestSummary metrics are demo values, not measured results.
