# Phase 2.9 — Player Feature Boundary Adoption Plan

## Objective

این فاز صرفاً برای تحلیل و مستندسازی مرز مالکیت آینده برای Player در فرانت‌اند است. هدف اصلی این است که:

- از تبدیل Episode به مالک زیرساخت پخش جلوگیری شود
- مسئولیت‌های آینده‌ی Player شفاف شوند
- وابستگی‌های فعلی بین Episode و playback infrastructure شناسایی شوند
- مسیر مهاجرت آینده بدون تغییر runtime behavior آماده شود
- ساختار فعلی در حین مستندسازی بدون تغییر باقی بماند

هدف نهایی، تعریف یک مرز قابل‌قبول برای Player است که در آینده بتوان بدون شکستن رفتار فعلی، ownership را به‌صورت تدریجی منتقل کرد.

---

## Current Player State

در حال حاضر، بخش‌های مرتبط با playback در چند لایه‌ی مختلف پراکنده‌اند. این وضعیت هنوز یک Player feature مستقل نیست، اما نشانه‌هایی از ownership آینده وجود دارد.

| Location | Responsibility | Current Owner |
| --- | --- | --- |
| [apps/web/src/features/episodes/components/EpisodeDetailView.tsx](../../apps/web/src/features/episodes/components/EpisodeDetailView.tsx) | نمایش جزئیات اپیزود و رندر inline audio element با استفاده از audioUrl اپیزود | Episode Feature |
| [apps/web/src/components/AudioPlayer.tsx](../../apps/web/src/components/AudioPlayer.tsx) | یک component مستقل برای کنترل پخش با استفاده از HTMLAudioElement و state محلی | Shared/UI layer |
| [apps/web/src/stores/playerStore.ts](../../apps/web/src/stores/playerStore.ts) | state مربوط به current episode، وضعیت پخش، volume، repeat و shuffle | Shared/global state layer |
| [apps/web/src/features/episodes/hooks/useEpisodeAudioUpload.ts](../../apps/web/src/features/episodes/hooks/useEpisodeAudioUpload.ts) | جریان آپلود audio برای اپیزود | Episode Feature |
| [apps/web/src/lib/episodes.ts](../../apps/web/src/lib/episodes.ts) | دسترسی به API مربوط به episode و upload audio | Shared data layer |

### جمع‌بندی وضعیت فعلی

- Player هنوز یک feature مستقل و کاملاً ادغام‌شده نیست.
- Episode در حال حاضر مسئول render مستقیم audio و نمایش source مربوط به خود است.
- یک store با نام Player وجود دارد اما هنوز به‌صورت فعال در runtime به کار گرفته نشده است.
- بنابراین، وضعیت فعلی بیشتر شبیه یک ownership-in-progress یا half-formed boundary است.

---

## Existing Coupling

### تحلیل هم‌پیوستی فعلی

در حال حاضر Episode و playback infrastructure به‌صورت زیر به هم مرتبط‌اند:

- Episode detail page از طریق [apps/web/src/features/episodes/components/EpisodeDetailView.tsx](../../apps/web/src/features/episodes/components/EpisodeDetailView.tsx) یک عنصر audio مستقیم رندر می‌کند.
- این component مستقیماً به audioUrl episode وابسته است و رفتار پخش را به‌صورت UI-native مدیریت می‌کند.
- بخش‌های مربوط به upload audio نیز در feature episode باقی مانده‌اند و با داده‌ی episode در هم تنیده‌اند.
- player-related state در [apps/web/src/stores/playerStore.ts](../../apps/web/src/stores/playerStore.ts) وجود دارد، اما هنوز به‌صورت عمیق در flow episode ادغام نشده است.

### وابستگی فعلی

جهت وابستگی فعلی به‌صورت خلاصه این است:

- Episode -> playback surface
- Episode از طریق داده‌ی خود (audioUrl و metadata) رفتار پخش را کنترل می‌کند

### جهت آینده

جهت مطلوب آینده باید به شکل زیر باشد:

Player Feature
↓
Episode Metadata / Data Layer

یعنی Player باید مالک engine و lifecycle پخش باشد و Episode فقط داده و metadata مرتبط را فراهم کند.

---

## Ownership Boundary

### Player Feature should own

در آینده، Player feature باید مسئولیت‌های زیر را بر عهده بگیرد:

- playback engine
- lifecycle پخش (play/pause/stop/load)
- مدیریت current playing item
- مدیریت queue
- کنترل‌های پخش (play/pause/next/previous/seek)
- mini player UI و full player UI
- state مربوط به playback در سطح application
- رفتارهای مرتبط با media session در صورت نیاز آینده

### Episode Feature should own

Episode Feature نباید مالک زیرساخت پخش باشد، اما مسئولیت‌های زیر را باید حفظ کند:

- نمایش metadata اپیزود
- نمایش اطلاعات اپیزود
- ارائه‌ی داده‌ی اپیزود به Player
- مدیریت workflowهای مرتبط با اپیزود مانند upload audio
- ارائه‌ی actions مرتبط با اپیزود به‌عنوان data/interaction surface

### مواردی که نباید به Episode تعلق بگیرند

موارد زیر نباید در آینده جزو مسئولیت Episode باشند:

- audio lifecycle
- queue management
- current playing episode state
- player UI infrastructure
- media-session integration
- عمومی‌سازی playback state

---

## Shared Responsibilities

برخی مسئولیت‌ها در مرز shared باقی می‌مانند و نباید به Player یا Episode اختصاصی شوند:

- UI primitives عمومی مانند button، card، modal
- layout و shell application
- providers و application-wide infrastructure
- abstractionهای داده‌ای عمومی برای دسترسی به API
- utilityهای عمومی مرتبط با media که صرفاً generic باشند

