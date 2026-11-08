import {
  Bath,
  BedDouble,
  Check,
  CalendarDays,
  House,
  Lock,
  MapPin,
  Footprints,
  ShieldCheck,
  Sofa,
  UserRound,
  Users,
} from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { cache, type ReactNode } from 'react';
import { BoardBand, BoardWork } from '@/app/_components/board-band';
import { FavoriteButton } from '@/app/_components/favorite-button';
import { ListingBadge } from '@/app/_components/listing-badge';
import { MessageHostButton } from '@/app/_components/message-host-button';
import { ReportButton } from '@/app/_components/report-button';
import { TermTimelineBar } from '@/app/_components/term-timeline';
import { orNotFound } from '@/app/_lib/guards';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  formatDate,
  formatDateRange,
  formatDistanceKm,
  formatMonthYear,
  formatRent,
} from '@/lib/format';
import {
  AMENITY_LABELS,
  GENDER_PREFERENCE_LABELS,
  LISTING_TYPE_LABELS,
  ROOM_FEATURE_LABELS,
  ROOM_TYPE_LABELS,
  roommatesLabel,
} from '@/lib/listing-options';
import { listingBadges } from '@/lib/listing-rules';
import { SAFETY_NOTICE } from '@/lib/messaging-options';
import { getActor } from '@/server/auth/get-actor';
import { getListingDetail } from '@/server/services/listing-reads';
import { getActiveSchoolBySlug, schoolBrand } from '@/server/services/schools';
import { ListingMap } from './listing-map';
import { PhotoGallery } from './photo-gallery';

type ListingPageProps = { params: Promise<{ school: string; id: string }> };

const loadListing = cache(async (id: string) => orNotFound(getListingDetail(await getActor(), id)));

const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

export async function generateMetadata({ params }: ListingPageProps): Promise<Metadata> {
  const listing = await loadListing((await params).id);
  const cover = listing.photos[0];
  return {
    title: listing.title,
    robots: { index: false, follow: false },
    openGraph: {
      title: `${listing.title} · ${formatRent(listing.rentCents)}`,
      description: `${LISTING_TYPE_LABELS[listing.type]} near ${listing.school.name}, ${formatDateRange(listing.availableFrom, listing.availableTo)}`,
      images: cover ? [{ url: cover.galleryUrl }] : [],
    },
  };
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-t border-line pt-7 first:border-t-0 first:pt-0">
      <h2 className="font-display text-[22px] leading-tight font-extrabold tracking-[-0.01em]">
        {title}
      </h2>
      <div className="mt-3.5">{children}</div>
    </section>
  );
}

function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-[14.5px] text-ink sm:grid-cols-3">
      {items.map((item) => (
        <li key={item} className="flex items-center gap-2">
          <Check aria-hidden="true" className="size-4 shrink-0 text-ok" />
          {item}
        </li>
      ))}
    </ul>
  );
}

