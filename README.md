# SideQuest

Your next adventure is outside this app.

## What It Is
An open-AI outdoor quest engine that creates short real-world adventures and verifies what you discover when you return. Quest generation uses hosted Gemma 4 with a safe curated fallback.

## Core Philosophy
“The world is the interface.” Less screen interaction, more exploration and observation.

## Planned MVP
Choose duration, mood and environment; receive 2–3 safe tasks, go outside, return with one photo, self-report the remaining tasks and see an estimated Away Ratio. Photo verification and timing remain mocked in Plan 2.

## Away Ratio
Estimated time away from SideQuest / total quest duration. Future timing uses app visibility/session timing, never device-wide screen-time tracking. Current completion numbers are explicitly demo values.

## Product Screens
Landing → Quest Setup → Quest (including active state) → Evidence → Completion.

## Stack
Next.js App Router, strict TypeScript, Tailwind CSS, Zod, React state, localStorage; Vitest for contracts. Hosted Gemma 4 uses Google's Interactions API. Render is the planned deployment target.

## Project Documentation
Start with [AGENTS.md](AGENTS.md), then [RULES.md](RULES.md), [PLAN.md](PLAN.md), [DATA_MODEL.md](DATA_MODEL.md), [DESIGN.md](DESIGN.md), [CODING_STANDARDS.md](CODING_STANDARDS.md), [TESTING.md](TESTING.md), [DECISIONS.md](DECISIONS.md), [SUBMISSION.md](SUBMISSION.md). Future integration workflows are in .agent/skills/.

## Development
Node.js 24.x (see .nvmrc), npm. The selected Vitest release requires modern Node.
```sh
npm ci
npm run dev
# Open http://localhost:3000
npm run lint
npm run typecheck
npm run test
npm run build
```
For real generation, copy `.env.example` to `.env.local` and provide the three server-only Gemma values. Missing or unavailable provider configuration automatically uses a validated curated fallback. Setup preferences persist locally; photos and flow progress do not.

## Current Phase
Plan 2: the five-screen shell calls hosted `gemma-4-26b-a4b-it` through Google's stateless Interactions API. Every candidate is parsed, schema-checked, matched to the request and deterministically safety-checked. The `QuestModel` boundary remains provider-independent so local Gemma can be added later. Local/offline inference is not implemented. Evidence verification and Away Ratio values remain explicit demos.

## Hackathon Principle
Optimize for a small, reliable, visually polished vertical slice. Add only what materially increases the chance of winning the current challenge.
