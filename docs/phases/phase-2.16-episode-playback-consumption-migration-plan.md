# Phase 2.16 — Episode Playback Consumption Migration Plan

## Status

Planning only / no implementation

---

## Objective

این فاز برای اولین migration واقعی مصرف‌کننده‌ی Player Runtime طراحی شده است.

هدف:

- حذف وابستگی مستقیم Episode presentation به playback behavior
- اتصال Episode به Player Runtime از طریق Playable Contract
- حفظ کامل runtime behavior فعلی
- انتقال ownership playback surface به Player بدون ساخت Player UI کامل

این فاز یک migration محدود و کنترل‌شده است.

---

## Non-Goals

این فاز شامل موارد زیر نیست:

- ساخت Mini Player
- ساخت Full Player UI
- اضافه کردن Queue
- اضافه کردن Playlist
- اضافه کردن History
- اضافه کردن Persistence
- اضافه کردن Offline playback
- اضافه کردن Media Session API
- تغییر API contract
- تغییر Episode data model
- تغییر routeها

---

# Current State

## Episode Playback Ownership

در حال حاضر:

[apps/web/src/features/episodes/components/EpisodeDetailView.tsx](../../apps/web/src/features/episodes/components/EpisodeDetailView.tsx)

هنوز مسئول:

- نمایش audio element
- اتصال مستقیم به audioUrl
- ارائه playback surface در UI episode

وضعیت فعلی:

```text
Episode Feature

├── Episode metadata

├── Upload workflow

└── Audio playback presentation
```

---

## Player Runtime State

Player Runtime در Phase 2.14 ایجاد شده:

```text
features/player

├── runtime

│    ├── audioEngine.ts

│    └── playerRuntime.ts

│

├── hooks

│    └── usePlayerRuntime.ts

│

└── store

└── playerStore.ts
```

مسئولیت فعلی:

- audio lifecycle
- playback state
- duration tracking
- current position
- runtime errors

---

# Migration Goal

بعد از این فاز:

```text
Episode Feature

├── metadata

├── episode presentation

└── playable data provider
```

|

v

```text
Player Feature

├── runtime

├── audio engine

└── playback lifecycle
```

Episode دیگر نباید مسئول:

- play
- pause
- seek
- audio lifecycle

باشد.

---

# Scope

## Allowed Changes

در این فاز:

- اتصال Episode به Player Runtime
- حذف direct audio handling از Episode
- استفاده از Playable Contract
- انتقال playback trigger به Player boundary
- محدود کردن Episode به metadata presentation

مجاز است.

---

## Forbidden Changes

در این فاز:

- ساخت UI جدید Player
- تغییر design system
- تغییر app shell
- تغییر API
- تغییر shared types بدون نیاز واقعی
- تغییر route
- تغییر query behavior
- تغییر upload flow

ممنوع است.

---

# Current Dependency Direction

وضعیت فعلی:

```text
Episode

|

├── audioUrl

|

└── HTMLAudioElement
```

مشکل:

Episode هنوز playback implementation را می‌شناسد.

---

# Target Dependency Direction

بعد از migration:

```text
Episode

|

|

Playable Adapter

|

v

Player Runtime

|

v

Audio Engine
```

---

# Migration Steps

## Step 1 — Identify Current Playback Surface

بررسی:

- EpisodeDetailView
- AudioPlayer component
- player runtime hook

هدف:

مشخص شود دقیقاً کدام بخش playback باید حذف یا جایگزین شود.

---

## Step 2 — Introduce Player Consumption Point

یک نقطه مصرف مشخص برای Player ایجاد شود.

مثلاً:

- runtime hook
- player action
- player controller API

مسئولیت:

Episode فقط playable item ارائه کند.

مثال مفهومی:

```ts
play(playableItem)
```

Episode نباید بداند:

- audio element چگونه ساخته می‌شود
- eventها چگونه مدیریت می‌شوند
- state کجا ذخیره می‌شود

---

## Step 3 — Replace Episode Direct Audio Usage

تغییر:

قبل:

```tsx
<audio src={episode.audioUrl} />
```

بعد:

```ts
const playable = episodeToPlayable(episode)

player.play(playable)
```

---

## Step 4 — Keep Episode UI Stable

در این مرحله:

- layout تغییر نکند
- metadata تغییر نکند
- upload UI تغییر نکند
- route تغییر نکند

هدف:

فقط ownership تغییر کند.

---

## Step 5 — Validate Runtime Behavior

بررسی:

- play behavior
- pause behavior
- loading
- error state
- episode navigation
- upload flow

---

# Legacy AudioPlayer Decision

در این فاز فقط بررسی شود.

سه حالت ممکن:

## Option A

AudioPlayer حذف شود.

اگر:

- consumer ندارد
- runtime جایگزین کامل شده است

---

## Option B

AudioPlayer به Player feature منتقل شود.

اگر:

- UI behavior قابل استفاده مجدد است

---

## Option C

فعلاً باقی بماند.

اگر:

- migration هنوز کامل نشده است

تصمیم نهایی بعد از بررسی repository گرفته شود.

---

# Ownership After Migration

```text
Responsibility Owner
Episode metadata -> Episode
Episode CRUD / Data Layer -> Episode
Audio upload -> Episode
Playable mapping -> Adapter
Playback lifecycle -> Player
Audio engine -> Player Runtime
Playback state -> Player Store
Player UI -> Future Player Feature
```

---

# Risks

## 1. Behavior Regression

ریسک:

تغییر lifecycle باعث شود play/pause متفاوت رفتار کند.

راهکار:

- migration کوچک
- حفظ API داخلی runtime
- تست دستی flow فعلی

---

## 2. Over Engineering

ریسک:

ساخت abstractionهای اضافی در مسیر migration.

ممنوع:

- provider جدید بدون نیاز
- event bus
- playback framework
- generic media architecture

---

## 3. Duplicate Playback Logic

ریسک:

باقی ماندن دو سیستم:

```text
Episode Audio
+
Player Runtime
```

هدف:

در پایان migration فقط Player مالک playback باشد.

---

# Validation Checklist

بعد از implementation:

- Episode دیگر audio lifecycle را مدیریت نمی‌کند
- Player Runtime تنها owner playback lifecycle است
- Playable contract مسیر اصلی انتقال داده است
- Audio engine فقط در Player runtime وجود دارد
- Routeها unchanged هستند
- API contract unchanged است
- Upload workflow unchanged است
- Query behavior unchanged است
- Lint موفق است
- Build موفق است

---

# Expected Outcome

بعد از این فاز:

- Episode یک feature داده‌محور باقی می‌ماند.
- Player اولین مصرف‌کننده واقعی خود را خواهد داشت.
- مسیر برای Player UI در آینده آماده می‌شود.
- بدون ساخت complexity اضافی، ownership صحیح تثبیت می‌شود.

---

# Final Decision

## READY FOR IMPLEMENTATION

Reason:

- Player Runtime foundation موجود است.
- Playable contract تعریف شده است.
- Dependency direction مشخص است.
- Migration محدود و قابل rollback است.
- ریسک implementation کنترل‌شده است.
