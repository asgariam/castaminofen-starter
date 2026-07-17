import { RoutePlaceholder } from '@/components/layout/route-placeholder';

export default function LibraryPage() {
  return (
    <RoutePlaceholder
      title="کتابخانه"
      description="این صفحه برای آماده‌سازی مسیر کتابخانه و محتوای آینده در نظر گرفته شده است."
      badge="Route foundation"
      links={[{ href: '/', label: 'خانه' }, { href: '/search', label: 'جستجو' }]}
      stateVariant="empty"
      stateTitle="وضعیت خالی"
      stateDescription="برای نمایش فضای آماده‌ی محتوا در مسیر کتابخانه از این الگوی عمومی استفاده می‌شود."
    />
  );
}
