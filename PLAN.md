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

## Plan 3 — evidence intelligence
Plan 3 replaces mock evidence with one real, server-side Gemini 3.7 Flash check. The server validates one JPEG/PNG/WebP image (MIME, signature and 5 MB maximum), sends it transiently with `store: false`, validates structured output and applies a centralized 0.75 threshold. Valid uncertain results do not retry; technical failures retry once. Neither result traps the user, and only verified photo evidence counts as a completed discovery. Away Ratio and timing remain explicit demo values.

Plan 3 excludes image persistence, multiple images, video, OCR, recognition systems, GPS evidence, auth, databases, deployment, audio and real timing.

## Plan 3 status
Complete. Real verified and uncertain provider paths, forged upload rejection, 390×844 completion behavior, secret audit, lint, typecheck, 100+ tests and production build pass. Away Ratio and timing remain explicit demo values.

## Plan 4A — real session timing and Away Ratio
Plan 4A measures the session from Begin SideQuest through Complete my SideQuest. `activeScreenMs` accumulates only visible SideQuest segments; hidden elapsed time becomes estimated-away time. One validated active session is recoverable from localStorage across Active and Evidence refreshes. Evidence results and self-reports persist, but image bytes never do. Interrupted visible segments are discarded conservatively on restoration.

Plan 4A is complete and verified. Deployment remains Plan 4B and has not started.
