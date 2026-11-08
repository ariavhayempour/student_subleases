'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Check } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { schoolThemeStyle } from '@/lib/school-theme';
import { onboardingSchema, type OnboardingInput } from '@/lib/validation/onboarding';
import type { SchoolSummary } from '@/server/services/schools';
import { completeOnboardingAction } from './actions';

export function OnboardingForm({
  schools,
  returnPath,
}: {
  schools: SchoolSummary[];
  returnPath: string | null;
}) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<OnboardingInput>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: { homeSchoolId: '' },
  });

  async function onSubmit(values: OnboardingInput) {
    const result = await completeOnboardingAction(values, returnPath);
    if (result.ok) return;
    const message = result.error.fieldErrors?.homeSchoolId?.[0];
    if (message) setError('homeSchoolId', { message });
    else setError('root', { message: result.error.message });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-2" noValidate>
      <h2
        id="home-school-label"
        className="font-display text-[22px] leading-tight font-extrabold tracking-[-0.01em] text-ink"
      >
        Home school
      </h2>
      <div
        role="radiogroup"
        aria-labelledby="home-school-label"
        aria-invalid={Boolean(errors.homeSchoolId)}
        aria-describedby={errors.homeSchoolId ? 'homeSchoolId-error' : undefined}
        className="mt-4 grid max-w-5xl gap-4 md:grid-cols-3"
      >
        {schools.map((school) => (
          <label
            key={school.id}
            style={schoolThemeStyle(school.theme)}
            className="group relative block cursor-pointer overflow-hidden rounded-md border-[1.5px] border-line-2 bg-white transition-[transform,box-shadow,border-color] duration-300 ease-out-expo hover:-translate-y-0.5 hover:border-ink-3 hover:shadow-[0_10px_22px_-12px_rgb(40_20_5/0.45)] has-[:checked]:border-ink has-[:checked]:shadow-[0_0_0_1.5px_var(--ink),0_10px_22px_-12px_rgb(40_20_5/0.45)] has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ink"
          >
            <input
              type="radio"
              value={school.id}
              className="absolute inset-0 z-10 cursor-pointer opacity-0"
              {...register('homeSchoolId')}
            />
            <span
              aria-hidden="true"
              className="packing-tape flex h-14 items-center bg-school shadow-none after:hidden px-5 font-display text-[22px] font-extrabold tracking-[0.04em] text-school-secondary uppercase"
            >
              {school.shortName}
            </span>
            <span className="flex min-h-24 flex-col px-5 pt-4 pb-5 pr-14 text-ink">
              <span className="text-[15px] font-bold">{school.name}</span>
              {school.city && <span className="mt-0.5 text-sm text-ink-2">{school.city}</span>}
              <span className="mt-0.5 text-sm text-ink-2">Near {school.campusName}</span>
            </span>
            <span
              aria-hidden="true"
              className="absolute right-4 bottom-5 grid size-7 place-items-center rounded-full border-2 border-line-2 group-has-[:checked]:border-transparent group-has-[:checked]:bg-ink group-has-[:checked]:text-white"
            >
              <Check className="hidden size-4 group-has-[:checked]:block" strokeWidth={3} />
            </span>
          </label>
        ))}
      </div>
      {errors.homeSchoolId && (
        <p id="homeSchoolId-error" className="mt-3 text-sm font-medium text-bad">
          {errors.homeSchoolId.message}
        </p>
      )}
      {errors.root && <p className="mt-3 text-sm font-medium text-bad">{errors.root.message}</p>}
      <div className="mt-8 flex flex-wrap items-center gap-4">
        <Button type="submit" variant="ink" size="lg" disabled={isSubmitting}>
          Continue
        </Button>
        <p className="text-sm text-ink-2">You can&apos;t switch schools after this step.</p>
      </div>
    </form>
  );
}
