'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useThemeSchool } from '@/app/_components/school-theme';
import { cn } from '@/lib/utils';

const LINKS = [
  { href: '/me/favorites', label: 'Saved' },
  { href: '/me/listings', label: 'My listings' },
  { href: '/settings', label: 'Settings' },
];

// Links sit on the aluminum strip; the current page gets a bar in the school color along its bottom edge.
export const HEADER_LINK =
  "relative flex items-center gap-1.5 px-3 text-[14.5px] font-semibold text-ink no-underline hover:bg-white/35 aria-[current=page]:font-extrabold aria-[current=page]:after:absolute aria-[current=page]:after:inset-x-3 aria-[current=page]:after:bottom-0 aria-[current=page]:after:h-1 aria-[current=page]:after:bg-school aria-[current=page]:after:content-['']";

export function useIsCurrent(): (href: string) => boolean {
  const pathname = usePathname();
  return (href) => pathname === href || pathname.startsWith(`${href}/`);
}

export function HeaderNavLinks({ variant = 'bar' }: { variant?: 'bar' | 'menu' }) {
  const school = useThemeSchool();
  const isCurrent = useIsCurrent();
  const browse = school ? `/${school.slug}` : '/';
  const links = [{ href: browse, label: 'Browse' }, ...LINKS];
  return links.map((link) => (
    <Link
      key={link.label}
      href={link.href}
      aria-current={isCurrent(link.href) && link.href !== '/' ? 'page' : undefined}
      className={cn(variant === 'bar' ? HEADER_LINK : 'text-ink aria-[current=page]:font-bold')}
    >
      {link.label}
    </Link>
  ));
}

export function CurrentLink({
  href,
  className,
  children,
  ...rest
}: React.ComponentProps<typeof Link> & { href: string }) {
  const isCurrent = useIsCurrent();
  return (
    <Link
      href={href}
      aria-current={isCurrent(href) ? 'page' : undefined}
      className={className}
      {...rest}
    >
      {children}
    </Link>
  );
}
