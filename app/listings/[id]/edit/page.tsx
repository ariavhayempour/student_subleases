import type { Metadata } from 'next';
import { BoardBand, BoardWork } from '@/app/_components/board-band';
import { orNotFound, requireOnboardedUser } from '@/app/_lib/guards';
import { updateListingAction } from '@/app/listings/actions';
import { ListingForm } from '@/app/listings/_components/listing-form';
import { getListingForEdit, getListingFormContext } from '@/server/services/listing-reads';

export const metadata: Metadata = {
  title: 'Edit listing',
  robots: { index: false, follow: false },
};

type EditListingPageProps = { params: Promise<{ id: string }> };

export default async function EditListingPage({ params }: EditListingPageProps) {
  const actor = await requireOnboardedUser();
  const { id } = await params;
  const [edit, context] = await Promise.all([
    orNotFound(getListingForEdit(actor, id)),
    getListingFormContext(actor),
  ]);
  return (
    <main className="flex flex-1 flex-col">
      <BoardBand
        title="Edit listing"
        back={{ href: '/me/listings', label: 'My listings' }}
        description={
          edit.reviewStatus === 'rejected'
            ? 'Fix what was flagged, then save to send it back for review.'
            : 'Some changes send the listing back for a short review period.'
        }
        pin="green"
      />
      <BoardWork>
        {edit.reviewStatus === 'rejected' ? (
          <p className="mb-7 max-w-[70ch] rounded-[5px] border border-bad/25 bg-bad-bg px-4 py-3 text-sm font-semibold text-bad">
            Rejected{edit.reviewNote ? `: ${edit.reviewNote}` : ''}. Saving your changes resubmits
            it for review.
          </p>
        ) : (
          <p className="mb-7 max-w-[70ch] text-[15px] text-ink-2">
            Changing the title, description, rent, address, unit, or gender preference, or adding
            photos, sends the listing back to review.
          </p>
        )}
        <ListingForm
          schools={context.schools}
          initialPhotos={edit.photos}
          defaultValues={edit.values}
          submitLabel="Save changes"
          submitNote={
            edit.reviewStatus === 'rejected'
              ? 'Saving your changes resubmits it for review.'
              : 'Some changes send the listing back to review.'
          }
          submitAction={updateListingAction.bind(null, edit.id)}
          lockSchoolAndType
        />
      </BoardWork>
    </main>
  );
}
