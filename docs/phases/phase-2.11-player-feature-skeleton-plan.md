# Phase 2.11 — Player Feature Skeleton Adoption Plan

## Objective

این فاز صرفاً برای تعریف و تثبیت skeleton آینده‌ی Player به‌عنوان یک feature مستقل در فرانت‌اند انجام می‌شود. هدف اصلی این است که:

- مرز مالکیت بین Episode و Player به‌صورت شفاف تعریف شود
- ساختار آینده‌ی Player قبل از هرگونه implementation واقعی مشخص شود
- از ورود premature abstraction و over-engineering جلوگیری شود
- مسیر مهاجرت تدریجی بدون تغییر runtime behavior روشن شود
- Player به‌عنوان یک feature مستقل با مسئولیت‌های مشخص، نه یک component پراکنده یا state ی پراکنده، تعریف شود

این فاز محدود به مستندسازی معماری است و هیچ تغییر runtime، API، dependency یا file movement را در بر نمی‌گیرد.

---

## Current Player Code Inventory

در حال حاضر، بخش‌های مرتبط با playback در چند نقطه‌ی مختلف پراکنده‌اند و هنوز یک feature مستقل با نام Player وجود ندارد.

| Location | Current Responsibility | Current Ownership | Future Ownership |
| --- | --- | --- | --- |
| [apps/web/src/components/AudioPlayer.tsx](../../apps/web/src/components/AudioPlayer.tsx) | کنترل play/pause با استفاده از HTMLAudioElement و state محلی | Shared/UI layer (transitional) | Player Feature |
| [apps/web/src/stores/playerStore.ts](../../apps/web/src/stores/playerStore.ts) | نگه‌داشتن current episode، وضعیت پخش، volume، repeat و shuffle | Global state layer | Player Feature |
| [apps/web/src/features/episodes/components/EpisodeDetailView.tsx](../../apps/web/src/features/episodes/components/EpisodeDetailView.tsx) | رندر inline audio و نمایش source episode در صفحه‌ی جزئیات | Episode Feature | Episode Feature (metadata/presentation only) |
| [apps/web/src/features/episodes/hooks/useEpisodeAudioUpload.ts](../../apps/web/src/features/episodes/hooks/useEpisodeAudioUpload.ts) | جریان آپلود audio برای episode | Episode Feature | Episode Feature |

### تحلیل وضعیت فعلی

- Player هنوز به‌صورت یک feature کاملاً مستقل ظهور نکرده است.
- AudioPlayer فعلاً یک component مستقل و ساده است که responsibilities پخش را با UI خود ترکیب کرده است.
- playerStore در سطح application state وجود دارد، اما هنوز به‌صورت feature-scoped و واضح در معماری قرار نگرفته است.
- Episode در حال حاضر هنوز بخشی از experience playback را از طریق UI مستقیم و source داده‌ی خود مدیریت می‌کند.

---

## Future Ownership Boundary

### Player Feature should own

Player در آینده باید مالکیت این مسئولیت‌ها را بر عهده بگیرد:

- lifecycle پخش: load/play/pause/stop
- state مربوط به current item
- queue و history در آینده
- کنترل‌های پخش و UI مرتبط
- playback-related state در سطح application
- integration با media-session یا experience‌های مشابه در آینده

### Episode Feature should own

Episode باید مالکیت این موارد را حفظ کند:

- metadata و business data اپیزود
- نمایش اطلاعات اپیزود
- workflowهای مرتبط با episode مانند upload audio
- validation و rules مربوط به اپیزود
- ارائه‌ی داده‌ی اپیزود به‌صورت read-oriented به Player

### Shared Layer should own

بخش‌های زیر باید در لایه‌ی shared باقی بمانند:

- UI primitives عمومی
- API clients و data access abstractions
- application providers
- utilityهای generic media که به‌طور مستقل و بدون coupling به episode یا player کار کنند

### Ownership violations to watch

موارد زیر باید به‌عنوان violations احتمالی در نظر گرفته شوند:

- اگر AudioPlayer به‌صورت یک shared component با state و logic episode-specific رشد کند
- اگر Player مستقیماً به internals Episode وابسته شود
- اگر Episode به state یا implementation Player دسترسی پیدا کند
- اگر playback logic در feature Episode با business logic آن ادغام شود

