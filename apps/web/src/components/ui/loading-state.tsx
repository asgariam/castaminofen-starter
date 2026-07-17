import clsx from 'clsx';

export function LoadingState({ message = 'در حال بارگذاری…', className }: { message?: string; className?: string }) {
  return (
    <div className={clsx('loading-state', className)} role="status" aria-live="polite">
      <div className="flex items-center gap-3">
        <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-accent" />
        <span className="text-sm text-text-secondary">{message}</span>
      </div>
    </div>
  );
}
