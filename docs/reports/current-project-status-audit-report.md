# Castaminofen Current Project Status Audit Report

## Audit Date
2026-07-17

## Overall Status
Needs Attention

## Executive Summary
The repository is in a substantially functional state for an MVP baseline: the monorepo structure is intact, both the backend and frontend build successfully, and lint checks pass for the current workspace. The implementation already includes a NestJS API, Prisma-backed persistence, JWT authentication, podcast and episode modules, and a Next.js frontend with React Query and Zustand integration.

However, several gaps remain between the documented architecture and the current implementation. The most important issues are incomplete alignment with the documented folder structure, missing readiness for RSS/queue/offline/PWA features, weak environment-file protection, and the presence of local repository changes that suggest migration-related churn rather than a fully stabilized baseline.

## Repository & Git Status
- Current branch: main
- Remote configuration:
  - origin -> https://github.com/ProCooper004/castaminofen-starter
  - upstream -> https://github.com/PicoRmin/castaminofen-starter.git
- Git status shows existing uncommitted changes in the working tree, including:
  - [.env](../.env)
  - [.env.example](../.env.example)
  - [README.md](../README.md)
  - [apps/api/.env](../apps/api/.env)
  - [apps/api/src/app.module.ts](../apps/api/src/app.module.ts)
  - [apps/api/src/auth/auth.module.ts](../apps/api/src/auth/auth.module.ts)
  - [apps/api/src/auth/auth.service.ts](../apps/api/src/auth/auth.service.ts)
  - [apps/api/src/auth/strategies/jwt.strategy.ts](../apps/api/src/auth/strategies/jwt.strategy.ts)
- The repository is not clean, and the presence of modified environment files and auth-related files indicates that migration or stabilization work is still in progress.
- The root [.gitignore](../.gitignore) currently comments out the `.env` and `.env.local` ignore rules, so environment files are not fully protected by Git ignore rules.

## Documentation Compliance
- The documentation set exists and covers the intended architecture, stack, dependencies, roadmap, and folder structure, including [docs/architecture.md](architecture.md), [docs/tech-stack.md](tech-stack.md), [docs/dependencies.md](dependencies.md), [docs/folder-structure.md](folder-structure.md), [docs/mvp.md](mvp.md), [docs/roadmap.md](roadmap.md), and [.github/copilot-instructions.md](../.github/copilot-instructions.md).
- The repository also contains a current project status file at [docs/project-status.md](project-status.md), but it is not fully reflected by the current repository state in some areas because the actual codebase still has missing pieces versus the documented roadmap.
- Documentation is present, but the repository would benefit from a more explicit synchronization step between the planned architecture and the implemented features so that docs become a reliable source of truth.

## Project Rules Compliance
- The repository instructions in [.github/copilot-instructions.md](../.github/copilot-instructions.md) emphasize simplicity, feature-first architecture, type safety, documentation discipline, and MVP-first development.
- The current codebase generally respects those principles in the sense that it is small, focused, and mostly clear.
- Several rules are only partially followed:
  - The architecture is not fully aligned with the documented folder structure for backend modules.
  - The implementation does not yet cover the documented future-facing areas such as RSS/queue/offline/PWA support.
  - Environment configuration is not fully protected and is still being adjusted in the working tree.
  - The documentation and implementation should be kept more tightly synchronized as the project evolves.

## Architecture Compliance
- Monorepo structure is present and working:
  - [package.json](../package.json)
  - [pnpm-workspace.yaml](../pnpm-workspace.yaml)
  - [apps/api](../apps/api)
  - [apps/web](../apps/web)
  - [packages/shared-types](../packages/shared-types)
- Frontend/backend separation is present. The API lives under [apps/api](../apps/api), and the web app lives under [apps/web](../apps/web).
- The backend uses NestJS modules and Prisma integration with a clear feature-based approach in the current source tree.
- The frontend uses Next.js App Router under [apps/web/src/app](../apps/web/src/app), and uses React Query and Zustand in the current implementation.
- A notable architectural mismatch remains: the backend source tree uses direct feature folders such as [apps/api/src/auth](../apps/api/src/auth), [apps/api/src/podcasts](../apps/api/src/podcasts), and [apps/api/src/episodes](../apps/api/src/episodes), while the documented structure in [docs/folder-structure.md](folder-structure.md) expects a more explicit nested structure under a modules folder.

## Folder Structure Compliance
- The repository mostly follows a monorepo layout and separate app/package boundaries.
- Frontend structure is mostly consistent with the documented “feature-based” idea, with feature folders such as [apps/web/src/features/podcasts](../apps/web/src/features/podcasts) and [apps/web/src/features/episodes](../apps/web/src/features/episodes).
- Backend structure is acceptable for an MVP, but it does not yet fully match the documented backend folder structure that anticipates a dedicated [apps/api/src/modules](../apps/api/src/modules) location and clearer separation of common/config/database concerns.
- The current implementation keeps shared types in [packages/shared-types](../packages/shared-types), which is aligned with the documented intention.

