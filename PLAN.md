# SideQuest delivery plan

## Current checkpoint
Plans 1–4B complete. Plan 5A is preserved. Plan 5B capture specifications, walkthrough script and cover brief are ready; no outdoor field test or finished media is claimed. Plan 5C article and bounded documentation QA are complete; photo-verification unavailability found by live checks, media production and DEV publication remain pending in SUBMISSION.md. No new product features are authorized.

The foundation sections below record Plan 1 scope, not the current application behavior.

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

## Plan 1 status (historical)
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

## Plan 2 status (historical)
Plan 2 is complete. A real 15-minute / Explore / City request returned an approved Gemma quest with exactly one photo task. Unsafe candidates and all non-completed statuses consume an attempt; two failures return an approved fallback. The mobile flow, secret audit, lint, typecheck, 75 tests and production build pass. The reviewed result authorized Plan 3, which is now complete.

## Plan 3 — evidence intelligence (completed phase scope)
Plan 3 replaces mock evidence with one real, server-side Gemini 3.7 Flash check. The server validates one JPEG/PNG/WebP image (MIME, signature and 5 MB maximum), sends it transiently with `store: false`, validates structured output and applies a centralized 0.75 threshold. Valid uncertain results do not retry; technical failures retry once. Neither result traps the user, and only verified photo evidence counts as a completed discovery. At the Plan 3 checkpoint, Away Ratio and timing were demo values; Plan 4A subsequently replaced them with measured visibility timing.

Plan 3 excludes image persistence, multiple images, video, OCR, recognition systems, GPS evidence, auth, databases, deployment, audio and real timing.

## Plan 3 status (historical)
Complete. Real verified and uncertain provider paths, forged upload rejection, 390×844 completion behavior, secret audit, lint, typecheck, 100+ tests and production build pass. At the Plan 3 checkpoint, Away Ratio and timing were demo values; Plan 4A subsequently replaced them with measured visibility timing.

## Plan 4A — real session timing and Away Ratio
Plan 4A measures the session from Begin SideQuest through Complete my SideQuest. `activeScreenMs` accumulates only visible SideQuest segments; hidden elapsed time becomes estimated-away time. One validated active session is recoverable from localStorage across Active and Evidence refreshes. Evidence results and self-reports persist, but image bytes never do. Interrupted visible segments are discarded conservatively on restoration.

Plan 4A is complete and verified.

## Plan 4B — Render deployment
Complete per owner handoff: the app is deployed as a Render Node Web Service at https://side-quest-ai.onrender.com. The `plan-4b-complete` tag is present locally. The October 11 recheck confirms landing access and Gemma generation; photo verification is currently unavailable (HTTP 503) in synthetic tests. This is not an outdoor field test.

## Plan 5 — submission only

### Plan 5A
Prepare the public repo audit, polished README, updated SUBMISSION, DEV article draft, screenshot plan, 60–90 second script and cover brief. Run lint, build, typecheck and tests. Documentation prepared and local checks pass (119/119); article review is complete. Credential revocation is not an automated-test result; see the updated owner-reported private-screenshot context in SECURITY_AUDIT.md.

### Plan 5B
Prepare five live-app screenshot specifications, a 60–90 second walkthrough and a concise cover brief. Completed on 2026-10-11. Media capture/upload remain pending. The owner authorized proceeding without a real outdoor test; do not invent results or require field evidence as a condition of finishing the article.

### Plan 5C
Article text, privacy, factual boundaries, DEV template/tags/categories and bounded scans reviewed on 2026-10-11. Live-provider rechecks on October 11 returned Gemma generation but unavailable photo verification. Remaining release work: resolve/disclose that issue, check any produced media and the final rendered DEV submission. Publish before the deadline; record the article URL and disclose any later commits.

No auth, maps, GPS, social, audio, analytics, database or other product additions in Plan 5.

## Documentation synchronization

The owner authorized committing and pushing the reviewed Plan 5 documentation on October 11. Product source and dependencies remain unchanged. Pre-push Git snapshots in the audit records are historical. Current provider investigation found a valid local Google verification response, while the deployed verification failure remains unconfirmed in cause; availability is disclosed in the article. DEV draft editing/publication still requires access to the editor.
