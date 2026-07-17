# Frontend Feature Boundary Audit

## Executive Summary

بررسی فعلی نشان می‌دهد که معماری فرانت‌اند در مسیر پذیرش مالکیت مبتنی بر Feature در حال پیشرفت است. در چند بخش، به‌خصوص برای Podcast، ساختار فعلی به‌خوبی با الگوی مورد انتظار هم‌راستاست: روت‌ها به‌صورت ورودی‌های سبک عمل می‌کنند و منطق اصلی در featureها قرار دارد. با این حال، در بخش Episode و بخش‌های روتی مانند صفحه‌های جدید و جزئیات، هنوز منطق orchestration و داده‌خوانی در لایه Route یا لایه shared/lib باقی مانده است. این موضوع مانع از تکمیل کامل جداسازی مالکیت نمی‌شود، اما برای رشد آینده باید با یک برنامه‌ی تدریجی اصلاح شود.

در مجموع، ساختار فعلی از نظر پایه‌ی معماری قابل قبول است، اما برای رسیدن به سطح انتظار از نظر ownership boundary هنوز نیاز به تثبیت بیشتر در لایه‌های Route، API/data access و Player دارد.

## Current Architecture State

مسیرهای اصلی در [apps/web/src](apps/web/src) به‌صورت زیر سازماندهی شده‌اند:

- [apps/web/src/app](apps/web/src/app): مسیرهای Next.js و صفحات Route
- [apps/web/src/features](apps/web/src/features): featureهای auth، podcasts و episodes
- [apps/web/src/components](apps/web/src/components): اجزای مشترک UI و لایه‌های عمومی
- [apps/web/src/lib](apps/web/src/lib): لایه‌ی داده و API abstraction
- [apps/web/src/stores](apps/web/src/stores): Zustand برای stateهای سراسری
- [apps/web/src/providers](apps/web/src/providers): Providerهای React و Query
- [apps/web/src/shared](apps/web/src/shared): لایه‌ی مشترک زیرساختی مانند api-client و react-query

از نظر ساختاری، الگوی کلی زیر در حال شکل‌گیری است:

- app/ → entry point مسیرها
- features/ → منطق و UI مرتبط با feature
- components/ → shared UI primitives
- lib/ → transport و abstraction داده
- stores/ → stateهای سراسری

با این حال، هنوز بین این لایه‌ها مرزهای کاملاً سخت و دقیق برقرار نیست.

## Route Audit

| Route | Current Responsibility | Expected Ownership | Boundary Status |
|---|---|---|---|
| /login | فقط نمایش صفحه‌ی ورود و delegate به feature auth | Entry point فقط | Good |
| /register | فقط نمایش صفحه‌ی ثبت‌نام و delegate به feature auth | Entry point فقط | Good |
| /podcasts | نمایش لیست و interaction با hook feature | Entry point + feature orchestration | Good |
| /podcasts/new | جمع‌آوری فرم و اجرای mutation | باید در feature podcast باشد | Needs attention |
| /podcasts/[id] | بارگذاری جزئیات و delete orchestration | باید در feature podcast باشد | Needs attention |
| /podcasts/[id]/edit | بارگذاری فرم و submit update | باید در feature podcast باشد | Needs attention |
| /episodes/new | فرم ساخت episode + fetch podcast list + submit | باید در feature episode باشد | Needs attention |
| /episodes/[id] | fetch detail + upload audio + UI composition | باید در feature episode باشد | Needs attention |
| /profile | صفحه‌ی placeholder و ساختار مسیر آینده | Entry point فقط | Good |
| /library | صفحه‌ی placeholder و ساختار مسیر آینده | Entry point فقط | Good |
| /search | صفحه‌ی placeholder و ساختار مسیر آینده | Entry point فقط | Good |
| / | صفحه‌ی placeholder و ساختار مسیر آینده | Entry point فقط | Good |

### جمع‌بندی Route Audit

