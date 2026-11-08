// Academic terms on the same Jan–Apr / May–Aug / Sep–Dec calendar the landing's term chart uses.
const SEASONS = [
  { name: 'Spring', months: 'Jan–Apr', start: '01-01', end: '04-30' },
  { name: 'Summer', months: 'May–Aug', start: '05-01', end: '08-31' },
  { name: 'Fall', months: 'Sep–Dec', start: '09-01', end: '12-31' },
] as const;

export type Term = {
  key: string;
  label: string;
  months: string;
  from: string;
  to: string;
};

function seasonIndex(month: number): number {
  if (month < 4) return 0;
  if (month < 8) return 1;
  return 2;
}

// The term containing `today`, then the ones after it; `today` is read as a calendar date in UTC.
export function upcomingTerms(today: Date, count = 3): Term[] {
  let year = today.getUTCFullYear();
  let index = seasonIndex(today.getUTCMonth());
  const terms: Term[] = [];
  for (let n = 0; n < count; n += 1) {
    const season = SEASONS[index]!;
    terms.push({
      key: `${season.name.toLowerCase()}-${year}`,
      label: `${season.name} ${year}`,
      months: season.months,
      from: `${year}-${season.start}`,
      to: `${year}-${season.end}`,
    });
    index += 1;
    if (index === SEASONS.length) {
      index = 0;
      year += 1;
    }
  }
  return terms;
}
