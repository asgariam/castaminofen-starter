import { RoutePlaceholder } from '@/components/layout/route-placeholder';

export default function ProfilePage() {
  return (
    <RoutePlaceholder
      title="پروفایل"
      description="این صفحه برای ساختاردهی مسیر پروفایل و ترکیب صفحه در آینده آماده شده است."
      badge="Route foundation"
      links={[{ href: '/', label: 'خانه' }, { href: '/library', label: 'کتابخانه' }]}
      stateVariant="error"
      stateTitle="وضعیت خطا"
      stateDescription="این الگوی عمومی برای نمایش خطاهای صفحه‌ای در مسیرهای آینده قابل استفاده است."
    />
  );
}