- روت‌های ساده‌تر مانند login/register و صفحه‌های placeholder در وضعیت خوب قرار دارند.
- روت‌های مربوط به podcast و episode هنوز در برخی موارد از سطح entry point فراتر رفته‌اند و مسئولیت‌هایی مانند form orchestration، API call مستقیم و UI composition را در خود نگه داشته‌اند.

## Feature Boundary Audit

| Feature | Existing Ownership | Missing Ownership | Status |
|---|---|---|---|
| auth | فرم‌های ورود/ثبت‌نام در داخل feature، ProtectedRoute در feature، state auth در store | هنوز برخی توابع transport در [apps/web/src/lib/auth.ts](apps/web/src/lib/auth.ts) قرار دارند و این لایه به‌صورت shared/data access عمل می‌کند | Needs attention |
| podcast | فرم، جزئیات، کارت، hookهای react-query و utilityها در feature قرار گرفته‌اند | چند روت still شامل orchestration و submit logic هستند و بخش‌هایی از data access هنوز در shared lib مانده‌اند | Good |
| episode | اجزای اولیه مانند EpisodeCard و EpisodeForm وجود دارد، اما هنوز feature ownership به‌طور کامل تثبیت نشده | منطق fetch/mutation/upload در routeها و shared lib قرار دارد؛ hook و page-view feature-محور هنوز به‌طور کامل شکل نگرفته‌اند | Needs attention |

### نکات مهم

- feature podcast نسبت به دو feature دیگر از وضعیت بهتری برخوردار است.
- feature auth دارای پایه‌ی خوب است، اما هنوز لایه‌ی auth transport در shared lib متمرکز است.
- feature episode در وضعیت اولیه‌ی adoption قرار دارد و هنوز باید به سمت feature-owned hooks و view components پیش برود.

## Shared Layer Audit

### Ownership مناسب

- [apps/web/src/components/ui](apps/web/src/components/ui): UI primitives و shared components عمومی
- [apps/web/src/components/layout](apps/web/src/components/layout): لایه‌ی shared layout و placeholder patterns
- [apps/web/src/providers](apps/web/src/providers): providerهای سراسری
- [apps/web/src/shared/lib](apps/web/src/shared/lib): API client، error handling و query config

### Potential violations

1. لایه‌ی shared در حال حاضر نسبتاً سالم است، اما برخی feature-specific logic هنوز در لایه‌ی shared یا lib دیده می‌شود.
2. [apps/web/src/components/auth/ProtectedRoute.tsx](apps/web/src/components/auth/ProtectedRoute.tsx) یک wrapper سطحی است که به‌جای داشتن منطق مستقل، فقط به feature auth delegate می‌دهد. این مورد به‌خودی‌خود مشکل‌ساز نیست، اما نشان‌دهنده‌ی این است که مرز بین shared component و feature component هنوز کاملاً شفاف نیست.
3. [apps/web/src/components/AudioPlayer.tsx](apps/web/src/components/AudioPlayer.tsx) از نظر مفهوم یک component عمومی است، اما در عمل هنوز به‌صورت player feature-agnostic عمل نمی‌کند و در آینده باید به یک feature-owned player منتقل شود.
4. [apps/web/src/lib](apps/web/src/lib) به‌عنوان shared data layer عمل می‌کند، اما در برخی موارد به‌نحوی feature-aware است و مرزownership را کمی مبهم می‌کند.

## API/Data Audit

در حال حاضر لایه‌ی داده به‌صورت زیر سازماندهی شده است:

- [apps/web/src/lib/podcasts.ts](apps/web/src/lib/podcasts.ts): abstraction برای podcast API
- [apps/web/src/lib/episodes.ts](apps/web/src/lib/episodes.ts): abstraction برای episode API
- [apps/web/src/lib/auth.ts](apps/web/src/lib/auth.ts): abstraction برای auth API و session
- [apps/web/src/shared/lib/api-client.ts](apps/web/src/shared/lib/api-client.ts): transport اصلی

