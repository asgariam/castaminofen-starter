import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { PageState, type PageStateVariant } from '@/components/ui/page-state';

type RouteLink = {
  href: string;
  label: string;
};

export function RoutePlaceholder({
  title,
  description,
  badge = 'Route foundation',
  links = [],
  stateVariant = 'empty',
  stateTitle,
  stateDescription,
}: {
  title: string;
  description: string;
  badge?: string;
  links?: RouteLink[];
  stateVariant?: PageStateVariant;
  stateTitle?: string;
  stateDescription?: string;
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

        <PageState
          variant={stateVariant}
          title={stateTitle ?? 'وضعیت صفحه'}
          description={stateDescription ?? 'این بخش برای نمایش الگوی وضعیت صفحه در مسیرهای آینده آماده شده است.'}
        />
      </Card>
    </main>
  );
}
