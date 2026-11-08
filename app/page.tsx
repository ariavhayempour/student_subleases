import {
  ArrowRight,
  BanknoteX,
  CalendarClock,
  DoorClosed,
  GraduationCap,
  Plus,
} from 'lucide-react';
import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { LandingPreview } from '@/app/_components/landing-preview';
import { LandingReveal } from '@/app/_components/landing-reveal';
import { LandingSearch } from '@/app/_components/landing-search';
import { SchoolTape } from '@/app/_components/school-tape';
import { TermMatch } from '@/app/_components/term-match';
import { APP_NAME } from '@/lib/app-config';
import { upcomingTerms } from '@/lib/terms';
import { getActor } from '@/server/auth/get-actor';
import { listActiveSchools } from '@/server/services/schools';
import { getOnboardingState } from '@/server/services/users';

export const metadata: Metadata = {
  title: { absolute: `${APP_NAME}: student subleases near campus` },
  description:
    'Students sublease their own apartments, houses, and rooms to other students. Always free.',
  alternates: { canonical: '/' },
};

const RULES = [
  {
    icon: GraduationCap,
    term: 'Students only',
    detail: 'Hosts are students subleasing their own place. No landlords or property managers.',
  },
  {
    icon: CalendarClock,
    term: 'A short review period',
    detail: 'New listings go live after a short review period, not the moment they’re posted.',
  },
  {
    icon: BanknoteX,
    term: 'Free, no payments',
    detail:
      'Posting and browsing cost nothing. The site never handles money; you arrange rent with the host.',
  },
  {
    icon: DoorClosed,
    term: 'Unit number kept private',
    detail:
      'Listings show the street. The unit only shows to students in a conversation with the host.',
  },
];

const FAQ = [
  {
    q: 'Is it really free?',
    a: 'Yes. Posting, browsing, and messaging cost nothing. The site never takes payments or fees.',
  },
  {
    q: 'Who can post a place?',
    a: 'Students subleasing their own apartment, house, or room near their school. Landlords and property managers can’t post.',
  },
  {
    q: 'When does my listing go live?',
    a: 'New listings appear after a short review period. You can see your listing’s status under My listings.',
  },
  {
    q: 'Is my address public?',
    a: 'The street shows on the listing and the map. Your unit number only shows to students who are in a conversation with you.',
  },
  {
    q: 'How do I pay rent?',
    a: 'You and the host arrange it directly. The site never handles money, so never send money or a deposit before you’ve seen the place in person.',
  },
  {
    q: 'Can I look at other schools?',
    a: 'Yes. Without an account you can browse any school’s listings. When you sign up you pick one home school, once; saving, messaging, and posting happen there.',
  },
];

const sectionHead = 'paper inline-block max-w-[760px] px-5 pt-6 pb-6 sm:px-8 sm:pt-7';
const display = 'board-display text-[clamp(2.2rem,4.4vw,3.6rem)] text-balance';

