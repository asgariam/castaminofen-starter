# Phase 2.5 — Frontend Foundation Plan

## Status

Planned — آماده برای تأیید قبل از شروع پیاده‌سازی.

## Objective

طراحی و تثبیت لایه‌ی پایه‌ی فرانت‌اند برای MVP Castaminofen با تمرکز روی:

- معماری موبایل‌فرست و ساده
- شل اپلیکیشن (application shell)
- سیستم طراحی واحد برای UI
- لایه‌ی state و API مناسب برای آینده
- حفظ محدودیت MVP و جلوگیری از Over Engineering

هدف این فاز، آماده‌سازی زیرساختی است که صفحات بعدی مثل پادکست، اپیزود، جستجو، کتابخانه و player را بدون بازنویسی گسترده پشتیبانی کند.

## Current Frontend State

وضعیت فعلی در [apps/web](apps/web) به‌صورت زیر است:

- ساختار Next.js App Router در [apps/web/src/app](apps/web/src/app) وجود دارد.
- صفحات پایه‌ای auth و podcast در حال حاضر در [apps/web/src/app/login](apps/web/src/app/login)، [apps/web/src/app/register](apps/web/src/app/register)، [apps/web/src/app/profile](apps/web/src/app/profile) و [apps/web/src/app/podcasts](apps/web/src/app/podcasts) موجود هستند.
- کامپوننت‌های مشترک UI در [apps/web/src/components/ui](apps/web/src/components/ui) قرار دارند و شامل button، card، input، loading/error state هستند.
- لایه‌ی داده و API در [apps/web/src/lib](apps/web/src/lib) آماده شده و شامل wrapper عمومی در [apps/web/src/lib/api.ts](apps/web/src/lib/api.ts) است.
- مدیریت state با React Query در [apps/web/src/providers/react-query-provider.tsx](apps/web/src/providers/react-query-provider.tsx) و Zustand در [apps/web/src/stores/authStore.ts](apps/web/src/stores/authStore.ts) و [apps/web/src/stores/playerStore.ts](apps/web/src/stores/playerStore.ts) انجام می‌شود.

با این حال، لایه‌ی پایه‌ی UI هنوز در حد MVP اولیه است و نیازمند تثبیت در حوزه‌های زیر است:

- shell ثابت اپلیکیشن با header و navigation مناسب
- سیستم token/spacing/color و theme foundation
- حالت‌های empty/loading/error استانداردتر
- پشتیبانی RTL و dark/light mode پایه
- فضای آماده برای player foundation بدون پیچیدگی بیش از حد

## Documentation Requirements

این برنامه باید با مستندات زیر هم‌راستا باشد:

- [docs/architecture.md](docs/architecture.md)
- [docs/folder-structure.md](docs/folder-structure.md)
- [docs/tech-stack.md](docs/tech-stack.md)
- [docs/dependencies.md](docs/dependencies.md)
- [docs/ui-ux-design-system.md](docs/ui-ux-design-system.md)
- [docs/mvp.md](docs/mvp.md)
- [docs/roadmap.md](docs/roadmap.md)
- [docs/project-status.md](docs/project-status.md)
- [docs/reports/current-project-status-audit-report.md](docs/reports/current-project-status-audit-report.md)
- [docs/reports/phase-2.4.4-stabilization-report.md](docs/reports/phase-2.4.4-stabilization-report.md)

الزامات اصلی:

- MVP-first بودن حفظ شود.
- هیچ ویژگی آینده‌ای مثل AI، social feed، live audio یا پشتیبانی گسترده PWA در این فاز پیاده‌سازی نشود.
- معماری feature-based باقی بماند.
- سادگی و خوانایی بر پیچیدگی ترجیح داده شود.

## Architecture Decisions

تصمیم‌های معماری لازم قبل از شروع کدنویسی:

