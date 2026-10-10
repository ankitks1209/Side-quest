# Deterministic business and safety rules

Every future quest must fit the selected duration, match mood and environment, contain 2–3 tasks, use approved primitives, minimize screen interaction, require no purchase and no special equipment. Exactly one task is photo-verifiable; remaining tasks are self-reported. Photos should focus on objects or scenery, not identifiable strangers. No exact location dependency.

Approved primitives: PHOTO_OBJECT, FIND_NATURE, OBSERVE_PATTERN, OBSERVE_COLOR, COMPARE, LISTEN, WALK_DURATION, REFLECT. Do not invent primitives without explicit human instruction and contract/schema/safety/test updates.

Never allow: trespassing; private property; construction zones; rail tracks; unsafe traffic interaction; dangerous road crossing; climbing; entering water; abandoned buildings; approaching or handling wildlife; touching unknown plants/fungi; eating unknown plants/berries/fungi; following strangers; closing eyes outdoors; dangerous night exploration; extreme physical activity; illegal activity; dangerous tools/weapons/fire.

Use accessible public places and observation from safe paths. Users may skip a task when conditions are unsafe. Walking is comfortable and optional, with rest time inside the duration budget. Historically, Plan 1 used curated fixtures only. The current model approval boundary below includes a deterministic rule-based safety filter; it is not an exhaustive semantic safety system.

## Quest approval pipeline
model output → schema validation → primitive validation → deterministic safety validation → approved quest

The language model is NOT the final safety authority. Schema validation alone is not semantic safety validation. Reject unsafe/ambiguous output; retry once and then use a safe fixture fallback compatible with the input. Never display raw output. This deterministic boundary is implemented in `lib/quests/approval.ts` and `lib/quests/safety.ts`.

## Evidence verification
Exactly one photo is checked against the photo task's single criterion. SideQuest accepts JPEG, PNG or WebP up to 5 MB and validates both declared MIME and file signature. Gemini output is untrusted until JSON parsing and `VerificationResultSchema` validation. A result is verified only when the model returns `verified: true` with confidence at least 0.75. All other valid results are uncertain. Technical failures retry once. Uncertain or unavailable verification never blocks completion, and the photo task counts only when verified.

## Away Ratio contract
estimatedAwayMs = max(0, totalDurationMs - clampedActiveScreenMs)
awayRatio = estimatedAwayMs / totalDurationMs (0 when duration is 0)

Measurement runs from Begin through Completion using SideQuest document visibility. `activeScreenMs` accumulates visible segments; hidden elapsed time is estimated away. Clamp active time to total duration and return ratio 0 for zero-duration sessions. Never cap elapsed time at the selected duration or adjust a low score. It is an estimate, never device-wide screen-time tracking.
