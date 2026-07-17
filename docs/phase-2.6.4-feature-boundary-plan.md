# Phase 2.6.4 — Feature Boundary Foundation Plan

## Status

Planned / Documentation-Only

## Objective

آماده‌سازی مرزهای مالکیت فرانت‌اند برای رشد تدریجی ویژگی‌ها بدون بازنویسی بزرگ، تغییر رفتار، یا تغییر مسیرهای فعلی. هدف این فاز، تعریف الگوی مالکیت feature-based برای آینده است تا auth، podcasts، episodes و featureهای بعدی مانند search، library، profile و player بتوانند به‌صورت مستقل و قابل‌نگهداری رشد کنند.

## Current Frontend Structure Analysis

ساختار فعلی فرانت‌اند در [apps/web/src](apps/web/src) از نظر معماری از نوع feature-based و route-based ترکیب شده است:

- [apps/web/src/app](apps/web/src/app): محل routeها و pageهای Next.js است. این پوشه مسئول ورود به صفحه‌ها و نگه‌داری ساختار مسیرهاست.
- [apps/web/src/components](apps/web/src/components): کامپوننت‌های UI، layout و auth shared نگهداری می‌شوند.
- [apps/web/src/features](apps/web/src/features): featureهای فعلی با محتوای تخصصی مانند podcast و episode در اینجا قرار دارند.
- [apps/web/src/providers](apps/web/src/providers): providerهای فرانت‌اند و تنظیمات shared infrastructure.
- [apps/web/src/shared](apps/web/src/shared): زیرساخت مشترک مانند API client، env، error handling و React Query.
- [apps/web/src/lib](apps/web/src/lib): لایه‌ی دسترسی به داده و منطق‌های مرتبط با featureها که هنوز در سطح مشترک/feature-mixed قرار دارند.

در حال حاضر، ساختار foundation و feature با هم هم‌پوشانی دارند، اما مرز مالکیت هنوز به‌صورت رسمی و مستند تعریف نشده است.

## Existing Feature Locations

### Authentication

کد مربوط به auth در چند نقطه پراکنده است:

- صفحات ورود و ثبت‌نام در [apps/web/src/app/login](apps/web/src/app/login) و [apps/web/src/app/register](apps/web/src/app/register)
- کامپوننت محافظ مسیر در [apps/web/src/components/auth](apps/web/src/components/auth)
- منطق auth در [apps/web/src/lib/auth.ts](apps/web/src/lib/auth.ts) و [apps/web/src/lib/auth-token.ts](apps/web/src/lib/auth-token.ts)
- state مربوط به session در [apps/web/src/stores/authStore.ts](apps/web/src/stores/authStore.ts)

### Podcasts

کد پادکست عمدتاً در این بخش‌ها متمرکز است:

- صفحات مربوط به پادکست در [apps/web/src/app/podcasts](apps/web/src/app/podcasts)
- کامپوننت‌های feature در [apps/web/src/features/podcasts](apps/web/src/features/podcasts)
- منطق داده و API در [apps/web/src/lib/podcasts.ts](apps/web/src/lib/podcasts.ts)

### Episodes

کد اپیزود نیز در این بخش‌ها دیده می‌شود:

- صفحات اپیزود در [apps/web/src/app/episodes](apps/web/src/app/episodes)
- کامپوننت‌های feature در [apps/web/src/features/episodes](apps/web/src/features/episodes)
- منطق داده و API در [apps/web/src/lib/episodes.ts](apps/web/src/lib/episodes.ts)

### Shared Code That Should Remain Outside Features

کدهای زیر باید در لایه‌ی shared یا foundation باقی بمانند، حتی اگر در آینده featureها رشد کنند:

- [apps/web/src/components/ui](apps/web/src/components/ui): کامپوننت‌های پایه‌ی UI
- [apps/web/src/components/layout](apps/web/src/components/layout): layout و shell مشترک
- [apps/web/src/providers](apps/web/src/providers): providerها و تنظیمات application-wide
- [apps/web/src/shared](apps/web/src/shared): API client، errors، env، React Query
- [apps/web/src/styles](apps/web/src/styles): design tokens و استایل پایه
- [apps/web/src/stores](apps/web/src/stores): stateهای global UI یا session که به‌صورت cross-feature استفاده می‌شوند

