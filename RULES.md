# Deterministic business and safety rules

Every future quest must fit the selected duration, match mood and environment, contain 2–3 tasks, use approved primitives, minimize screen interaction, require no purchase and no special equipment. Exactly one task is photo-verifiable; remaining tasks are self-reported. Photos should focus on objects or scenery, not identifiable strangers. No exact location dependency.

Approved primitives: PHOTO_OBJECT, FIND_NATURE, OBSERVE_PATTERN, OBSERVE_COLOR, COMPARE, LISTEN, WALK_DURATION, REFLECT. Do not invent primitives without explicit human instruction and contract/schema/safety/test updates.

Never allow: trespassing; private property; construction zones; rail tracks; unsafe traffic interaction; dangerous road crossing; climbing; entering water; abandoned buildings; approaching or handling wildlife; touching unknown plants/fungi; eating unknown plants/berries/fungi; following strangers; closing eyes outdoors; dangerous night exploration; extreme physical activity; illegal activity; dangerous tools/weapons/fire.

Use accessible public places and observation from safe paths. Users may skip a task when conditions are unsafe. Walking is comfortable and optional, with rest time inside the duration budget. Plan 1 uses curated fixtures, not generated instructions; this does not constitute an implemented general-purpose safety validator.

## Quest approval pipeline
model output → schema validation → primitive validation → deterministic safety validation → approved quest

The language model is NOT the final safety authority. Schema validation alone is not semantic safety validation. Reject unsafe/ambiguous output; retry once and then use a safe fixture fallback compatible with the input. Never display raw output. This deterministic boundary is implemented in `lib/quests/approval.ts` and `lib/quests/safety.ts`.

## Away Ratio contract
estimatedAwayMs = max(0, totalDurationMs - clampedActiveScreenMs)
awayRatio = estimatedAwayMs / totalDurationMs (0 when duration is 0)

Future measurement uses app visibility/session timing only. It is an estimate, never device-wide screen-time tracking. Plan 1 has clearly marked demo metrics only.
