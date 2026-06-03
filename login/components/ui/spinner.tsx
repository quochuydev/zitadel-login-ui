import * as React from 'react';

import { cn } from '#/lib/utils';

function Spinner({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      role="status"
      aria-label="Loading"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('size-5 animate-spin text-primary', className)}
      {...props}
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
        className="opacity-25"
      />
      <path
        d="M12 2a10 10 0 0 1 10 10"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        className="opacity-90"
      />
    </svg>
  );
}

function LoadingOverlay({ loading }: { loading?: boolean }) {
  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60">
      <Spinner className="size-8" />
    </div>
  );
}

export { Spinner, LoadingOverlay };
