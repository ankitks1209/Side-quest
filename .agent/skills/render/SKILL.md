---
name: render
description: Deploy the SideQuest single Next.js application on Render after local MVP and explicit deployment authorization. Not for Plan 1.
---

# Render deployment

Plan 4B is complete: production runs as one Render Node Web Service at https://side-quest-ai.onrender.com. Plan 5 is submission-only; no new deployment architecture is authorized. Keep deployment architecture minimal: one Next.js app, no database or separate services. Secrets only via environment variables, never client bundles or repository. Production build must work. Verify the full vertical slice after deployment, including mobile use and fallback behavior. No deployment during Plan 1.
