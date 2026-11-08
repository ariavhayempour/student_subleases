'use client';

import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useSelectedLayoutSegment } from 'next/navigation';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type MessagesShellProps = { inbox: ReactNode; children: ReactNode };

// Sized to the viewport under the 64px header and its 1px rule, so only the panes scroll.
export function MessagesShell({ inbox, children }: MessagesShellProps) {
  const inThread = useSelectedLayoutSegment() !== null;
  return (
    <main className="flex h-[calc(100dvh-4rem-1px)] w-full flex-col">
      <section className="cork shrink-0 py-3.5 max-md:hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="paper inline-block px-[22px] pt-3.5 pb-3 [--r:-0.4deg]">
            <span
              aria-hidden="true"
              className="pin pin-blue -top-[7px] left-1/2 size-[18px] -ml-[9px]"
            />
            <h1 className="board-display text-[26px] leading-none">Messages</h1>
            <p className="mt-1 text-[14px] text-ink-2">
              Your conversations with hosts and students.
            </p>
          </div>
        </div>
      </section>
      <h1 className="sr-only md:hidden">Messages</h1>
      <div className="relative z-[1] flex min-h-0 flex-1 bg-white md:shadow-[0_-6px_14px_-8px_rgb(40_20_5/0.45)]">
        <div className="mx-auto flex min-h-0 w-full max-w-7xl md:px-6 md:pt-5 md:pb-6 lg:px-8">
          <div className="flex min-h-0 w-full overflow-hidden md:rounded-md md:border md:border-line">
            <aside
              className={cn(
                'flex w-full shrink-0 flex-col border-line md:flex md:w-[22.5rem] md:border-r',
                inThread && 'hidden',
              )}
            >
              <h2 className="px-4 pt-4 pb-2.5 font-display text-[18px] leading-none font-extrabold">
                Inbox
              </h2>
              <div className="min-h-0 flex-1 overflow-y-auto">{inbox}</div>
            </aside>
            <section
              className={cn('min-w-0 flex-1 flex-col md:flex', inThread ? 'flex' : 'hidden')}
            >
              {inThread && (
                <Link
                  href="/messages"
                  className="flex items-center gap-1 border-b border-line px-4 py-2.5 text-sm font-bold text-ink no-underline md:hidden"
                >
                  <ChevronLeft aria-hidden="true" className="size-4" />
                  Back to messages
                </Link>
              )}
              <div className="min-h-0 flex-1">{children}</div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
