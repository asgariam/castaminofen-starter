import { RoutePlaceholder } from '@/components/layout/route-placeholder';

export default function SearchPage() {
  return (
    <RoutePlaceholder
      title="جستجو"
      description="این صفحه برای ساختاردهی مسیر جستجو در آینده آماده شده است."
      badge="Route foundation"
      links={[{ href: '/', label: 'خانه' }, { href: '/library', label: 'کتابخانه' }]}
      stateVariant="empty"
      stateTitle="وضعیت خالی"
      stateDescription="این الگوی صفحه برای حالت‌های بدون محتوا در مسیرهای آینده قابل استفاده است."
    />
  );
}
