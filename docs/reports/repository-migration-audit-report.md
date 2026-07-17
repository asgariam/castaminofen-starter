# Repository Migration Audit Report

## Status
Needs Attention

## Git Migration Status

- Current branch: main
- Remote origin: https://github.com/ProCooper004/castaminofen-starter
- Upstream remote: https://github.com/PicoRmin/castaminofen-starter.git
- Uncommitted changes: none detected (git status returned an empty working tree)
- Detached HEAD: none detected
- Git configuration: user.name and user.email are both set locally
- Note: the repository is not currently in a detached HEAD state, and the migration does not appear to have introduced an active Git checkout problem

## Architecture Compliance

- The repository is structured as a monorepo with separate web and API applications, which aligns with the documented high-level direction.
- The backend uses NestJS with Prisma and a versioned API prefix of /api/v1, which is consistent with the documented architecture.
- The frontend uses Next.js App Router and React Query, which partially aligns with the documented stack.
- Gaps remain compared with the documented architecture:
  - The architecture docs describe feature modules under src/modules, but the current implementation places feature folders directly under src/ (for example src/auth, src/podcasts, src/episodes).
  - The documented RSS/queue/offline architecture is not yet implemented; there is no BullMQ, Redis queue worker flow, or offline/PWA layer in the current codebase.
  - The documented global error handling and shared backend infrastructure layers are not yet fully reflected in the implementation.

## Folder Structure Compliance

- The requested documents docs/03-folder-structure.md and docs/02-architecture.md are not present in the repository. The audit used the existing equivalents docs/folder-structure.md and docs/architecture.md.
- The repository does contain the expected top-level monorepo folders:
  - apps/web
  - apps/api
  - packages/shared-types
  - docs
  - docker-compose.yml
- The current structure is partially aligned with the documented folder structure:
  - Present: apps/web/src/app, apps/web/src/components, apps/web/src/features, apps/api/src/auth, apps/api/src/podcasts, apps/api/src/episodes, apps/api/prisma
  - Missing or not yet implemented compared with the documentation: packages/ui, apps/web/src/shared, apps/web/src/styles, apps/web/src/service-worker, apps/web/public, apps/api/src/modules, apps/api/src/config, apps/api/src/database, apps/api/test
- The frontend folder is still a foundation scaffold rather than a fully feature-complete structure.

## Dependency Compliance

- The declared root package manager is pnpm, and the workspace configuration is present via pnpm-workspace.yaml.
- The main dependencies that are present and align with the documented stack include:
  - Next.js in apps/web/package.json
  - NestJS in apps/api/package.json
  - Prisma and @prisma/client in apps/api/package.json
  - React Query, React Hook Form, Zod, Zustand in apps/web/package.json
- Important dependencies documented in docs/tech-stack.md and docs/dependencies.md are still missing from the actual manifests:
  - Tailwind CSS, PostCSS, Autoprefixer
  - next-pwa / Workbox
  - idb
  - next-intl
  - framer-motion
  - axios
  - @nestjs/bullmq, bullmq, ioredis
  - rss-parser, fast-xml-parser
  - @nestjs/throttler, helmet
  - testing packages such as jest, ts-jest, supertest
- Verification result:
  - Backend build attempt failed with: "nest: not found"
  - Frontend build attempt failed with: "next: not found"
  - This indicates that workspace dependencies are not currently available to run the apps from the installed environment state

## Configuration Issues

- Mixed package-manager artifacts are present:
  - pnpm-lock.yaml exists
  - package-lock.json also exists
  - This suggests previous npm-based installation activity alongside the pnpm workspace setup
- The project uses pnpm workspaces, but there is no turbo.json in the repository. This is not a blocker, but it differs from the documented monorepo example.
- The repository contains .env and .env.example, so the base environment file structure is present.
- The API TypeScript configuration reports a compiler issue in apps/api/tsconfig.json related to rootDir/outDir layout, which should be reviewed during a future build cleanup.
- The web app uses the App Router and a path alias of @/*, and the source tree currently resolves imports without obvious missing-path issues in the inspected files.

## Missing Components

- docs/03-folder-structure.md and docs/02-architecture.md are referenced by the audit request but are not present; the repository currently uses docs/folder-structure.md and docs/architecture.md instead.
- The documented Tailwind-based frontend setup is incomplete: no tailwind.config.ts or corresponding dependency set was found in the package manifests.
- The documented offline/PWA stack is not present.
- The documented queue and RSS processing stack is not present.
- The documented test infrastructure and shared backend infrastructure directories are not yet implemented.

## Recommended Next Steps

1. Run a fresh workspace installation from the repository root with pnpm install to restore the intended dependency state.
2. Remove the npm lockfile or standardize on pnpm exclusively to avoid package-manager drift.
3. Re-run the API and web builds after installation to confirm the environment is healthy.
4. Align the implementation with the documented architecture incrementally, especially around backend module structure, queue/RSS flow, and offline/PWA support.
5. Revisit the TypeScript configuration for the API build output path and resolve any compiler warnings before treating the build as healthy.
