'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const FOOTER_LINKS = [
  { href: '/schools', label: 'Schools' },
  { href: '/about', label: 'About' },
  { href: '/terms', label: 'Terms' },
  { href: '/privacy', label: 'Privacy' },
  { href: '/contact', label: 'Contact' },
] as const;

const REPO_URL = 'https://github.com/ariavhayempour/student_subleases';

// The bottom of the board's aluminum frame.
export function SiteFooter() {
  // The messages screen fills the viewport below the header; a footer would make it scroll.
  const pathname = usePathname();
  if (pathname === '/messages' || pathname.startsWith('/messages/')) return null;
  return (
    <footer className="alu mt-auto border-t border-alu-edge">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-sm text-ink sm:grid sm:grid-cols-[1fr_auto_1fr] sm:items-center sm:gap-6 sm:px-6 lg:px-8">
        <p className="sm:justify-self-start">Not affiliated with any university.</p>
        <a
          href={REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-ink no-underline hover:underline"
        >
          GitHub
        </a>
        <nav aria-label="Footer" className="sm:justify-self-end">
          <ul className="flex flex-wrap gap-x-5 gap-y-1 font-semibold sm:justify-end">
            {FOOTER_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-ink no-underline hover:underline">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