1. Next.js App Router به‌عنوان چارچوب اصلی حفظ شود.
2. Server Components به‌عنوان پیش‌فرض باقی بمانند و فقط کامپوننت‌های تعاملی با use client مشخص شوند.
3. لایه‌ی shared UI در [apps/web/src/components/ui](apps/web/src/components/ui) نگه‌داشته شود و کامپوننت‌های business-specific در feature folders قرار گیرند.
4. React Query فقط برای server state استفاده شود؛ Zustand فقط برای stateهای سراسری UI مثل auth و player.
5. player foundation فقط به‌صورت state و shell اولیه پیاده‌سازی شود، نه یک implementation کامل پخش صوت.
6. RTL به‌عنوان جهت پیش‌فرض رابط در نظر گرفته شود و از logical properties برای spacing و alignment استفاده شود.
7. طراحی dark mode به‌عنوان حالت پیش‌فرض و light mode به‌عنوان حالت اختیاری در نظر گرفته شود.
8. برای این فاز، سیستم i18n به‌صورت پایه و بدون پیچیدگی زیاد تنظیم شود؛ ترجمه‌ی کامل و چندزبانه بودن به فازهای بعد موکول شود.

## Dependency Review

### وابستگی‌های فعلی موجود

بر اساس [apps/web/package.json](apps/web/package.json)، وابستگی‌های زیر در حال حاضر در دسترس هستند:

- Next.js
- React و React DOM
- TypeScript
- React Query
- Zustand
- React Hook Form
- Zod
- Lucide Icons
- clsx

### وابستگی‌های مورد نیاز برای Foundation این فاز

به‌صورت عملی، این فاز می‌تواند با وابستگی‌های فعلی شروع شود و بدون نیاز به اضافه‌کردن بسته‌های جدید به‌صورت فوری پیش برود. با این حال، برای تکمیل بهتر foundation در آینده، موارد زیر در نظر گرفته می‌شوند:

- next-intl: برای پشتیبانی از متن‌های قابل ترجمه و آماده‌سازی RTL/i18n
- next-pwa یا Workbox: برای PWA در فازهای بعد، اما نه برای MVP اولیه
- idb: برای storage آفلاین در فازهای بعد
- framer-motion: برای transition‌های ظریف، ولی اختیاری و نه ضروری برای این فاز

### نتیجه‌ی بررسی وابستگی

- هیچ وابستگی جدیدی در این فاز لازم نیست.
- بهتر است در این مرحله از ساختار فعلی استفاده شود و فقط در صورت نیاز واقعی، وابستگی‌های جدید به‌صورت محدود اضافه شوند.
- وابستگی‌های اضافی که به‌طور مستقیم برای MVP ضروری نیستند، باید به تعویق بیفتند.

## Design System Plan

### 1. Typography system

- استفاده از فونت قابل‌خواندن و سازگار با فارسی و انگلیسی، با تمرکز بر Vazirmatn یا Inter/Fallback مناسب.
- مقیاس متن بر مبنای Tailwind scale استاندارد و بدون شلوغی بیش از حد.
- برای عنوان‌ها از سایزهای بزرگ‌تر و برای متن اصلی از اندازه‌های متوسط و خوانا استفاده شود.

### 2. Color tokens

- تعریف tokens برای background، surface، text، border، accent و status colors در سطح CSS variables.
- حالت dark به‌عنوان پیش‌فرض و light به‌عنوان حالت مکمل.
- رنگ accent باید در مرحله‌ی طراحی نهایی برند مشخص شود، اما برای MVP می‌توان از یک رنگ ثابت ساده و قابل‌خواندن استفاده کرد.

### 3. Spacing system

- استفاده از مقیاس spacing Tailwind استاندارد با واحد 4px.
- فاصله‌های بین بخش‌ها، کارت‌ها و فرم‌ها باید منسجم و یکنواخت باشند.
- برای layout موبایل، padding و gapهای حداقلی اما کافی در نظر گرفته شوند.

### 4. Responsive rules

- طراحی از موبایل شروع شود و در صفحه‌های بزرگ‌تر، max-width مناسب و spacing بهتر اعمال شود.
- برای دسکتاپ، محدودیت عرض محتوا حفظ شود تا تجربه موبایل‌محور حفظ شود.
- در هر صفحه، layout اصلی باید در عرض‌های کوچک، متوسط و بزرگ قابل‌خواندن باشد.

