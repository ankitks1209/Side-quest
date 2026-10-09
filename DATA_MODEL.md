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
| VerificationResult | verified: boolean, confidence: 0–1, reason: nonblank string up to 300 characters |
| EvidenceVerificationResponse | result: VerificationResult, status: verified \| uncertain |
| EvidenceCompletionStatus | verified \| not_verified \| verification_unavailable |
| QuestSession | questId, startedAt (epoch ms), completedAt? (epoch ms), activeScreenMs, completedTaskIds, verificationResults (task-ID → VerificationResult) |
| QuestSummary | totalDurationMs, activeScreenMs, estimatedAwayMs, awayRatio (0–1), completedTasks (count), xp? |
| QuestGenerationResponse | quest, source: gemma \| fallback |
| ActiveSessionRecord | version: 1, quest, questSession, phase: active \| evidence, visibleSegmentStartedAt: epoch ms \| null |

Quest/task IDs are nonblank; task IDs must be unique within a quest. Exactly one task requires photo verification. Schema checks structure, not full safety or semantic compatibility. All mock inputs are parsed; fixture selection preserves duration/mood/environment and approved primitives.

V1 persistence is localStorage only. Validated setup preferences and one versioned active-session record may persist. Active and Evidence phases restore after refresh; Completion history does not. Storage failure leaves the in-memory flow usable and gives at most one friendly recovery warning.

No User/Profile/Auth entity. No cloud synchronization or multi-tab coordination. `activeScreenMs` is cumulative time when SideQuest was visible between Begin and Completion. QuestSummary timing values are measured from the active session and are not capped at the selected duration.

Evidence photos are request-only data. SideQuest does not persist the uploaded evidence image. It is sent to Google for verification with `store:false`. Validated verification results and self-reported task IDs may persist for active-session recovery.

Generated quest data remains untrusted until it passes JSON parsing, `QuestSchema`, request compatibility and deterministic safety. Provider metadata stays outside `Quest`; the client validates `QuestGenerationResponse` before placing a quest in React state.
