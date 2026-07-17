import clsx from 'clsx';
import type { HTMLAttributes } from 'react';

export type BadgeVariant = 'default' | 'accent' | 'success' | 'warning' | 'error';

export function Badge({
  className,
  variant = 'default',
  ...props
}: HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
}) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold tracking-wide',
        {
          'border-border bg-surface-secondary text-text-secondary': variant === 'default',
          'border-accent bg-surface-secondary text-accent': variant === 'accent',
          'border-success bg-surface-secondary text-success': variant === 'success',
          'border-warning bg-surface-secondary text-warning': variant === 'warning',
          'border-error bg-surface-secondary text-error': variant === 'error',
        },
        className,
      )}
      {...props}
    />
  );
}