export default async function HomePage() {
  const actor = await getActor();
  if (actor.kind === 'user') {
    const state = await getOnboardingState(actor);
    if (state.needsOnboarding) redirect('/onboarding');
    if (state.homeSchoolSlug) redirect(`/${state.homeSchoolSlug}`);
  }
  const schools = await listActiveSchools();
  const terms = upcomingTerms(new Date());
  const previewSchool = schools.find((school) => school.slug === 'umich') ?? schools[0];

  return (
    <main className="flex-1">
      <section
        aria-labelledby="hero-title"
        className="cork relative overflow-hidden pt-6 pb-7 sm:pt-[30px] sm:pb-14"
      >
        <div className="mx-auto grid max-w-310 items-center gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,770px)_300px] lg:justify-between lg:gap-12 lg:px-8 xl:grid-cols-[minmax(0,770px)_340px]">
          <div
            className="paper pin-on px-5 pt-[34px] pb-6 sm:px-[46px] sm:pt-[42px] sm:pb-[34px] lg:[--r:-1deg]"
            style={{ '--d': 0 } as CSSProperties}
          >
            <span aria-hidden="true" className="pin pin-red top-3.5 left-1/2" />
            <h1 id="hero-title" className="flyer-caps text-[clamp(2.7rem,6.3vw,5.8rem)]">
              Sublet near campus.
            </h1>
            <p className="mt-3.5 max-w-[30ch] font-display text-[clamp(1.2rem,1.9vw,1.65rem)] leading-tight font-bold tracking-[-0.01em]">
              Leaving for a term? Post your place. Coming for one? Find a place.
            </p>
            <p className="mt-3 max-w-[60ch] text-[16px] text-ink-2 sm:text-[17px]">
              Students sublease their own apartments, houses, and rooms to other students.{' '}
              <strong className="text-ink">Students only, always free.</strong> New listings go live
              after a short review period.
            </p>
            <LandingSearch
              schools={schools.map(({ slug, shortName }) => ({ slug, shortName }))}
              terms={terms}
              defaultTermKey={terms[1]?.key ?? ''}
            />
          </div>
          <SampleListing />
        </div>
        <SchoolTape
          id="schools"
          schools={schools}
          className="relative z-[3] mt-10 -ml-[6vw] w-[112vw] -rotate-[2.2deg] sm:mt-12 sm:-ml-[4vw] sm:w-[108vw] sm:-rotate-[1.4deg]"
        />
      </section>

      <section aria-labelledby="who-title" className="cork pt-10 pb-18 sm:pb-26">
        <div className="mx-auto max-w-310 px-4 sm:px-6 lg:px-8">
          <div data-reveal="" className={`${sectionHead} [--r:-0.6deg] max-sm:[--r:0deg]`}>
            <span aria-hidden="true" className="pin pin-yellow top-2.5 left-3.5" />
            <span aria-hidden="true" className="pin pin-green top-2.5 right-3.5" />
            <h2 id="who-title" className={display}>
              Every term, someone leaves and someone arrives.
            </h2>
            <p className="mt-3 max-w-[58ch] text-[16px] text-ink-2 sm:text-[17px]">
              Internships, study abroad, co-ops, early graduations. The same months one student is
              gone, another needs a place near campus.
            </p>
          </div>
          <TermMatch schools={schools} />
        </div>
      </section>

      {previewSchool && (
        <section aria-labelledby="preview-title" className="cork pt-6 pb-18 sm:pb-26">
          <div className="mx-auto max-w-310 px-4 sm:px-6 lg:px-8">
            <div data-reveal="" className={`${sectionHead} [--r:0.7deg] max-sm:[--r:0deg]`}>
              <span aria-hidden="true" className="pin pin-red top-2.5 left-3.5" />
              <span aria-hidden="true" className="pin pin-blue top-2.5 right-3.5" />
              <h2 id="preview-title" className={display}>
                Like the board, but online.
              </h2>
              <p className="mt-3 max-w-[58ch] text-[16px] text-ink-2 sm:text-[17px]">
                Every listing has photos, dates, rent, and how far it is from campus. Filter to the
                months you need, see every place on a map, and message the host right here.
              </p>
            </div>
            <LandingPreview school={previewSchool} />
          </div>
        </section>
      )}

      <div aria-hidden="true" className="alu h-[18px] border-y border-alu-edge" />

      <section aria-labelledby="rules-title" className="wall py-18 text-white sm:py-26">
        <div className="relative z-[1] mx-auto grid max-w-310 items-start gap-9 px-4 sm:px-6 lg:grid-cols-[5fr_7fr] lg:gap-16 lg:px-8">
          <div>
            <h2 id="rules-title" className={display}>
              Board rules.
            </h2>
            <p className="mt-[18px] max-w-[40ch] text-[18px] text-white/90">
              The same four rules hold at every school, for every listing.
            </p>
          </div>
          <article
            data-reveal=""
            aria-labelledby="notice-title"
            className="paper px-[18px] pt-7 pb-5 text-ink sm:px-[42px] sm:pt-10 sm:pb-[30px] sm:[--r:0.8deg]"
          >
            <span aria-hidden="true" className="masking-tape -top-3 -left-4 [--tr:-32deg]" />
            <span aria-hidden="true" className="masking-tape -top-3 -right-4 [--tr:30deg]" />
            <span aria-hidden="true" className="masking-tape -bottom-2.5 -left-4 [--tr:28deg]" />
            <span aria-hidden="true" className="masking-tape -right-4 -bottom-2.5 [--tr:-30deg]" />
            <div className="flex flex-col gap-1 border-b-[3px] border-ink pb-3.5 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
              <h3 id="notice-title" className="flyer-caps text-[30px]">
                Posting policy
              </h3>
              <span className="text-[13px] font-bold text-ink-2 sm:text-right">
                {APP_NAME}
                <br className="max-sm:hidden" /> Applies at every school
              </span>
            </div>
            <dl>
              {RULES.map(({ icon: Icon, term, detail }) => (
                <div
                  key={term}
                  className="grid grid-cols-[30px_1fr] gap-x-3.5 gap-y-1 border-b border-line py-[18px] sm:grid-cols-[34px_190px_1fr]"
                >
                  <Icon aria-hidden="true" className="size-[26px]" strokeWidth={1.75} />
                  <dt className="font-display text-[19px] leading-tight font-extrabold">{term}</dt>
                  <dd className="text-[15.5px] text-ink-2 max-sm:col-start-2">{detail}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-4 flex justify-between gap-3 text-[13px] font-semibold text-ink-2">
              <span>
                Questions?{' '}
                <Link href="/contact" className="text-ink underline">
                  Contact us
                </Link>
              </span>
              <span>Posted for all students</span>
            </div>
          </article>
        </div>
      </section>

      <section
        id="faq"
        aria-labelledby="faq-title"
        className="scroll-mt-6 bg-[#fbfaf7] py-18 sm:py-26"
      >
        <div className="mx-auto grid max-w-310 gap-9 px-4 sm:px-6 lg:grid-cols-[4fr_8fr] lg:gap-16 lg:px-8">
          <div>
            <h2 id="faq-title" className={display}>
              Questions, answered.
            </h2>
            <p className="mt-[18px] max-w-[32ch] text-[17px] text-ink-2">
              Something else?{' '}
              <Link href="/contact" className="text-ink underline">
                Send us a note
              </Link>{' '}
              and we’ll get back to you.
            </p>
            <p
              aria-hidden="true"
              className="paper scribble mt-[30px] w-[190px] bg-sticky! px-3.5 pt-3.5 pb-3 text-[22px] leading-[1.05] [--r:-3deg] max-lg:hidden"
            >
              Parents ask these too
            </p>
          </div>
          <div className="border-t-2 border-ink">
            {FAQ.map((item, index) => (
              <details key={item.q} open={index === 0} className="group border-b border-line">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-0.5 py-5 font-display text-[18px] font-bold tracking-[-0.01em] hover:underline hover:underline-offset-4 sm:text-[20px] [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <Plus
                    aria-hidden="true"
                    className="size-[18px] shrink-0 transition-transform duration-300 ease-out-expo group-open:rotate-45"
                  />
                </summary>
                <p className="mb-[22px] max-w-[64ch] text-[16.5px] text-ink-2">{item.a}</p>
              </details>
            ))}
            <details className="group border-b border-line">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-0.5 py-5 font-display text-[18px] font-bold tracking-[-0.01em] hover:underline hover:underline-offset-4 sm:text-[20px] [&::-webkit-details-marker]:hidden">
                My school isn’t listed. Can you add it?
                <Plus
                  aria-hidden="true"
                  className="size-[18px] shrink-0 transition-transform duration-300 ease-out-expo group-open:rotate-45"
                />
              </summary>
              <p className="mb-[22px] max-w-[64ch] text-[16.5px] text-ink-2">
                Tell us which school on the{' '}
                <Link href="/contact?topic=add-school" className="text-ink underline">
                  contact page
                </Link>
                .
              </p>
            </details>
          </div>
        </div>
      </section>

      <section aria-labelledby="close-title" className="cork px-4 py-18 sm:py-28">
        <div
          data-reveal=""
          className="paper mx-auto w-full max-w-[700px] px-5 pt-[38px] pb-8 text-center sm:px-12 sm:pt-[46px] sm:pb-10 sm:[--r:0.8deg]"
        >
          <span aria-hidden="true" className="pin pin-red top-3.5 left-1/2" />
          <h2 id="close-title" className="flyer-caps text-[clamp(2.4rem,5vw,4rem)] leading-[0.92]">
            Find a place, or fill yours.
          </h2>
          <p className="mx-auto mt-3.5 max-w-[44ch] text-[17px] text-ink-2">
            Free for students. New listings go live after a short review period.
          </p>
          <Link
            href="/sign-up"
            className="group mt-6 inline-flex h-[52px] items-center justify-center gap-2.5 rounded-[5px] border-[1.5px] border-ink bg-ink px-[22px] text-[17px] font-bold text-white no-underline transition-[transform,box-shadow] duration-200 ease-out-expo hover:-translate-y-px hover:shadow-[0_8px_16px_-8px_rgb(26_20_16/0.6)]"
          >
            Create your free account
            <ArrowRight
              aria-hidden="true"
              className="size-[18px] transition-transform duration-200 ease-out-expo group-hover:translate-x-[3px]"
            />
          </Link>
          <p className="mt-4 text-[15px]">
            Don’t see your school?{' '}
            <Link href="/contact?topic=add-school" className="font-bold text-ink underline">
              Tell us
            </Link>
          </p>
        </div>
      </section>
      <LandingReveal />
    </main>
  );
}

// A pinned print of one sample listing beside the hero flyer.
function SampleListing() {
  return (
    <article
      aria-label="Sample listing"
      className="paper pin-on mx-auto w-full max-w-[330px] px-3.5 pt-3.5 pb-[18px] [--r:1.5deg] lg:mr-[22px] lg:[--r:2.5deg]"
      style={{ '--d': 2 } as CSSProperties}
    >
      <span aria-hidden="true" className="pin pin-blue -top-1.5 left-1/2" />
      <div className="relative h-[200px] overflow-hidden bg-surface-2 lg:h-[180px] xl:h-[214px]">
        <Image
          src="/landing/sample-living-room.webp"
          alt="Sunny living room with plants and a gray sofa"
          fill
          sizes="330px"
          priority
          className="object-cover"
        />
        <span className="absolute top-2.5 left-2.5 rounded-[3px] bg-ink px-2 py-1 text-[11.5px] font-bold tracking-[0.08em] text-white uppercase">
          Sample listing
        </span>
      </div>
      <h3 className="mt-3 font-display text-[19px] leading-tight font-bold tracking-[-0.01em]">
        Private room near campus
      </h3>
      <p className="font-display text-[26px] font-extrabold tracking-[-0.02em]">
        $725<small className="font-sans text-[14px] font-semibold text-ink-2"> /mo</small>
      </p>
      <ul className="mt-2 grid gap-[3px] text-[14px] text-ink-2">
        <li>Jun 1 – Aug 15</li>
        <li>0.6 mi to campus · furnished</li>
      </ul>
    </article>
  );
}
