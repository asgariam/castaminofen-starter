import clsx from 'clsx';
import type { ReactNode } from 'react';

export function EmptyState({
  title,
  description,
  action,
  className,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx('flex flex-col items-start gap-4 rounded-2xl border border-dashed border-border bg-surface-secondary/70 p-6 text-start', className)} role="status">
      <div className="space-y-2">
        <h3 className="text-subheading">{title}</h3>
        {description ? <p className="text-body m-0">{description}</p> : null}
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  );
}
