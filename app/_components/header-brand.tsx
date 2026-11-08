'use client';

import { useAuth } from '@clerk/nextjs';
import Link from 'next/link';
import { useThemeSchool } from '@/app/_components/school-theme';
import { APP_NAME } from '@/lib/app-config';

export function HeaderBrand() {
  const school = useThemeSchool();
  // Signed-out visitors always get a way back to the landing page.
  const { isSignedIn } = useAuth();
  const toSchool = school && isSignedIn !== false;
  return (
    <Link
      href={toSchool ? `/${school.slug}` : '/'}
      className="flex min-w-0 items-center gap-2 text-ink no-underline sm:gap-2.5"
      aria-label={toSchool ? `${APP_NAME}, ${school.shortName} listings` : `${APP_NAME} home`}
    >
      <PushPin className="size-[19px] shrink-0 sm:size-[22px]" />
      <span className="font-display text-[17px] font-extrabold tracking-[-0.015em] whitespace-nowrap sm:text-[19px]">
        {APP_NAME}
      </span>
      {school && (
        <span className="hidden rounded-[3px] bg-school px-1.5 pt-[3px] pb-[2px] font-display text-[12px] font-extrabold tracking-[0.06em] text-on-school uppercase lg:inline">
          {school.shortName}
        </span>
      )}
    </Link>
  );
}

// The brand mark: a red push pin seen from above at an angle.
function PushPin({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path d="M12 13.5 12 22" stroke="#6b6058" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="12" cy="8.5" r="6.5" fill="#d23a2e" />
      <circle cx="12" cy="8.5" r="6.5" fill="none" stroke="#9e2219" strokeOpacity=".55" />
      <circle cx="9.6" cy="6.2" r="1.8" fill="#fff" fillOpacity=".8" />
    </svg>
  );
}
