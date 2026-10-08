# Plan 1 — mock product foundation

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

## Plan 2 (not authorized by Plan 1)
Implement and test deterministic primitive/safety validation first. Then add a server-only Gemma adapter: QuestInput → prompt → structured output → Zod → primitive checks → safety checks → Quest. Retry once then use a validated safe fallback. Never render raw model output. Vision and real visibility timing follow only in their authorized phase.
