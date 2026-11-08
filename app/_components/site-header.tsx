import { Show, SignInButton, SignUpButton } from '@clerk/nextjs';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { AccountMenu } from '@/app/_components/account-menu';
import { AdminNavLink } from '@/app/_components/admin-nav-link';
import { HeaderBrand } from '@/app/_components/header-brand';
import { HEADER_LINK, HeaderNavLinks } from '@/app/_components/header-nav';
import { MessagesNavLink } from '@/app/_components/messages-nav-link';
import { SiteHeaderMenu } from '@/app/_components/site-header-menu';
import { Button } from '@/components/ui/button';

const signedOutLink =
  'flex h-10 items-center rounded-[5px] px-2.5 text-[14.5px] font-semibold text-ink no-underline hover:bg-white/35 hover:underline';

// The board's aluminum frame: brand left, navigation and account right.
export function SiteHeader() {
  return (
    <header className="alu relative z-30 border-b border-alu-edge shadow-[0_6px_10px_-6px_rgb(40_20_5/0.45)]">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:gap-5 sm:px-6 lg:px-8">
        <HeaderBrand />
        <Show when="signed-out">
          <nav className="flex items-center gap-1 sm:gap-2" aria-label="Account">
            <Link href="/" className={`${signedOutLink} hidden md:flex`}>
              Home
            </Link>
            <Link href="/schools" className={`${signedOutLink} hidden md:flex`}>
              Browse schools
            </Link>
            <Link href="/about" className={`${signedOutLink} hidden md:flex`}>
              How it works
            </Link>
            <Link href="/#faq" className={signedOutLink}>
              FAQ
            </Link>
            <SignInButton>
              <button type="button" className={`${signedOutLink} hidden cursor-pointer sm:flex`}>
                Sign in
              </button>
            </SignInButton>
            <SignUpButton>
              <Button variant="ink" className="ml-1 h-10 px-3.5 sm:h-[42px] sm:px-4">
                <span className="sm:hidden">Sign up</span>
                <span className="max-sm:hidden">Create free account</span>
              </Button>
            </SignUpButton>
          </nav>
        </Show>
        <Show when="signed-in">
          <nav className="flex h-full items-stretch gap-0.5" aria-label="Main">
            <div className="hidden items-stretch md:flex">
              <HeaderNavLinks />
              <AdminNavLink className={HEADER_LINK} />
            </div>
            <MessagesNavLink className={HEADER_LINK} />
            <div className="ml-1 flex items-center gap-2.5 sm:ml-2.5 sm:gap-3">
              <Button asChild variant="ink" className="hidden h-10 md:inline-flex">
                <Link href="/listings/new">
                  <Plus aria-hidden="true" />
                  Post a listing
                </Link>
              </Button>
              <SiteHeaderMenu className="md:hidden">
                <Link href="/listings/new">Post a listing</Link>
                <HeaderNavLinks variant="menu" />
                <AdminNavLink className="flex items-center gap-1.5 text-ink" />
              </SiteHeaderMenu>
              <AccountMenu />
            </div>
          </nav>
        </Show>
      </div>
    </header>
  );
}