## Proposed Feature Boundary Structure

پیشنهاد این است که ساختار feature در فرانت‌اند به شکل زیر formalize شود:

```text
apps/web/src/
  app/                  # route entry points only
  components/           # shared UI and layout primitives
  features/
    auth/
    podcasts/
    episodes/
    search/
    library/
    profile/
    player/
  providers/
  shared/
  lib/
  stores/
  styles/
```

### Ownership Model

هر feature باید مالکیت این موارد را بر عهده بگیرد:

- کامپوننت‌های خاص آن feature
- فرم‌ها و stateهای مرتبط با آن feature
- hooks و منطق محلی در صورتی که به‌طور مستقیم به آن feature مربوط باشند
- انواع محلی و constants مربوط به همان feature

### Responsibility Boundaries

- Featureها باید فقط مسئول منطق، UI و داده‌های مربوط به خود باشند.
- routeها در [apps/web/src/app](apps/web/src/app) باید فقط به عنوان entry point عمل کنند و نه محل اصلی پیاده‌سازی feature logic.
- کامپوننت‌های مشترک و infrastructure باید در خارج از featureها باقی بمانند.

### What Belongs Inside a Feature

مواردی که باید داخل feature قرار بگیرند:

- صفحه یا بخش خاص مربوط به آن feature
- کامپوننت‌های UI مربوط به همان feature
- فرم‌های مرتبط با آن feature
- hookهای محلی و منطق‌های تخصصی
- نوع‌ها و ثابت‌های مورد استفاده فقط در آن feature

### What Must Remain Shared

مواردی که نباید به featureها منتقل شوند:

- design system primitives
- layout و app shell
- providerهای global
- API client و error handling مشترک
- stateهای global UI یا session
- utilities عمومی و abstractions cross-cutting

## Feature Ownership Rules

### Auth Ownership Example

- routeهای auth مانند login و register در [apps/web/src/app](apps/web/src/app) به‌عنوان entry point باقی می‌مانند.
- هر چیز مرتبط با تجربه‌ی ورود/ثبت‌نام و session-aware UI در آینده باید در قالب feature auth سازمان‌دهی شود.
- guarded routes، redirect و منطق auth shared باید در لایه‌ی shared یا components/auth shared باقی بمانند تا از تکرار جلوگیری شود.

### Podcast Ownership Example

- pages و UI مرتبط با podcast در [apps/web/src/app/podcasts](apps/web/src/app/podcasts) و [apps/web/src/features/podcasts](apps/web/src/features/podcasts) به‌عنوان مالکیت feature podcast در نظر گرفته می‌شوند.
- کامپوننت‌های خاص پادکست مانند card، form و details باید در داخل feature podcast نگهداری شوند.
- shared UI primitives و API infrastructure باید خارج از این feature باقی بمانند.

### Episode Ownership Example

- pages و UI مرتبط با episode در [apps/web/src/app/episodes](apps/web/src/app/episodes) و [apps/web/src/features/episodes](apps/web/src/features/episodes) تحت مالکیت feature episode قرار می‌گیرند.
- فرم‌ها و نمایش‌های اپیزود باید در feature episode نگهداری شوند.
- لایه‌های shared مثل API client، providers و layout به‌صورت مشترک باقی می‌مانند.

### Future Feature Ownership Examples

- Search: صفحات و UI مرتبط با جستجو در feature search قرار می‌گیرند، در حالی که layout و shared UI در خارج از feature باقی می‌مانند.
- Library: تجربه‌ی کتابخانه و stateهای مرتبط با آن در feature library نگهداری می‌شود.
- Profile: بخش profile و فرم‌های مرتبط آن در feature profile قرار می‌گیرد.
- Player: منطق و UI پخش در feature player متمرکز می‌شود، در حالی که shared player shell و providers در لایه‌ی foundation می‌مانند.

## Migration Strategy

مهاجرت باید به‌صورت تدریجی و بدون ریسک انجام شود.

### Phase 1 — Documentation and Convention

- تعریف قواعد مالکیت feature
- ثبت مثال‌های روشن برای auth، podcasts و episodes
- مشخص‌کردن اینکه کدام بخش‌ها shared و کدام feature-owned هستند

