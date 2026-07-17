# Phase 2.4 — Frontend Foundation Plan

## 1. Current frontend status

- `apps/web` در حال حاضر یک اسکلت ساده `Next.js` App Router دارد.
- فایل‌های موجود فقط شامل `page.tsx`, `layout.tsx`, `globals.css` هستند.
- هیچ لایهٔ API client، State Management یا صفحات اختصاصی Podcast/Episode ایجاد نشده است.
- هنوز هیچ کامپوننتی برای Podcast list، Episode list، فرم‌ها یا پخش‌کننده صوتی ساخته نشده است.
- وابستگی‌های فعلی فقط شامل `next`, `react`, `react-dom`, `typescript`, `eslint`, `eslint-config-next` و type definitions پایه هستند.

## 2. Required dependencies

برای پیاده‌سازی Phase 2.4 باید حداقل بسته‌های زیر را اضافه کنیم:

- `@tanstack/react-query` — مدیریت server state و cache برای API requestها
- `zustand` — global UI state مانند player state و auth snapshot
- `react-hook-form` — فرم‌های پویا با validation بهتر
- `zod` — schema validation فرم و تبدیل داده
- `lucide-react` — آیکون‌های سبک و یکپارچه
- `next-intl` — پشتیبانی از متن‌های قابل ترجمه و i18n
- `clsx` یا `classnames` (اختیاری) — ترکیب کلاس‌های Tailwind به شکل خواناتر

اگر بخواهیم تست UI اولیه داشته باشیم، می‌توان در آینده از موارد زیر استفاده کرد، اما برای فاز ۲.۴ ضروری نیست:

- `@testing-library/react`
- `@testing-library/jest-dom`

## 3. Frontend architecture

- معماری بر پایه `Next.js App Router` خواهد بود.
- صفحات در `app/` نگهداری می‌شوند و سرور کامپوننت‌ها پیش‌فرض خواهد بود.
- تنها کامپوننت‌های نیازمند state یا effect، `use client` خواهند شد.
- به جای تمرکز بر `pages` و `components` کلی، باید از معماری Feature-Based استفاده کنیم:
  - `features/podcasts/`
  - `features/episodes/`
  - `features/auth/`
- کامپوننت‌های مشترک UI در `src/components/` قرار می‌گیرند.
- لایهٔ داده و API در `src/lib/` پیاده می‌شود.
- global providers در `src/providers/` یا `src/lib/providers/` قرار می‌گیرند.

## 4. Folder structure

پیشنهاد ساختار برای `apps/web/src`:

- `app/`
  - `layout.tsx`
  - `page.tsx`
  - `login/page.tsx`
  - `register/page.tsx`
  - `profile/page.tsx`
  - `podcasts/`
    - `page.tsx`
    - `new/page.tsx`
    - `[id]/page.tsx`
    - `[id]/edit/page.tsx`
  - `episodes/`
    - `new/page.tsx`
    - `[id]/page.tsx`
    - `[id]/edit/page.tsx`
- `features/`
  - `podcasts/`
    - `PodcastCard.tsx`
    - `PodcastForm.tsx`
    - `PodcastDetails.tsx`
    - `PodcastEpisodeList.tsx`
  - `episodes/`
    - `EpisodeCard.tsx`
    - `EpisodeForm.tsx`
    - `EpisodeDetails.tsx`
- `components/`
  - `AudioPlayer.tsx`
  - `AuthForm.tsx`
  - `AppShell.tsx`
  - `Header.tsx`
  - `LoadingState.tsx`
  - `ErrorState.tsx`
  - `SearchBar.tsx`
- `lib/`
  - `api.ts`
  - `auth.ts`
  - `podcasts.ts`
  - `episodes.ts`
  - `types.ts`
- `providers/`
  - `react-query-provider.tsx`
  - `auth-provider.tsx`
- `stores/`
  - `authStore.ts`
  - `playerStore.ts`

