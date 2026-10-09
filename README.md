# SideQuest

Your next adventure is outside this app.

## What It Is
An open-AI outdoor quest engine that creates short real-world adventures and verifies what you discover when you return. Quest generation uses hosted Gemma 4 with a safe curated fallback.

## Core Philosophy
“The world is the interface.” Less screen interaction, more exploration and observation.

## Planned MVP
Choose duration, mood and environment; receive 2–3 safe tasks, go outside, return with one photo, verify that photo against its mission criterion, self-report the remaining tasks and see a measured visibility-based Away Ratio.

## Away Ratio
Estimated time away from SideQuest / total quest duration. Timing starts at Begin, ends at Completion and uses document visibility. It is an app-visibility estimate, never device-wide screen-time tracking.

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
For real generation and evidence verification, copy `.env.example` to `.env.local` and provide the server-only Google values. Missing or unavailable quest generation uses a validated curated fallback. Setup preferences and one active quest session persist locally; photos never do.

## Current Phase
Plan 4A: hosted Gemma generates quests, Gemini 3.7 Flash checks one photo, and the completion screen calculates real session timing from SideQuest visibility. Active/Evidence refresh recovery uses one validated localStorage record. Deployment is the separate Plan 4B checkpoint.

## Hackathon Principle
Optimize for a small, reliable, visually polished vertical slice. Add only what materially increases the chance of winning the current challenge.
