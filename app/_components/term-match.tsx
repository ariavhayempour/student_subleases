'use client';

import { Check } from 'lucide-react';
import { type CSSProperties, useRef, useState } from 'react';
import { APP_NAME } from '@/lib/app-config';
import { schoolThemeStyle } from '@/lib/school-theme';
import type { SchoolSummary } from '@/server/services/schools';

type MatchSchool = Pick<SchoolSummary, 'slug' | 'shortName' | 'theme'>;

const TERMS = ['Jan–Apr', 'May–Aug', 'Sep–Dec'];

const ROWS = [
  { who: 'You’re away for an internship', bar: 'term-bar-host' },
  { who: 'A student needs a place for the summer', bar: 'term-bar-guest' },
];

// Illustrative chart pinned to the board: a host away May–Aug and a student who needs those months.
export function TermMatch({ schools }: { schools: MatchSchool[] }) {
  const [current, setCurrent] = useState(schools[0]?.slug);
  const figure = useRef<HTMLElement>(null);
  const school = schools.find((entry) => entry.slug === current) ?? schools[0];

  const pick = (slug: string) => {
    setCurrent(slug);
    const el = figure.current;
    if (!el || el.dataset.reveal !== 'in') return;
    // Snaps the bars back to empty, then lets them draw in again in the new colors.
    el.dataset.reveal = 'reset';
    void el.offsetWidth;
    el.dataset.reveal = 'in';
  };

  return (
    <figure
      ref={figure}
      data-reveal=""
      style={school ? schoolThemeStyle(school.theme) : undefined}
      className="paper mt-12 max-w-[66rem] bg-school-tint! px-5 pt-9 pb-6 transition-colors duration-500 [--r:0.4deg] sm:px-11 sm:pt-10 sm:pb-8 max-sm:[--r:0deg]"
    >
      <span aria-hidden="true" className="pin pin-red top-3 left-4" />
      <span aria-hidden="true" className="pin pin-blue top-3 right-4" />
      {schools.length > 1 && (
        <div className="mb-7 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
          <p
            id="term-match-schools"
            className="font-display text-[19px] font-extrabold sm:text-[22px]"
          >
            See it in your school’s colors
          </p>
          <div role="group" aria-labelledby="term-match-schools" className="flex flex-wrap gap-1.5">
            {schools.map((entry) => (
              <button
                key={entry.slug}
                type="button"
                aria-pressed={entry.slug === school?.slug}
                onClick={() => pick(entry.slug)}
                style={
                  {
                    backgroundColor: entry.theme.primary,
                    color: entry.theme.onPrimary,
                    '--chip-mark': entry.theme.secondary,
                  } as CSSProperties
                }
                className="relative h-[38px] rounded-[3px] px-3.5 pb-0.5 font-display text-[16px] font-extrabold tracking-[0.04em] uppercase shadow-[0_1px_1px_rgb(40_20_5/0.25)] transition-transform duration-200 hover:-translate-y-px aria-pressed:outline-3 aria-pressed:outline-offset-2 aria-pressed:outline-ink aria-pressed:after:absolute aria-pressed:after:inset-x-3 aria-pressed:after:bottom-[7px] aria-pressed:after:h-0.5 aria-pressed:after:bg-(--chip-mark)"
              >
                {entry.shortName}
              </button>
            ))}
          </div>
        </div>
      )}
      <div aria-hidden="true" className="grid grid-cols-3 gap-[5px]">
        {TERMS.map((term) => (
          <span
            key={term}
            className="font-display text-[12px] font-extrabold tracking-[0.06em] text-ink-2 uppercase sm:text-[14px]"
          >
            {term}
          </span>
        ))}
      </div>
      <div className="mt-1 grid gap-4">
        {ROWS.map((row) => (
          <div key={row.who} className="mt-2.5">
            <div aria-hidden="true" className="grid grid-cols-3 gap-[5px]">
              <span className="h-8 rounded-[3px] bg-ink/8 sm:h-10" />
              <span className="relative h-8 overflow-hidden rounded-[3px] bg-ink/8 sm:h-10">
                <span className={`term-bar ${row.bar}`} />
              </span>
              <span className="h-8 rounded-[3px] bg-ink/8 sm:h-10" />
            </div>
            <p className="mt-2 text-[14px] text-ink-2 sm:text-[15.5px]">
              <span className="font-semibold text-ink">{row.who}</span>, May through August
            </p>
          </div>
        ))}
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-x-[18px] gap-y-2.5">
        <span className="term-matched inline-flex h-8 items-center gap-[7px] rounded-[3px] bg-highlight px-3 pb-px font-display text-[16px] font-extrabold tracking-[0.05em] text-on-highlight uppercase">
          <Check aria-hidden="true" className="size-4" strokeWidth={3} />
          Same months
        </span>
        <figcaption className="text-[14px] text-ink-2 sm:text-[14.5px]">
          Example. Every listing on {APP_NAME} draws its dates on this same term calendar.
        </figcaption>
      </div>
    </figure>
  );
}