## 5. API client design

- تعریف یک wrapper پایه در `src/lib/api.ts` که:
  - `fetch` را با `baseUrl` و `Authorization` header مدیریت کند.
  - پاسخ‌های JSON را normalize کند.
  - خطاهای HTTP را به شکل قابل استفاده به بالا منتقل کند.
- ایجاد کلاینت‌های feature-specific:
  - `src/lib/podcasts.ts` برای مسیرهای `podcasts`
  - `src/lib/episodes.ts` برای مسیرهای `episodes`
  - `src/lib/auth.ts` برای login/register و profile
- هر endpoint باید یک تابع معنادار داشته باشد، مثل:
  - `getPodcasts(query)`
  - `getPodcastById(id)`
  - `createPodcast(payload)`
  - `getEpisodeById(id)`
  - `createEpisode(formData)`
- پاسخ‌ها و ورودی‌ها باید با type definitions در `src/lib/types.ts` هماهنگ شوند.
- `react-query` در سطح کامپوننت‌ها برای fetch / mutation استفاده شود.

## 6. State management approach

- استفاده از `@tanstack/react-query` برای server state و data fetching:
  - Podcast list
  - Podcast detail
  - Episode data
  - Auth profile
- استفاده از `zustand` فقط برای global UI state:
  - `player` state (currentEpisode, queue, isPlaying, currentTime)
  - `auth` snapshot یا client-side auth flags
  - `offline download` state در آینده
- فرم‌ها با state محلی و `react-hook-form` مدیریت شوند.
- هیچ دادهٔ server-side مثل لیست اپیزود یا podcast در Zustand ذخیره نشود.
- storeهای global محدود و کوچک نگه داشته شوند.

## 7. Pages required

- `/` — صفحه اصلی / home shell
- `/login` — صفحه ورود
- `/register` — صفحه ثبت‌نام
- `/profile` — صفحه پروفایل کاربر
- `/podcasts` — فهرست پادکست‌ها
- `/podcasts/new` — فرم ایجاد پادکست
- `/podcasts/[id]` — صفحه جزئیات پادکست به همراه فهرست اپیزودها
- `/podcasts/[id]/edit` — ویرایش پادکست
- `/episodes/new` — فرم ایجاد اپیزود
- `/episodes/[id]` — جزئیات اپیزود و دکمه پخش
- `/episodes/[id]/edit` — ویرایش اپیزود

## 8. Components required

- `AppShell` — ساختار قالب کلی و احتمالا Sidebar/BottomBar
- `Header` — ناوبری، Search، وضعیت auth
- `PodcastCard` — کارت خلاصه پادکست
- `EpisodeCard` — کارت خلاصه اپیزود
- `PodcastForm` — فرم create/edit پادکست
- `EpisodeForm` — فرم create/edit اپیزود با upload audio
- `AudioPlayer` — mini player persistent
- `AuthForm` — فرم login/register
- `LoadingState` و `ErrorState` — نمایش وضعیت بارگذاری و خطا
- `SearchBar` — برای فهرست پادکست و اپیزود
- `PodcastEpisodeList` — فهرست اپیزودهای پادکست
- `EpisodeMetadata` — نمایش جزئیات اپیزود و دکمه‌های action

## 9. Authentication integration

- auth باید ابتدا با backend هماهنگ شود، اما در frontend باید gating ساده داشته باشیم.
- یک Provider یا hook مثل `useAuth()` برای دسترسی به وضعیت لاگین و `accessToken` تعریف شود.
- برای هر request نوشتنی (`create`, `update`, `delete`) از header `Authorization: Bearer <token>` استفاده شود.
- صفحه‌های `/podcasts/new`, `/podcasts/[id]/edit`, `/episodes/new`, `/episodes/[id]/edit` فقط برای کاربرانی که auth شده‌اند نمایش داده شوند.
- UI باید بر اساس وضعیت auth دو حالت داشته باشد:
  - کاربر لاگین نشده: نمایش دکمه login/register و عدم نمایش گزینهٔ create/edit
  - کاربر لاگین شده: نمایش دکمه‌های مدیریت و امکان ارسال فرم
