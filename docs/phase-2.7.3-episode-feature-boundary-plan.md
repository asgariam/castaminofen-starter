# Phase 2.7.3 — Episode Feature Boundary Adoption Plan

## Status

Planned / Documentation-Only

## Objective

تثبیت مرز مالکیت فرانت‌اند برای feature اپیزود بر اساس الگوی feature-boundary تعریف‌شده در Phase 2.6.4 و الگوی adoption استفاده‌شده در Auth و Podcast.

هدف این فاز:

- مشخص‌کردن مالکیت feature episode
- تفکیک مسئولیت route، feature و shared infrastructure
- آماده‌سازی مسیر مهاجرت تدریجی آینده
- بدون تغییر رفتار runtime، UI، routeها، API contracts یا dependencyها

این فاز صرفاً برای روشن‌سازی ownership و آماده‌سازی ساختار آینده است.

---

## Scope Rules

### Allowed during this phase

- تحلیل ساختار فعلی episode در frontend
- بررسی routeهای episode
- بررسی feature components و hooks موجود
- تعریف مرز feature-owned و shared-owned
- مستندسازی ownership model
- تعریف migration checklist آینده

### Forbidden during this phase

- جابه‌جایی فایل‌ها
- تغییر importها
- تغییر routeها یا URLها
- تغییر API contract
- افزودن dependency
- تغییر UI
- refactor منطق episode
- اضافه‌کردن player/download functionality
- تغییر state management

---

## Current Structure Analysis

### 1. Route Layer

مسیری که در حال حاضر برای اپیزود در فرانت‌اند وجود دارد:

- [apps/web/src/app/episodes/[id]/page.tsx](../apps/web/src/app/episodes/[id]/page.tsx)

تحلیل:

- این route به‌عنوان entry point عمل می‌کند.
- در حال حاضر logic مربوط به fetch، mutation، state محلی فایل و composition UI در همین صفحه قرار دارد.
- این ساختار نشان می‌دهد route هنوز نقش entry point دارد اما در آینده باید بیشتر به feature-owned composition واگذار شود.
- از نظر ownership، route در حال حاضر مسئولیت‌های episode-specific را به‌صورت مستقیم برعهده دارد؛ این موضوع برای adoption آینده باید شفاف‌تر شود.

### 2. Feature Layer

در مسیر feature فعلی:

- [apps/web/src/features/episodes/EpisodeCard.tsx](../apps/web/src/features/episodes/EpisodeCard.tsx)
- [apps/web/src/features/episodes/EpisodeForm.tsx](../apps/web/src/features/episodes/EpisodeForm.tsx)

تحلیل:

- componentهای اختصاصی episode از قبل در feature قرار گرفته‌اند.
- این بخش‌ها به‌خوبی قابل‌تلقی به‌عنوان feature-owned UI هستند.
- در آینده باید موارد زیر نیز در همین boundary نگه‌داشته شوند:
  - episode-specific UI composition
  - episode-specific hooks
  - episode-specific validation
  - episode-specific formatting
  - local interaction state

### 3. Data Layer

فایل داده فعلی:

- [apps/web/src/lib/episodes.ts](../apps/web/src/lib/episodes.ts)

تحلیل:

- این لایه در حال حاضر abstraction برای دسترسی به API است.
- اصل پیشنهادی برای این فاز این است که این لایه همچنان shared باقی بماند.
- request construction، endpoint access و API communication در shared infrastructure باقی بماند.
- منطق مربوط به نمایش، formatting و interaction-specific episode باید در feature قرار گیرد.

---

## Current Ownership State

Episode currently has a mixed ownership model:

### Route Layer

Responsibilities:
- Next.js route entry point
- Page-level composition
- Data orchestration currently living close to the route

### Feature Layer

Responsibilities:
- Episode-specific reusable UI components
- Future feature-local hooks
- Episode interaction logic

### Shared Layer

Responsibilities:
- API communication abstraction
- Shared UI primitives
- Global infrastructure

## Naming Note

The repository folder naming may use `episodes`, while the conceptual ownership boundary remains the Episode feature.

## API Ownership Rule

Episode feature may consume episode-related data operations, but API client implementation and transport concerns remain outside the feature boundary.

The feature owns business-facing UI behavior, not network infrastructure.

## Expected Ownership Boundary

### Episode Feature Owns

موارد زیر در آینده باید متعلق به feature episode باشند:

- UI اختصاصی episode
- composition صفحات episode
- hookهای episode-specific
- validationهای تخصصی episode
- Episode-specific types that are not shared contracts
- منطق formatting episode
- stateهای تعاملی محلی

### Shared Layer Owns

موارد زیر خارج از feature باقی بمانند:

- API client abstraction
- React Query configuration
- error handling مشترک
- UI primitives
- layout و shell
- providers
- global stores
- مرز مالکیت feature Player و زیرساخت‌های playback مشترک در آینده

---

## Podcast and Episode Relationship

Podcast feature may compose Episode components (for example episode lists or episode previews).

However:

- Podcast does not own Episode implementation.
- Episode remains owner of episode-specific UI and interactions.
- Communication should happen through shared contracts or data access layers.

---

## Player Future Boundary

با توجه به roadmap، Player در آینده feature مستقل خواهد بود.

بنابراین:

- Episode feature نباید مالک audio playback engine باشد.
- queue management، global player state و mini player UI خارج از ownership episode باقی بمانند.
- Episode فقط باید metadata، اطلاعات episode و actions مرتبط با آن را ارائه کند.

---

## Migration Strategy

### Phase 1 — Documentation Alignment

- ثبت ownership فعلی
- مشخص‌کردن نقاط ضعف boundary
- تعریف مسئولیت آینده

### Phase 2 — Non-Breaking Adoption

- حفظ ساختار فعلی
- بدون mass move
- بدون تغییر route
- بدون تغییر API

### Phase 3 — Incremental Migration

در صورت نیاز:

- انتقال UI تخصصی episode
- انتقال hookهای feature-specific
- انتقال validation logic
- اصلاح محدود importها

---

## Risks

- coupling زیاد بین podcast و episode
- وابستگی آینده player به episode
- انتقال زودهنگام business logic
- ایجاد feature boundary بیش از حد پیچیده

---

## Guardrails

- Episode نباید تبدیل به محل نگهداری player شود.
- Shared layer نباید شامل UI اختصاصی episode شود.
- هیچ migration بدون نیاز واقعی انجام نشود.
- اولویت با حفظ runtime behavior است.

---

## Future Migration Checklist

- [ ] Route logic and feature logic are clearly separated
- [ ] Episode page composition can move behind feature boundary
- [ ] Episode-specific hooks live inside feature ownership
- [ ] Episode validation and formatting remain feature-owned
- [ ] API transport stays outside feature
- [ ] Player state remains independent
- [ ] Build and lint validation run after migration

---

## Validation Summary

این فاز فقط documentation و ownership planning است:

- هیچ code change انجام نمی‌شود.
- هیچ route تغییر نمی‌کند.
- هیچ API تغییر نمی‌کند.
- هیچ dependency اضافه نمی‌شود.
- هیچ رفتار runtime تغییر نمی‌کند.

هدف:

ایجاد یک feature boundary پایدار برای Episode قبل از ورود به featureهای بزرگ‌تر مانند Player، Library و Search.
