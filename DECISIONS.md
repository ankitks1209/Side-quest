# Architecture decisions

## ADR-001: Next.js single application
- Status: Accepted (future integrations remain planned, not implemented).
- Decision: Use one Next.js App Router application.
- Reason: One local and deployable vertical slice minimizes operational work.
- Revisit condition: A proven requirement cannot be handled within the existing app.

## ADR-002: No authentication
- Status: Accepted (future integrations remain planned, not implemented).
- Decision: No accounts, auth or OAuth.
- Reason: The quest flow needs no identity.
- Revisit condition: Explicit product requirement for identity.

## ADR-003: localStorage instead of database
- Status: Accepted (future integrations remain planned, not implemented).
- Decision: Use localStorage only for V1 persistence.
- Reason: Local preferences need no cloud infrastructure.
- Revisit condition: Explicitly authorized cross-device persistence requirement.

## ADR-004: Structured quest primitives
- Status: Accepted (future integrations remain planned, not implemented).
- Decision: Use only the eight approved primitives.
- Reason: Constrained output can be validated and tested.
- Revisit condition: Explicit approval of a new primitive with safety and tests.

## ADR-005: Deterministic safety validation
- Status: Accepted (future integrations remain planned, not implemented).
- Decision: Schema, primitive and deterministic safety validation precede future model approval.
- Reason: Models are not a safety authority.
- Revisit condition: Never remove the deterministic gate; improve coverage based on evidence.

## ADR-006: Mobile-first design
- Status: Accepted (future integrations remain planned, not implemented).
- Decision: Design for approximately 390×844 and support 375/430px and desktop.
- Reason: Outdoor use favors short, readable mobile interactions.
- Revisit condition: Observed accessibility or layout issue.

## ADR-007: AI integration only after UI/product skeleton
- Status: Accepted (future integrations remain planned, not implemented).
- Decision: Plan 1 uses fixtures; no model calls.
- Reason: Prove product flow independently of inference.
- Revisit condition: Plan 1 checks pass and Plan 2 is authorized.

## ADR-008: No global state library
- Status: Accepted (future integrations remain planned, not implemented).
- Decision: Use React state.
- Reason: Five screens need only a small local flow.
- Revisit condition: A demonstrated state problem cannot be resolved simply.

## ADR-009: Render is planned deployment target
- Status: Accepted (future integrations remain planned, not implemented).
- Decision: Plan to deploy the single app on Render later.
- Reason: Matches partner target with minimal deployment architecture.
- Revisit condition: Deployment phase reveals a concrete blocker.

## ADR-010: ElevenLabs is optional
- Status: Accepted (future integrations remain planned, not implemented).
- Decision: Only consider reading quests aloud after stable MVP.
- Reason: Voice is valuable only when it reduces screen interaction.
- Revisit condition: Authorized evidence that audio improves the core outdoor experience.

## ADR-011: No maps or GPS routing
- Status: Accepted (future integrations remain planned, not implemented).
- Decision: No GPS, maps, routing or nearby-place search.
- Reason: Location-independent quests keep scope and permissions small.
- Revisit condition: Explicit product contract change.

## ADR-012: One AI-verifiable task per quest is enough
- Status: Accepted (future integrations remain planned, not implemented).
- Decision: Exactly one photo-verifiable task; others self-reported.
- Reason: One photo proves the verification loop with minimal screen use.
- Revisit condition: Explicit requirement supported by field-test evidence.

## Foundation implementation notes
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