- auth state در Zustand یا context نگهداری شود، اما دادهٔ کاربر و profile با `react-query` fetch شود.
- چون backend از refresh token استفاده می‌کند، frontend باید بتواند تلاش مجدد برای بررسی session را انجام دهد.
- برای فاز ۲.۴ کافی است auth بررسی client-side داشته باشد و مجوز اصلی را به backend بسپاریم.

## 10. Audio upload UI approach

- در `EpisodeForm` از `input type="file" accept="audio/*"` استفاده شود.
- اطلاعات فایل انتخاب‌شده (name, size, type) باید به کاربر نمایش داده شود.
- validation اولیه client-side:
  - `audio/*` mime type
  - حداقل و حداکثر حجم فایل (مثلاً 100MB)
- ارسال داده با `FormData` برای endpoint audio upload یا create episode.
- اگر از route جداگانه استفاده شود، فرایند upload باید به صورت مرحله‌ای باشد:
  1. ارسال metadata اپیزود
  2. آپلود فایل صوتی
  3. به‌روزرسانی `audioUrl`
- نمایش progress indicator ساده هنگام آپلود ضروری است.
- پس از آپلود موفق، لینک پخش یا دکمه `Play` نمایش داده شود.
- اگر `audioUrl` هنوز آماده نیست، فرم باید کاربر را برای ارسال مجدد یا اصلاح فایل راهنمایی کند.

## 11. Risks

- عدم وجود API client مشخص می‌تواند باعث تکرار کد و ناسازگاری endpointها شود.
- اگر `react-query` و `zustand` با هم قاطی شوند، server state ممکن است به صورت اشتباه در global state ذخیره شود.
- تعریف بیش از حد صفحات و کامپوننت قبل از تثبیت API ممکن است منجر به بازنویسی مجدد شود.
- آپلود audio ممکن است با محدودیت حجم و timeouts روبرو شود.
- احراز هویت client-side بدون هماهنگی backend ممکن است UI را گمراه کند؛ مجوز نهایی باید همیشه در backend بررسی شود.
- اگر ساختار فولدرها خیلی پیچیده شود، توسعه سریع Phase 2.4 کند خواهد شد.
- از آنجا که هنوز ترجمه (`next-intl`) فعال نیست، اضافه کردن آن در حین توسعه ممکن است زمان‌بر شود.

## 12. Implementation order

1. تثبیت ساختار `apps/web/src` و dependencies مورد نیاز.
2. تعریف `src/lib/api.ts` و API clientهای feature-specific.
3. راه‌اندازی `react-query` provider و `zustand` stores پایه (`authStore`, `playerStore`).
4. ساخت صفحات auth ساده: `/login`, `/register`, `/profile`.
5. ایجاد صفحات فهرست و جزئیات پادکست: `/podcasts`, `/podcasts/[id]`, `/podcasts/new`, `/podcasts/[id]/edit`.
6. ایجاد صفحات اپیزود: `/episodes/new`, `/episodes/[id]`, `/episodes/[id]/edit`.
7. ساخت `PodcastForm`, `EpisodeForm` و `AudioPlayer` و لینک دادن آنها به API.
8. پیاده‌سازی client-side validation فایل صوتی و upload flow در `EpisodeForm`.
9. اتصال auth UI به backend و افزودن gating برای create/edit.
10. تست مسیرهای اصلی و بررسی هماهنگی با backend payload و response.
11. بازبینی و اصلاح folder structure و کامپوننت‌ها بر اساس تجربه توسعه اولیه.

---

> این طرح فقط برای ساختار frontend و آماده‌سازی فاز ۲.۴ نوشته شده است. پیاده‌سازی کد در این مرحله انجام نمی‌شود.
