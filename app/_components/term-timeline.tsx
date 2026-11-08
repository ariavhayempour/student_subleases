import { formatDateRange } from '@/lib/format';
import { termTimeline } from '@/lib/term-timeline';
import { cn } from '@/lib/utils';

type TermTimelineProps = {
  from: string;
  to: string;
  size?: 'compact' | 'full';
  // Shared across a page of cards so their bars compare; defaults to the stay's own start.
  axisStart?: string;
};

export function TermTimelineBar({ from, to, size = 'compact', axisStart }: TermTimelineProps) {
  const t = termTimeline(from, to, axisStart);
  const full = size === 'full';
  const labels = (
    <div className={cn('grid grid-cols-3 text-ink-3', full ? 'mb-2' : 'mt-1')} aria-hidden="true">
      {t.blocks.map((block) => (
        <span
          key={block.label}
          className={cn(
            'font-display leading-none font-extrabold tracking-[0.06em] uppercase',
            full ? 'text-[12.5px]' : 'text-[11px]',
            block.active && 'text-ink',
          )}
        >
          {block.label}
        </span>
      ))}
    </div>
  );
  return (
    <div role="img" aria-label={`Available ${formatDateRange(from, to)}`} className="mt-2">
      {full && labels}
      <div className={cn('relative grid grid-cols-3 gap-0.5', full ? 'h-8 gap-[3px]' : 'h-[6px]')}>
        {t.blocks.map((block) => (
          <i
            key={block.label}
            className={
              full
                ? 'rounded-[3px] bg-surface-2 ring-1 ring-line ring-inset'
                : 'rounded-[1px] bg-line'
            }
          />
        ))}
        <div
          className={cn(
            'absolute inset-y-0 bg-school',
            full ? 'rounded-[3px]' : 'rounded-[1px]',
            full &&
              'flex items-center justify-between gap-2 overflow-hidden px-2.5 text-xs font-semibold whitespace-nowrap text-on-school',
          )}
          style={{ left: `${t.leftPct}%`, width: `${t.widthPct}%` }}
        >
          {full && t.widthPct > 22 && (
            <span className="hidden sm:inline">{formatDateRange(from, to)}</span>
          )}
        </div>
      </div>
      {full ? (
        <div className="mt-1.5 grid grid-cols-12 text-xs text-ink-3" aria-hidden="true">
          {t.months.map((month, i) => (
            <span key={`${month}-${i}`}>{month}</span>
          ))}
        </div>
      ) : (
        labels
      )}
      {full && t.continues && (
        <p className="mt-1 text-xs text-ink-2">The stay continues past what this timeline shows.</p>
      )}
    </div>
  );
}
