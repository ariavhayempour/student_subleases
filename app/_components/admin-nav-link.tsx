import { CurrentLink } from '@/app/_components/header-nav';
import { getActor } from '@/server/auth/get-actor';
import { getAdminCounts } from '@/server/services/admin-listings';

export async function AdminNavLink({ className }: { className?: string }) {
  const actor = await getActor();
  if (actor.kind !== 'user' || !actor.isAdmin) return null;
  const { pendingListings, openReports } = await getAdminCounts(actor);
  const total = pendingListings + openReports;
  return (
    <CurrentLink
      href="/admin"
      prefetch={false}
      aria-label={total > 0 ? `Admin, ${total} to review` : undefined}
      className={className}
    >
      Admin
      {total > 0 && (
        <span
          aria-hidden="true"
          className="grid h-5 min-w-5 place-items-center rounded-full bg-school px-1.5 text-[12px] font-extrabold text-on-school tabular-nums"
        >
          {total}
        </span>
      )}
    </CurrentLink>
  );
}
