import { RoutePlaceholder } from '@/components/layout/route-placeholder';

export default function HomePage() {
  return (
    <RoutePlaceholder
      title="خانه"
      description="این صفحه‌ی ورود اصلی برای ساختار مسیرهای آینده آماده شده و در حال حاضر صرفاً ترکیب صفحه را نمایش می‌دهد."
      badge="Route foundation"
      links={[{ href: '/search', label: 'جستجو' }, { href: '/library', label: 'کتابخانه' }, { href: '/profile', label: 'پروفایل' }]}
    />
  );
}