## Backend Status
- The backend is structurally present and functional.
- Core backend components observed:
  - NestJS app bootstrap in [apps/api/src/main.ts](../apps/api/src/main.ts)
  - App module wiring in [apps/api/src/app.module.ts](../apps/api/src/app.module.ts)
  - Authentication foundation in [apps/api/src/auth](../apps/api/src/auth)
  - Prisma service in [apps/api/src/prisma/prisma.service.ts](../apps/api/src/prisma/prisma.service.ts)
  - Podcast and episode modules in [apps/api/src/podcasts](../apps/api/src/podcasts) and [apps/api/src/episodes](../apps/api/src/episodes)
  - Storage service in [apps/api/src/storage/storage.service.ts](../apps/api/src/storage/storage.service.ts)
- Prisma schema exists and includes User, Podcast, and Episode models in [apps/api/prisma/schema.prisma](../apps/api/prisma/schema.prisma).
- The API uses versioned routing with the prefix /api/v1, which matches the documented API direction.
- The backend still lacks several documented advanced features:
  - No RSS worker/processor structure
  - No BullMQ queue implementation
  - No Redis-backed queue or job orchestration
  - No explicit throttling or security middleware beyond validation and cookie parsing

## Frontend Status
- The frontend is present and functional, using App Router pages under [apps/web/src/app](../apps/web/src/app).
- The implementation includes:
  - React Query provider in [apps/web/src/providers/react-query-provider.tsx](../apps/web/src/providers/react-query-provider.tsx)
  - Zustand stores in [apps/web/src/stores/authStore.ts](../apps/web/src/stores/authStore.ts) and [apps/web/src/stores/playerStore.ts](../apps/web/src/stores/playerStore.ts)
  - Auth pages and protected route flow under [apps/web/src/app/login](../apps/web/src/app/login), [apps/web/src/app/register](../apps/web/src/app/register), and [apps/web/src/app/profile](../apps/web/src/app/profile)
  - Podcast pages and hooks under [apps/web/src/app/podcasts](../apps/web/src/app/podcasts) and [apps/web/src/features/podcasts](../apps/web/src/features/podcasts)
- The current frontend is aligned with the documented MVP direction for core UI and API integration.
- Remaining gaps versus the documented product vision:
  - No visible next-intl or RTL configuration
  - No PWA/service-worker/offline implementation
  - No persistent mini/full player UI beyond a Zustand store
  - No explicit offline download workflow implementation

## Infrastructure Status
- Container services are defined in [docker-compose.yml](../docker-compose.yml) for PostgreSQL, Redis, and MinIO.
- The infrastructure baseline is appropriate for local development and matches the documented stack direction.
- The current setup is still minimal and does not include a reverse proxy service such as Nginx, and there is no evidence of health checks or deployment automation in the repository snapshot.
- Environment configuration is present via [.env.example](../.env.example) and the live environment files in the working tree.

## Dependency Status
- The dependency set is broadly aligned with the planned MVP stack.
- Present and relevant packages include:
  - NestJS, Prisma, JWT, Passport, bcrypt, class-validator, class-transformer, S3 client, and validation packages in [apps/api/package.json](../apps/api/package.json)
  - Next.js, React, Zustand, React Query, React Hook Form, Zod, and Lucide in [apps/web/package.json](../apps/web/package.json)
  - Shared types package in [packages/shared-types/package.json](../packages/shared-types/package.json)
- Gaps versus the documented dependency plan in [docs/dependencies.md](dependencies.md):
  - Backend packages for queueing and RSS are not present: BullMQ, ioredis, rss-parser, fast-xml-parser
  - Security packages called for in the docs are not present: @nestjs/throttler, helmet
  - Frontend packages called for in the docs are not present: next-intl, next-pwa/workbox, framer-motion, idb, axios
- These gaps are not necessarily blocking for a minimal MVP, but they do mean the implementation is partially ahead of and partially behind the documented dependency plan.

## Build & Runtime Status
- Build verification was executed successfully:
  - Monorepo build command: pnpm -r build
  - Result: succeeded for the API, shared types package, and web app
- Lint verification was executed successfully:
  - Lint command: pnpm -r lint
  - Result: succeeded with no ESLint errors or warnings
- The repository is therefore buildable and lint-clean at the time of this audit.
- Runtime readiness beyond build/lint was not fully verified by starting the full stack end to end, so database connectivity, auth flow, MinIO integration, and background worker readiness remain to be validated in a live environment.

