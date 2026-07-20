# Phase 3.6 — Player Architecture Freeze & Hardening Audit

## Current Status

وضعیت فعلی Player به‌طور کلی پایدار، منظم و مناسب برای فریز به‌عنوان پایه‌ی MVP است. مرز مالکیت در سطح feature هنوز رعایت می‌شود، runtime رفتارهای اصلی را با نظم انجام می‌دهد، و Queue Experience Foundation بدون شکستن معماری قبلی ادغام شده است.

اعتبارسنجی انجام‌شده:
- بازبینی کد فعلی در مسیرهای Player feature، Store، Runtime Controller، UI components و adapter Episode → Playable
- اجرای تست‌های regression موجود برای Player:
  - دستور: `pnpm exec tsx --test apps/web/src/features/player/runtime/playerRuntime.test.ts`
  - نتیجه: 10 test passed، 0 failed

## Architecture Findings

- معماری فعلی Player نسبتاً شفاف است و بین چهار لایه‌ی اصلی تقسیم شده است:
  - Store: نگه‌داری state و منطق Queue/Repeat/Shuffle
  - Runtime Controller: مالکیت lifecycle پخش و تصمیم‌گیری runtime
  - Audio Engine: تعامل با مرورگر و عنصر صوتی
  - UI Components: نمایش وضعیت و انجام action‌های کاربر
- این ساختار با اصل MVP و جلوگیری از over-engineering هماهنگ است.
- هیچ نشانه‌ای از بازگشت منطق پخش به Episode یا ایجاد abstraction اضافی غیرضروری دیده نمی‌شود.
- تنها نقطه‌ی ریسک معماری، نه نقض معماری، این است که بعضی از state transitions در لایه‌ی store به‌صورت مستقل و بدون normalization کامل انجام می‌شوند و به controller برای تکمیل جریان وابسته‌اند.

## Ownership Validation

- مالکیت playback lifecycle در دست Player Runtime است.
- Store Player فقط state مربوط به playback، queue، repeat، shuffle و volume را نگه می‌دارد.
- UI components فقط state را می‌خوانند و action‌ها را به Runtime Controller می‌دهند؛ از خودِ منطق پخش مستقل‌اند.
- Episode همچنان در نقش ارائه‌ی metadata، workflow و content-oriented experience باقی مانده است.
- Adapter Episode → Playable فقط تبدیل داده‌ی اپیزود به قرارداد PlayableItem است و هیچ منطق playback یا queue را در خود ندارد.
- در بازبینی فعلی، هیچ موردی از leak رفتن منطق playback به Episode شناسایی نشد.

## Runtime Findings

- رفتارهای اصلی پخش در شرایط عادی پایدارند:
  - play/pause/stop
  - next/previous
  - انتخاب آیتم از Queue
  - حذف آیتم از Queue
  - repeat/off/one/queue
  - shuffle on/off
- موارد زیر در runtime به‌صورت graceful مدیریت می‌شوند:
  - queue خالی
  - آیتم بدون audio source
  - index نامعتبر برای Queue
  - حذف آخرین آیتم Queue
- با این حال، چند حالت edge case هنوز به‌صورت روشن پوشش داده نشده‌اند و بیشتر از حدّ تست‌های موجود، به‌عنوان ریسک hardening دیده می‌شوند:
  - تعامل سریع کاربر با next/previous/play/pause در یک بازه‌ی کوتاه
  - ترکیب repeat + shuffle در یک جریان پیوسته
  - انتخاب آیتمی که در حال حاضر current item است
  - حذف آیتم قبلی یا بعدی در مقایسه با current item
- در مجموع، هیچ bug قطعی در runtime شناسایی نشد، اما سطح hardening برای interaction‌های سریع هنوز محدود است.

## State Consistency Findings

