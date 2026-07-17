# Phase 2.7.3 — Episode Feature Boundary Adoption Report

## Objective

تثبیت مرز مالکیت فرانت‌اند برای feature اپیزود با حفظ رفتار فعلی و بدون تغییر routeها، قرارداد API، یا runtime behavior.

## Scope

- تحلیل ساختار فعلی episode در frontend
- بررسی route و feature layer موجود
- تعریف ownership boundary برای episode feature
- مستندسازی migration strategy آینده
- تأیید اینکه این فاز documentation-only است

## Implemented Work

- Reviewed the current episode frontend structure and existing feature ownership patterns.
- Confirmed that episode-specific UI components already live under [apps/web/src/features/episodes](../../apps/web/src/features/episodes).
- Documented the recommended ownership boundary for route entry points, feature-local UI, and shared infra responsibilities.
- Added a future migration checklist and guardrails for episode ownership without changing runtime behavior.

## Files Added

- [docs/phase-2.7.3-episode-feature-boundary-plan.md](../phase-2.7.3-episode-feature-boundary-plan.md)
- [docs/phases/phase-2.7.3-episode-feature-boundary-report.md](phase-2.7.3-episode-feature-boundary-report.md)

## Current Ownership State

Episode currently has a mixed ownership model:

### Route Layer

- Next.js route entry point
- Page-level composition
- Data orchestration currently living close to the route

### Feature Layer

- Episode-specific reusable UI components such as [apps/web/src/features/episodes/EpisodeCard.tsx](../../apps/web/src/features/episodes/EpisodeCard.tsx) and [apps/web/src/features/episodes/EpisodeForm.tsx](../../apps/web/src/features/episodes/EpisodeForm.tsx)
- Future feature-local hooks
- Episode interaction logic

### Shared Layer

- Data access in [apps/web/src/lib/episodes.ts](../../apps/web/src/lib/episodes.ts)
- Shared UI primitives, layout, providers, and global state
- Global infrastructure such as the future player ownership boundary

## Naming Note

The repository folder naming may use `episodes`, while the conceptual ownership boundary remains the Episode feature.

## API Ownership Rule

Episode feature may consume episode-related data operations, but API client implementation and transport concerns remain outside the feature boundary.

The feature owns business-facing UI behavior, not network infrastructure.

## Podcast and Episode Relationship

Podcast feature may compose Episode components (for example episode lists or episode previews).

However:

- Podcast does not own Episode implementation.
- Episode remains owner of episode-specific UI and interactions.
- Communication should happen through shared contracts or data access layers.

## Future Migration Checklist

- [ ] Route logic and feature logic are clearly separated
- [ ] Episode page composition can move behind feature boundary
- [ ] Episode-specific hooks live inside feature ownership
- [ ] Episode validation and formatting remain feature-owned
- [ ] API transport stays outside feature
- [ ] Player state remains independent
- [ ] Build and lint validation run after migration

## Recommended PR Metadata

### Title

`docs(frontend): define episode feature ownership boundary`

### Description

## Summary

Define the frontend ownership boundary for the Episode feature.

This documentation-only phase aligns Episode with the existing feature-boundary adoption model used in Auth and Podcast.

## Changes

- Documented current Episode ownership state
- Defined route, feature, and shared responsibilities
- Added API ownership rules
- Clarified Podcast/Episode relationship
- Added future migration guardrails

## Validation

- No runtime changes
- No route changes
- No API contract changes
- No dependency changes
- No UI changes

## Notes

این فاز در سطح documentation و planning باقی ماند و هیچ تغییر runtime، route، API contract، dependency یا UI behavior ایجاد نکرد.
