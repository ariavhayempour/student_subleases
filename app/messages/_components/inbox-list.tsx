'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSelectedLayoutSegment } from 'next/navigation';
import { useEffect } from 'react';
import { useMessaging } from '@/app/_components/messaging-provider';
import { LocalTime } from '@/app/_components/local-time';
import { DELETED_USER_LABEL, REMOVED_LISTING_LABEL } from '@/lib/messaging-options';
import { cn } from '@/lib/utils';
import type { InboxRow } from '@/server/services/messaging-reads';

export function InboxList({ items }: { items: InboxRow[] }) {
  const openId = useSelectedLayoutSegment();
  const router = useRouter();
  const { onEvent } = useMessaging();

  useEffect(() => onEvent(() => router.refresh()), [onEvent, router]);

  if (items.length === 0) {
    return (
      <p className="px-4 py-4 text-sm text-ink-2">
        No messages yet. Message a host from any listing to start a conversation.
      </p>
    );
  }
  return (
    <nav aria-label="Conversations">
      <ul className="px-2 pb-4">
        {items.map((item) => {
          const open = openId === item.id;
          return (
            <li key={item.id}>
              <Link
                href={`/messages/${item.id}`}
                aria-current={open ? 'page' : undefined}
                className={cn(
                  'grid grid-cols-[2.75rem_minmax(0,1fr)_auto] gap-3 rounded-md px-2.5 py-3 text-ink no-underline transition-colors',
                  open
                    ? 'bg-school-tint shadow-[inset_3px_0_0_var(--school)]'
                    : 'hover:bg-surface-2',
                )}
              >
                <div className="relative size-11 overflow-hidden rounded-md bg-surface-2">
                  {item.listing?.coverThumbUrl && (
                    <Image
                      src={item.listing.coverThumbUrl}
                      alt=""
                      fill
                      sizes="44px"
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="min-w-0">
                  <p
                    className={cn(
                      'truncate text-[14.5px]',
                      item.unread || open ? 'font-extrabold' : 'font-bold',
                    )}
                  >
                    {item.otherUser?.displayName ?? DELETED_USER_LABEL}
                  </p>
                  <p className="truncate text-[13px] text-ink-2">
                    {item.listing?.title ?? REMOVED_LISTING_LABEL}
                  </p>
                  <p
                    className={cn(
                      'mt-0.5 truncate text-[13px]',
                      item.unread ? 'font-bold text-ink' : 'text-ink-2',
                    )}
                  >
                    {item.lastMessageFromMe && 'You: '}
                    {item.preview}
                  </p>
                </div>
                <div className="grid justify-items-end gap-2 text-right">
                  <LocalTime iso={item.lastMessageAt} className="text-xs text-ink-2" />
                  {item.unread && (
                    <span className="size-2.5 rounded-full bg-school">
                      <span className="sr-only">Unread</span>
                    </span>
                  )}
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
