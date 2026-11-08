import { BanknoteX, CalendarClock, GraduationCap } from 'lucide-react';
import type { ReactNode } from 'react';
import { APP_NAME } from '@/lib/app-config';

const FACTS = [
  { icon: GraduationCap, text: 'Students only. No landlords or property managers.' },
  { icon: CalendarClock, text: 'New listings go live after a short review period.' },
  { icon: BanknoteX, text: 'Free to post and free to browse.' },
];

// Sign-in and sign-up: a flyer pinned to the cork on the left, Clerk's form on white paper right.
export function AuthShell({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <main className="grid flex-1 lg:grid-cols-[5fr_6fr]">
      <section className="cork hidden items-center justify-center px-10 py-16 lg:flex">
        <div className="paper w-full max-w-[460px] px-10 pt-12 pb-9 [--r:-1deg]">
          <span aria-hidden="true" className="pin pin-red top-3.5 left-1/2" />
          <h1 className="flyer-caps text-[clamp(2.8rem,4.4vw,4rem)]">{heading}</h1>
          <ul className="mt-7 grid gap-4 text-[16px]">
            {FACTS.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-start gap-3">
                <Icon aria-hidden="true" className="mt-0.5 size-5 shrink-0" strokeWidth={1.75} />
                {text}
              </li>
            ))}
          </ul>
          <p className="mt-8 border-t border-line pt-4 text-sm text-ink-2">
            {APP_NAME} is not affiliated with any university.
          </p>
        </div>
      </section>
      <section className="flex items-center justify-center bg-white px-4 py-12">
        <h1 className="sr-only lg:hidden">{heading}</h1>
        {children}
      </section>
    </main>
  );
}
