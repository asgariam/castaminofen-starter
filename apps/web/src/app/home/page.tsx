import { RoutePlaceholder } from '@/components/layout/route-placeholder';

export default function HomeRoutePage() {
  return (
    <RoutePlaceholder
      title="خانه"
      description="این صفحه‌ی ساختاری برای ورود اصلی اپلیکیشن و آماده‌سازی ساختار مسیر آینده است."
      badge="Route foundation"
      links={[{ href: '/search', label: 'جستجو' }, { href: '/library', label: 'کتابخانه' }]}
    />
  );
}