- رابطه‌ی اصلی بین queue، currentIndex و currentItem در جریان‌های رایج حفظ می‌شود.
- در حالت empty queue، state به‌صورت روشن به idle و null reset می‌شود.
- هنگام حذف آیتم current، state به آیتم بعدی یا idle می‌رسد و این رفتار در تست‌ها پوشش داده شده است.
- هنگام replaceQueue و clearQueue، state به‌صورت قابل‌قبولی بازنشانی می‌شود.
- یک ریسک جزئی اما مهم وجود دارد: بعضی از انتقال‌های state در سطح store، به‌ویژه در جابه‌جایی بین آیتم‌ها، وابسته به این هستند که controller بعداً با playItem آن را تکمیل کند. این موضوع باعث می‌شود state consistency در سطح runtime خوب باشد، اما در لایه‌ی store به‌تنهایی یک‌نیمه‌مستقل‌تر به نظر برسد.
- از نظر عملی، هیچ inconsistency شدید یا corruption state در تست‌های فعلی مشاهده نشد.

## UI Findings

- UI Player در سطح فعلی اطلاعات کافی برای کاربر فراهم می‌کند:
  - loading state
  - idle state
  - empty queue state
  - error state
  - کنترل‌های repeat/shuffle/queue
- Queue sheet تجربه‌ی کاربری اولیه‌ی مناسبی ارائه می‌دهد و از اصول موبایل‌فیرست پیروی می‌کند.
- چند بهبود غیرهسته‌ای و بدون redesign قابل پیشنهاد است:
  - بهتر کردن accessibility برای artwork در QueueListItem
  - روشن‌تر کردن پیام‌های empty/error در حالت‌های بدون آیتم پخش
  - مدیریت focus برای dialog Queue هنگام باز و بسته شدن
- از نظر UX کلی، UI برای MVP قابل قبول است و تغییرات پیشنهادی بیشتر polishing هستند تا اصلاحات ضروری.

## Test Coverage Findings

- تست‌های موجود برای Player به‌خوبی مسیرهای اصلی را پوشش می‌دهند:
  - repeat mode
  - shuffle selection
  - queue selection
  - queue removal
  - clearQueue
  - empty queue
  - missing audio source
- اما چند مسیر حیاتی هنوز در تست‌ها دیده نمی‌شوند:
  - interaction‌های سریع و تکراری next/previous/play/pause
  - ترکیب repeat one + shuffle
  - انتخاب current item دوباره
  - حذف آیتم‌های قبلی و بعدی نسبت به current item
  - مسیر load → playing → error و load → paused
- از نظر پوشش، فعلی برای freeze اولیه کافی است، اما برای hardening بعدی نیاز به تکمیل تست‌ها دارد.

## Performance Findings

- در بازبینی فعلی، نشانه‌ی قطعی از rerender غیرضروری، memory leak، یا مشکل در lifecycle Audio Engine دیده نشد.
- ساختار فعلی برای MVP سبک و قابل‌پیش‌بینی است.
- ریسک عملکردی فعلی بیشتر به state subscription و interaction‌های سریع مربوط است تا به یک مشکل معماری یا نشت حافظه.
- در نتیجه، هیچ issue عملکردی بحرانی برای تأخیر فریز شناسایی نشد.

## Risks

- ریسک متوسط: race condition یا state drift در تعاملات سریع کاربر با کنترل‌های پخش.
- ریسک متوسط: پوشش تستی هنوز برای همه‌ی مسیرهای edge case کافی نیست.
- ریسک کم: UX و accessibility بعضی از سطوح Queue/UI هنوز نیاز به polish دارد.
- ریسک کم: نبود persistence یا recovery برای Queue در جلسه‌ی بعدی، که برای MVP فعلی قابل قبول است اما برای آینده مهم خواهد بود.

## Recommended Actions

1. این مرحله را به‌عنوان audit-only تکمیل کنید و بدون وارد کردن refactor یا abstraction جدید، فریز معماری را ادامه دهید.
2. برای hardening بعدی، تست‌های regression برای interaction‌های سریع و edge cases اضافه شوند.
3. در صورت نیاز به آماده‌سازی برای انتشار یا تست بیشتر، فقط polish‌های محدود و بدون تغییر قراردادها اعمال شوند.
4. در فازهای بعدی، state normalization و accessibility Queue UI به‌صورت incremental و بدون تغییر ownership boundary تقویت شوند.

## Implementation Required?

خیر. این فاز در سطح audit انجام شد و هیچ تغییر کد، refactor، یا اصلاح runtime برای این مرحله لازم نیست. نتیجه‌ی این بازبینی، آماده بودن Player برای فریز به‌عنوان پایه‌ی MVP با ریسک‌های قابل‌مدیریت است.
