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

## Current Ownership Summary

### Feature-owned responsibilities

- Episode-specific UI components such as [apps/web/src/features/episodes/EpisodeCard.tsx](../../apps/web/src/features/episodes/EpisodeCard.tsx) and [apps/web/src/features/episodes/EpisodeForm.tsx](../../apps/web/src/features/episodes/EpisodeForm.tsx)
- Future episode-specific hooks, formatting logic, and local interaction state
- Episode-focused composition that remains conceptually tied to the feature boundary

### Shared responsibilities

- Data access in [apps/web/src/lib/episodes.ts](../../apps/web/src/lib/episodes.ts)
- Shared UI primitives, layout, providers, and global state
- Future player infrastructure and global playback ownership

## Notes

این فاز در سطح documentation و planning باقی ماند و هیچ تغییر runtime، route، API contract، dependency یا UI behavior ایجاد نکرد.
