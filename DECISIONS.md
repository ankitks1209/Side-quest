# Architecture decisions

## ADR-001: Next.js single application
- Status: Accepted.
- Decision: Use one Next.js App Router application.
- Reason: One local and deployable vertical slice minimizes operational work.
- Revisit condition: A proven requirement cannot be handled within the existing app.

## ADR-002: No authentication
- Status: Accepted.
- Decision: No accounts, auth or OAuth.
- Reason: The quest flow needs no identity.
- Revisit condition: Explicit product requirement for identity.

## ADR-003: localStorage instead of database
- Status: Accepted.
- Decision: Use localStorage only for V1 persistence.
- Reason: Setup preferences and one recoverable active session need no cloud infrastructure.
- Revisit condition: Explicitly authorized cross-device persistence requirement.

## ADR-004: Structured quest primitives
- Status: Accepted.
- Decision: Use only the eight approved primitives.
- Reason: Constrained output can be validated and tested.
- Revisit condition: Explicit approval of a new primitive with safety and tests.

## ADR-005: Deterministic safety validation
- Status: Accepted.
- Decision: Schema, primitive and deterministic safety validation precede model approval; implemented in Plan 2.
- Reason: Models are not a safety authority.
- Revisit condition: Never remove the deterministic gate; improve coverage based on evidence.

## ADR-006: Mobile-first design
- Status: Accepted.
- Decision: Design for approximately 390×844 and support 375/430px and desktop.
- Reason: Outdoor use favors short, readable mobile interactions.
- Revisit condition: Observed accessibility or layout issue.

## ADR-007: AI integration only after UI/product skeleton
- Status: Accepted.
- Decision: Plan 1 uses fixtures; no model calls.
- Reason: Prove product flow independently of inference.
- Revisit condition: Plan 1 checks pass and Plan 2 is authorized.

## ADR-008: No global state library
- Status: Accepted.
- Decision: Use React state.
- Reason: Five screens need only a small local flow.
- Revisit condition: A demonstrated state problem cannot be resolved simply.

## ADR-009: Render deployment target
- Status: Accepted.
- Decision: Deploy the single app as one Render Node Web Service; Plan 4B is complete per owner handoff.
- Reason: Matches partner target with minimal deployment architecture.
- Revisit condition: Deployment phase reveals a concrete blocker.

## ADR-010: Audio is outside submission scope
- Status: Accepted.
- Decision: No ElevenLabs or other audio integration for this submission.
- Reason: Freeze the working outdoor vertical slice; media narration does not need a product integration.
- Revisit condition: Authorized evidence that audio improves the core outdoor experience.

## ADR-011: No maps or GPS routing
- Status: Accepted.
- Decision: No GPS, maps, routing or nearby-place search.
- Reason: Location-independent quests keep scope and permissions small.
- Revisit condition: Explicit product contract change.

## ADR-012: One AI-verifiable task per quest is enough
- Status: Accepted.
- Decision: Exactly one photo-verifiable task; others self-reported.
- Reason: One photo proves the verification loop with minimal screen use.
- Revisit condition: Explicit requirement supported by field-test evidence.

## Foundation implementation notes (historical Plan 1)
- Dependencies are pinned to exact installed versions and package-lock.json is committed-ready; use npm ci. Node 24.x is documented in .nvmrc and package engines for the selected Vitest version.
- next.config.ts disables Next.js managed agentRules so next dev cannot append framework instructions to the hand-maintained AGENTS.md contract. Consult installed version-matched Next.js documentation when changing framework behavior.
- Plan 1 does not persist photos or sessions. Only validated setup preferences are saved. Evidence and metrics remain simulations.

## ADR-013: Disable Google Interaction Storage
- Status: Accepted.
- Decision: Every Google Interactions request uses `store: false`. SideQuest does not use `previous_interaction_id` or provider-managed conversation state.
- Reason: Quest generation is stateless; disabling storage avoids unnecessary provider-side persistence and supports the local-first product boundary.
- Revisit condition: A future authorized product requirement genuinely needs provider-managed conversation state.

## ADR-014: Completed Interactions Only
- Status: Accepted.
- Decision: Accept a Google Interactions response only when `status === "completed"`; every other, unknown or missing status consumes the current attempt.
- Reason: SideQuest needs synchronous quest generation and has no polling or tool-action workflow.
- Revisit condition: SideQuest explicitly adopts a long-running model workflow.

## ADR-015: Hosted Gemma Through Google Interactions
- Status: Accepted.
- Decision: The demo path uses `gemma-4-26b-a4b-it` through Google AI Studio / Gemini Developer API at `/v1beta/interactions` behind the small `QuestModel` interface.
- Reason: Hosted inference improves demo reliability while the abstraction preserves a future local-Gemma path.
- Revisit condition: A validated local provider meets the demo's reliability and latency needs.

