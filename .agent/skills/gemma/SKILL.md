---
name: gemma
description: Integrate Gemma structured quest generation in an authorized future SideQuest phase, with validation, one retry, and safe fallback. Not for Plan 1.
---

# Gemma — future phase only

Use only when Gemma integration is explicitly authorized after the mock product skeleton.

QuestInput → prompt → Gemma → structured output → Zod → primitive validation → deterministic safety validation → Quest.

Keep calls server-only, keys in environment variables. Constrain duration/mood/environment and approved primitives in prompts. Never trust or render raw model output. Retry once after invalid output or failure, then use a validated safe fixture fallback compatible with the input. Provide loading/error/fallback UX. Test malformed, unsafe and unavailable responses. The model is not the final safety authority.