### violations احتمالی

نکات زیر باید به‌عنوان violations احتمالی در نظر گرفته شوند:

- اگر Episode component خود شامل state، queue یا play/pause logic شود
- اگر Player feature به‌جای استفاده از shared abstraction، به‌صورت مستقیم با logic episode CRUD درگیر شود
- اگر audio behavior در feature episode با UI و business logic آن ادغام شود
- اگر shared layer شامل component‌های اختصاصی episode یا player شود

---

## API/Data Boundary

### Player can consume

Player در آینده می‌تواند از موارد زیر استفاده کند:

- episode id
- title
- audioUrl
- duration اگر در داده موجود باشد
- artwork / metadata مرتبط
- داده‌های عمومی مربوط به episode از shared data layer

### Player must not own

Player نباید مالک موارد زیر باشد:

- CRUD اپیزود
- آپلود audio
- endpointهای podcast یا episode management
- validation یا form logic مربوط به episode
- business logic ایجاد/ویرایش اپیزود

### پیشنهاد برای مرز داده

برای حفظ سادگی و کاهش coupling، Player باید از یک abstraction ساده‌ی داده‌ای استفاده کند که اطلاعات پخش را به‌صورت read-only یا read-optimized ارائه دهد. این abstraction می‌تواند از لایه‌ی shared API یا hookهای موجود استفاده کند، اما نباید خود مالک workflow episode باشد.

---

## Migration Strategy

### Phase 1 — Documentation Alignment

- شفاف‌سازی مرز فعلی
- ثبت مسئولیت‌های current owner
- مشخص‌کردن نقاط coupling
- تعریف boundary آینده بدون تغییر behavior

### Phase 2 — Introduce Player Feature Boundary

- ایجاد یک feature مستقل برای Player
- تعریف store/hook/provider مرتبط با playback
- نگه‌داشتن Episode به‌عنوان source of episode metadata
- بدون تغییر routeها یا قراردادهای API

### Phase 3 — Incremental Ownership Transfer

- انتقال audio lifecycle از Episode به Player
- کاهش استفاده‌ی مستقیم از audio DOM در Episode
- نگه‌داشتن UI و business logic episode در حد داده و presentation

### Phase 4 — Remove Playback Coupling from Episode

- حذف وابستگی مستقیم Episode به playback infrastructure
- حفظ Episode به‌عنوان feature presentation/data owner
- تثبیت Player به‌عنوان owner اصلی playback experience

---

## Risks

### 1. Episode/Player coupling

اگر در آینده playback logic در Episode باقی بماند، Player feature به‌طور واقعی شکل نمی‌گیرد و ownership دوباره مبهم می‌شود.

### 2. Global state complexity

اگر state پخش به‌صورت پراکنده در چند component یا store نگهداری شود، آینده‌ی maintenance دشوار خواهد شد.

### 3. Audio lifecycle issues

در صورت عدم تفکیک درست، مشکلاتی مانند double-play، pause/resume نادرست، و state inconsistency ممکن است رخ دهد.

### 4. SSR/client boundary issues

اگر playback logic به‌طور زودهنگام به SSR-sensitive code متصل شود، ممکن است مشکلات hydration یا browser-only behavior ایجاد شود.

### 5. Future queue complexity

با رشد feature، queue و current item به‌تدریج پیچیده‌تر می‌شوند و نیازمند ownership واضح در Player دارند.

### 6. Download feature coupling

اگر download behavior در کنار playback قرار بگیرد، مرز Player و download feature مبهم می‌شود. بهتر است download به‌عنوان feature جدا یا shared concern باقی بماند مگر اینکه محصول آن را به‌طور رسمی به Player وصل کند.

---

## Guardrails

- هیچ تغییر runtime در این فاز انجام نشود.
- هیچ route، API contract یا behavior فعلی تغییر نکند.
- Episode نباید به‌طور ضمنی مالک playback engine شود.
- Player نباید مسئولیت CRUD episode یا upload audio را بر عهده بگیرد.
- مرز feature باید شفاف و کوچک نگه داشته شود.
- migration باید تدریجی و non-breaking باشد.

---

## Future Checklist

- [ ] تعریف دقیق feature folder برای Player
- [ ] مشخص‌کردن ownership store/hook/provider برای Player
- [ ] تعیین قرارداد داده‌ی ورودی Player از Episode
- [ ] جدا کردن UI پخش از Episode presentation
- [ ] حفظ Episode به‌عنوان مالک metadata و data
- [ ] بررسی و حذف couplingهای باقی‌مانده در مرحله‌ی مهاجرت
- [ ] اجرای build و lint پس از مهاجرت آینده

---

## Validation Summary

این فاز در سطح documentation و planning باقی ماند. هیچ کد، فایل، route، API contract، dependency یا behavior runtime تغییر نکرد.

بر اساس تحلیل فعلی:

- Player هنوز به‌صورت یک feature مستقل وجود ندارد.
- Episode در حال حاضر مسئول render مستقیم audio و نگه‌داشتن workflow مرتبط با audio است.
- مرز آینده برای Player کاملاً قابل‌تعریف است و می‌توان آن را به‌صورت safe و تدریجی اجرا کرد.

## Final Decision

READY FOR FUTURE IMPLEMENTATION

دلیل:

- الگوی ownership برای Player در repository به‌طور واضح قابل‌تشخیص است
- current coupling محدود و قابل‌پیش‌بینی است
- مسیر مهاجرت آینده بدون نیاز به تغییر رفتار فعلی قابل طراحی است
- هیچ نشانه‌ای از نیاز به تحلیل بیشتر برای شروع مرحله‌ی بعدی وجود ندارد
