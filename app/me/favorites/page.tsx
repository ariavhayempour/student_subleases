import { Heart } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { BoardBand, BoardWork } from '@/app/_components/board-band';
import { ListingTile } from '@/app/_components/listing-tile';
import { todayIso } from '@/lib/term-timeline';
import { getThemeContext } from '@/app/_lib/theme-school';
import { requireOnboardedUser } from '@/app/_lib/guards';
import { buttonVariants } from '@/components/ui/button';
import { listFavorites } from '@/server/services/favorites';

export const metadata: Metadata = {
  title: 'Saved listings',
  robots: { index: false, follow: false },
};

export default async function FavoritesPage() {
  const actor = await requireOnboardedUser();
  const [saved, { schools, school: home }] = await Promise.all([
    listFavorites(actor),
    getThemeContext(),
  ]);
  // Each tile names its own school's campus; admins can save across schools.
  const campusOf = (slug: string) => schools.find((s) => s.slug === slug)?.campusName;
  return (
    <main className="flex flex-1 flex-col">
      <BoardBand
        title="Saved listings"
        pin="blue"
        description={
          saved.length === 0
            ? 'Save places while you browse, then compare them here.'
            : `${saved.length} saved ${saved.length === 1 ? 'place' : 'places'}.`
        }
      />
      <BoardWork>
        {saved.length === 0 ? (
          <div className="mt-2 flex flex-col items-center rounded-md border-[1.5px] border-dashed border-line-2 px-6 py-14 text-center">
            <span className="grid size-12 place-items-center rounded-full bg-school-tint text-school">
              <Heart aria-hidden="true" className="size-6" />
            </span>
            <p className="mt-4 font-display text-[22px] font-extrabold tracking-[-0.01em]">
              Nothing saved yet
            </p>
            <p className="mt-2 max-w-sm text-sm text-ink-2">
              Use the heart on a listing to save it here.
            </p>
            {home && (
              <Link href={`/${home.slug}`} className={`${buttonVariants()} mt-5`}>
                Browse {home.shortName} listings
              </Link>
            )}
          </div>
        ) : (
          <ul className="mt-2 grid gap-x-6 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
            {saved.map((card) => (
              <li key={card.id}>
                <ListingTile
                  card={card}
                  signedIn
                  campusName={campusOf(card.schoolSlug)}
                  timelineStart={todayIso()}
                />
              </li>
            ))}
          </ul>
        )}
      </BoardWork>
    </main>
  );
}