export default async function ListingPage({ params }: ListingPageProps) {
  const { school, id } = await params;
  const listing = await loadListing(id);
  const actor = await getActor();
  if (listing.school.slug !== school) redirect(`/${listing.school.slug}/listings/${listing.id}`);
  // An inactive school still shows its own non-public listings to owners and admins.
  const brandRow = await getActiveSchoolBySlug(listing.school.slug).catch(() => null);
  const brand = brandRow ? schoolBrand(brandRow) : null;
  const campusName = brand?.campusName ?? listing.school.name;
  const visitor = listing.viewer === 'visitor';
  const canInteract = visitor && !listing.crossSchool;

  const facts: { icon: ReactNode; label: string; value: string }[] = [
    { icon: <House />, label: 'Type', value: LISTING_TYPE_LABELS[listing.type] },
    {
      icon: <BedDouble />,
      label: 'Bedrooms',
      value: listing.bedrooms === 0 ? 'Studio' : String(listing.bedrooms),
    },
    { icon: <Bath />, label: 'Bathrooms', value: String(listing.bathrooms) },
    { icon: <Users />, label: 'Roommates', value: roommatesLabel(listing.roommatesCount) },
    { icon: <BedDouble />, label: 'Room type', value: ROOM_TYPE_LABELS[listing.roomType] },
    { icon: <Sofa />, label: 'Furnished', value: listing.furnished ? 'Yes' : 'No' },
    ...(listing.privateBathroom === null
      ? []
      : [
          {
            icon: <Bath />,
            label: 'Your bathroom',
            value: listing.privateBathroom ? 'Private' : 'Shared',
          },
        ]),
    ...(listing.genderPreference === 'any'
      ? []
      : [
          {
            icon: <UserRound />,
            label: 'Prefers',
            value: GENDER_PREFERENCE_LABELS[listing.genderPreference],
          },
        ]),
  ];
  const street = listing.unit ? `${listing.address}, Unit ${listing.unit}` : listing.address;
  const cityLine = `${listing.city}, ${listing.state} ${listing.zip}`;
  const distance = `${formatDistanceKm(listing.distanceKm)} to ${campusName}`;
  const rent = usd.format(listing.rentCents / 100);

  return (
    <main className="flex flex-1 flex-col">
      <BoardBand
        title={listing.title}
        back={{
          href: `/${listing.school.slug}`,
          label: `All ${brand?.shortName ?? listing.school.name} listings`,
        }}
        school={brand ?? undefined}
      >
        <p className="mt-2.5 flex flex-wrap items-baseline gap-x-[18px] gap-y-1.5">
          <span>
            <span className="font-display text-[30px] leading-none font-extrabold tracking-[-0.02em]">
              {rent}
            </span>
            <span className="text-[14px] font-semibold text-ink-2"> / month</span>
          </span>
          <span className="inline-flex items-center gap-1.5 text-[15px] font-bold">
            <CalendarDays aria-hidden="true" className="size-4" />
            {formatDateRange(listing.availableFrom, listing.availableTo)}
          </span>
        </p>
      </BoardBand>

      <BoardWork>
        {!visitor && !listing.isPublic && (
          <div className="mb-5 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-[5px] border border-line bg-school-tint px-4 py-3 text-sm text-ink">
            <div className="flex flex-wrap gap-2">
              {listingBadges(listing).map((badge) => (
                <ListingBadge key={badge.label} badge={badge} />
              ))}
            </div>
            <p>
              Only you{listing.viewer === 'admin' ? ' (admin)' : ''} can see this page right now.
            </p>
            {listing.viewer === 'owner' && (
              <Link href={`/listings/${listing.id}/edit`} className="font-bold text-school-link">
                Edit listing
              </Link>
            )}
          </div>
        )}

        <PhotoGallery photos={listing.photos} title={listing.title} />

        <div className="mt-8 grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-12">
          <div className="min-w-0 space-y-[30px]">
            <Section title="The place">
              <dl className="grid grid-cols-2 gap-x-4 gap-y-[18px] sm:grid-cols-4">
                {facts.map((fact) => (
                  <div key={fact.label} className="grid gap-[3px]">
                    <dt className="flex items-center gap-[7px] text-[12.5px] font-bold text-ink-2 [&_svg]:size-4 [&_svg]:text-ink">
                      <span aria-hidden="true">{fact.icon}</span>
                      {fact.label}
                    </dt>
                    <dd className="text-[15.5px] font-bold text-ink">{fact.value}</dd>
                  </div>
                ))}
              </dl>
            </Section>

            <Section title="About it">
              <p className="max-w-[68ch] text-[16px] leading-[1.65] whitespace-pre-line text-ink">
                {listing.description}
              </p>
            </Section>

            {listing.roomFeatures.length > 0 && (
              <Section title="The room">
                <CheckList
                  items={listing.roomFeatures.map((feature) => ROOM_FEATURE_LABELS[feature])}
                />
              </Section>
            )}

            {listing.amenities.length > 0 && (
              <Section title="Amenities">
                <CheckList items={listing.amenities.map((amenity) => AMENITY_LABELS[amenity])} />
              </Section>
            )}

            <Section title="Where it is">
              <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[15.5px]">
                <MapPin aria-hidden="true" className="size-[17px] shrink-0" />
                <span className="font-bold text-ink">{street}</span>
                <span className="text-ink-2">{cityLine}</span>
              </p>
              {visitor && !listing.unit && (
                <p className="mt-2 flex items-start gap-2 text-[14px] text-ink-2">
                  <Lock aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
                  The unit number shows once you’re in a conversation with the host.
                </p>
              )}
              <div className="mt-3.5">
                <ListingMap
                  listing={listing.location}
                  campus={listing.school.campusLocation}
                  campusName={campusName}
                />
              </div>
              <p className="mt-3 flex items-center gap-[7px] text-[14.5px] text-ink">
                <Footprints aria-hidden="true" className="size-4" />
                <span className="font-bold">{distance}</span>
              </p>
            </Section>
          </div>

          <aside className="grid gap-4 max-lg:order-first lg:sticky lg:top-5">
            <div className="rounded-md border border-line bg-white p-5 shadow-[0_10px_24px_-18px_rgb(40_20_5/0.5)]">
              <p className="flex items-baseline gap-1.5">
                <span className="font-display text-[36px] leading-none font-extrabold tracking-[-0.02em]">
                  {rent}
                </span>
                <span className="text-sm font-semibold text-ink-2">/ month</span>
              </p>
              <dl className="mt-4 grid grid-cols-2 rounded-[5px] border border-line">
                <div className="px-3 py-2.5">
                  <dt className="text-[12.5px] font-bold text-ink-2">Move in</dt>
                  <dd className="mt-0.5 text-[15px] font-bold text-ink">
                    {formatDate(listing.availableFrom)}
                  </dd>
                </div>
                <div className="border-l border-line px-3 py-2.5">
                  <dt className="text-[12.5px] font-bold text-ink-2">Move out</dt>
                  <dd className="mt-0.5 text-[15px] font-bold text-ink">
                    {formatDate(listing.availableTo)}
                  </dd>
                </div>
              </dl>
              <TermTimelineBar from={listing.availableFrom} to={listing.availableTo} />
              {listing.crossSchool && (
                <p className="mt-4 flex gap-2.5 rounded-[5px] bg-surface-2 p-3 text-sm text-ink-2">
                  <Lock aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
                  This listing is at another school. You can look around, but messaging, saving, and
                  reporting are only available for listings at your own school.
                </p>
              )}
              {(canInteract || listing.viewer === 'owner') && (
                <div className="mt-[18px] grid gap-2">
                  {canInteract && (
                    <MessageHostButton
                      listingId={listing.id}
                      conversationId={listing.conversationId}
                      signedIn={actor.kind === 'user'}
                    />
                  )}
                  {canInteract && (
                    <FavoriteButton
                      listingId={listing.id}
                      listingTitle={listing.title}
                      initialFavorited={listing.isFavorited}
                      signedIn={actor.kind === 'user'}
                      withText
                      className="w-full"
                    />
                  )}
                  {listing.viewer === 'owner' && (
                    <Link
                      href={`/listings/${listing.id}/edit`}
                      className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'w-full')}
                    >
                      Edit your listing
                    </Link>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 rounded-md border border-line bg-white p-4 shadow-[0_10px_24px_-18px_rgb(40_20_5/0.5)]">
              <span
                aria-hidden="true"
                className="grid size-11 shrink-0 place-items-center rounded-full bg-surface-2 font-display text-base font-extrabold text-ink ring-1 ring-line-2 ring-inset"
              >
                {listing.host ? (
                  listing.host.displayName.slice(0, 1)
                ) : (
                  <Lock className="size-5 text-ink-2" />
                )}
              </span>
              {listing.host ? (
                <p className="text-[13.5px] text-ink-2">
                  <span className="block text-[15.5px] font-bold text-ink">
                    Hosted by {listing.host.displayName}
                  </span>
                  Student host · joined {formatMonthYear(listing.host.joinedAt)}
                </p>
              ) : (
                <p className="text-[13.5px] text-ink-2">
                  <span className="block text-[15.5px] font-bold text-ink">Student host</span>
                  {actor.kind === 'user'
                    ? `Host details are shown only to ${listing.school.name} students.`
                    : 'Sign in to see who is hosting.'}
                </p>
              )}
            </div>

            <p className="flex gap-2.5 rounded-md bg-warn-bg px-3.5 py-3 text-[13.5px] leading-snug font-semibold text-warn">
              <ShieldCheck aria-hidden="true" className="mt-px size-[17px] shrink-0" />
              {SAFETY_NOTICE}
            </p>

            {canInteract && actor.kind === 'user' && (
              <ReportButton
                targetType="listing"
                targetId={listing.id}
                label="Report listing"
                title="Report listing"
                className="justify-self-start"
              />
            )}
          </aside>
        </div>
      </BoardWork>
    </main>
  );
}
