'use client';

import { actionErrorMessage } from '@/app/_lib/action-message';
import { SignUpButton } from '@clerk/nextjs';
import { Heart } from 'lucide-react';
import { useState, useTransition } from 'react';
import { setFavoriteAction } from '@/app/me/favorites/actions';
import { cn } from '@/lib/utils';

type FavoriteButtonProps = {
  listingId: string;
  listingTitle: string;
  initialFavorited: boolean;
  signedIn: boolean;
  withText?: boolean;
  className?: string;
};

const baseClass =
  'inline-flex cursor-pointer items-center justify-center gap-2 text-sm font-bold text-ink transition-colors disabled:opacity-60';
const iconClass =
  'size-9 rounded-full bg-white/95 shadow-[0_2px_6px_rgb(0_0_0/0.18)] hover:bg-white';
// The labeled variant matches the outline button it sits beside on the listing page.
const textClass =
  'h-12 w-full rounded-[5px] border-[1.5px] border-line-2 bg-white px-5 text-[15px] hover:border-ink-3 hover:bg-surface-2';

export function FavoriteButton({
  listingId,
  listingTitle,
  initialFavorited,
  signedIn,
  withText = false,
  className,
}: FavoriteButtonProps) {
  const [favorited, setFavorited] = useState(initialFavorited);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const buttonClass = cn(baseClass, withText ? textClass : iconClass);
  const icon = (
    <Heart
      aria-hidden
      className={cn(withText ? 'size-4' : 'size-[18px]', favorited && 'fill-school text-school')}
    />
  );
  const label = favorited ? `Remove “${listingTitle}” from saved` : `Save “${listingTitle}”`;
  const text = withText && <span>{favorited ? 'Saved' : 'Save'}</span>;

  if (!signedIn) {
    return (
      <SignUpButton mode="redirect">
        <button type="button" aria-label={label} className={cn(buttonClass, className)}>
          {icon}
          {text}
        </button>
      </SignUpButton>
    );
  }

  function toggle() {
    const next = !favorited;
    setFavorited(next);
    setError(null);
    startTransition(async () => {
      const result = await setFavoriteAction(listingId, next).catch(() => null);
      if (!result?.ok) {
        setFavorited(!next);
        setError(actionErrorMessage(result, 'Could not update your saved listings. Try again.'));
      }
    });
  }

  return (
    <span
      className={cn(
        withText ? 'flex flex-col items-stretch gap-1' : 'relative inline-flex',
        className,
      )}
    >
      <button
        type="button"
        onClick={toggle}
        disabled={pending}
        aria-label={label}
        className={buttonClass}
      >
        {icon}
        {text}
      </button>
      {error && (
        <span
          role="alert"
          className={cn(
            'text-xs text-destructive',
            !withText &&
              'absolute top-full right-0 z-10 mt-1 w-44 rounded-[5px] bg-white px-2 py-1 shadow-sm ring-1 ring-line',
          )}
        >
          {error}
        </span>
      )}
    </span>
  );
}
