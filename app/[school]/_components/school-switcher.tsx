'use client';

import { useRouter } from 'next/navigation';
import { useId } from 'react';
import type { SchoolSummary } from '@/server/services/schools';

type SchoolSwitcherProps = { current: string; schools: Pick<SchoolSummary, 'slug' | 'name'>[] };

// Admin-only; filters are per school, so switching starts the new school unfiltered.
export function SchoolSwitcher({ current, schools }: SchoolSwitcherProps) {
  const router = useRouter();
  const id = useId();
  return (
    <div className="flex items-center gap-2 text-[13px]">
      <label htmlFor={id} className="shrink-0 font-bold text-ink-2">
        Viewing school
      </label>
      <select
        id={id}
        value={current}
        onChange={(event) => router.push(`/${event.target.value}`)}
        className="h-9 w-full min-w-48 cursor-pointer rounded-[5px] border-[1.5px] border-line-2 bg-white px-3 text-sm font-semibold text-ink outline-none hover:border-ink-3 focus-visible:border-school focus-visible:ring-3 focus-visible:ring-school/20"
      >
        {schools.map((school) => (
          <option key={school.slug} value={school.slug}>
            {school.name}
          </option>
        ))}
      </select>
    </div>
  );
}
