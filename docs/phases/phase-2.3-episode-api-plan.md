# Phase 2.3 — Episode API and Audio Storage Plan

## 1. وضعیت فعلی پیاده‌سازی اپیزود

- ماژول `episodes` در `apps/api/src/episodes` موجود است.
- کنترلر فعلی مسیرهای پایه CRUD را دارد:
  - `GET /episodes`
  - `GET /episodes/:id`
  - `POST /episodes`
  - `PUT /episodes/:id`
  - `DELETE /episodes/:id`
- مسیرهای `POST`, `PUT`, `DELETE` با `JwtAuthGuard` محافظت شده‌اند.
- سرویس `EpisodesService` برای ایجاد، به‌روزرسانی و حذف اپیزود، مالکیت پادکست را بررسی می‌کند.
- مدل Prisma `Episode` شامل فیلد `audioUrl` است.
- مسیر `GET /podcasts/:id/episodes` قبلاً در فاز 2.2 اضافه شده است.
- در حال حاضر هیچ مسیر یا منطق اختصاصی برای آپلود فایل صوتی وجود ندارد.
- هیچ سرویس ذخیره‌سازی media یا adapter مستقل برای audio وجود ندارد.
- `audioUrl` تنها مرجع ذخیرهٔ فایل صوتی است و هنوز هیچ metadata بیشتر یا ابستراکشن storage ندارد.

## 2. قابلیت‌های گمشده

- پشتیبانی از آپلود فایل صوتی از کلاینت.
- پردازش multipart/form-data برای فایل‌های صوتی.
- سرویس ذخیره‌سازی برای نوشتن فایل صوتی در object storage یا فایل‌سیستم.
- مدیریت آدرس دسترسی به فایل صوتی (URL یا signed URL).
- اعتبارسنجی نوع و اندازه فایل صوتی.
- مسیر مجزا برای آپلود یا جایگزینی فایل صوتی.
- metadata فایل صوتی مانند `mimeType`, `fileSize`, `duration` (پیشنهادی).
- فیلتر و pagination برای فهرست اپیزودها در مقیاس بزرگ.
- مسیرهای مرتبط با پخش یا دانلود امن audio.
- لایهٔ frontend برای ارسال فایل صوتی و نمایش پخش‌کننده.

## 3. معماری ذخیره‌سازی صوتی پیشنهادی برای MVP

- MVP باید از یک راهکار ساده و قابل توسعه استفاده کند: object storage محلی با MinIO یا adapter مشابه.
- یک `StorageService` مستقل در backend پیاده شود که provider را از منطق تجاری جدا کند.
- فایل‌های صوتی در object storage ذخیره شوند و `Episode.audioUrl` آدرس قابل پخش آنها را نگه دارد.
- برای فاز 2.3 لازم نیست provider پیچیده یا cloud-specific باشد؛ MinIO محلی بهترین انتخاب برای همگامی با معماری پروژه است.
- در MVP می‌توان از URL مستقیم storage استفاده کرد، اما بهتر است ساختار ذخیره‌سازی طوری باشد که در آینده بتوان با presigned URL یا proxy تغییر داد.
- `audioUrl` باید به‌عنوان مرجع playback استفاده شود؛ اگر نیاز به provider-agnostic تر شدن داریم، می‌توان در آینده یک ستون `audioStorageKey` اضافه کرد.
- از CDN یا پردازش استریم در این فاز خودداری شود. کافی است backend و object storage فایل‌ها را ذخیره و در صورت نیاز به کلاینت آدرس دهد.

## 4. برنامهٔ پیاده‌سازی Backend

1. ایجاد `StorageModule` و `StorageService` در `apps/api/src/storage`.
   - این سرویس مسئول upload فایل و تولید URL خروجی باشد.
   - پیاده‌سازی اولیه می‌تواند با MinIO یا local filesystem کار کند.
2. آماده‌سازی endpoint آپلود صوتی در `episodes.controller.ts`.
   - گزینهٔ اول: `POST /api/v1/episodes` با `multipart/form-data` که metadata و فایل را همزمان دریافت کند.
   - گزینهٔ دوم: `POST /api/v1/episodes` برای ایجاد metadata و `POST /api/v1/episodes/:id/audio` برای آپلود فایل.
3. اصلاح `EpisodesService`:
   - در متد create، پس از اعتبارسنجی مالکیت پادکست، فایل صوتی را با `StorageService` آپلود کند و `audioUrl` را ذخیره نماید.
   - در متد update، امکان جایگزینی فایل صوتی یا به‌روزرسانی metadata را فراهم کند.
   - در صورت استفاده از route جداگانه، متدی برای دریافت signed URL یا مسیر پخش افزوده شود.
4. افزودن validation upload:
   - محدودیت MIME type مجاز
   - محدودیت اندازه فایل
   - reject فایل‌های غیر صوتی
5. بررسی endpointهای جدید برای اپیزود:
   - `POST /api/v1/episodes/:id/audio` یا `PATCH /api/v1/episodes/:id/audio`
   - `GET /api/v1/episodes/:id/audio-url` (اختیاری برای آینده)
6. اصلاح DTOها برای پشتیبانی از metadata جدید و upload flow.
7. نگهداری مسیرهای عمومی: `GET /episodes` و `GET /episodes/:id` باید بدون auth باقی بمانند.
8. آزمون‌پذیری: آماده‌سازی ساختار برای نوشتن تست واحد/اینتگراسیون در فاز بعد.

