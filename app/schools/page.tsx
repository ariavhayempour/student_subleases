import { ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import Link from 'next/link';
import { BoardBand, BoardWork } from '@/app/_components/board-band';
import { APP_NAME } from '@/lib/app-config';
import { schoolThemeStyle } from '@/lib/school-theme';
import { listActiveSchools } from '@/server/services/schools';

export const metadata: Metadata = {
  title: 'Schools',
  description: `Every school on ${APP_NAME}. Pick one to browse student subleases near campus.`,
  alternates: { canonical: '/schools' },
};

export default async function SchoolsPage() {
  const schools = await listActiveSchools();
  return (
    <main className="flex flex-1 flex-col">
      <BoardBand
        title="Schools"
        description="Pick a school to browse subleases from students near campus."
        pin="yellow"
      />
      <BoardWork>
        <ul className="grid grid-cols-[repeat(auto-fill,minmax(17.5rem,1fr))] gap-5">
          {schools.map((school) => (
            <li key={school.slug} style={schoolThemeStyle(school.theme) as CSSProperties}>
              <Link
                href={`/${school.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-md border border-line bg-white text-ink no-underline shadow-[0_1px_2px_rgb(40_20_5/0.06)] transition-[border-color,box-shadow] duration-200 hover:border-ink-3 hover:shadow-[0_10px_20px_-12px_rgb(40_20_5/0.45)]"
              >
                <span className="packing-tape flex h-14 items-center bg-school shadow-none after:hidden px-5 font-display text-[22px] font-extrabold tracking-[0.04em] text-school-secondary uppercase">
                  {school.shortName}
                </span>
                <span className="flex flex-1 flex-col gap-1 px-5 pt-4 pb-5">
                  <span className="text-[15px] font-bold">{school.name}</span>
                  <span className="text-[14px] text-ink-2">
                    {[school.city, `Near ${school.campusName}`].filter(Boolean).join(' · ')}
                  </span>
                  <span className="mt-auto flex items-center gap-1.5 pt-3 text-[14px] font-bold text-school-link">
                    Browse listings
                    <ArrowRight
                      aria-hidden
                      className="size-4 transition-transform duration-200 ease-out-expo group-hover:translate-x-0.5"
                    />
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-sm text-ink-2">
          Don’t see your school?{' '}
          <Link href="/contact?topic=add-school" className="font-bold text-ink underline">
            Tell us
          </Link>
        </p>
      </BoardWork>
    </main>
  );
}
