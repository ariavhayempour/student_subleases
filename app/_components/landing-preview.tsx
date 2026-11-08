import {
  CalendarDays,
  Map as MapIcon,
  MessageCircle,
  Search,
  Send,
  ShieldAlert,
  SlidersHorizontal,
} from 'lucide-react';
import Image from 'next/image';
import type { CSSProperties } from 'react';
import { SAFETY_NOTICE } from '@/lib/messaging-options';
import { schoolThemeStyle } from '@/lib/school-theme';
import type { SchoolSummary } from '@/server/services/schools';

type PreviewSchool = Pick<SchoolSummary, 'slug' | 'shortName' | 'city' | 'campusName' | 'theme'>;

const TILES = [
  {
    photo: '/landing/tile-bedroom-apartment.webp',
    title: 'Private room in a 3-bed apartment',
    rent: '$850',
    dates: 'Jun 1 – Aug 15',
    miles: '0.4',
  },
  {
    photo: '/landing/tile-studio.webp',
    title: 'Studio a short walk from campus',
    rent: '$975',
    dates: 'May 15 – Aug 20',
    miles: '0.9',
  },
  {
    photo: '/landing/tile-house-room.webp',
    title: 'Room in a 4-bed house',
    rent: '$700',
    dates: 'May 20 – Aug 18',
    miles: '1.3',
  },
];

const THREAD = [
  {
    mine: true,
    body: 'Hi! Is your room open Jun 1 – Aug 15? I have a summer research job on campus.',
    at: '4:12 PM',
  },
  {
    mine: false,
    body: 'It is. It’s furnished, and you’d share the kitchen with two other students.',
    at: '4:15 PM',
  },
  { mine: true, body: 'Could I come see it this week?', at: '4:16 PM' },
  { mine: false, body: 'Thursday after 4 works. I’ll send the unit number here.', at: '4:18 PM' },
];

const HOW = [
  {
    icon: SlidersHorizontal,
    term: 'Filter',
    detail: 'Rent, dates, bedrooms, type, furnished, and distance to campus.',
  },
  {
    icon: MapIcon,
    term: 'Map',
    detail: 'Every place is pinned. Drag somewhere new and tap “Search this area.”',
  },
  {
    icon: MessageCircle,
    term: 'Message',
    detail:
      'Talk to the host on the site. Messages arrive live, and you can block or report anyone.',
  },
];

const tag =
  'rounded-[3px] bg-ink px-2 py-1 text-[11.5px] font-bold tracking-[0.08em] text-white uppercase';

