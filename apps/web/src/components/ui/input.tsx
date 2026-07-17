import clsx from 'clsx';
import type { InputHTMLAttributes, DetailedHTMLProps } from 'react';

export function Input({ className, ...props }: DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>) {
  return <input className={clsx('input', className)} aria-invalid={props['aria-invalid'] ?? undefined} {...props} />;
}
