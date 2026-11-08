import type { Metadata } from 'next';
import Link from 'next/link';
import { BoardBand, BoardWork } from '@/app/_components/board-band';
import { requireOnboardedUser } from '@/app/_lib/guards';
import { createListingAction } from '@/app/listings/actions';
import { ListingForm } from '@/app/listings/_components/listing-form';
import { MAX_ACTIVE_LISTINGS } from '@/lib/listing-options';
import { getListingFormContext } from '@/server/services/listing-reads';

export const metadata: Metadata = {
  title: 'Post a listing',
  robots: { index: false, follow: false },
};

export default async function NewListingPage() {
  const actor = await requireOnboardedUser();
  const { schools, homeSchoolId, atCap } = await getListingFormContext(actor);
  return (
    <main className="flex flex-1 flex-col">
      <BoardBand
        title="Post a listing"
        description={
          atCap
            ? 'You can have one live listing at a time.'
            : 'New listings go live after a short review period.'
        }
        pin="green"
      />
      <BoardWork>
        {atCap ? (
          <p className="max-w-[60ch] rounded-md border border-line bg-surface-2 p-5 text-[16px] text-ink-2">
            You already have {MAX_ACTIVE_LISTINGS} active{' '}
            {MAX_ACTIVE_LISTINGS === 1 ? 'listing' : 'listings'}. Mark it as taken or remove it in{' '}
            <Link href="/me/listings" className="font-bold text-school-link underline">
              My listings
            </Link>{' '}
            to post another.
          </p>
        ) : (
          <ListingForm
            schools={schools}
            initialPhotos={[]}
            submitLabel="Submit for review"
            submitNote="New listings go live after a short review period."
            submitAction={createListingAction}
            lockSchool={!actor.isAdmin}
            defaultValues={{
              schoolId: homeSchoolId ?? '',
              title: '',
              description: '',
              availableFrom: '',
              availableTo: '',
              privateBathroom: null,
              address: '',
              unit: '',
              city: '',
              state: '',
              zip: '',
              location: null,
              furnished: false,
              roomFeatures: [],
              amenities: [],
              photos: [],
            }}
          />
        )}
      </BoardWork>
    </main>
  );
}
