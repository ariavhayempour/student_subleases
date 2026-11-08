import { X } from 'lucide-react';
import Link from 'next/link';
import { activeFilterChips } from '@/lib/active-filters';
import { toSearchParams, type SearchFilters } from '@/lib/validation/search';

type ActiveFiltersProps = { schoolSlug: string; filters: SearchFilters };

export function ActiveFilters({ schoolSlug, filters }: ActiveFiltersProps) {
  const chips = activeFilterChips(filters);
  if (chips.length === 0) return null;
  const hrefFor = (without: SearchFilters) => {
    const query = toSearchParams(without).toString();
    return query ? `/${schoolSlug}?${query}` : `/${schoolSlug}`;
  };
  return (
    <ul aria-label="Active filters" className="flex flex-wrap gap-2">
      {chips.map((chip) => (
        <li key={chip.key}>
          <Link
            href={hrefFor(chip.without)}
            aria-label={`Remove filter: ${chip.label}`}
            className="group inline-flex h-8 items-center gap-1.5 rounded-full bg-school-tint pr-[5px] pl-3 text-[13.5px] font-semibold text-ink no-underline ring-1 ring-school/25 transition-colors ring-inset hover:ring-school"
          >
            {chip.label}
            <span className="grid size-[22px] place-items-center rounded-full bg-white text-school-link ring-1 ring-line-2 ring-inset group-hover:bg-school group-hover:text-on-school group-hover:ring-school">
              <X aria-hidden="true" className="size-[13px]" />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