---

## Proposed Feature Structure

در مرحله‌ی skeleton، Player باید به‌عنوان یک feature مستقل با ساختار ساده‌ی زیر تصور شود:

- features/player/components
- features/player/hooks
- features/player/store
- features/player/types
- features/player/constants

این ساختار باید فقط برای organization و ownership آینده طراحی شود و در این فاز هیچ runtime usage جدیدی ایجاد نمی‌شود.

### هدف ساختار پیشنهادی

- جدا کردن Player از shared UI layer
- جدا کردن Player از Episode feature
- فراهم‌کردن جای پای قابل‌استخدام برای migration آینده
- جلوگیری از رشد uncontrolled state در لایه‌های دیگر

---

## Shared Layer Boundary

لایه‌ی shared باید فقط مسئولیت‌های truly generic را حفظ کند. این لایه نباید به‌صورت پیش‌فرض مسئول playback feature یا episode-specific experience شود.

### مواردی که در shared باقی می‌مانند

- generic UI primitives مانند button، card، modal، icon wrappers
- API client abstractions
- application providers
- generic media helpers که به هیچ feature خاصی وابسته نیستند

### مواردی که نباید به shared منتقل شوند

- logic مربوط به play/pause/queue/current item
- episode-specific playback UI
- state یا behavior وابسته به metadata اپیزود

### نتیجه

اگر یک component فقط برای پخش یک episode خاص طراحی شده باشد، در آینده باید در مرز Player قرار گیرد؛ فقط در صورتی که به‌طور کامل generic و reusable باشد، می‌تواند در shared باقی بماند.

---

## AudioPlayer Migration Analysis

### Should it eventually move into Player?

بله، در بلندمدت AudioPlayer باید در مرز Player feature قرار گیرد. دلیل آن این است که این component در حال حاضر بیش از یک UI ساده است و به‌طور مستقیم با lifecycle پخش و state مربوط به playback درگیر است.

### Responsibilities that belong to Player

این بخش‌ها باید در آینده متعلق به Player باشند:

- play/pause toggle
- کنترل source audio
- state مربوط به وضعیت پخش
- تعامل با current item
- UI مرتبط با playback controls

### Parts that should remain shared

بخش‌های زیر اگر در آینده دوباره استفاده شوند، می‌توانند در shared باقی بمانند:

- generic button/icon wrapping
- reusable media control primitives
- presentation helpers بدون state پخش

### Conclusion

AudioPlayer در حال حاضر یک transitional component است. در آینده باید به‌عنوان یک component feature-scoped در Player دیده شود، اما این انتقال در این فاز انجام نمی‌شود.

---

## Player State Ownership

### Current responsibility

در [apps/web/src/stores/playerStore.ts](../../apps/web/src/stores/playerStore.ts) فعلاً مسئولیت‌های زیر وجود دارد:

- نگه‌داشتن current episode
- وضعیت پخش
- volume
- repeat mode
- shuffle
- actions مرتبط با state

### Does it belong to future Player feature?

بله، این store به‌طور طبیعی باید در آینده به ownership Player منتقل شود. دلیل آن این است که state آن مستقیم با playback experience مرتبط است و نه با business logic episode.

### Possible migration approach

مسیر مهاجرت پیشنهادی به‌صورت زیر است:

1. store فعلی به‌عنوان یک starting point حفظ شود
2. نام و scope آن به یک store feature-scoped برای Player تغییر یابد
3. currentEpisode به یک abstraction عمومی‌تر مانند playable item یا current playback item تبدیل شود
4. Episode فقط داده‌ی لازم برای پخش را به Player ارائه دهد، نه اینکه خود Player از internals Episode استفاده کند

این migration باید تدریجی و بدون breaking change انجام شود.

---

## Episode Integration Boundary

### Desired direction

Episode Feature
↓
Playable Contract
↓
Player Feature

### Meaning

- Episode داده و metadata‌ی اپیزود را فراهم می‌کند
- یک adapter یا mapper ساده قرارداد playable را تولید می‌کند
- Player فقط از playable contract استفاده می‌کند

### Forbidden direction

این روابط باید ممنوع باشند:

- Player imports Episode internals
- Episode imports Player state یا implementation
- Episode مسئول lifecycle پخش یا queue management باشد

