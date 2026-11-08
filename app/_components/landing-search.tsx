'use client';

import { ArrowRight, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { type FormEvent, type ReactNode, useState } from 'react';
import type { Term } from '@/lib/terms';

type SearchSchool = { slug: string; shortName: string };

const ANY_DATES = '';

// The flyer's fill-in lines: pick a school and a term, then open that school's board.
export function LandingSearch({
  schools,
  terms,
  defaultTermKey,
}: {
  schools: SearchSchool[];
  terms: Term[];
  defaultTermKey: string;
}) {
  const router = useRouter();
  const [school, setSchool] = useState(schools[0]?.slug ?? '');
  const [termKey, setTermKey] = useState(defaultTermKey);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!school) return;
    const term = terms.find((entry) => entry.key === termKey);
    const query = term ? `?${new URLSearchParams({ from: term.from, to: term.to })}` : '';
    router.push(`/${school}${query}`);
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 grid gap-x-7 gap-y-4 sm:grid-cols-2">
      <FillLine id="landing-school" label="School">
        <select
          id="landing-school"
          value={school}
          onChange={(event) => setSchool(event.target.value)}
          className={selectClass}
        >
          {schools.map((entry) => (
            <option key={entry.slug} value={entry.slug}>
              {entry.shortName}
            </option>
          ))}
        </select>
      </FillLine>
      <FillLine id="landing-term" label="When">
        <select
          id="landing-term"
          value={termKey}
          onChange={(event) => setTermKey(event.target.value)}
          className={selectClass}
        >
          {terms.map((term) => (
            <option key={term.key} value={term.key}>
              {`${term.label} (${term.months})`}
            </option>
          ))}
          <option value={ANY_DATES}>Any dates</option>
        </select>
      </FillLine>
      <button
        type="submit"
        className="group mt-1.5 inline-flex h-14 items-center justify-center gap-2.5 rounded-[5px] border-[1.5px] border-ink bg-ink px-6 text-[18px] font-bold text-white transition-[transform,box-shadow] duration-200 ease-out-expo hover:-translate-y-px hover:shadow-[0_8px_16px_-8px_rgb(26_20_16/0.6)] sm:col-span-2"
      >
        Post or find a place
        <ArrowRight
          aria-hidden="true"
          className="size-[18px] transition-transform duration-200 ease-out-expo group-hover:translate-x-[3px]"
        />
      </button>
    </form>
  );
}

const selectClass =
  'h-[46px] w-full cursor-pointer appearance-none rounded-none border-0 border-b-2 border-ink bg-transparent pr-8 pl-0.5 text-[19px] font-semibold text-ink focus-visible:outline-offset-4 sm:text-[20px]';

function FillLine({ id, label, children }: { id: string; label: string; children: ReactNode }) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-[12.5px] font-bold tracking-[0.08em] text-ink-2 uppercase"
      >
        {label}
      </label>
      <div className="relative">
        {children}
        <ChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute right-0.5 bottom-3.5 size-[18px] text-ink"
        />
      </div>
    </div>
  );
}
