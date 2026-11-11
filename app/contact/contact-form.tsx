'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  ArrowRight,
  Bug,
  CircleHelp,
  GraduationCap,
  Info,
  KeyRound,
  type LucideIcon,
} from 'lucide-react';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { submitContactMessage } from '@/lib/contact';
import { cooldownRemaining, recordContactSent } from '@/lib/contact-cooldown';
import {
  CONTACT_MESSAGE_MAX_LENGTH,
  CONTACT_MESSAGE_MAX_WORDS,
  CONTACT_NAME_MAX_LENGTH,
  CONTACT_SCHOOL_MAX_LENGTH,
  CONTACT_TOPICS,
  contactSchema,
  countWords,
  DEFAULT_CONTACT_TOPIC,
  type ContactInput,
  type ContactMessage,
  type ContactTopic,
} from '@/lib/validation/contact';
import { HCaptchaWidget } from './hcaptcha-widget';

const TOPIC_DETAILS: Record<
  ContactTopic,
  { icon: LucideIcon; blurb: string; hint: string; placeholder: string }
> = {
  general: {
    icon: CircleHelp,
    blurb: 'Anything about how the site works',
    hint: 'Ask us anything about posting, browsing, or messaging.',
    placeholder: 'How can we help?',
  },
  bug: {
    icon: Bug,
    blurb: 'Something is broken or not working',
    hint: 'Tell us the page you were on, what you tried, and what happened. Your browser and device help too.',
    placeholder: 'On the browse page, the map didn’t load after I…',
  },
  account: {
    icon: KeyRound,
    blurb: 'Signing in, your email, deleting an account',
    hint: 'Use the email you signed up with so we can find your account. Never send your password.',
    placeholder: 'I can’t sign in with…',
  },
  'add-school': {
    icon: GraduationCap,
    blurb: 'Ask us to open a new school',
    hint: 'Tell us the school’s full name. We open new schools as students ask for them.',
    placeholder: 'Anything else we should know about subleasing near your campus?',
  },
};

const FIELD_LABEL = 'text-[13px] font-bold text-ink';
const FIELD_ERROR = 'text-[13.5px] font-bold text-bad';

