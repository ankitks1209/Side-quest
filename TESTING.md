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
Run npm run dev; complete Landing → Setup → Mock Quest → Begin → I'm Back → Mock Evidence → Completion. Verify local image preview, demo labeling, self-report completion and restart. Check 375, 390, 430px and desktop layouts, touch targets, keyboard focus, no overflow. Verify no keys or live services needed. Refresh returns to Landing and preserves setup preferences only.

## Plan 2 automated tests
- Frozen Google request contract, including `store: false`, model, endpoint and server-only key placement
- Every non-completed Interaction status, including `queued`
- Last `model_output` selection and ordered text concatenation
- Plain/fenced JSON parsing and schema rejection
- Input compatibility and deterministic safety categories
- Two-attempt orchestration, retry success and validated fallback
- Client/server `{ quest, source }` response boundary

## Future tests
Away Ratio visibility and zero-duration cases, vision failure/loading/retry. Outdoor field tests are future submission work.

## Plan 1 verification record — 2026-10-07
Lint, typecheck, 17 Vitest tests and production build pass on Node 24.18.0. Browser acceptance passed at 375×844, 390×844, 430×844 and 1280×900: full flow, local image selection/preview, invalid file feedback, self-report checkboxes, restart, refresh/preferences, skipped tasks and unavailable localStorage. No browser runtime errors or horizontal overflow. Mobile screenshots visually inspected. Build and local server require permission outside this workspace sandbox to bind local ports; this is an execution-environment constraint.

Four project skills were validated with the existing js-yaml dependency against the skill frontmatter/scaffold rules; the bundled Python validator could not run because PyYAML is unavailable.

Known tooling issue: npm audit reports five high-severity entries in the development-only eslint-config-next → fast-glob → micromatch → braces chain (GHSA-vfj7-8cjw-p6xm). The registry's latest braces release is 3.0.3 and is affected. Do not force-downgrade Next.js tooling to the audit's suggested 14.x configuration; revisit when a compatible patch is available.

## Plan 2 verification record — 2026-10-08
Lint, post-build strict typecheck, 75 Vitest tests and production build pass. A real Google Interactions request for 15 minutes / Explore / City returned `source: gemma` in under eight seconds with three tasks and exactly one verification-required task. A 390×844 browser run completed loading → generated quest → active quest → evidence demo → completion with no runtime errors or horizontal overflow.

The two-failure path was exercised against the live provider when both requests exceeded the original reasoning latency budget; it returned a schema-, input- and safety-approved fallback. Minimal thinking was then enabled for constrained JSON generation, and the real provider path passed. Automated tests cover unsafe candidate → retry, `queued` → retry, all other non-completed statuses, two failures → fallback and invalid fallback → hard error. Visual review exposed and closed a `close your eyes` outdoor-safety gap. The configured API key is absent from built client and server artifacts.
