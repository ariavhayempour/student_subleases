import { z } from 'zod';

export const CONTACT_NAME_MAX_LENGTH = 100;
export const CONTACT_MESSAGE_MIN_LENGTH = 10;
export const CONTACT_MESSAGE_MAX_LENGTH = 5000;
export const CONTACT_SCHOOL_MAX_LENGTH = 120;

export const CONTACT_TOPICS = [
  { value: 'general', label: 'General question' },
  { value: 'bug', label: 'Report a bug' },
  { value: 'account', label: 'Account or sign-in help' },
  { value: 'add-school', label: 'Add my school' },
] as const;

export type ContactTopic = (typeof CONTACT_TOPICS)[number]['value'];

export const DEFAULT_CONTACT_TOPIC: ContactTopic = 'general';

export function contactTopicLabel(topic: ContactTopic): string {
  return CONTACT_TOPICS.find((entry) => entry.value === topic)?.label ?? 'General question';
}

export function parseContactTopic(value: unknown): ContactTopic | null {
  return CONTACT_TOPICS.find((entry) => entry.value === value)?.value ?? null;
}

export const contactSchema = z
  .object({
    topic: z.enum(['general', 'bug', 'account', 'add-school'], { error: 'Choose a topic' }),
    school: z
      .string()
      .trim()
      .max(CONTACT_SCHOOL_MAX_LENGTH, 'School names can be up to 120 characters'),
    name: z
      .string()
      .trim()
      .min(1, 'Enter your name')
      .max(CONTACT_NAME_MAX_LENGTH, 'Names can be up to 100 characters'),
    email: z.string().trim().pipe(z.email('Enter a valid email address').max(254)),
    message: z
      .string()
      .trim()
      .min(CONTACT_MESSAGE_MIN_LENGTH, 'Write at least 10 characters')
      .max(CONTACT_MESSAGE_MAX_LENGTH, 'Messages can be up to 5,000 characters'),
  })
  .superRefine((value, ctx) => {
    if (value.topic === 'add-school' && value.school.length === 0) {
      ctx.addIssue({ code: 'custom', path: ['school'], message: 'Enter the school’s name' });
    }
  });

export type ContactInput = z.input<typeof contactSchema>;
export type ContactMessage = z.output<typeof contactSchema>;