## ADR-016: Minimal Thinking for Quest JSON
- Status: Accepted.
- Decision: Hosted quest requests set `generation_config.thinking_level` to `minimal`.
- Reason: Quest generation is a constrained JSON task, and minimal thinking keeps responses inside the 20-second synchronous attempt budget.
- Revisit condition: Field testing shows a material quest-quality regression or Google changes the supported setting.

## ADR-017: Gemini 3.7 Flash Evidence Verifier
- Status: Accepted.
- Decision: Use Gemini 3.7 Flash through the existing Google Interactions endpoint for one criterion-specific image check.
- Reason: It provides verified multimodal input with minimal new provider surface while Gemma remains the open-weight quest-generation core.
- Revisit condition: Field testing shows unacceptable accuracy, latency or availability.

## ADR-018: No Evidence Image Persistence
- Status: Accepted.
- Decision: Keep image bytes only for the request and send them to Google with `store: false`; do not write them to storage or logs.
- Reason: The vertical slice needs a result, not an evidence archive.
- Revisit condition: An explicitly authorized product requirement needs evidence history.

## ADR-019: Initial Evidence Confidence Threshold
- Status: Accepted.
- Decision: Treat `verified: true` at confidence 0.75 or higher as verified; classify every other valid result as uncertain.
- Reason: One centralized conservative boundary is clear, testable and easy to tune after field evidence.
- Revisit condition: Field tests support a different threshold.

## ADR-020: Verification Never Blocks Completion
- Status: Accepted.
- Decision: Uncertain and provider-error states may continue, but the photo task does not count as completed.
- Reason: A third-party model must not trap the outdoor quest flow or silently award unverified evidence.
- Revisit condition: Never remove the escape path without an equally reliable recovery flow.

## ADR-021: Visibility-Based Away Ratio
- Status: Accepted.
- Decision: Measure from Begin through Completion and treat elapsed time outside visible SideQuest segments as estimated away.
- Reason: Browser visibility provides a small, permission-free and defensible estimate without claiming device-wide screen time.
- Revisit condition: Never replace the disclosure with a stronger tracking claim; revisit mechanics only with field evidence.

## ADR-022: Date.now for Persisted Session Timing
- Status: Accepted.
- Decision: Pass explicit epoch timestamps through pure timing functions and persist them with the active session.
- Reason: Epoch timestamps remain meaningful across reloads; `performance.now()` does not.
- Revisit condition: A future runtime provides a better cross-document monotonic clock.

## ADR-023: One Recoverable Active Session
- Status: Accepted.
- Decision: Persist one validated Active/Evidence session in localStorage, including durable evidence results and self-reports but never image data.
- Reason: Refresh resilience materially improves an outdoor flow without accounts, databases or history infrastructure.
- Revisit condition: Explicit product demand for multiple or cross-device sessions.

## ADR-024: Conservative Interrupted-Segment Recovery
- Status: Accepted.
- Decision: Discard an unfinished persisted visible segment on restore and begin a fresh segment only if the new document is visible.
- Reason: Unknown time after a crash must not be falsely counted as visible app use.
- Revisit condition: Browser lifecycle guarantees materially improve.


## ADR-025: Submission-only Plan 5
- Status: Accepted (2026-10-10 owner handoff).
- Decision: Keep supporting contracts in the repo, with README as the public entry point. Plan 5 covers audit, writing, field evidence/media and final QA; no new product features.
- Reason: Writing quality and real outdoor evidence are the remaining challenge priorities.
- Revisit condition: Explicit human authorization after this submission.

## ADR-026: Precise public claims
- Status: Accepted.
- Decision: Describe Gemma as the hosted open-weight quest core and Gemini as a bounded multimodal verifier. Describe Away Ratio as app visibility and `store: false` as disabled Interaction storage. Never invent outdoor results or imply offline inference.
- Reason: Judges need inspectable evidence and accurate boundaries.
- Revisit condition: Implemented behavior changes under explicit authorization.

## ADR-027: Evidence-bounded submission without an outing
- Status: Accepted (2026-10-11 owner request).
- Decision: Finalize Plan 5B/5C writing and media specifications from implemented behavior and recorded technical tests. Omit accomplished outdoor claims; use an explicitly labeled app walkthrough. Media production and publication are separate unfinished release actions.
- Reason: No authentic outdoor results were supplied; an outing is bonus evidence in the challenge, not a reason to fabricate results or block article editing.
- Revisit condition: Real field evidence or media is supplied and can be accurately attributed.
