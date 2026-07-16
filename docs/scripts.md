# Castaminofen Scripts Documentation

This document contains all available project scripts and their purposes.

Every script created in the project must be documented here.

---

# Root Scripts

## Development

### dev

Location:

package.json

Command:

```bash
pnpm dev

Purpose:

Starts all development applications.

Applications:

Frontend
Backend

Environment:

Requires:

.env files configured
Build
build

Location:

package.json

Command:

pnpm build

Purpose:

Builds all applications for production.

Lint
lint

Location:

package.json

Command:

pnpm lint

Purpose:

Checks code quality and formatting rules.

Backend Scripts

Location:

apps/api/package.json

Prisma Generate

Command:

pnpm prisma generate

Purpose:

Generates Prisma Client after schema changes.

Prisma Migration

Command:

pnpm prisma migrate dev

Purpose:

Creates and applies database migrations during development.

Frontend Scripts

Location:

apps/web/package.json

(Will be documented when created)

Infrastructure Scripts

(Reserved for Docker, deployment and maintenance scripts)

Notes

This file must be updated whenever a new script is introduced.