# SideQuest delivery plan

## Goal
Create a clean, documented, runnable SideQuest product skeleton using mock data.

## Included
- Next.js + TypeScript foundation, App Router, Tailwind, Zod
- Five-screen UI skeleton, mobile-first layout, navigation, local React state
- Domain types inferred from Zod schemas
- Three polished mock quest fixtures and safe input mapping
- localStorage for setup preferences only; no database
- Basic schema/contract tests and all project memory files

## Excluded
Gemma, vision model, ElevenLabs, Render deployment, real AI calls, complex animation, real outdoor testing, final article/video. No real Away Ratio tracking in this phase.

## Definition of done
All memory and skill files exist. Next.js runs; strict TypeScript, Tailwind and Zod work. Complete Landing → Setup → Mock Quest → Begin → I'm Back → Mock Evidence → Completion without keys or AI. Input/task/quest/verification/session/summary contracts exist, fixtures and schema tests exist, and lint/typecheck/test/build pass.

## Implementation boundaries
app/ owns route/layout/styles. components/ owns UI and flow state. lib/quests/ owns contracts, fixtures and selection. lib/storage/ owns validated local preferences. No AI adapters, session tracker, or placeholder abstractions until required.

## Current status
Plan 1 complete: five-screen mock flow implemented; lint, strict typecheck, contract tests and production build verified. Browser acceptance passed at 375/390/430px and desktop, including local photo preview and unavailable storage. Completion statistics and verification are labeled demonstrations. Only setup preferences persist; reload starts at Landing.

## Plan 2 — hosted quest generation
Plan 2 adds hosted Gemma 4 through Google's Interactions API without changing the five-screen shell. The provider is server-only and stateless (`store: false`). Only completed interactions are accepted. Raw text passes JSON extraction, `QuestSchema`, request matching and deterministic safety. Any failure consumes an attempt; after two attempts, the same approval boundary validates a curated fallback.

The `QuestModel` boundary is provider-independent so a local Gemma implementation can be added later. Local inference, vision verification, deployment and real Away Ratio timing are not part of Plan 2.

## Plan 2 definition of done
- Real 15-minute / Explore / City request returns an approved Gemma quest.
- Exactly one task requires photo verification.
- Unsafe output is rejected and retried.
- Two failed attempts return an approved fallback.
- Client validates the API boundary before updating state.
- Lint, typecheck, tests and production build pass.

## Current status
Plan 2 is complete. A real 15-minute / Explore / City request returned an approved Gemma quest with exactly one photo task. Unsafe candidates and all non-completed statuses consume an attempt; two failures return an approved fallback. The mobile flow, secret audit, lint, typecheck, 75 tests and production build pass. Do not begin Plan 3 until this result is reviewed.
