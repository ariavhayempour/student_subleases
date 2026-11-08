'use client';

import { Menu } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, type ReactNode } from 'react';

export function SiteHeaderMenu({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const pathname = usePathname();
  const ref = useRef<HTMLDetailsElement>(null);

  // A native <details> stays open across client navigations, so close it on every route change.
  useEffect(() => {
    ref.current?.removeAttribute('open');
  }, [pathname]);

  return (
    <details ref={ref} className={className}>
      <summary className="flex h-10 cursor-pointer list-none items-center gap-1.5 rounded-[5px] border-[1.5px] border-ink/35 bg-white/50 px-2.5 text-[13.5px] font-bold text-ink hover:bg-white/80 [&::-webkit-details-marker]:hidden">
        <Menu aria-hidden="true" className="size-4" />
        Menu
      </summary>
      <div className="absolute inset-x-0 top-full z-40 flex flex-col gap-1 border-b border-line bg-white px-4 py-3 text-[15px] font-semibold text-ink shadow-[0_10px_24px_-8px_rgb(40_20_5/0.35)] [&>a]:py-2 [&>a]:no-underline">
        {children}
      </div>
    </details>
  );
}