## Security Review
- Authentication basics are implemented and use hashed passwords and refresh-token rotation logic in [apps/api/src/auth/auth.service.ts](../apps/api/src/auth/auth.service.ts).
- Input validation is enabled globally in [apps/api/src/main.ts](../apps/api/src/main.ts) using Nest validation pipes.
- The repository does not yet appear to implement global exception filtering, rate limiting, or Helmet-based security hardening.
- The presence of uncommitted environment files and the current [.gitignore](../.gitignore) settings increase the risk of sensitive configuration being accidentally committed or exposed.
- No obvious hard-coded secrets were detected in the repository snapshot during the audit, but the presence of live environment configuration files in the working tree should be treated carefully.

## Missing Components
- RSS synchronization pipeline and parser infrastructure
- BullMQ queue worker and Redis-backed background jobs
- Offline/PWA support and download management
- A more complete player experience beyond the state store
- CI/CD automation for lint/build validation
- Test coverage for the authentication and podcast flows
- Full RTL/i18n infrastructure

## Technical Debt
- The repository shows active local changes in core auth and environment files, which suggests migration stabilization is still ongoing.
- The repository has documentation and implementation drift in a few areas, especially around folder structure expectations and future-phase implementation scope.
- The current setup is lightweight and MVP-friendly, but the missing security and infrastructure pieces could become liabilities if the project grows rapidly.

## Violations

### 1. Rule
Backend folder structure should follow the documented feature-module pattern more explicitly.

- Current state: The backend source tree uses direct feature folders such as [apps/api/src/auth](../apps/api/src/auth), [apps/api/src/podcasts](../apps/api/src/podcasts), and [apps/api/src/episodes](../apps/api/src/episodes) rather than a more explicit modules-based structure.
- Why it is a problem: This creates a mild mismatch with the documented architecture and can make future expansion less consistent.
- Recommended action: Introduce a more structured backend layout under a dedicated modules folder or formalize the current layout in the docs so the implementation and documentation stay aligned.

### 2. Rule
The repository should protect environment files from accidental commits.

- Current state: [.gitignore](../.gitignore) currently comments out the `.env` and `.env.local` ignore rules, while root [.env](../.env) and [apps/api/.env](../apps/api/.env) are present in the working tree.
- Why it is a problem: Environment files may be accidentally committed or exposed during migration and routine development.
- Recommended action: Re-enable `.env` ignore rules and sanitize any committed environment artifacts.

### 3. Rule
The implementation should reflect the documented MVP architecture for RSS, queue, and background processing readiness.

- Current state: The repository includes Prisma and podcast/episode modules, but there is no visible RSS parser, BullMQ worker, or Redis queue implementation yet.
- Why it is a problem: This is a key product capability called out in the architecture and roadmap; the current repo is not yet ready for that path.
- Recommended action: Add an explicit RSS sync module and queue foundation before relying on those features in the product flow.

### 4. Rule
Frontend should support the documented offline/PWA and RTL/i18n expectations.

- Current state: The frontend has App Router pages and state management, but there is no visible next-intl, RTL setup, PWA/service-worker, or offline storage workflow.
- Why it is a problem: These features are part of the intended product experience and should be planned and implemented deliberately rather than assumed.
- Recommended action: Introduce the minimum PWA/offline foundation and decide on the i18n/RTL strategy early in the next implementation stage.

### 5. Rule
Security middleware and hardening should be part of the backend baseline.

- Current state: The backend uses validation pipes and JWT auth, but there is no visible global exception filter, rate limiting, or Helmet-based security middleware.
- Why it is a problem: Security defaults are still thin for a production-oriented backend.
- Recommended action: Add a global exception filter, rate limiting for auth endpoints, and standard security headers.

### 6. Rule
The project documentation should stay synchronized with the codebase.

- Current state: The documentation set is present, but some implementation areas (especially the future-facing infrastructure and architecture expectations) are ahead of the codebase and do not yet fully map onto the current implementation state.
- Why it is a problem: Documentation drift can mislead contributors and weaken architectural discipline.
- Recommended action: Update the project documentation to reflect the current implementation baseline and clearly mark which roadmap items are still pending.

## Recommended Next Steps
### P0 - Blocking
- Reconcile the current working tree changes, especially in auth and environment files, before treating the migration as stabilized.
- Restore strict environment-file protection in Git so secrets do not leak accidentally.
- Clarify the backend structure decision so the implementation and the documented folder structure remain consistent.

### P1 - Important
- Add the missing RSS/queue foundation and document its status explicitly.
- Introduce a minimum security hardening layer for the API.
- Define the plan for offline/PWA and RTL/i18n support so they do not remain implicit.

### P2 - Future Improvement
- Add CI validation for build and lint on pull requests.
- Expand test coverage for auth, podcast, and episode flows.
- Review whether the current dependency set should be expanded for the next implementation phase or kept intentionally minimal for the MVP.
