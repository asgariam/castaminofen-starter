# Phase 3.5 — Player Queue Experience Foundation Plan

## Status

Planning only / no implementation

---

## Objective

طراحی اولین تجربه‌ی کاربری Queue بر اساس معماری پایدار Player فعلی، بدون ایجاد abstraction جدید و بدون تغییر مالکیت Episode یا runtime پایه.

## 1. Current Queue Capability

امکان‌های فعلی Player در سطح state و runtime به‌صورت زیر آماده‌اند:

- Queue در Store Player به‌صورت آرایه‌ی PlayableItem نگهداری می‌شود.
- currentIndex و currentItem برای تعیین آیتم فعلی در Queue وجود دارند.
- Runtime Player می‌تواند:
  - آیتم بعدی را انتخاب کند
  - آیتم قبلی را انتخاب کند
  - Queue را جایگزین یا پاک کند
  - با توجه به repeat و shuffle، انتخاب بعدی را مدیریت کند
- UI فعلی PlayerBar فقط وضعیت پخش و کنترل‌های اصلی را نمایش می‌دهد و هنوز surface‌ی Queue را ارائه نمی‌کند.

این ساختار از نظر معماری برای نمایش یک Queue UI اولیه کافی است، اما برای تعامل کاربر نیاز به چند action اضافی در لایه‌ی Player وجود دارد.

## 2. UI Requirements

تجربه‌ی Queue باید در اولین نسخه ساده و مستقیم باشد:

- نمایش Queue فعلی با آیتم‌های بعدی و آیتم فعلی
- تشخیص واضح آیتم در حال پخش
- امکان انتخاب یکی از آیتم‌های Queue برای پخش آن
- امکان حذف یک آیتم از Queue
- امکان پاک کردن کل Queue
- حفظ ساده‌بودن UX و جلوگیری از پیچیده‌سازی

این تجربه بهتر است در قالب یک sheet یا drawer ساده در لبه‌ی PlayerBar یا بالای AppShell ارائه شود، نه به‌صورت یک صفحه‌ی جداگانه یا redesign کامل.

## 3. Required Data Changes

در سطح داده، هیچ مدل جدیدی لازم نیست.

### داده‌های موجود کافی‌اند

- عنوان آیتم
- زیرعنوان/metadata
- artworkUrl
- duration
- audioUrl
- sourceType

این اطلاعات برای نمایش Queue و انتخاب آیتم کافی‌اند و نیازی به تغییر قرارداد PlayableItem نداریم.

### تغییرات پیشنهادی در state

برای پشتیبانی از تعامل کاربر، حداقل این actions در Store/Runtime لازم می‌شوند:

- selectQueueItem(index)
- removeQueueItem(index)
- clearQueue (در حال حاضر موجود است)

این تغییرات در مرز Player باقی می‌مانند و به Episode یا API هیچ وابستگی جدیدی اضافه نمی‌کنند.

## 4. Component Plan

### اجزای پیشنهادی

- QueueSheet یا QueueDrawer
  - surface‌ی اصلی برای نمایش Queue
- QueueListItem
  - نمایش هر آیتم با وضعیت current/playing/queued
- QueueEmptyState
  - نمایش حالت خالی Queue
- QueueFooterActions
  - دکمه‌ی Clear Queue

### موقعیت UI

- از PlayerBar قابل دسترس باشد
- با یک دکمه‌ی ساده مثل “Queue” یا آیکن لیست در کنترل‌های Player
- در موبایل به‌صورت sheet پایین‌آمدنی و در دسکتاپ به‌صورت panel جانبی یا dropdown ساده پیاده‌سازی شود

### مرز مالکیت

- کامپوننت‌ها در Feature Player باقی بمانند
- routeها و صفحه‌های episode/podcast تغییر نخواهند کرد
- AppShell فقط surface‌ی trigger/host را فراهم می‌کند

## 5. Runtime Changes Needed

### تغییرات الزامی

- افزودن action به Store برای انتخاب یا حذف آیتم از Queue
- افزودن method در Runtime Controller برای دسترسی UI به این عملیات
- در هنگام انتخاب آیتم از Queue، رفتار پخش باید به‌صورت واضح و یک‌پارچه انجام شود:
  - اگر آیتم انتخاب‌شده همان آیتم فعلی است، هیچ‌چیزی تغییر نکند
  - اگر آیتم دیگری انتخاب شود، playback روی آن شروع شود

### تغییرات پیشنهادی ولی محدود

- هنگام حذف آیتم فعلی، اگر Queue هنوز آیتم‌های دیگر دارد، پخش روی آیتم بعدی ادامه یابد
- اگر Queue پس از حذف خالی شود، state به idle برگردد

### تغییرات غیرضروری

- QueueManager
- PlaylistService
- Event Bus
- Store جدید
- abstraction عمومی media

## 6. Risks

- حذف آیتم فعلی می‌تواند منجر به state inconsistency شود اگر runtime به‌درستی به‌روزرسانی نشود
- انتخاب آیتم از Queue باید با currentIndex و currentItem هماهنگ باشد
- اگر Queue خالی شود، UI باید حالت empty و idle را به‌طور واضح نشان دهد
- رفتار repeat/shuffle در هنگام انتخاب دستی باید با رفتار فعلی compatible بماند

## 7. Recommendation

این فاز برای implementation آماده است.

پیشنهاد اصلی این است که Queue Experience به‌صورت یک لایه‌ی UI ساده روی Store و Runtime موجود ساخته شود، نه با ایجاد یک معماری جدید.

### رویکرد پیشنهادی

1. در Store Player، actions محدود برای select/remove اضافه شوند.
2. Runtime Controller این actions را به‌صورت یکپارچه برای UI فراهم کند.
3. یک Queue UI ساده در Feature Player ساخته شود.
4. AppShell و PlayerBar فقط trigger و host این UI باشند.

این رویکرد هم با معماری فعلی سازگار است و هم از over-engineering جلوگیری می‌کند.

## 8. Final Decision

READY FOR IMPLEMENTATION