### ارزیابی

- abstraction API وجود دارد و این یک نقطه قوت است.
- data fetching و mutationها در چند بخش به‌صورت feature-aware در feature hooks یا routeها استفاده می‌شوند.
- با این حال، ownership transport هنوز در لایه‌ی shared/lib متمرکز است و برای تکمیل boundary بهتر است featureهای مستقل‌تر با api moduleهای خودشان یا hookهای feature-owned، داده‌های خود را مدیریت کنند.

### نتیجه

- API ownership در سطح قابل قبول است، اما هنوز به‌طور کامل feature-first نیست.

## State Management Audit

### Global state

- [apps/web/src/stores/authStore.ts](apps/web/src/stores/authStore.ts): مناسب برای auth state سراسری
- [apps/web/src/stores/playerStore.ts](apps/web/src/stores/playerStore.ts): مناسب برای player state سراسری در آینده

### Feature state

- فرم‌های react-hook-form به‌صورت local feature state مدیریت می‌شوند و این رویکرد مناسب است.
- چند بخش از state management در routeها و componentها به‌جای feature moduleها نگهداری می‌شوند؛ این موضوع به‌خصوص برای episode pages مشاهده می‌شود.

### نتیجه

- Zustand به‌طور کلی در جای درست استفاده شده است.
- player state هنوز به‌صورت کامل به feature boundary تبدیل نشده و به‌عنوان یک candidate برای migration آینده در نظر گرفته می‌شود.

## Player Readiness Audit

در حال حاضر، player در repo با چند نشانه‌ی اولیه حضور دارد:

- [apps/web/src/stores/playerStore.ts](apps/web/src/stores/playerStore.ts): state سراسری player
- [apps/web/src/components/AudioPlayer.tsx](apps/web/src/components/AudioPlayer.tsx): component پخش صدا
- [apps/web/src/app/episodes/[id]/page.tsx](apps/web/src/app/episodes/[id]/page.tsx): استفاده از audio element در سطح page

### ارزیابی

- player به‌صورت یک feature در حال شکل‌گیری است، اما هنوز به‌صورت یک feature مستقل و بالغ سازماندهی نشده است.
- queue، playback controller، episode-to-player integration و player UI هنوز در مرز feature مشخص نشده‌اند.
- current implementation بیش از آنکه player feature باشد، یک prototype یا placeholder است.

### نتیجه

- Player readiness در سطح متوسط تا پایین است و برای آینده باید به‌عنوان یک feature جداگانه با ownership مشخص طراحی شود.

## Podcast/Episode Dependency Audit

در حال حاضر رابطه‌ی اصلی بین Podcast و Episode به شکل زیر است:

- Podcast details نمایش لیست episodeهای مرتبط را دارد.
- Episode page از podcastId برای ارتباط با podcast استفاده می‌کند.
- انتقال داده بین این دو feature بیشتر از طریق shared/data layer و contracts مشترک انجام می‌شود.

### ارزیابی

- جهت وابستگی فعلی عمدتاً از Podcast به Episode و نه برعکس است.
- این جهت با الگوی پیشنهادی سازگارتر است:

Podcast → Episode → Shared/Data Layer

### نکته‌ی مهم

- در حال حاضر، episode feature هنوز به‌صورت کامل از podcast feature جدا نشده است و به‌خصوص در صفحه‌های create/detail، وابستگی به shared lib و route-level orchestration وجود دارد.
- این موضوع مانع از شکل‌گیری یک dependency direction تمیز نیست، اما در آینده با جداسازی feature hooks و view components قابل اصلاح است.

## Migration Readiness Score

### Feature Boundary Maturity: 3/5

- feature podcast در سطح خوبی قرار دارد.
- feature auth پایه‌ی خوبی دارد اما هنوز با shared auth transport در هم آمیخته است.
- feature episode هنوز به‌طور کامل تثبیت نشده است.