### Practical interpretation

در آینده، Episode باید به Player فقط یک surface‌ی داده‌ای ارائه دهد؛ Player نباید از structure داخلی Episode برای رفتار پخش استفاده کند.

---

## Migration Strategy

### Phase 1 — Player boundary documentation

- تعریف مسئولیت‌های Player و Episode
- ثبت مرز shared vs feature
- تثبیت ownership بدون تغییر runtime

### Phase 2 — Create Player feature skeleton

- ایجاد ساختار feature برای Player
- تعریف store/hook/type اولیه در مرز feature
- بدون فعال‌سازی runtime usage جدید

### Phase 3 — Connect existing playback to Player ownership

- انتقال control و state پخش به Player
- نگه‌داشتن Episode به‌عنوان source داده
- حفظ behavior فعلی تا حد ممکن

### Phase 4 — Remove playback responsibility from Episode

- کاهش استفاده‌ی مستقیم Episode از audio lifecycle
- تثبیت Player به‌عنوان owner اصلی experience پخش

### Phase 5 — Extend Player with queue/history/media features

- افزودن queue، history، resume و experience‌های پیشرفته
- با حفظ مرز Episode/Player در قالب contract مشخص

---

## Risks

### 1. Moving too much too early

اگر Player خیلی زود از حد skeleton فراتر برود، complexity اضافه می‌شود و migration سخت‌تر می‌شود.

### 2. Creating duplicate player states

اگر state پخش هم در Episode و هم در Player نگهداری شود، inconsistency ایجاد می‌شود.

### 3. Breaking audio behavior

اگر migration به‌طور ناگهانی انجام شود، تجربه‌ی پخش ممکن است دچار regressions شود.

### 4. Coupling with Episode

اگر Player از internals Episode استفاده کند، ownership دوباره مبهم می‌شود.

### 5. Overengineering Player

اگر Player پیش از نیاز با queue، history و media features پیچیده شود، هزینه‌ی نگهداری افزایش می‌یابد.

### 6. Global state complexity

اگر state پخش به‌صورت پراکنده و بدون ownership مشخص مدیریت شود، framtای maintenance دشوار خواهد شد.

---

## Guardrails

- Player باید مستقل و feature-scoped باقی بماند
- Episode باید مالک metadata و data اپیزود باقی بماند
- shared layer باید generic و بدون feature-specific playback logic باقی بماند
- هیچ abstraction premature ایجاد نشود
- هیچ تغییر runtime قبل از مرحله‌ی migration انجام نشود
- migration باید non-breaking و تدریجی باشد

---

## Future Checklist

- [ ] یک feature folder ساده برای Player تعریف شود
- [ ] ownership boundary بین Player و Episode روشن شود
- [ ] یک قرارداد داده‌ی ساده برای playable item مشخص شود
- [ ] AudioPlayer به‌عنوان transitional ownership شناخته شود
- [ ] playerStore به‌عنوان future Player state معرفی شود
- [ ] migration به‌صورت phase-based و بدون breaking change انجام شود
- [ ] در مرحله‌ی implementation، direct dependency به Episode کاهش یابد

---

## Validation Summary

این فاز در سطح documentation و planning باقی ماند و موارد زیر تأیید می‌شود:

- هیچ تغییر کد اعمال نشده است
- هیچ file movement انجام نشده است
- هیچ dependency جدیدی اضافه نشده است
- هیچ runtime behavior تغییر نکرده است
- هیچ route یا API contractی تغییر نکرده است
- هیچ تغییر در Episode یا Player implementation واقعی انجام نشده است

بر اساس تحلیل فعلی، مرز آینده‌ی Player به‌طور قابل‌قبولی روشن شده است و آماده‌ی انتقال به مرحله‌ی skeleton implementation در آینده است.

---

## Final Decision

READY FOR PLAYER FEATURE IMPLEMENTATION

دلیل: مرز مالکیت، ساختار پیشنهادی، مسیر مهاجرت، محدودیت‌های shared layer و ریسک‌های احتمالی به‌صورت شفاف تعریف شده‌اند و هیچ نیازی به تحلیل بیشتر برای شروع مرحله‌ی بعدی دیده نمی‌شود.
