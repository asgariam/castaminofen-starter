import clsx from 'clsx';

export function ErrorState({ message = 'مشکلی پیش آمده است.', className }: { message?: string; className?: string }) {
  return (
    <div className={clsx('error-state', className)} role="alert">
      <p className="m-0 text-sm font-medium">{message}</p>
    </div>
  );
}
