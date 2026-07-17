# Phase 2.7.2 — Podcast Feature Boundary Adoption Report

## Objective

تثبیت مرز مالکیت فرانت‌اند برای feature پادکست با حفظ رفتار فعلی و بدون تغییر routeها، قرارداد API، یا runtime behavior.

## Scope

- انتقال منطق فرم و validation تخصصی پادکست به داخل feature
- نگه‌داشتن route pages به‌عنوان entry point
- حفظ shared infrastructure و shared API abstraction خارج از feature
- تأیید build و lint

## Implemented Work

- Added a dedicated podcast form schema and normalization utility under [apps/web/src/features/podcasts/utils/podcastForm.ts](../../apps/web/src/features/podcasts/utils/podcastForm.ts)
- Added a feature-owned field composition component at [apps/web/src/features/podcasts/components/PodcastFormFields.tsx](../../apps/web/src/features/podcasts/components/PodcastFormFields.tsx)
- Updated the create and edit podcast route pages to consume the feature-owned form logic without changing their public routes or page behavior

## Files Changed

- [apps/web/src/app/podcasts/new/page.tsx](../../apps/web/src/app/podcasts/new/page.tsx)
- [apps/web/src/app/podcasts/[id]/edit/page.tsx](../../apps/web/src/app/podcasts/[id]/edit/page.tsx)
- [apps/web/src/features/podcasts/components/PodcastFormFields.tsx](../../apps/web/src/features/podcasts/components/PodcastFormFields.tsx)
- [apps/web/src/features/podcasts/utils/podcastForm.ts](../../apps/web/src/features/podcasts/utils/podcastForm.ts)
- [docs/project-status.md](../project-status.md)
- [docs/development/changelog.md](../development/changelog.md)

## Validation

- Web build: passed with `pnpm --filter @castaminofen/web build`
- Web lint: passed with `pnpm --filter @castaminofen/web lint`

## Notes

این تغییر بر اساس الگوی feature-boundary قبلی برای auth انجام شد و مرز مالکیت پادکست را شفاف‌تر کرد بدون ایجاد تغییرات رفتاری یا مهاجرت گسترده فایل‌ها.
