# SideQuest agent contract

SideQuest is a hackathon product under a hard deadline. Optimize for a small, reliable, visually polished vertical slice. Do not optimize for theoretical future scale. Do not introduce infrastructure for requirements that do not currently exist.

Before adding a feature, ask whether it materially increases our chance of winning the current challenge. If not, do not add it.

## Project instruction precedence
1. AGENTS.md
2. RULES.md
3. PLAN.md
4. DATA_MODEL.md
5. DESIGN.md
6. CODING_STANDARDS.md
7. task-specific instructions

This is project-level precedence; platform instructions and explicit human authorization still apply. Read this contract and the relevant memory files before editing. Update memory when an authorized contract change occurs.

## Product boundary
SideQuest is an open-AI outdoor quest engine. The world is the interface. Optimize for less screen interaction and more exploration and observation, never chat engagement or retention. Exactly five primary screens: Landing, Quest Setup, Quest (including active state), Evidence, Completion.

## Engineering rules
- Do not redesign architecture because a feature is unfinished.
- Inspect existing implementation before changing architecture.
- Keep business logic outside UI components, in lib/.
- Never trust model output; validate schema, primitives, then deterministic safety.
- Never expose secrets or commit keys.
- Prefer existing dependencies over new dependencies.
- Prefer localStorage over a database.
- Prefer simple explicit code over abstractions.
- Use React state; no global state library.
- Run lint/typecheck/test/build before declaring work complete.
- Do not add future integrations during Plan 1.

## Frozen scope
Inputs: 15/30/60 minutes; Explore/Relax/Move/Notice; City/Park/Anywhere. No custom inputs, maps, GPS, routing, or exact location dependency. Each quest has 2–3 tasks and one photo-verifiable task; the rest are self-reported. Approved primitives are defined in RULES.md and lib/quests/primitives.ts.

Stack: Next.js App Router, strict TypeScript, Tailwind, Zod, React state, localStorage. No authentication, accounts, OAuth, database, social feed, friends, leaderboard, multiplayer, chatbot, native app, payments, subscriptions, notifications, RAG, vector database, multi-agent system, orchestration framework, admin dashboard, analytics platform, or complex gamification.

## Session handoff
Read PLAN.md for phase/status, DECISIONS.md for rationale, and TESTING.md for checks. Preserve working code and lockfile. Report what changed, validation results, limitations, and the next authorized step. Completion metrics in Plan 1 are explicitly demo values; Away Ratio is never device-wide screen time.