### 5. Dark mode foundation

- dark mode به عنوان حالت پیش‌فرض به‌صورت CSS variable پیاده‌سازی شود.
- در صورت نیاز، light mode در نسخه‌ی بعدی قابل فعال‌سازی باشد.
- تمام کامپوننت‌های پایه باید به‌صورت theme-aware ساخته شوند.

### 6. RTL support

- جهت پیش‌فرض HTML روی RTL تنظیم شود.
- در کامپوننت‌های UI از logical properties استفاده شود.
- آیکون‌های جهت‌دار و layout‌های با alignment خاص باید در راستا‌ی RTL بررسی شوند.

### 7. Reusable components

کامپوننت‌های پایه‌ی مورد نیاز برای MVP:

- Button
- Input
- Card
- Modal
- LoadingState
- EmptyState
- ErrorState
- SectionHeader
- ScreenContainer

این کامپوننت‌ها باید بدون منطق کسب‌وکار باشند و فقط ظاهر و رفتار UI را پوشش دهند.

### 8. Mobile-first layout

- تجربه کاربری باید شبیه اپ موبایل باشد.
- بخش‌های اصلی مثل header، mini player و bottom navigation باید در دسترس و قابل‌دسترسی باشند.
- فضای صفحه باید به‌جای شلوغی، روی خوانایی و دسترسی تمرکز کند.

## Application Shell Plan

### 1. Root layout

در [apps/web/src/app/layout.tsx](apps/web/src/app/layout.tsx) باید:

- metadata اولیه برای برند تنظیم شود
- providers اصلی قرار گیرند
- shell عمومی صفحه با header و container مشترک ایجاد شود
- dir RTL در سطح root تعیین شود

### 2. Providers

در [apps/web/src/providers/react-query-provider.tsx](apps/web/src/providers/react-query-provider.tsx) باید لایه‌ی provider به‌صورت واضح و ساده نگه داشته شود و از پیچیدگی اضافی پرهیز شود.

### 3. Global styles

در [apps/web/src/app/globals.css](apps/web/src/app/globals.css) باید:

- CSS variables برای theme foundation تعریف شوند
- استایل پایه برای body، typography و spacing تنظیم شوند
- کلاس‌های عمومی برای page container، section spacing و card styling ایجاد شوند

### 4. Theme handling

- theme handling اولیه فقط در سطح CSS variables انجام شود
- بدون ایجاد abstraction پیچیده برای theme switcher در این فاز
- dark mode به‌عنوان default حفظ شود

### 5. Metadata

- عنوان و توضیحات صفحه برای Castaminofen در layout تنظیم شود
- metadata برای صفحات مهم بعداً تکمیل شود

## Component Foundation Plan

### Shared UI foundations

کامپوننت‌های زیر باید به‌صورت استاندارد و قابل استفاده مجدد طراحی شوند:

- [apps/web/src/components/ui/button.tsx](apps/web/src/components/ui/button.tsx)
- [apps/web/src/components/ui/input.tsx](apps/web/src/components/ui/input.tsx)
- [apps/web/src/components/ui/card.tsx](apps/web/src/components/ui/card.tsx)
- [apps/web/src/components/ui/loading-state.tsx](apps/web/src/components/ui/loading-state.tsx)
- [apps/web/src/components/ui/error-state.tsx](apps/web/src/components/ui/error-state.tsx)

### Layout components

برای ساختار کلی صفحه، کامپوننت‌های زیر پیشنهاد می‌شوند:

- MobileContainer: محدودکننده عرض و padding موبایل
- Header: هدر ثابت یا ساده‌ی صفحه
- BottomNavigation: ناوبری اصلی برای صفحات اصلی
- PlayerSlot: محلی برای preview player یا player foundation

### Functional UI components

- EmptyState: برای صفحاتی مثل library یا playlist خالی
- Modal: برای اقدام‌های حذف یا انتخاب‌های ساده
- Skeleton/Loading patterns: برای state‌های اولیه و fetch

