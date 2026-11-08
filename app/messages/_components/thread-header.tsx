import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { DELETED_USER_LABEL, REMOVED_LISTING_LABEL } from '@/lib/messaging-options';
import type { Participant, ThreadListing } from '@/server/services/messaging-reads';
import { ThreadMenu } from './thread-menu';

const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

type ThreadHeaderProps = {
  listing: ThreadListing | null;
  otherUser: Participant | null;
  blocked?: boolean;
  showMenu?: boolean;
};

export function ThreadHeader({
  listing,
  otherUser,
  blocked = false,
  showMenu = true,
}: ThreadHeaderProps) {
  return (
    <header className="flex items-center gap-3 border-b border-line px-3 py-3 sm:gap-3.5 sm:px-5">
      <div className="relative aspect-[4/3] w-14 shrink-0 overflow-hidden rounded-md bg-surface-2 sm:w-16">
        {listing?.coverThumbUrl && (
          <Image src={listing.coverThumbUrl} alt="" fill sizes="64px" className="object-cover" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[16px] font-extrabold text-ink">
          {otherUser?.displayName ?? DELETED_USER_LABEL}
        </p>
        <h2 className="truncate text-sm font-medium text-ink-2">
          {listing === null ? (
            REMOVED_LISTING_LABEL
          ) : listing.linkable ? (
            <Link
              href={`/${listing.schoolSlug}/listings/${listing.id}`}
              className="inline-flex max-w-full items-center gap-1 font-semibold text-school-link"
            >
              <span className="truncate">{listing.title}</span>
              <ArrowUpRight aria-hidden="true" className="size-3.5 shrink-0" />
            </Link>
          ) : (
            listing.title
          )}
        </h2>
        {listing && (
          <p className="truncate text-xs text-ink-2">
            {listing.unit ? `${listing.address}, Unit ${listing.unit}` : listing.address}
          </p>
        )}
      </div>
      {listing && (
        <p className="hidden shrink-0 text-right sm:block">
          <span className="block font-display text-[1.5rem] leading-none font-extrabold tracking-[-0.02em] text-ink tabular-nums">
            {usd.format(listing.rentCents / 100)}
          </span>
          <span className="text-xs text-ink-2">/ month</span>
        </p>
      )}
      {otherUser && showMenu && (
        <ThreadMenu
          otherUserId={otherUser.id}
          otherName={otherUser.displayName}
          blocked={blocked}
        />
      )}
    </header>
  );
}
