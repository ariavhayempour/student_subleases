'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <main className="cork flex flex-1 items-center justify-center px-4 py-16 sm:py-24">
      <div className="paper w-full max-w-[560px] px-6 pt-10 pb-8 sm:px-10 sm:pt-12 sm:pb-10 sm:[--r:1deg]">
        <span aria-hidden="true" className="pin pin-yellow top-3.5 left-1/2" />
        <h1 className="board-display text-[clamp(2rem,4vw,2.75rem)]">Something went wrong</h1>
        <p className="mt-3 max-w-[46ch] text-[16px] text-ink-2">
          We&apos;ve been notified. Please try again.
        </p>
        <Button variant="ink" className="mt-7 h-11 px-5" onClick={reset}>
          Try again
        </Button>
      </div>
    </main>
  );
}
