import clsx from 'clsx';
import type { ReactNode } from 'react';

export function ErrorState({
  message = 'مشکلی پیش آمده است.',
  className,
  title,
  description,
  action,
}: {
  message?: string;
  className?: string;
  title?: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className={clsx('error-state', className)} role="alert">
      <div className="space-y-3">
        {title ? <h3 className="m-0 text-subheading">{title}</h3> : null}
        <p className="m-0 text-sm font-medium">{message}</p>
        {description ? <p className="m-0 text-sm text-text-secondary">{description}</p> : null}
        {action ? <div>{action}</div> : null}
      </div>
    </div>
  );
}
