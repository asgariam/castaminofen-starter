import clsx from 'clsx';

export function LoadingState({
  message = 'در حال بارگذاری…',
  className,
  title,
}: {
  message?: string;
  className?: string;
  title?: string;
}) {
  return (
    <div className={clsx('loading-state', className)} role="status" aria-live="polite">
      <div className="flex items-center gap-3">
        <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-accent" />
        <div className="space-y-1">
          {title ? <p className="m-0 text-sm font-medium text-text-primary">{title}</p> : null}
          <p className="m-0 text-sm text-text-secondary">{message}</p>
        </div>
      </div>
    </div>
  );
}