### Route Separation: 3/5

- چند route به‌خوبی به feature delegate می‌کنند.
- با این حال، هنوز برخی روت‌ها دارای responsibilityهای زیاد و mixed orchestration هستند.

### Shared Layer Health: 4/5

- shared UI و providerها در وضعیت نسبتاً سالم‌اند.
- مرز میان shared و feature در بعضی بخش‌ها هنوز روشن نیست.

### API Ownership: 3/5

- abstraction API خوب است.
- اما ownership feature-based هنوز کامل نشده و لایه‌ی shared/lib نقش مهمی در orchestration داده دارد.

### Player Readiness: 2/5

- player state و component اولیه وجود دارد.
- اما feature ownership، queue، playback orchestration و integration کامل هنوز شکل نگرفته است.

## Findings

### Critical

- هیچ مشکل بحرانی و blocker مستقیم برای ادامه‌ی توسعه‌ی MVP در این بازبینی دیده نشد.

### High

1. Episode routes still contain feature-level orchestration.
   - صفحه‌های [apps/web/src/app/episodes/new/page.tsx](apps/web/src/app/episodes/new/page.tsx) و [apps/web/src/app/episodes/[id]/page.tsx](apps/web/src/app/episodes/[id]/page.tsx) هنوز منطق form، fetch، mutation و upload را داخل route نگه داشته‌اند.
   - این موضوع باعث می‌شود ownership episode به‌طور کامل منتقل نشده باشد.

2. Player boundary is not yet formalized.
   - وجود store و component اولیه خوب است، اما هنوز player به‌عنوان یک feature مستقل با ownership مشخص تعریف نشده است.

### Medium

1. Podcast routes still include some orchestration responsibilities.
   - صفحات create/edit/details در [apps/web/src/app/podcasts](apps/web/src/app/podcasts) به‌طور کامل به feature delegate نمی‌شوند و هنوز در سطح route با منطق submit/delete interaction همراه‌اند.

2. Shared data layer still absorbs feature-specific responsibilities.
   - [apps/web/src/lib](apps/web/src/lib) هنوز نقش مهمی در داده‌خوانی و transport featureها دارد و این موضوع باعث می‌شود مرز feature/shared کمی مبهم شود.

3. Auth ownership is partially mixed with shared transport.
   - [apps/web/src/lib/auth.ts](apps/web/src/lib/auth.ts) و [apps/web/src/stores/authStore.ts](apps/web/src/stores/authStore.ts) در کنار feature auth، یک لایه‌ی ترکیبی ایجاد کرده‌اند که برای آینده نیاز به شفاف‌سازی دارد.

### Low

1. Some shared components still act as thin wrappers around feature implementations.
   - [apps/web/src/components/auth/ProtectedRoute.tsx](apps/web/src/components/auth/ProtectedRoute.tsx) نمونه‌ای از این الگو است.

2. Placeholder routes still define foundational UI without feature-specific ownership.
   - مسیرهای [apps/web/src/app/profile](apps/web/src/app/profile)، [apps/web/src/app/library](apps/web/src/app/library) و [apps/web/src/app/search](apps/web/src/app/search) مناسب برای foundation‌اند، اما هنوز feature ownershipی ندارند.

## Recommended Next Step

پیشنهاد اصلی این است که انتقال مالکیت را به‌صورت تدریجی و با تمرکز بر Episode و Player انجام شود. اولویت‌های پیشنهادی:

1. انتقال منطق Episode page و Episode create page به feature-owned hooks و view components
2. انتقال منطق upload/audio orchestration به لایه‌ی feature episode
3. تعریف مرز روشن‌تر برای Player feature با store، hooks، UI و data access مستقل
4. حفظ current podcast boundary و استفاده از آن به‌عنوان الگوی اصلی برای featureهای بعدی

این audit یک بررسی معماری است و هیچ تغییر کد یا refactor در این مرحله انجام نشده است.
