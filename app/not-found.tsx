import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <main className="cork flex flex-1 items-center justify-center px-4 py-16 sm:py-24">
      <div className="paper w-full max-w-[560px] px-6 pt-10 pb-8 sm:px-10 sm:pt-12 sm:pb-10 sm:[--r:-1deg]">
        <span aria-hidden="true" className="pin pin-red top-3.5 left-1/2" />
        <p aria-hidden="true" className="flyer-caps text-[clamp(5rem,14vw,8rem)] text-ink-3">
          404
        </p>
        <h1 className="board-display mt-3 text-[clamp(2rem,4vw,2.75rem)]">Page not found</h1>
        <p className="mt-3 max-w-[46ch] text-[16px] text-ink-2">
          This page may have been taken down, or the link is wrong.
        </p>
        <Button asChild variant="ink" className="mt-7 h-11 px-5">
          <Link href="/">Go home</Link>
        </Button>
      </div>
    </main>
  );
}
