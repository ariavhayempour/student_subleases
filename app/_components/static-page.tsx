import type { ReactNode } from 'react';
import { BoardBand, BoardWork } from '@/app/_components/board-band';

type StaticPageProps = {
  title: string;
  description?: ReactNode;
  lastUpdated?: string;
  children: ReactNode;
};

// About, Terms, Privacy, Contact: a pinned title over a white reading sheet.
export function StaticPage({ title, description, lastUpdated, children }: StaticPageProps) {
  return (
    <main className="flex flex-1 flex-col">
      <BoardBand
        title={title}
        description={lastUpdated ? `Last updated ${lastUpdated}` : description}
        pin="blue"
      />
      <BoardWork>
        <div className="max-w-[70ch] space-y-4 text-[16px] leading-7 text-ink [&_a]:font-semibold [&_a]:text-school-link [&_a]:underline [&_h2]:pt-6 [&_h2]:font-display [&_h2]:text-[1.6rem] [&_h2]:leading-tight [&_h2]:font-extrabold [&_h2]:tracking-[-0.015em] [&_li]:mt-1 [&_li]:pl-1 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-6 [&_ul]:marker:text-ink-3">
          {children}
        </div>
      </BoardWork>
    </main>
  );
}
