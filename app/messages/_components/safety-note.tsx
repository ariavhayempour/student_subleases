import { ShieldAlert } from 'lucide-react';
import { SAFETY_NOTICE } from '@/lib/messaging-options';

export function SafetyNote() {
  return (
    <p className="mx-3 mt-3 flex items-start gap-2.5 rounded-md bg-warn-bg px-3.5 py-2.5 text-[13.5px] font-semibold text-warn sm:mx-5 sm:mt-3.5">
      <ShieldAlert aria-hidden="true" className="mt-px size-[17px] shrink-0" />
      <span>{SAFETY_NOTICE}</span>
    </p>
  );
}
