import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';

type RouteLink = {
  href: string;
  label: string;
};

export function RoutePlaceholder({
  title,
  description,
  badge = 'Route foundation',
  links = [],
}: {
  title: string;
  description: string;
  badge?: string;
  links?: RouteLink[];
}) {
  return (
    <main className="page-container">
      <Card className="space-y-6">
        <div className="space-y-3">
          <p className="text-caption uppercase">{badge}</p>
          <h1 className="text-heading">{title}</h1>
          <p className="text-body">{description}</p>
        </div>

        {links.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="button button-secondary">
                {link.label}
              </Link>
            ))}
          </div>
        ) : null}

        <EmptyState
          title="ساختار مسیر"
          description="در این مرحله فقط ترکیب صفحه، عنوان و فضای آماده‌سازی برای مسیرهای آینده نمایش داده می‌شود."
        />
      </Card>
    </main>
  );
}
