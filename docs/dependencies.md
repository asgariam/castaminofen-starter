# Dependencies — Castaminofen

این فایل وضعیت پکیج‌های پروژه را به‌صورت هم‌ساز با واقعیت فعلی ریپو جدا می‌کند.

---

## Implemented Dependencies

این پکیج‌ها در ریپو نصب شده‌اند و در نسخه‌ی فعلی استفاده می‌شوند.

### Frontend (apps/web)

#### Core
```bash
next
react
react-dom
typescript
```

#### Styling / UI
```bash
tailwindcss
postcss
autoprefixer
clsx
tailwind-merge
lucide-react
```

#### State / Data / Forms
```bash
zustand
@tanstack/react-query
react-hook-form
zod
@hookform/resolvers
```

### Backend (apps/api)

#### Core / Framework
```bash
@nestjs/common
@nestjs/config
@nestjs/core
@nestjs/jwt
@nestjs/passport
@nestjs/platform-express
@nestjs/mapped-types
```

#### Database / Storage
```bash
@prisma/client
prisma
@aws-sdk/client-s3
multer
```

#### Auth / Validation
```bash
bcrypt
class-transformer
class-validator
cookie-parser
passport
passport-jwt
```

#### Development tooling
```bash
@nestjs/cli
typescript
```

### Infrastructure (Root)

```bash
docker compose
postgres
redis
minio
```

---

## Planned Dependencies

این پکیج‌ها بخشی از نقشه‌ی راه آینده هستند اما در نسخه‌ی فعلی نصب نشده‌اند.

### Frontend roadmap
```bash
next-intl
next-pwa
idb
framer-motion
```

### Background jobs / queue / cache
```bash
@nestjs/bullmq
bullmq
ioredis
```

### RSS / parsing / security
```bash
rss-parser
fast-xml-parser
@nestjs/throttler
helmet
```

---

## Note on Dependency Changes

طبق اصل No Over Engineering، هر پکیج جدید باید فقط در صورت نیاز واقعی MVP یا فاز بعدی اضافه شود. پکیج‌هایی مثل AI SDK، Elasticsearch client، Socket.io و ابزارهای live experience در این نسخه جزو roadmap آینده‌اند و در حال حاضر نصب نشده‌اند.
