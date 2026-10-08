# Coding standards

- TypeScript strict mode; avoid any.
- Use Zod for runtime validation; prefer inferred types over duplicate interfaces.
- Keep business logic in lib/ and UI components focused.
- Use descriptive function names and simple explicit code.
- Every async/network/model call eventually needs loading/error handling.
- Do not swallow errors; report a friendly message or deliberate recovery.
- Do not expose raw internal errors to users.
- Never expose secrets; future model calls are server-only.
- No unnecessary dependencies or unrelated refactors.
- Comments explain why, not what syntax does.
- Critical business logic gets tests; no snapshot tests for this phase.
- Keep app usable when localStorage is unavailable.
- Do not introduce AI/session/storage abstractions without a current requirement.
