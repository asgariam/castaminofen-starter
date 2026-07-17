import clsx from 'clsx';
import type { ReactNode, FormHTMLAttributes } from 'react';

export function Form({ className, children, ...props }: FormHTMLAttributes<HTMLFormElement> & { children: ReactNode }) {
  return (
    <form className={clsx('form', className)} {...props}>
      {children}
    </form>
  );
}

export function FormField({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={clsx('form-field', className)}>{children}</div>;
}

export function FormLabel({ htmlFor, children }: { htmlFor?: string; children: ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="form-label">
      {children}
    </label>
  );
}

export function FormMessage({ children }: { children: ReactNode }) {
  return <p className="form-message">{children}</p>;
}