## 5. تغییرات دیتابیس مورد نیاز

- برای Phase 2.3 در وضعیت فعلی، تغییر ساختار دیتابیس الزامی نیست.
  - مدل `Episode` قبلاً فیلد `audioUrl String?` را دارد.
- اگر بخواهیم طراحی storage را آینده‌نگرتر کنیم، می‌توان موارد زیر را پس از فاز 2.3 اضافه کرد اما در این فاز ضروری نیست:
  - `audioStorageKey String?`
  - `audioMimeType String?`
  - `audioFileSize Int?`
  - `duration Int?`
- توصیه: فعلاً از schema موجود استفاده شود و فقط در صورت نیاز واقعی به metadata بیشتر، migration جدید ایجاد شود.

## 6. API endpointهای مورد پیشنهاد

### موجود
- `GET /api/v1/episodes`
- `GET /api/v1/episodes/:id`
- `GET /api/v1/podcasts/:podcastId/episodes`
- `POST /api/v1/episodes`
- `PUT /api/v1/episodes/:id`
- `DELETE /api/v1/episodes/:id`

### پیشنهادی برای فاز 2.3
- `POST /api/v1/episodes/:id/audio`  – آپلود یا جایگزینی فایل صوتی
- `PATCH /api/v1/episodes/:id`       – به‌روزرسانی metadata اپیزود
- `GET /api/v1/episodes/:id/audio-url`  – دریافت URL پخش امن (اختیاری)
- `GET /api/v1/podcasts/:podcastId/episodes?page=&limit=` – pagination اپیزودهای پادکست

### نکته
- اگر مسیر upload جدا تعریف نشود، `POST /api/v1/episodes` باید `multipart/form-data` را پشتیبانی کند.
- بهتر است `audioUrl` بعد از آپلود فایل به عنوان مرجع پخش بازگردانده شود.

## 7. مسائل امنیتی

- تمام عملیات نوشتنی (`POST`, `PUT`, `DELETE`, upload audio) باید با `JwtAuthGuard` محافظت شوند.
- قبل از ایجاد یا ویرایش اپیزود، باید مالکیت پادکست بررسی شود.
- فیلد `audioUrl` نباید توسط کلاینت به‌صورت آزاد قابل تنظیم باشد؛ URL باید از طریق سرویس ذخیره‌سازی تولید شود.
- نوع فایل و اندازه باید در backend بررسی شود.
- آدرس فایل‌های صوتی نباید به صورت کاملاً قابل حدس باشد اگر امنیت پخش نیاز باشد.
- اگر در فاز 2.3 از URL مستقیم storage استفاده شود، دسترسی به bucket یا مسیر باید تنها برای خواندن audio باشد.
- عدم افشای credentials / keys ذخیره‌سازی در responses یا لاگ.
- در آینده می‌توان authentication پخش و signed URL را اضافه کرد، اما در MVP کافی است که upload و write access محدود بماند.

## 8. فایل‌های پیشنهادی برای ایجاد یا اصلاح

- `docs/phase-2.3-episode-api-plan.md`
- `docs/project-status.md`
- `apps/api/src/storage/storage.module.ts`
- `apps/api/src/storage/storage.service.ts`
- `apps/api/src/episodes/episodes.controller.ts`
- `apps/api/src/episodes/episodes.service.ts`
- `apps/api/src/episodes/episodes.module.ts`
- `apps/api/src/episodes/dto/create-episode.dto.ts`
- `apps/api/src/episodes/dto/update-episode.dto.ts`
- `apps/api/src/episodes/dto/upload-episode-audio.dto.ts` (اختیاری)
- `apps/api/src/episodes/dto/episode-query.dto.ts` (اختیاری)
- `apps/api/src/app.module.ts` یا ماژول مرتبط برای وارد کردن `StorageModule`

## 9. خطرات

- ترکیب multipart upload و validation ممکن است افزایش پیچیدگی بک‌اند را بیشتر از حد انتظار کند.
- قبول فایل‌های صوتی بزرگ بدون محدودیت درست، می‌تواند منجر به فشار روی سرویس و منابع شود.
- اگر `audioUrl` تنها مرجع فایل صوتی باشد، تغییر provider ذخیره‌سازی در آینده ممکن است مهاجرت داده لازم داشته باشد.
- public کردن آدرس‌های صوتی ممکن است موجب لو رفتن محتوای ناپسند یا منتشرنشده بشود.
- افزودن منطق مالکیت و auth پیش از نهایی شدن auth فرانت‌اند ممکن است تست دستی را دشوار کند.
- پیش از راه‌اندازی storage abstraction، ممکن است کدهای اضافی و نیمه‌کاره برای providerهای مختلف ایجاد شود.
- اگر endpointهای فهرست اپیزود و پخش بهینه نشوند، در آینده با تعداد زیاد اپیزود مقیاس‌پذیری کاهش می‌یابد.

---

### نتیجه‌گیری

فاز 2.3 باید روی تبدیل مدل اپیزود موجود به یک مسیر کامل upload و playback متمرکز شود، بدون تغییرات بزرگ دیتابیس. معماری پیشنهادی به سادگی یک storage service قابل تعویض، کنترلرهای مشخص برای upload و حفظ امنیت write access را تعریف می‌کند.
