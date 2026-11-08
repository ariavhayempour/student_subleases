import { describe, expect, it } from 'vitest';
import { upcomingTerms } from '@/lib/terms';

describe('upcomingTerms', () => {
  it('starts with the term containing today and rolls into the next year', () => {
    expect(upcomingTerms(new Date('2026-11-07T12:00:00Z'))).toEqual([
      {
        key: 'fall-2026',
        label: 'Fall 2026',
        months: 'Sep–Dec',
        from: '2026-09-01',
        to: '2026-12-31',
      },
      {
        key: 'spring-2027',
        label: 'Spring 2027',
        months: 'Jan–Apr',
        from: '2027-01-01',
        to: '2027-04-30',
      },
      {
        key: 'summer-2027',
        label: 'Summer 2027',
        months: 'May–Aug',
        from: '2027-05-01',
        to: '2027-08-31',
      },
    ]);
  });

  it('puts term boundaries on the first and last day of each season', () => {
    expect(upcomingTerms(new Date('2027-04-30T23:59:00Z'), 1)[0]?.key).toBe('spring-2027');
    expect(upcomingTerms(new Date('2027-05-01T00:00:00Z'), 1)[0]?.key).toBe('summer-2027');
    expect(upcomingTerms(new Date('2027-08-31T12:00:00Z'), 1)[0]?.key).toBe('summer-2027');
    expect(upcomingTerms(new Date('2027-09-01T12:00:00Z'), 1)[0]?.key).toBe('fall-2027');
  });

  it('returns as many terms as asked for', () => {
    expect(upcomingTerms(new Date('2027-02-01T00:00:00Z'), 5).map((term) => term.key)).toEqual([
      'spring-2027',
      'summer-2027',
      'fall-2027',
      'spring-2028',
      'summer-2028',
    ]);
  });
});
