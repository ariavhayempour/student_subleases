import { ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import Link from 'next/link';
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
    <main className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <h1 className="varsity text-[clamp(2.75rem,6vw,4.5rem)] font-black text-ink">Schools</h1>
      <div aria-hidden="true" className="mt-6 h-1 w-16 bg-school" />
      <p className="mt-6 max-w-[60ch] text-[17px] leading-relaxed text-ink-2">
        Pick a school to browse subleases from students near campus.
      </p>
      <ul className="mt-10 grid grid-cols-[repeat(auto-fill,minmax(16.5rem,1fr))] gap-1.5">
        {schools.map((school) => (
          <li
            key={school.slug}
            className="on-school"
            style={schoolThemeStyle(school.theme) as CSSProperties}
          >
            <Link
              href={`/${school.slug}`}
              className="group flex h-44 flex-col bg-school px-5 pt-5 text-on-school no-underline transition-colors duration-300 hover:bg-school-deep focus-visible:-outline-offset-4"
            >
              <span className="varsity text-[2.5rem] font-black">{school.shortName}</span>
              <span className="mt-1 truncate text-sm">{school.name}</span>
              <span className="mt-1 flex items-center justify-between gap-3 text-sm">
                <span className="truncate">{school.city ?? school.campusName}</span>
                <span className="flex shrink-0 items-center gap-1 font-semibold">
                  Browse
                  <ArrowRight
                    aria-hidden
                    className="size-4 transition-transform group-hover:translate-x-0.5"
                  />
                </span>
              </span>
              <span aria-hidden className="varsity-stripe mt-auto mb-4 block" />
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-8 text-sm text-ink-2">
        Don’t see your school?{' '}
        <Link href="/contact" className="font-semibold text-school-link underline">
          Tell us
        </Link>
      </p>
    </main>
  );
}
