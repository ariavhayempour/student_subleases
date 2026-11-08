import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import type { CSSProperties, ReactNode } from 'react';
import { schoolThemeStyle } from '@/lib/school-theme';
import { cn } from '@/lib/utils';
import type { SchoolSummary } from '@/server/services/schools';

type BandSchool = Pick<SchoolSummary, 'shortName' | 'city' | 'campusName' | 'theme'>;

type BoardBandProps = {
  title: ReactNode;
  // Replaces the visible title for assistive tech when the sheet shows a shorter one.
  accessibleTitle?: string;
  description?: ReactNode;
  back?: { href: string; label: string };
  // Pinned beside the title sheet on wide screens (an index card, a status note).
  aside?: ReactNode;
  // School pages run a band of printed packing tape in the school's colors under the sheet.
  school?: BandSchool;
  pin?: 'red' | 'blue' | 'yellow' | 'green';
  // Extra lines on the title sheet, under the description.
  children?: ReactNode;
};

// The top of every working page: a strip of cork with the page title on a pinned sheet.
export function BoardBand({
  title,
  accessibleTitle,
  description,
  back,
  aside,
  school,
  pin = 'red',
  children,
}: BoardBandProps) {
  return (
    <section
      className={cn(
        'cork relative overflow-hidden pt-[18px] sm:pt-[26px]',
        !school && 'pb-[22px] sm:pb-[30px]',
      )}
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-5 px-4 sm:px-6 lg:px-8">
        <div className="paper inline-block max-w-[min(760px,100%)] px-[18px] pt-[26px] pb-4 sm:px-[30px] sm:pt-[30px] sm:pb-5 sm:[--r:-0.6deg]">
          <span
            aria-hidden="true"
            className={`pin pin-${pin} top-2 left-1/2 size-[18px] -ml-[9px]`}
          />
          {back && (
            <Link
              href={back.href}
              className="mb-2.5 inline-flex items-center gap-1.5 text-[14px] font-bold text-ink-2 no-underline hover:text-ink hover:underline"
            >
              <ChevronLeft aria-hidden="true" className="size-4" />
              {back.label}
            </Link>
          )}
          <h1 className="board-display text-[clamp(1.9rem,3.4vw,2.75rem)] leading-none text-balance">
            {accessibleTitle ? (
              <>
                <span className="sr-only">{accessibleTitle}</span>
                <span aria-hidden="true">{title}</span>
              </>
            ) : (
              title
            )}
          </h1>
          {description && <p className="mt-2 text-[15.5px] text-ink-2">{description}</p>}
          {children}
        </div>
        {aside && <div className="max-lg:hidden">{aside}</div>}
      </div>
      {school && <SchoolTapeBand school={school} />}
    </section>
  );
}

// A static run of printed packing tape repeating the school's name, city, and campus.
export function SchoolTapeBand({ school }: { school: BandSchool }) {
  const pieces = [school.city, `Near ${school.campusName}`].filter(Boolean) as string[];
  const run = Array.from({ length: 8 }, (_, index) => pieces[index % pieces.length] ?? '');
  return (
    <div
      aria-hidden="true"
      style={schoolThemeStyle(school.theme) as CSSProperties}
      className="relative z-[2] mt-[18px] mb-4 -ml-[5vw] w-[110vw] -rotate-[1.2deg] sm:mt-6 sm:mb-[18px] sm:-ml-[3vw] sm:w-[106vw] sm:-rotate-[0.7deg]"
    >
      <div className="packing-tape flex h-11 items-center gap-[22px] overflow-hidden bg-school px-6 font-display text-[15px] font-extrabold tracking-[0.05em] whitespace-nowrap text-school-secondary uppercase sm:h-[50px] sm:gap-[30px] sm:text-[17px]">
        {run.map((piece, index) => (
          <span key={index} className="inline-flex shrink-0 items-center gap-3.5">
            {school.shortName}
            <i className="inline-block size-1.5 rounded-full bg-current" />
            <small className="font-sans text-[12px] font-bold tracking-[0.08em] text-on-school sm:text-[13px]">
              {piece}
            </small>
          </span>
        ))}
      </div>
    </div>
  );
}

// The white working sheet under the band: everything a visitor operates lives here.
export function BoardWork({
  children,
  className,
  bare = false,
}: {
  children: ReactNode;
  className?: string;
  // Skips the centered container, for full-bleed layouts such as a list beside a map.
  bare?: boolean;
}) {
  return (
    <div className="relative z-[1] flex flex-1 flex-col bg-white shadow-[0_-6px_14px_-8px_rgb(40_20_5/0.45)]">
      {bare ? (
        children
      ) : (
        <div
          className={cn(
            'mx-auto w-full max-w-7xl px-4 pt-5 pb-12 sm:px-6 sm:pt-7 sm:pb-16 lg:px-8',
            className,
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}