## State Management Plan

### React Query

React Query باید برای موارد زیر استفاده شود:

- session و profile کاربر
- لیست پادکست‌ها
- جزئیات پادکست
- لیست اپیزودها و جزئیات اپیزود

### Zustand

Zustand باید فقط برای stateهای سراسری و UI استفاده شود:

- auth snapshot
- player state اولیه
- وضعیت باز/بسته بودن player sheet در آینده

### Rule of thumb

- داده‌های سرور در Zustand ذخیره نشوند.
- stateهای سراسری فقط برای UI و interactionهای فوری استفاده شوند.

## API Integration Plan

### Current baseline

لایه‌ی فعلی در [apps/web/src/lib/api.ts](apps/web/src/lib/api.ts) مناسب است و باید به‌صورت تکمیلی حفظ شود.

### Planned adjustment

- یک لایه‌ی API ساده‌تر و به‌صورت feature-oriented ایجاد شود تا endpointهای auth، podcasts و episodes از یک wrapper مشترک استفاده کنند.
- خطاها باید به‌صورت یکپارچه مدیریت شوند.
- در هر feature hook، از React Query برای fetch و mutation استفاده شود.
- برای requestهای auth و protected routes، header Authorization و handling session به‌صورت متمرکز ادامه یابد.

### Scope boundary

- این فاز API را به‌صورت پایه و قابل اتکا آماده می‌کند.
- پیاده‌سازی کامل retry، cache invalidation پیشرفته یا background sync در این فاز انجام نمی‌شود.

## File Creation Plan

### Files to be created

- [apps/web/src/components/layout/mobile-container.tsx]
  - مسئولیت: ارائه‌ی wrapper مشترک برای صفحه‌های موبایل با max-width و padding یکنواخت.
  - چرا در اینجا: برای حفظ consistency بین صفحات و جلوگیری از تکرار layout.

- [apps/web/src/components/layout/app-shell.tsx]
  - مسئولیت: ساختار کلی صفحه شامل header، content و slot player.
  - چرا در اینجا: برای جدا کردن shell از page content و آماده‌سازی تجربه‌ی ثابت.

- [apps/web/src/components/layout/bottom-nav.tsx]
  - مسئولیت: ارائه‌ی navigation اصلی در پایین صفحه برای صفحات اصلی.
  - چرا در اینجا: برای هماهنگی با الگوی موبایل‌فرست و تجربه‌ی نزدیک به اپ.

- [apps/web/src/components/ui/empty-state.tsx]
  - مسئولیت: نمایش حالت خالی برای لیست‌ها و کتابخانه‌ها.
  - چرا در اینجا: برای جلوگیری از نمایش‌های پراکنده و نامنظم.

- [apps/web/src/components/ui/modal.tsx]
  - مسئولیت: پایه‌ی modal برای اقدام‌های ساده مثل حذف یا تأیید.
  - چرا در اینجا: برای فراهم‌کردن پایه‌ی interactionهای آینده بدون پیچیدگی.

- [apps/web/src/components/ui/section-header.tsx]
  - مسئولیت: هدینگ‌های یکسان برای بخش‌های مختلف.
  - چرا در اینجا: برای یکنواختی UI در صفحات مختلف.

- [apps/web/src/styles/tokens.css]
  - مسئولیت: نگهداری theme tokens و متغیرهای طراحی.
  - چرا در اینجا: برای جداسازی design system از استایل‌های تکی.

### Files to be modified

- [apps/web/src/app/layout.tsx](apps/web/src/app/layout.tsx)
  - مسئولیت: ادغام shell و providers و metadata پایه.
  - چرا در اینجا: چون entry point اصلی app است.

- [apps/web/src/app/globals.css](apps/web/src/app/globals.css)
  - مسئولیت: جایگزینی استایل‌های ساده با foundation theme-aware.
  - چرا در اینجا: چون استایل‌های سراسری در این فایل نگهداری می‌شوند.

