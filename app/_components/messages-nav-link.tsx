'use client';

import { MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { useIsCurrent } from '@/app/_components/header-nav';
import { useMessaging } from '@/app/_components/messaging-provider';

export function MessagesNavLink({ className }: { className?: string }) {
  const { unreadCount } = useMessaging();
  const isCurrent = useIsCurrent();
  return (
    <Link
      href="/messages"
      aria-label={unreadCount > 0 ? `Messages, ${unreadCount} unread` : undefined}
      aria-current={isCurrent('/messages') ? 'page' : undefined}
      className={className}
    >
      <MessageCircle aria-hidden="true" className="size-[18px]" />
      <span className="max-sm:sr-only">Messages</span>
      {unreadCount > 0 && (
        <span
          aria-hidden="true"
          className="grid h-5 min-w-5 place-items-center rounded-full bg-school px-1.5 text-[12px] font-extrabold text-on-school tabular-nums"
        >
          {unreadCount}
        </span>
      )}
    </Link>
  );
}
