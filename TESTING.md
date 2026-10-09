# Verification contract

## Plan 1 automated tests
Schemas and core contracts:
- accepts valid quest with 2 tasks
- accepts valid quest with 3 tasks
- rejects quest with no tasks
- rejects unsupported primitive
- rejects invalid duration, mood, environment
- requires nonblank verificationCriterion when verificationRequired is true
- validates all curated fixtures and all 36 setup combinations
- enforces unique task IDs and exactly one photo-verifiable task

No snapshot tests. Vitest is the small test runner; tests live beside domain code.

## Required commands
```sh
npm run lint
npm run typecheck
npm run test
npm run build
```

Run build and typecheck sequentially: Next.js regenerates .next type files during build/dev restarts.

## Manual acceptance
Run npm run dev; complete Landing → Setup → generated Quest → Begin → I'm Back → Evidence → Completion. Verify real measured timing, exact completed/total discoveries, local image preview, verification states and restart. Refresh during Active and Evidence must restore the current session without an image; refresh after Completion returns to Landing. Check 375, 390, 430px and desktop layouts, touch targets, keyboard focus and no overflow.

## Plan 2 automated tests
- Frozen Google request contract, including `store: false`, model, endpoint and server-only key placement
- Every non-completed Interaction status, including `queued`
- Last `model_output` selection and ordered text concatenation
- Plain/fenced JSON parsing and schema rejection
- Input compatibility and deterministic safety categories
- Two-attempt orchestration, retry success and validated fallback
- Client/server `{ quest, source }` response boundary

## Plan 3 automated tests
- JPEG/PNG/WebP MIME and byte signatures, mismatches, fake images, 5 MB limit and bounded text fields
- Stateless Google vision request, completed-only response handling and final ordered model output
- Verification result schema, 0.75 classification boundary and client/server response schema
- Exactly two technical attempts and no retry for a valid uncertain result
- Verified evidence counts; uncertain/unavailable evidence remains completable without counting the photo

## Plan 4A automated tests
- Explicit-timestamp start, repeated visibility transitions, multiple segments and completion boundaries
- Zero duration, active-time clamping, uncapped elapsed duration and zero Away Ratio while always visible
- Conservative interrupted-page restoration while visible or hidden
- Active/Evidence record validation, corrupt state, storage failures and clearing
- Durable self-report/verification progress with no image bytes
- Minute and hour-plus duration formatting

## Future tests
Production deployment smoke tests and outdoor field tests remain future work.

## Plan 1 verification record — 2026-10-07
Lint, typecheck, 17 Vitest tests and production build pass on Node 24.18.0. Browser acceptance passed at 375×844, 390×844, 430×844 and 1280×900: full flow, local image selection/preview, invalid file feedback, self-report checkboxes, restart, refresh/preferences, skipped tasks and unavailable localStorage. No browser runtime errors or horizontal overflow. Mobile screenshots visually inspected. Build and local server require permission outside this workspace sandbox to bind local ports; this is an execution-environment constraint.

Four project skills were validated with the existing js-yaml dependency against the skill frontmatter/scaffold rules; the bundled Python validator could not run because PyYAML is unavailable.

Known tooling issue: npm audit reports five high-severity entries in the development-only eslint-config-next → fast-glob → micromatch → braces chain (GHSA-vfj7-8cjw-p6xm). The registry's latest braces release is 3.0.3 and is affected. Do not force-downgrade Next.js tooling to the audit's suggested 14.x configuration; revisit when a compatible patch is available.

## Plan 2 verification record — 2026-10-08
Lint, post-build strict typecheck, 75 Vitest tests and production build pass. A real Google Interactions request for 15 minutes / Explore / City returned `source: gemma` in under eight seconds with three tasks and exactly one verification-required task. A 390×844 browser run completed loading → generated quest → active quest → evidence demo → completion with no runtime errors or horizontal overflow.

The two-failure path was exercised against the live provider when both requests exceeded the original reasoning latency budget; it returned a schema-, input- and safety-approved fallback. Minimal thinking was then enabled for constrained JSON generation, and the real provider path passed. Automated tests cover unsafe candidate → retry, `queued` → retry, all other non-completed statuses, two failures → fallback and invalid fallback → hard error. Visual review exposed and closed a `close your eyes` outdoor-safety gap. The configured API key is absent from built client and server artifacts.

## Plan 3 verification record — 2026-10-10
Lint, strict typecheck, 100+ Vitest tests and the production webpack build pass. A real Gemini 3.7 Flash request verified a synthetic green/yellow checkerboard at 0.99 confidence; an unrelated solid-gray image returned uncertain; a JPEG declared as PNG was rejected with HTTP 400. The 390×844 browser flow completed an uncertain photo without counting it, counted both self-reported tasks, showed the honest completion receipt, had no horizontal overflow and logged no browser errors. The configured API key is absent from built artifacts. Automated tests cover the simulated two-failure provider path and error completion behavior without live provider calls.

## Plan 4A verification record — 2026-10-10
Lint, strict typecheck, 119 Vitest tests and production build pass. Browser acceptance at 390×844 restored both Active and Evidence phases after refresh, restored an uncertain verification result and a self-reported task without restoring its image, completed with measured values, showed 2 of 3 discoveries, cleared recovery state after completion and returned to Landing on completion refresh. There was no horizontal overflow and no browser warning/error output. Pure tests cover hidden-time math because browser automation cannot reliably background the in-app tab.
