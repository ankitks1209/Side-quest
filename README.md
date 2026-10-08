# SideQuest

Your next adventure is outside this app.

## What It Is
An open-AI outdoor quest engine that creates short real-world adventures and verifies what you discover when you return. Currently a mock-data product skeleton.

## Core Philosophy
“The world is the interface.” Less screen interaction, more exploration and observation.

## Planned MVP
Choose duration, mood and environment; receive 2–3 safe tasks, go outside, return with one photo, self-report the remaining tasks and see an estimated Away Ratio. Future Gemma and vision integrations are not part of Plan 1.

## Away Ratio
Estimated time away from SideQuest / total quest duration. Future timing uses app visibility/session timing, never device-wide screen-time tracking. Current completion numbers are explicitly demo values.

## Product Screens
Landing → Quest Setup → Quest (including active state) → Evidence → Completion.

## Stack
Next.js App Router, strict TypeScript, Tailwind CSS, Zod, React state, localStorage; Vitest for contracts. Render is the planned deployment target.

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
No environment variables or keys are required. .env.example contains commented future placeholders only. Setup preferences persist locally; photos and flow progress do not.

## Current Phase
Plan 1: documented five-screen mock flow. Mock verification never inspects image content. No live AI, measured Away Ratio, auth, database, maps, or deployment yet.

## Hackathon Principle
Optimize for a small, reliable, visually polished vertical slice. Add only what materially increases the chance of winning the current challenge.