### Phase 2 — Non-Breaking Adoption

- در featureهای فعلی، فقط ساختار folder و ownership را به‌صورت رسمی مستند و به‌کار گرفته شود
- بدون تغییر routeها، بدون تغییر API، بدون تغییر رفتار
- اگر در آینده بخشی از کد feature به feature folder منتقل شود، فقط importها و مسیرهای مربوطه به‌صورت محلی به‌روزرسانی شوند

### Phase 3 — Incremental Move of Feature Code

- کامپوننت‌های تخصصی podcast و episode به‌صورت تدریجی در feature folderهای مربوطه قرار بگیرند
- منطق‌های مرتبط با auth و profile در featureهای خود نگهداری شوند
- بخش‌های truly shared هرگز به‌صورت غیرضروری جابه‌جا نشوند

### Guardrails

برای جلوگیری از refactor بزرگ:

- هیچ فایل فعلی بدون نیاز به‌صورت دسته‌جمعی جابه‌جا نشود
- ساختار routeها دست‌نخورده باقی بماند
- رفتار UI و API بدون تغییر بماند
- importها فقط در صورت لزوم و با حداقل تغییر به‌روزرسانی شوند

## Allowed Changes

در این فاز فقط موارد زیر مجاز هستند:

- تعریف قرارداد folder structure برای featureها
- مستندسازی ownership rules
- ثبت boundary و responsibility برای هر feature
- اضافه‌کردن مثال‌های روشن برای feature و shared code
- آماده‌سازی checklist مهاجرت برای فازهای بعدی

## Forbidden Changes

در این فاز هیچ‌کدام از موارد زیر مجاز نیست:

- جابه‌جا کردن فایل‌های فعلی به‌صورت mass refactor
- تغییر کامپوننت‌های موجود
- تغییر importها در سطح وسیع
- تغییر routeها یا URLها
- پیاده‌سازی feature جدید
- افزودن hookها، serviceها یا لایه‌های داده جدید
- اتصال جدید به API یا تغییر رفتارهای فعلی

## Expected Files To Create Or Modify

### Create

- [docs/phase-2.6.4-feature-boundary-plan.md](docs/phase-2.6.4-feature-boundary-plan.md)

### Potential Future Documentation Updates After Approval

- [docs/folder-structure.md](docs/folder-structure.md)
- [docs/architecture.md](docs/architecture.md)
- [docs/project-status.md](docs/project-status.md)

## Risks and Guardrails

- ابهام در مرز بین feature-specific و shared code
- پراکندگی فعلی auth، podcast و episode در چند لایه
- احتمال ایجاد over-structure در صورت تعریف بیش از حد دقیق
- افزایش پیچیدگی در صورت مهاجرت زودهنگام بدون نیاز

Guardrails پیشنهادی:

- از جابه‌جایی دسته‌جمعی فایل‌ها خودداری شود.
- routeها، APIs و رفتار فعلی دست‌نخورده باقی بمانند.
- هر مهاجرت بعدی فقط با مستندات روشن و حداقل تغییر انجام شود.
- shared layer فقط برای موارد truly shared استفاده شود.

## Future Migration Checklist

- [ ] مرز feature/shared در مستندات پروژه ثبت شود.
- [ ] برای هر feature فعلی یک مثال مالکیت روشن تعریف شود.
- [ ] در صورت نیاز، فقط یک feature در هر مرحله به‌صورت تدریجی بازآرایی شود.
- [ ] importها و routeها بدون تغییر رفتار به‌روزرسانی شوند.
- [ ] بررسی شود که feature جدید از shared infrastructure استفاده کند و نه از ساختارهای اختصاصی غیرضروری.

## Next Implementation Steps

1. تأیید دامنه این فاز با توجه به محدودیت‌های گفته‌شده.
2. ثبت قواعد ownership و boundary در مستندات پروژه.
3. تعریف نمونه‌ی عملی برای هر feature فعلی و featureهای آینده.
4. آماده‌سازی checklist مهاجرت برای فازهای بعدی بدون اعمال تغییر در کد.
5. در صورت تأیید، اجرای مرحله‌ی بعدی با حداقل تغییر و بدون شکستن ساختار فعلی.
