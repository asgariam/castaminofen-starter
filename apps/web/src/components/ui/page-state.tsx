import clsx from 'clsx';
import type { ReactNode } from 'react';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { LoadingState } from '@/components/ui/loading-state';

export type PageStateVariant = 'loading' | 'empty' | 'error';

export function PageState({
  variant,
  title,
  description,
  action,
  className,
}: {
  variant: PageStateVariant;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  if (variant === 'loading') {
    return <LoadingState className={className} title={title} message={description} />;
  }

  if (variant === 'error') {
    return (
      <ErrorState
        className={className}
        title={title}
        description={description}
        action={action}
        message="مشکلی در نمایش این بخش پیش آمده است."
      />
    );
  }

  return <EmptyState className={clsx('w-full', className)} title={title} description={description} action={action} />;
}
