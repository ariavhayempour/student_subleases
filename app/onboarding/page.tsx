import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { BoardBand, BoardWork } from '@/app/_components/board-band';
import { requireSignedIn } from '@/app/_lib/guards';
import { APP_NAME } from '@/lib/app-config';
import { safeReturnPath } from '@/lib/return-path';
import { listActiveSchools } from '@/server/services/schools';
import { getOnboardingState } from '@/server/services/users';
import { OnboardingForm } from './onboarding-form';

export const metadata: Metadata = { title: 'Welcome' };

export default async function OnboardingPage({ searchParams }: PageProps<'/onboarding'>) {
  const actor = await requireSignedIn();
  const returnPath = safeReturnPath((await searchParams).next);
  const state = await getOnboardingState(actor);
  if (!state.needsOnboarding && state.homeSchoolSlug) {
    redirect(returnPath ?? `/${state.homeSchoolSlug}`);
  }
  const schools = await listActiveSchools();
  return (
    <main className="flex flex-1 flex-col">
      <BoardBand
        title={`Welcome to ${APP_NAME}`}
        description={
          <>
            Pick your school to see subleases near campus. This is your home school: you&apos;ll see
            its listings and colors, and it can&apos;t be changed later.
          </>
        }
      />
      <BoardWork>
        <OnboardingForm schools={schools} returnPath={returnPath} />
      </BoardWork>
    </main>
  );
}
