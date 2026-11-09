import { SignUpButton } from '@clerk/nextjs';
import { Lock, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type MessageHostButtonProps = {
  listingId: string;
  conversationId: string | null;
  signedIn: boolean;
  crossSchool: boolean;
};

const buttonClass = cn(buttonVariants({ size: 'lg' }), 'w-full text-[15.5px]');

export function MessageHostButton({
  listingId,
  conversationId,
  signedIn,
  crossSchool,
}: MessageHostButtonProps) {
  if (!signedIn) {
    return (
      <SignUpButton mode="redirect">
        <button type="button" className={buttonClass}>
          <Lock aria-hidden="true" />
          Sign in to message host
        </button>
      </SignUpButton>
    );
  }
  if (crossSchool) {
    return (
      <button type="button" disabled className={buttonClass}>
        <Lock aria-hidden="true" />
        Message host
      </button>
    );
  }
  return (
    <Link
      href={conversationId ? `/messages/${conversationId}` : `/messages/new?listing=${listingId}`}
      className={buttonClass}
    >
      <MessageSquare aria-hidden="true" />
      {conversationId ? 'View conversation' : 'Message host'}
    </Link>
  );
}
