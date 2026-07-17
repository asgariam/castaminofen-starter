import clsx from 'clsx';
import type { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  type = 'button',
  ...props
}: DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
}) {
  return (
    <button
      type={type}
      className={clsx(
        'button',
        {
          'button-primary': variant === 'primary',
          'button-secondary': variant === 'secondary',
          'button-ghost': variant === 'ghost',
          'px-3 py-2 text-xs': size === 'sm',
          'px-4 py-3 text-sm': size === 'md',
          'px-5 py-4 text-base': size === 'lg',
        },
        className,
      )}
      {...props}
    />
  );
}
