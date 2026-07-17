import clsx from 'clsx';
import type { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';

export function Button({
  className,
  variant = 'primary',
  type = 'button',
  ...props
}: DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
  variant?: ButtonVariant;
}) {
  return (
    <button
      type={type}
      className={clsx('button', {
        'button-primary': variant === 'primary',
        'button-secondary': variant === 'secondary',
        'button-ghost': variant === 'ghost',
      }, className)}
      {...props}
    />
  );
}
