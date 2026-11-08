'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { APP_NAME } from '@/lib/app-config';

const FOOTER_LINKS = [
  { href: '/schools', label: 'Schools' },
  { href: '/about', label: 'About' },
  { href: '/terms', label: 'Terms' },
  { href: '/privacy', label: 'Privacy' },
  { href: '/contact', label: 'Contact' },
] as const;

// The bottom of the board's aluminum frame.
export function SiteFooter() {
  // The messages screen fills the viewport below the header; a footer would make it scroll.
  const pathname = usePathname();
  if (pathname === '/messages' || pathname.startsWith('/messages/')) return null;
  return (
    <footer className="alu mt-auto border-t border-alu-edge">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-sm text-ink sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p>
          <span className="font-bold">{APP_NAME}</span> is free and for students only. Not
          affiliated with any university.
        </p>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-5 gap-y-1 font-semibold">
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
