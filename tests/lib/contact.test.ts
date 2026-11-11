import { describe, expect, it, vi } from 'vitest';
import { APP_NAME } from '@/lib/app-config';
import { contactPayload, submitContactMessage, WEB3FORMS_ENDPOINT } from '@/lib/contact';
import { contactSchema, parseContactTopic, type ContactMessage } from '@/lib/validation/contact';

const message: ContactMessage = {
  topic: 'general',
  school: '',
  name: 'Ada L.',
  email: 'ada@example.edu',
  message: 'Is there a way to edit my school?',
};

function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

describe('contactSchema', () => {
  it('trims fields and accepts a valid message', () => {
    const parsed = contactSchema.parse({
      topic: 'general',
      school: '',
      name: '  Ada L. ',
      email: ' ada@example.edu ',
      message: '  Is there a way to edit my school?  ',
    });
    expect(parsed).toEqual(message);
  });

  it('rejects a missing name, a bad email, and a too-short message', () => {
    const result = contactSchema.safeParse({
      topic: 'general',
      school: '',
      name: '   ',
      email: 'nope',
      message: 'hi',
    });
    expect(result.success).toBe(false);
    const fields = result.error?.flatten().fieldErrors;
    expect(fields?.name).toEqual(['Enter your name']);
    expect(fields?.email).toEqual(['Enter a valid email address']);
    expect(fields?.message).toEqual(['Write at least 10 characters']);
  });

  it('rejects an unknown topic', () => {
    const result = contactSchema.safeParse({ ...message, topic: 'press' });
    expect(result.success).toBe(false);
    expect(result.error?.flatten().fieldErrors.topic).toEqual(['Choose a topic']);
  });

  it('needs a school name only when asking to add a school', () => {
    const missing = contactSchema.safeParse({ ...message, topic: 'add-school', school: '  ' });
    expect(missing.error?.flatten().fieldErrors.school).toEqual(['Enter the school’s name']);
    expect(contactSchema.safeParse({ ...message, topic: 'bug', school: '' }).success).toBe(true);
    expect(
      contactSchema.parse({ ...message, topic: 'add-school', school: ' Ohio State ' }).school,
    ).toBe('Ohio State');
  });

  it('accepts 150 words and rejects 151', () => {
    const words = (n: number) => Array.from({ length: n }, () => 'word').join(' \n ');
    expect(contactSchema.safeParse({ ...message, message: words(150) }).success).toBe(true);
    const result = contactSchema.safeParse({ ...message, message: words(151) });
    expect(result.error?.flatten().fieldErrors.message).toEqual([
      'Messages can be up to 150 words',
    ]);
  });

  it('rejects a message over 5,000 characters', () => {
    const result = contactSchema.safeParse({ ...message, message: 'a'.repeat(5001) });
    expect(result.success).toBe(false);
  });
});

describe('parseContactTopic', () => {
  it('accepts known topics and rejects anything else', () => {
    expect(parseContactTopic('add-school')).toBe('add-school');
    expect(parseContactTopic('bug')).toBe('bug');
    expect(parseContactTopic('press')).toBeNull();
    expect(parseContactTopic(['bug'])).toBeNull();
    expect(parseContactTopic(undefined)).toBeNull();
  });
});

describe('contactPayload', () => {
  it('sends the access key, the captcha token, a topic subject, and the visitor fields', () => {
    expect(contactPayload(message, 'key-123', 'tok')).toEqual({
      access_key: 'key-123',
      'h-captcha-response': 'tok',
      subject: `General question: new message from the ${APP_NAME} contact form`,
      from_name: APP_NAME,
      topic: 'General question',
      name: 'Ada L.',
      email: 'ada@example.edu',
      message: 'Is there a way to edit my school?',
    });
  });

  it('labels bug reports and includes the school only for school requests', () => {
    const bug = contactPayload({ ...message, topic: 'bug', school: 'ignored' }, 'k', 't');
    expect(bug.subject).toBe(`Report a bug: new message from the ${APP_NAME} contact form`);
    expect(bug).not.toHaveProperty('school');
    const school = contactPayload(
      { ...message, topic: 'add-school', school: 'Ohio State' },
      'k',
      't',
    );
    expect(school).toMatchObject({ topic: 'Add my school', school: 'Ohio State' });
  });
});

describe('submitContactMessage', () => {
  it('posts JSON to Web3Forms and succeeds on success: true', async () => {
    const fetchImpl = vi.fn<typeof fetch>(async () => jsonResponse(200, { success: true }));
    await expect(submitContactMessage(message, 'tok', 'key-123', fetchImpl)).resolves.toEqual({
      ok: true,
    });
    const [url, init] = fetchImpl.mock.calls[0]!;
    expect(url).toBe(WEB3FORMS_ENDPOINT);
    expect(init?.method).toBe('POST');
    expect(JSON.parse(String(init?.body))).toMatchObject({
      access_key: 'key-123',
      'h-captcha-response': 'tok',
      name: 'Ada L.',
    });
  });

  it('refuses without an access key and never calls the network', async () => {
    const fetchImpl = vi.fn<typeof fetch>();
    const result = await submitContactMessage(message, 'tok', '', fetchImpl);
    expect(result).toEqual({ ok: false, message: 'The contact form is not set up yet.' });
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it('fails on success: false, on a rate limit, on non-JSON, and on a network error', async () => {
    const cases: Array<() => Promise<Response>> = [
      async () => jsonResponse(400, { success: false, message: 'Invalid access key' }),
      async () => jsonResponse(200, { success: false }),
      async () => jsonResponse(429, { success: false }),
      async () => new Response('<html>oops</html>', { status: 500 }),
      async () => {
        throw new TypeError('Failed to fetch');
      },
    ];
    for (const respond of cases) {
      const result = await submitContactMessage(
        message,
        'tok',
        'key-123',
        vi.fn<typeof fetch>(respond),
      );
      expect(result.ok).toBe(false);
    }
  });

  it('explains a rate limit', async () => {
    const result = await submitContactMessage(
      message,
      'tok',
      'key-123',
      vi.fn<typeof fetch>(async () => jsonResponse(429, { success: false })),
    );
    expect(result).toEqual({
      ok: false,
      message: 'Too many messages were sent. Please try again later.',
    });
  });
});
