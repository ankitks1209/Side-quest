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