- [apps/web/src/components/header.tsx](apps/web/src/components/header.tsx)
  - مسئولیت: یکپارچه‌سازی header با shell و navigation.
  - چرا در اینجا: چون header یک عنصر ثابت در همه‌ی صفحات است.

- [apps/web/src/components/ui/button.tsx](apps/web/src/components/ui/button.tsx)
  - مسئولیت: استانداردسازی دکمه‌ها بر اساس design tokens.
  - چرا در اینجا: چون این کامپوننت در بسیاری از صفحات استفاده می‌شود.

- [apps/web/src/components/ui/input.tsx](apps/web/src/components/ui/input.tsx)
  - مسئولیت: استانداردسازی ورودی‌ها و فرم‌ها.
  - چرا در اینجا: چون فرم‌های auth و podcast از آن استفاده می‌کنند.

- [apps/web/src/components/ui/card.tsx](apps/web/src/components/ui/card.tsx)
  - مسئولیت: ایجاد کارت‌های یکپارچه و قابل استفاده مجدد.
  - چرا در اینجا: چون کارت‌ها در لیست‌ها و جزئیات بخش‌های مختلف استفاده می‌شوند.

- [apps/web/src/components/ui/loading-state.tsx](apps/web/src/components/ui/loading-state.tsx)
  - مسئولیت: بهبود state بارگذاری.
  - چرا در اینجا: چون این state در چند صفحه مشترک است.

- [apps/web/src/components/ui/error-state.tsx](apps/web/src/components/ui/error-state.tsx)
  - مسئولیت: یکپارچه‌سازی state خطا.
  - چرا در اینجا: چون این state باید با design system هماهنگ باشد.

- [apps/web/src/lib/api.ts](apps/web/src/lib/api.ts)
  - مسئولیت: حفظ و تکمیل wrapper API با handling خطا و ساختار یکنواخت.
  - چرا در اینجا: چون همه‌ی feature hooks به این لایه وابسته‌اند.

- [apps/web/src/stores/playerStore.ts](apps/web/src/stores/playerStore.ts)
  - مسئولیت: تبدیل store پخش به foundation قابل استفاده برای player آینده.
  - چرا در اینجا: چون player state یکی از بخش‌های مهم معماری است.

- [apps/web/src/stores/authStore.ts](apps/web/src/stores/authStore.ts)
  - مسئولیت: ساده‌سازی و استانداردسازی state auth برای shell و protected routes.
  - چرا در اینجا: چون auth state در چند بخش کلیدی استفاده می‌شود.

### Files to be deleted

- هیچ فایل حذف‌نشده‌ای در این فاز پیشنهاد نمی‌شود.

## Implementation Phases

### Phase 2.5.1 — Foundation setup

- Objective: تثبیت ساختار پایه‌ی shell و providerها.
- Files affected: [apps/web/src/app/layout.tsx](apps/web/src/app/layout.tsx), [apps/web/src/providers/react-query-provider.tsx](apps/web/src/providers/react-query-provider.tsx), [apps/web/src/app/globals.css](apps/web/src/app/globals.css)
- Dependencies: وجود ساختار فعلی Next.js و React Query
- Verification: render اولیه صفحه، بدون خطای ساختار، theme variables اعمال شده‌اند

### Phase 2.5.2 — Design system foundation

- Objective: تعریف tokens، spacing، typography و shared UI primitives.
- Files affected: [apps/web/src/components/ui/button.tsx](apps/web/src/components/ui/button.tsx), [apps/web/src/components/ui/input.tsx](apps/web/src/components/ui/input.tsx), [apps/web/src/components/ui/card.tsx](apps/web/src/components/ui/card.tsx), [apps/web/src/components/ui/loading-state.tsx](apps/web/src/components/ui/loading-state.tsx), [apps/web/src/components/ui/error-state.tsx](apps/web/src/components/ui/error-state.tsx)
- Dependencies: مرحله‌ی قبل
- Verification: همه‌ی کامپوننت‌های پایه در صفحات auth و podcast بدون شکست ظاهر می‌شوند

### Phase 2.5.3 — Application shell and navigation