// A pinned printout of one school's browse page and a conversation; every place and person is a sample.
export function LandingPreview({ school }: { school: PreviewSchool }) {
  return (
    <div
      className="mt-14 grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_360px]"
      style={schoolThemeStyle(school.theme) as CSSProperties}
    >
      <figure
        data-reveal=""
        aria-label="Preview of a school’s browse page with sample listings"
        className="paper p-2.5 [--r:0.5deg] max-sm:[--r:0deg] sm:p-4"
      >
        <span aria-hidden="true" className="pin pin-red -top-1.5 -left-1.5" />
        <span aria-hidden="true" className="pin pin-yellow -top-1.5 -right-1.5" />
        <span aria-hidden="true" className="pin pin-blue -bottom-1.5 -left-1.5" />
        <span aria-hidden="true" className="pin pin-green -right-1.5 -bottom-1.5" />
        <div className="mb-2.5 flex items-center justify-between gap-3 text-[13px] font-bold text-ink-2">
          <span>{school.shortName}’s browse page</span>
          <span className={tag}>Sample listings</span>
        </div>
        <div
          aria-hidden="true"
          className="overflow-hidden rounded-lg border border-line text-[13.5px]"
        >
          <div className="flex h-[34px] items-center gap-2.5 border-b border-line bg-surface-2 px-3 text-[12.5px] text-ink-2">
            <i className="size-[9px] rounded-full bg-line-2" />
            <i className="size-[9px] rounded-full bg-line-2" />
            <i className="size-[9px] rounded-full bg-line-2" />
            <span className="flex-1 text-center">studentsubleases.com/{school.slug}</span>
          </div>
          <div className="flex h-[46px] items-center justify-between border-b-4 border-school-secondary bg-school px-4 text-on-school">
            <b className="font-display text-[17px] font-extrabold tracking-[0.01em] uppercase">
              {school.shortName}
            </b>
            <span className="text-[12.5px]">
              {[school.city, `near ${school.campusName}`].filter(Boolean).join(' · ')}
            </span>
          </div>
          <div className="flex flex-wrap gap-2 border-b border-line px-4 py-3">
            <span className={`${chip} border-school bg-school text-on-school`}>
              <CalendarDays className="size-[13px]" />
              Jun 1 – Aug 15
            </span>
            <span className={chip}>Rent up to $1,000</span>
            <span className={chip}>1+ bedroom</span>
            <span className={`${chip} max-sm:hidden`}>Within 1 mi of {school.campusName}</span>
            <span className={`${chip} max-sm:hidden`}>Furnished</span>
            <span className={chip}>
              <SlidersHorizontal className="size-[13px]" />
              More filters
            </span>
          </div>
          <div className="grid min-h-[380px] sm:grid-cols-2">
            <div className="grid content-start gap-3 border-line px-4 py-3.5 max-sm:border-b sm:border-r">
              <div className="flex justify-between text-[12.5px] font-bold">
                Places for Jun 1 – Aug 15{' '}
                <span className="font-semibold text-ink-2">Closest to campus</span>
              </div>
              {TILES.map((tile) => (
                <div key={tile.title} className="grid grid-cols-[112px_1fr] gap-3">
                  <Image
                    src={tile.photo}
                    alt=""
                    width={224}
                    height={168}
                    className="h-[84px] w-[112px] rounded-[5px] object-cover"
                  />
                  <div>
                    <b className="block leading-tight">{tile.title}</b>
                    <span className="font-display text-[18px] font-extrabold tracking-[-0.01em]">
                      {tile.rent}
                      <small className="font-sans text-[12px] font-semibold text-ink-2"> /mo</small>
                    </span>
                    <div className="mt-0.5 text-[12px] text-ink-2">
                      {tile.dates} · {tile.miles} mi to {school.campusName}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <PreviewMap campusName={school.campusName} />
          </div>
        </div>
      </figure>

      <div className="grid gap-[34px] max-lg:sm:grid-cols-2">
        <figure
          data-reveal=""
          aria-label="Sample conversation with a host"
          className="paper p-4 [--r:-1.4deg] max-sm:[--r:0deg]"
        >
          <span aria-hidden="true" className="pin pin-green -top-1.5 left-1/2" />
          <div className="flex items-center justify-between gap-2.5 border-b border-line pb-2.5">
            <div>
              <b className="block text-[14.5px]">Maya R.</b>
              <span className="text-[12.5px] text-ink-2">Private room in a 3-bed apartment</span>
            </div>
            <span className={tag}>Sample</span>
          </div>
          <p className="my-3 flex gap-2 rounded-md bg-warn-bg px-3 py-2.5 text-[13px] leading-snug font-semibold text-warn">
            <ShieldAlert aria-hidden="true" className="mt-px size-4 shrink-0" />
            {SAFETY_NOTICE}
          </p>
          <div className="grid gap-2 text-[13.5px] leading-snug">
            {THREAD.map((message) => (
              <p
                key={message.at}
                className={
                  message.mine
                    ? 'max-w-[86%] justify-self-end rounded-xl rounded-br-[4px] bg-school px-3 py-2 text-on-school'
                    : 'max-w-[86%] justify-self-start rounded-xl rounded-bl-[4px] bg-surface-2 px-3 py-2 text-ink'
                }
              >
                {message.body}
                <time className="mt-0.5 block text-[11.5px] opacity-85">{message.at}</time>
              </p>
            ))}
          </div>
          <div aria-hidden="true" className="mt-3 flex gap-2">
            <span className="flex h-9 flex-1 items-center rounded-md border border-line-2 px-2.5 text-[13px] text-ink-2">
              Write a message…
            </span>
            <i className="grid size-9 place-items-center rounded-md bg-school text-on-school">
              <Send className="size-[15px]" />
            </i>
          </div>
        </figure>
        <aside
          data-reveal=""
          className="paper px-[22px] pt-[22px] pb-[18px] [--r:1.2deg] max-sm:[--r:0deg]"
        >
          <span aria-hidden="true" className="masking-tape -top-3 left-[40%]" />
          <dl className="grid gap-3.5">
            {HOW.map(({ icon: Icon, term, detail }) => (
              <div key={term}>
                <dt className="flex items-center gap-2 font-display text-[17px] font-extrabold">
                  <Icon aria-hidden="true" className="size-[18px]" />
                  {term}
                </dt>
                <dd className="mt-0.5 text-[14.5px] text-ink-2">{detail}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>
    </div>
  );
}

const chip =
  'inline-flex h-[30px] items-center gap-1.5 rounded-full border border-line-2 px-[11px] text-[12.5px] font-semibold text-ink';

function PreviewMap({ campusName }: { campusName: string }) {
  return (
    <div className="relative min-h-[260px] overflow-hidden bg-[#efece6]">
      <svg
        viewBox="0 0 400 380"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 size-full"
      >
        <rect width="400" height="380" fill="#efece6" />
        <path
          d="M0 310 C80 290 160 330 240 300 S360 290 400 300 V340 C340 330 260 350 200 345 S60 330 0 345z"
          fill="#cfe0ee"
        />
        <rect x="250" y="150" width="90" height="70" fill="#dbe8d4" />
        <g stroke="#fff" strokeWidth="9">
          <path d="M0 70H400M0 150H400M0 230H400M70 0V380M160 0V380M250 0V380M340 0V380" />
        </g>
        <path d="M0 360L400 40" stroke="#f6dc8c" strokeWidth="10" />
        <g fontFamily="var(--font-hanken), sans-serif" fontWeight="700" fontSize="13">
          <rect
            x="178"
            y="166"
            width="44"
            height="40"
            rx="3"
            fill="var(--school)"
            opacity=".12"
            stroke="var(--school)"
            strokeDasharray="4 3"
          />
          <text x="200" y="226" textAnchor="middle" fill="#15171c" fontSize="12">
            {campusName}
          </text>
          {[
            { x: 120, y: 104, label: '$850' },
            { x: 262, y: 88, label: '$975' },
            { x: 282, y: 250, label: '$790' },
          ].map((pin) => (
            <g key={pin.label}>
              <rect x={pin.x} y={pin.y} width="56" height="26" rx="13" fill="var(--school)" />
              <text x={pin.x + 28} y={pin.y + 18} textAnchor="middle" fill="var(--on-school)">
                {pin.label}
              </text>
            </g>
          ))}
          <rect x="60" y="250" width="56" height="26" rx="13" fill="var(--school-highlight)" />
          <text x="88" y="268" textAnchor="middle" fill="var(--on-school-highlight)">
            $700
          </text>
        </g>
      </svg>
      <span className="absolute top-3 left-1/2 inline-flex h-[30px] -translate-x-1/2 items-center gap-1.5 rounded-full bg-white px-3 text-[12.5px] font-bold whitespace-nowrap shadow-[0_2px_6px_rgb(0_0_0/0.18)]">
        <Search className="size-[13px]" />
        Search this area
      </span>
    </div>
  );
}
