import { Check, Info, Plus } from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { BoardBand, BoardWork } from '@/app/_components/board-band';
import { ListingBadge } from '@/app/_components/listing-badge';
import { requireOnboardedUser } from '@/app/_lib/guards';
import { formatDateRange } from '@/lib/format';
import { MAX_ACTIVE_LISTINGS } from '@/lib/listing-options';
import { listingBadges, listingCap } from '@/lib/listing-rules';
import { listMyListings, type MyListing } from '@/server/services/listing-reads';
import { ListingRowActions } from './listing-row-actions';

export const metadata: Metadata = {
  title: 'My listings',
  robots: { index: false, follow: false },
};

const NOTICES: Record<string, string> = {
  created: 'Thanks! Your listing will go live after a short review period.',
  'in-review': 'Saved. Your listing will go live again after a short review period.',
  saved: 'Saved.',
};

const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

// Mirrors the cap rule: active, not expired, and not rejected listings use a slot.
const usesSlot = (listing: MyListing) =>
  listing.status === 'active' && !listing.isExpired && listing.reviewStatus !== 'rejected';

type MyListingsPageProps = { searchParams: Promise<{ notice?: string }> };

export default async function MyListingsPage({ searchParams }: MyListingsPageProps) {
  const actor = await requireOnboardedUser();
  const [{ notice }, mine] = await Promise.all([searchParams, listMyListings(actor)]);
  const message = notice ? NOTICES[notice] : undefined;
  const cap = listingCap(actor.isAdmin);
  const slotted = mine.filter(usesSlot).slice(0, cap);
  const others = mine.filter((listing) => !slotted.includes(listing));
  // Admins have no cap, so one "post" slot always shows.
  const open = actor.isAdmin ? 1 : Math.max(cap - slotted.length, 0);
  const capLine =
    MAX_ACTIVE_LISTINGS === 1
      ? 'One live listing at a time'
      : `${MAX_ACTIVE_LISTINGS} live listings at a time`;

  return (
    <main className="flex flex-1 flex-col">
      <BoardBand
        title="My listings"
        pin="green"
        description={
          actor.isAdmin ? (
            <span className="font-semibold text-ink">Admins have no listing limit.</span>
          ) : (
            <>
              <span className="font-semibold text-ink">
                {open === 0 ? 'Your slot is in use.' : 'Your slot is open.'}
              </span>{' '}
              Taken, removed, expired, and rejected listings don&apos;t use a slot.
            </>
          )
        }
        aside={
          <div className="paper max-w-[320px] px-[18px] pt-[22px] pb-3 text-[14px] [--r:1.4deg]">
            <span aria-hidden="true" className="pin pin-yellow -top-1.5 left-1/2 size-[18px]" />
            <p className="mb-0.5 font-display text-[16px] leading-tight font-extrabold">
              {actor.isAdmin ? 'No listing limit' : capLine}
            </p>
            <p className="text-ink-2">New listings go live after a short review period.</p>
          </div>
        }
      />
      <BoardWork>
        {message && (
          <p
            role="status"
            className="mb-2 flex items-start gap-2.5 rounded-md bg-ok-bg px-4 py-3 text-[14.5px] font-semibold text-ok"
          >
            <Check aria-hidden="true" className="mt-px size-[18px] shrink-0" />
            {message}
          </p>
        )}

        <section aria-labelledby="active-heading" className="mt-6">
          <h2 id="active-heading" className={sectionHeading}>
            Active
          </h2>
          {slotted.length > 0 && (
            <ul className="border-t border-line">
              {slotted.map((listing) => (
                <ListingRow key={listing.id} listing={listing} />
              ))}
            </ul>
          )}
          {Array.from({ length: open }, (_, i) => (
            <Link
              key={`open-${i}`}
              href="/listings/new"
              className="group mt-[18px] grid items-center gap-5 rounded-md border-[1.5px] border-dashed border-line-2 p-[18px] text-[14.5px] text-ink-2 no-underline transition-colors hover:border-school hover:bg-school-tint sm:grid-cols-[132px_1fr]"
            >
              <span className="hidden h-24 place-items-center rounded-[5px] bg-surface-2 sm:grid">
                <Plus aria-hidden="true" className="size-[26px] text-ink" />
              </span>
              <span>
                <span className="block font-display text-[18px] font-extrabold text-ink group-hover:underline">
                  Post a listing
                </span>
                New listings go live after a short review period.
              </span>
            </Link>
          ))}
        </section>

        {others.length > 0 && (
          <section className="mt-12" aria-labelledby="past-heading">
            <h2 id="past-heading" className={sectionHeading}>
              Past and inactive
            </h2>
            <p className="-mt-1.5 mb-3.5 text-[14px] text-ink-2">
              These don&apos;t count toward your slot.
            </p>
            <ul className="border-t border-line">
              {others.map((listing) => (
                <ListingRow key={listing.id} listing={listing} past />
              ))}
            </ul>
          </section>
        )}
      </BoardWork>
    </main>
  );
}

const sectionHeading =
  'mb-3 font-display text-[22px] leading-tight font-extrabold tracking-[-0.01em] text-ink';

function ListingRow({ listing, past = false }: { listing: MyListing; past?: boolean }) {
  const inReview = listing.reviewStatus === 'pending';
  return (
    <li className="grid grid-cols-[96px_minmax(0,1fr)] items-center gap-x-3.5 gap-y-3 border-b border-line py-[18px] sm:grid-cols-[132px_minmax(0,1fr)_auto] sm:gap-5">
      <div className="relative h-[76px] overflow-hidden rounded-[5px] bg-surface-2 sm:h-24">
        {listing.coverThumbUrl && (
          <Image
            src={listing.coverThumbUrl}
            alt=""
            fill
            sizes="132px"
            className={past ? 'object-cover opacity-85 grayscale-[0.6]' : 'object-cover'}
          />
        )}
      </div>
      <div className="grid min-w-0 justify-items-start gap-[5px]">
        <div className="flex flex-wrap gap-2">
          {listingBadges(listing).map((badge) => (
            <ListingBadge key={badge.label} badge={badge} />
          ))}
        </div>
        <h3 className="max-w-full truncate text-[16px] font-extrabold">
          <Link
            href={`/${listing.schoolSlug}/listings/${listing.id}`}
            className="text-ink no-underline hover:underline"
          >
            {listing.title}
          </Link>
        </h3>
        <p className="text-[13.5px] text-ink-2">
          <b className="font-display text-[15px] font-extrabold text-ink">
            {usd.format(listing.rentCents / 100)}
          </b>{' '}
          / month · {formatDateRange(listing.availableFrom, listing.availableTo)}
        </p>
        {inReview && !past && (
          <p className="mt-0.5 flex gap-1.5 text-[13.5px] text-ink-2">
            <Info aria-hidden="true" className="mt-0.5 size-[15px] shrink-0" />
            Students can see it once the review period ends.
          </p>
        )}
      </div>
      <div className="col-span-2 sm:col-span-1">
        <ListingRowActions
          listingId={listing.id}
          status={listing.status}
          reviewStatus={listing.reviewStatus}
        />
      </div>
    </li>
  );
}
