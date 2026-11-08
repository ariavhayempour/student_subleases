'use client';

import { useClerk, useUser } from '@clerk/nextjs';
import { LogOut, Settings, UserRound } from 'lucide-react';
import Link from 'next/link';
import { DropdownMenu } from 'radix-ui';

const ITEM =
  'flex cursor-pointer items-center gap-2.5 rounded-[4px] px-2.5 py-2 text-sm font-medium text-ink no-underline outline-none data-[highlighted]:bg-surface-2';

// Initials in the school's colors instead of Clerk's generated avatar, which ignores the palette.
export function AccountMenu() {
  const { user } = useUser();
  const { openUserProfile, signOut } = useClerk();
  const initials =
    [user?.firstName, user?.lastName]
      .map((name) => name?.trim()[0] ?? '')
      .join('')
      .toUpperCase() || '?';
  const name = user?.fullName ?? user?.primaryEmailAddress?.emailAddress ?? 'Your account';

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger
        aria-label="Account menu"
        className="grid size-9 place-items-center rounded-full bg-school font-display text-[14px] font-extrabold tracking-[0.03em] text-on-school shadow-[0_0_0_2px_rgb(255_255_255/0.7)] transition-shadow hover:shadow-[0_0_0_3px_rgb(255_255_255/0.9)]"
      >
        {initials}
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={10}
          className="z-50 w-60 rounded-[5px] border border-line bg-white p-1.5 shadow-[0_10px_30px_-8px_rgb(40_20_5/0.35)]"
        >
          <div className="px-2.5 pt-1.5 pb-2">
            <p className="truncate text-sm font-semibold text-ink">{name}</p>
            {user?.primaryEmailAddress && user.fullName && (
              <p className="truncate text-xs text-ink-2">{user.primaryEmailAddress.emailAddress}</p>
            )}
          </div>
          <DropdownMenu.Separator className="my-1 h-px bg-line" />
          <DropdownMenu.Item asChild className={ITEM}>
            <Link href="/settings">
              <Settings aria-hidden="true" className="size-4 text-ink-2" />
              Settings
            </Link>
          </DropdownMenu.Item>
          <DropdownMenu.Item className={ITEM} onSelect={() => openUserProfile()}>
            <UserRound aria-hidden="true" className="size-4 text-ink-2" />
            Name, email, and password
          </DropdownMenu.Item>
          <DropdownMenu.Separator className="my-1 h-px bg-line" />
          <DropdownMenu.Item className={ITEM} onSelect={() => void signOut({ redirectUrl: '/' })}>
            <LogOut aria-hidden="true" className="size-4 text-ink-2" />
            Sign out
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
