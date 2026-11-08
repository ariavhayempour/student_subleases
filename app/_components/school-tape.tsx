'use client';

import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { type CSSProperties, useEffect, useRef } from 'react';
import { useMediaQuery } from '@/app/_lib/use-media-query';
import { cn } from '@/lib/utils';
import type { SchoolSummary } from '@/server/services/schools';

type TapeSchool = Pick<SchoolSummary, 'slug' | 'name' | 'shortName' | 'city' | 'theme'>;

// Segment width estimate, used to repeat the list until one half covers a wide screen.
const SEGMENT_PX = 340;
const COVER_PX = 2560;
const SPEED_PX_PER_S = 100;
// Holds the drift until the tape has unrolled.
const START_DELAY_MS = 1300;

// The landing's school ribbon: printed packing tape that drifts and stops under a hand or focus.
export function SchoolTape({
  schools,
  id,
  className,
}: {
  schools: TapeSchool[];
  id?: string;
  className?: string;
}) {
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const scroller = useRef<HTMLDivElement>(null);
  const holding = useRef({ hover: false, focus: false, touch: false });

  const half = Math.max(1, Math.ceil(COVER_PX / (Math.max(schools.length, 1) * SEGMENT_PX)));

  useEffect(() => {
    const el = scroller.current;
    if (!el || reducedMotion) return;
    let frame = 0;
    let last = performance.now();
    const startAt = last + START_DELAY_MS;
    let pos = el.scrollLeft;
    const tick = (now: number) => {
      const dt = Math.min(now - last, 64);
      last = now;
      const held = holding.current;
      // Picks up any manual scroll (trackpad, swipe, focus) before moving on from there.
      if (Math.abs(el.scrollLeft - Math.round(pos)) > 1) pos = el.scrollLeft;
      if (
        now >= startAt &&
        !held.hover &&
        !held.focus &&
        !held.touch &&
        document.visibilityState === 'visible'
      ) {
        const wrapAt = el.scrollWidth / 2;
        pos += (SPEED_PX_PER_S * dt) / 1000;
        if (pos >= wrapAt) pos -= wrapAt;
        el.scrollLeft = Math.round(pos);
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reducedMotion]);

  if (schools.length === 0) return null;

  const hold = (key: 'hover' | 'focus' | 'touch', value: boolean) => {
    holding.current[key] = value;
  };

  return (
    <nav id={id} aria-label="Schools on Student Subleases" className={cn('scroll-mt-6', className)}>
      <div className={cn('packing-tape', !reducedMotion && 'tape-unroll')}>
        {reducedMotion ? (
          <ul className="flex flex-wrap">
            {schools.map((school) => (
              <TapeSegment key={school.slug} school={school} className="flex-1" />
            ))}
          </ul>
        ) : (
          <div
            ref={scroller}
            onPointerEnter={() => hold('hover', true)}
            onPointerLeave={() => hold('hover', false)}
            onFocus={() => hold('focus', true)}
            onBlur={() => hold('focus', false)}
            onTouchStart={() => hold('touch', true)}
            onTouchEnd={() => hold('touch', false)}
            onTouchCancel={() => hold('touch', false)}
            className="flex overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {Array.from({ length: half * 2 }, (_, copy) => (
              // Repeats stay clickable but out of the tab order and accessibility tree.
              <ul key={copy} className="flex shrink-0" aria-hidden={copy > 0 || undefined}>
                {schools.map((school) => (
                  <TapeSegment key={school.slug} school={school} repeat={copy > 0} />
                ))}
              </ul>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}

function TapeSegment({
  school,
  repeat = false,
  className,
}: {
  school: TapeSchool;
  repeat?: boolean;
  className?: string;
}) {
  const style = {
    '--seg': school.theme.primary,
    '--seg-on': school.theme.onPrimary,
    '--seg-mark': school.theme.secondary,
  } as CSSProperties;
  return (
    <li style={style} className={cn('shrink-0', className)}>
      <Link
        href={`/${school.slug}`}
        tabIndex={repeat ? -1 : undefined}
        className="flex h-14 items-center gap-2.5 bg-(--seg) px-7 font-display text-[19px] font-extrabold tracking-[0.04em] whitespace-nowrap text-(--seg-mark) uppercase no-underline transition-[filter] duration-200 hover:brightness-110 focus-visible:outline-(--seg-mark) focus-visible:-outline-offset-8 sm:h-[68px] sm:gap-3.5 sm:px-11 sm:text-[21px]"
      >
        {school.shortName}
        <span aria-hidden="true" className="size-[7px] rounded-full bg-current opacity-90" />
        <span className="font-sans text-[12.5px] font-bold tracking-[0.08em] text-(--seg-on) sm:text-[14.5px]">
          {school.city ?? school.name}
        </span>
        <ArrowRight aria-hidden="true" className="size-4 shrink-0 sm:size-[18px]" />
        <span className="sr-only">{`, browse ${school.name} listings`}</span>
      </Link>
    </li>
  );
}
