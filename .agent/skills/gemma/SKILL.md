---
name: gemma
description: Maintain SideQuest hosted Gemma quest generation through Google's Interactions API, with stateless requests, validation, one retry, and safe fallback.
---

# Hosted Gemma quest generation

The public/demo path uses hosted `gemma-4-26b-a4b-it` through Google's Interactions API. `QuestModel` remains provider-independent; local Gemma is not implemented.

QuestInput → prompt → Gemma → structured output → Zod → primitive validation → deterministic safety validation → Quest.

Keep calls server-only and keys in environment variables. Every request uses `store: false`, `thinking_level: minimal`, no `previous_interaction_id`, a 20-second timeout and no provider-level retry. Minimal thinking keeps constrained JSON generation within the synchronous request budget. Accept only `status === "completed"`, then extract the last `model_output`. The orchestrator permits two total calls. Constrain duration/mood/environment and approved primitives in prompts. Never trust or render raw output: parse JSON, validate with Zod, match the request, then run deterministic safety. After two failures, validate a compatible fixture fallback. The model is not the final safety authority.
