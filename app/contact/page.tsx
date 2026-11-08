import { CircleAlert, Flag, ShieldAlert } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { BoardBand, BoardWork } from '@/app/_components/board-band';
import { APP_NAME } from '@/lib/app-config';
import { DEFAULT_CONTACT_TOPIC, parseContactTopic } from '@/lib/validation/contact';
import { ContactForm } from './contact-form';

export const metadata: Metadata = {
  title: 'Contact',
  description: `Send a message to the ${APP_NAME} team.`,
  alternates: { canonical: '/contact' },
};

export default async function ContactPage({ searchParams }: PageProps<'/contact'>) {
  const { topic } = await searchParams;
  const defaultTopic = parseContactTopic(topic) ?? DEFAULT_CONTACT_TOPIC;
  return (
    <main className="flex flex-1 flex-col">
      <BoardBand
        title="Contact us"
        pin="yellow"
        description="Questions, a bug, or trouble with your account? Send it here and we’ll reply by email."
      />
      <BoardWork>
        <div className="grid items-start gap-7 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14">
          <div>
            <h2 className="font-display text-[22px] leading-tight font-extrabold tracking-[-0.01em]">
              Before you write
            </h2>
            <p className="mt-2.5 max-w-[46ch] text-[16px] leading-relaxed">
              Pick the topic that fits best so your message gets to the right place.
            </p>
            <ul className="mt-5 grid gap-3.5 border-t border-line pt-5 text-[14.5px] leading-normal">
              <li className="grid grid-cols-[22px_1fr] gap-2.5">
                <Flag aria-hidden="true" className="mt-0.5 size-[18px] text-ink-2" />
                <span>
                  <b className="block">Something wrong with a listing, message, or user?</b>
                  Use Report on it instead. That sends us the details we need.
                </span>
              </li>
              <li className="grid grid-cols-[22px_1fr] gap-2.5">
                <CircleAlert aria-hidden="true" className="mt-0.5 size-[18px] text-ink-2" />
                <span>
                  <b className="block">How the site works</b>
                  See{' '}
                  <Link href="/about" className="font-bold text-school-link underline">
                    how {APP_NAME} works
                  </Link>
                  .
                </span>
              </li>
              <li className="grid grid-cols-[22px_1fr] gap-2.5">
                <ShieldAlert aria-hidden="true" className="mt-0.5 size-[18px] text-ink-2" />
                <span>
                  <b className="block">Paying rent or a deposit</b>
                  The site never handles money. Never send any before you&apos;ve seen the place in
                  person.
                </span>
              </li>
            </ul>
          </div>
          <ContactForm defaultTopic={defaultTopic} />
        </div>
      </BoardWork>
    </main>
  );
}
