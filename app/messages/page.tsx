import { MessagesSquare } from 'lucide-react';

export default function MessagesIndexPage() {
  return (
    <div className="hidden h-full flex-col items-center justify-center gap-3 px-6 text-center md:flex">
      <MessagesSquare aria-hidden="true" className="size-8 text-ink-2" />
      <p className="font-display text-[18px] font-extrabold text-ink">Select a conversation</p>
      <p className="max-w-[34ch] text-sm text-ink-2">
        Your conversations with hosts and renters show up on the left.
      </p>
    </div>
  );
}