function browserStorage(): Storage | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function ContactForm({
  defaultTopic = DEFAULT_CONTACT_TOPIC,
}: {
  defaultTopic?: ContactTopic;
}) {
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [botcheck, setBotcheck] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaReset, setCaptchaReset] = useState(0);
  const {
    register,
    handleSubmit,
    setError,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput, unknown, ContactMessage>({
    resolver: zodResolver(contactSchema),
    defaultValues: { topic: defaultTopic, school: '', name: '', email: '', message: '' },
  });
  const topic = useWatch({ control, name: 'topic' });
  const messageWords = countWords(useWatch({ control, name: 'message' }) ?? '');

  async function onSubmit(values: ContactMessage) {
    // Honeypot: only bots fill the hidden field, so pretend success without sending.
    if (botcheck) {
      reset();
      setSentTo(values.email);
      return;
    }
    const storage = browserStorage();
    if (cooldownRemaining(storage) > 0) {
      setError('root', { message: 'Please wait a minute before sending another message.' });
      return;
    }
    if (!captchaToken) {
      setError('root', { message: 'Complete the check above to send your message.' });
      return;
    }
    const result = await submitContactMessage(values, captchaToken);
    // Tokens are single-use, so every attempt needs a fresh check.
    setCaptchaToken(null);
    setCaptchaReset((count) => count + 1);
    if (!result.ok) {
      setError('root', { message: result.message });
      return;
    }
    recordContactSent(storage);
    reset({ topic: values.topic, school: '', name: '', email: '', message: '' });
    setSentTo(values.email);
  }

  if (sentTo) {
    return (
      <div
        role="status"
        className="rounded-md border border-ok/25 bg-ok-bg p-6 text-ok shadow-[0_12px_26px_-20px_rgb(40_20_5/0.55)]"
      >
        <p className="font-display text-[20px] font-extrabold">Thanks, your message was sent.</p>
        <p className="mt-1 text-ink-2">We will reply to {sentTo}.</p>
        <Button variant="outline" className="mt-4" onClick={() => setSentTo(null)}>
          Send another message
        </Button>
      </div>
    );
  }

  const details = TOPIC_DETAILS[topic ?? DEFAULT_CONTACT_TOPIC];

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid gap-5 rounded-md border border-line bg-white p-[18px] shadow-[0_12px_26px_-20px_rgb(40_20_5/0.55)] sm:p-[26px]"
      noValidate
    >
      <fieldset>
        <legend className={`${FIELD_LABEL} mb-2.5`}>
          What&apos;s this about? <span className="font-medium text-ink-2">Required</span>
        </legend>
        <div className="grid gap-2.5 sm:grid-cols-2">
          {CONTACT_TOPICS.map((entry) => {
            const Icon = TOPIC_DETAILS[entry.value].icon;
            return (
              <label
                key={entry.value}
                className="group grid cursor-pointer grid-cols-[36px_1fr] items-center gap-x-3 gap-y-0.5 rounded-md border-[1.5px] border-line-2 px-3.5 py-[13px] transition-[border-color,background-color,box-shadow] hover:border-ink-3 has-checked:border-ink has-checked:bg-surface-2 has-checked:shadow-[inset_0_0_0_1px_var(--ink)] has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-ink"
              >
                <input
                  type="radio"
                  value={entry.value}
                  aria-labelledby={`topic-${entry.value}`}
                  aria-describedby={`topic-${entry.value}-blurb`}
                  className="sr-only"
                  {...register('topic')}
                />
                <span className="row-span-2 grid size-9 place-items-center rounded-md bg-surface-2 text-ink transition-colors group-has-checked:bg-ink group-has-checked:text-white">
                  <Icon aria-hidden="true" className="size-[18px]" />
                </span>
                <b id={`topic-${entry.value}`} className="text-[14.5px]">
                  {entry.label}
                </b>
                <small
                  id={`topic-${entry.value}-blurb`}
                  className="text-[12.5px] leading-snug text-ink-2"
                >
                  {TOPIC_DETAILS[entry.value].blurb}
                </small>
              </label>
            );
          })}
        </div>
        <p className="mt-2.5 flex gap-2 text-[13.5px] text-ink-2" aria-live="polite">
          <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          {details.hint}
        </p>
        {errors.topic && <p className={`mt-2 ${FIELD_ERROR}`}>{errors.topic.message}</p>}
      </fieldset>
      {topic === 'add-school' && (
        <div className="grid gap-1.5">
          <Label htmlFor="contact-school" className={FIELD_LABEL}>
            School name
          </Label>
          <Input
            id="contact-school"
            placeholder="e.g. University of Texas at Austin"
            maxLength={CONTACT_SCHOOL_MAX_LENGTH}
            aria-invalid={Boolean(errors.school)}
            aria-describedby={errors.school ? 'contact-school-error' : undefined}
            {...register('school')}
          />
          {errors.school && (
            <p id="contact-school-error" className={FIELD_ERROR}>
              {errors.school.message}
            </p>
          )}
        </div>
      )}
      <div className="grid gap-5 sm:grid-cols-2 sm:gap-4">
        <div className="grid content-start gap-1.5">
          <Label htmlFor="contact-name" className={FIELD_LABEL}>
            Name
          </Label>
          <Input
            id="contact-name"
            autoComplete="name"
            maxLength={CONTACT_NAME_MAX_LENGTH}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'contact-name-error' : undefined}
            {...register('name')}
          />
          {errors.name && (
            <p id="contact-name-error" className={FIELD_ERROR}>
              {errors.name.message}
            </p>
          )}
        </div>
        <div className="grid content-start gap-1.5">
          <Label htmlFor="contact-email" className={FIELD_LABEL}>
            Email
          </Label>
          <Input
            id="contact-email"
            type="email"
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'contact-email-error' : undefined}
            {...register('email')}
          />
          {errors.email && (
            <p id="contact-email-error" className={FIELD_ERROR}>
              {errors.email.message}
            </p>
          )}
        </div>
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="contact-message" className={FIELD_LABEL}>
          Message
        </Label>
        <textarea
          id="contact-message"
          rows={6}
          maxLength={CONTACT_MESSAGE_MAX_LENGTH}
          placeholder={details.placeholder}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={
            errors.message ? 'contact-message-error contact-message-count' : 'contact-message-count'
          }
          className="min-h-[150px] w-full resize-y rounded-[5px] border-[1.5px] border-line-2 bg-white px-3 py-2.5 text-base leading-normal text-ink transition-[border-color,box-shadow] outline-none placeholder:text-ink-3 hover:border-ink-3 focus-visible:border-school focus-visible:ring-3 focus-visible:ring-school/20 aria-invalid:border-bad md:text-[15px]"
          {...register('message')}
        />
        <div className="flex items-start justify-between gap-3">
          {errors.message ? (
            <p id="contact-message-error" className={FIELD_ERROR}>
              {errors.message.message}
            </p>
          ) : (
            <span />
          )}
          <span
            id="contact-message-count"
            className={`shrink-0 text-[12px] tabular-nums ${
              messageWords > CONTACT_MESSAGE_MAX_WORDS ? 'font-bold text-bad' : 'text-ink-2'
            }`}
          >
            {messageWords} / {CONTACT_MESSAGE_MAX_WORDS} words
          </span>
        </div>
      </div>
      <input
        type="checkbox"
        name="botcheck"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
        checked={botcheck}
        onChange={(event) => setBotcheck(event.target.checked)}
      />
      <HCaptchaWidget onToken={setCaptchaToken} resetSignal={captchaReset} />
      {errors.root && (
        <p role="alert" className={FIELD_ERROR}>
          {errors.root.message}
        </p>
      )}
      <div className="flex flex-wrap items-center gap-4">
        <Button
          type="submit"
          variant="ink"
          className="h-12 px-[22px] text-[15.5px]"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Sending…' : 'Send message'}
          {!isSubmitting && <ArrowRight aria-hidden="true" />}
        </Button>
        <p className="text-[13.5px] text-ink-2">We&apos;ll reply to the email you enter.</p>
      </div>
    </form>
  );
}
