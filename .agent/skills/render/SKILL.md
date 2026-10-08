---
name: render
description: Deploy the SideQuest single Next.js application on Render after local MVP and explicit deployment authorization. Not for Plan 1.
---

# Render — future deployment

Deployment comes after local MVP. Keep deployment architecture minimal: one Next.js app, no database or separate services. Secrets only via environment variables, never client bundles or repository. Production build must work. Verify the full vertical slice after deployment, including mobile use and fallback behavior. No deployment during Plan 1.