- Objective: ایجاد shell ثابت و navigation اصلی برای تجربه موبایل‌محور.
- Files affected: [apps/web/src/components/header.tsx](apps/web/src/components/header.tsx), [apps/web/src/components/layout/app-shell.tsx](apps/web/src/components/layout/app-shell.tsx), [apps/web/src/components/layout/mobile-container.tsx](apps/web/src/components/layout/mobile-container.tsx), [apps/web/src/components/layout/bottom-nav.tsx](apps/web/src/components/layout/bottom-nav.tsx)
- Dependencies: مرحله‌ی 2.5.2
- Verification: header و navigation در صفحات مختلف به‌صورت ثابت و قابل‌خواندن نمایش داده شوند

### Phase 2.5.4 — State and API foundation

- Objective: تثبیت ساختار state و API برای صفحات بعدی.
- Files affected: [apps/web/src/lib/api.ts](apps/web/src/lib/api.ts), [apps/web/src/stores/authStore.ts](apps/web/src/stores/authStore.ts), [apps/web/src/stores/playerStore.ts](apps/web/src/stores/playerStore.ts)
- Dependencies: مرحله‌ی 2.5.1 و 2.5.3
- Verification: auth/session و player state به‌درستی initialize و update شوند

### Phase 2.5.5 — Shared empty/error/loading and modal patterns

- Objective: ایجاد stateهای استاندارد UX برای صفحات مختلف.
- Files affected: [apps/web/src/components/ui/empty-state.tsx](apps/web/src/components/ui/empty-state.tsx), [apps/web/src/components/ui/modal.tsx](apps/web/src/components/ui/modal.tsx), [apps/web/src/components/ui/section-header.tsx](apps/web/src/components/ui/section-header.tsx)
- Dependencies: مرحله‌ی 2.5.2
- Verification: حالت‌های خالی، خطا و بارگذاری در صفحات مختلف یکنواخت باشند

### Phase 2.5.6 — Verification and documentation alignment

- Objective: بررسی نهایی سازگاری با مستندات و MVP scope.
- Files affected: این فاز بیشتر روی بازبینی و تطبیق مستندات متمرکز است.
- Dependencies: همه‌ی مراحل قبل
- Verification: build، lint و بررسی UX پایه بدون خطا انجام شود

## Risks and Deferred Items

### ریسک‌های اصلی

- ایجاد over-engineering در حوزه‌ی PWA، offline storage یا i18n کامل.
- ادغام خیلی زود stateهای سرور در Zustand که باعث آشفته شدن معماری می‌شود.
- پیچیده‌کردن shell با navigation بیش از حد قبل از اینکه صفحات واقعی نیازشان روشن شود.
- فاصله بین مستندات و پیاده‌سازی اگر در این فاز تصمیم‌های معماری به‌صورت مبهم گرفته شوند.

### مواردی که باید به تعویق بیفتند

- PWA و service worker کامل
- offline download و indexedDB کامل
- player حرفه‌ای با queue و progress bar پیشرفته
- ترجمه‌ی کامل و چندزبانه بودن
- social features و recommendations
- analytics و AI integration

## Verification Checklist

قبل از اعلام تکمیل این فاز، موارد زیر باید بررسی شوند:

- [ ] ساختار shell در صفحه‌ی اصلی و صفحات مهم بدون خطا render می‌شود
- [ ] dark mode و RTL foundation به‌صورت پایه اعمال شده‌اند
- [ ] کامپوننت‌های shared UI با استایل یکپارچه ظاهر می‌شوند
- [ ] state auth و player به‌صورت ساده و قابل پیش‌بینی کار می‌کنند
- [ ] API layer با React Query برای صفحات بعدی آماده است
- [ ] MVP scope حفظ شده و هیچ feature غیرضروری اضافه نشده است
- [ ] build و lint در سطح وب بدون خطا اجرا می‌شوند

این برنامه فقط برای آماده‌سازی و برنامه‌ریزی فاز 2.5 نوشته شده است و هیچ کد اجرایی در این مرحله ایجاد نمی‌شود.
