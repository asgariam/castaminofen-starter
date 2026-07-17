import { RoutePlaceholder } from '@/components/layout/route-placeholder';

export default function ProfileRoutePage() {
  return (
    <RoutePlaceholder
      title="پروفایل"
      description="این صفحه‌ی ساختاری برای مسیر پروفایل آماده شده و بدون منطق محصول است."
      badge="Route foundation"
      links={[{ href: '/', label: 'خانه' }, { href: '/library', label: 'کتابخانه' }]}
    />
  );
}
