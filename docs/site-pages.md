# Site pages, footer, and search-engine files

Public static pages, the site footer, the contact form, and `robots.txt` / `sitemap.xml`.

## Pages

| Route      | File                   | Notes                                                         |
| ---------- | ---------------------- | ------------------------------------------------------------- |
| `/schools` | `app/schools/page.tsx` | Every active school as a colored block linking to `/{school}` |
| `/about`   | `app/about/page.tsx`   | How the site works, safety tips, non-affiliation              |
| `/terms`   | `app/terms/page.tsx`   | Terms of Use; dated "Last updated"                            |
| `/privacy` | `app/privacy/page.tsx` | Privacy Policy; dated "Last updated"                          |
| `/contact` | `app/contact/page.tsx` | Web3Forms contact form (`contact-form.tsx`)                   |

All five are public and indexable. `/schools` reads `listActiveSchools()`; the landing page's
"Browse a school" link, the signed-out header, the footer, and the signed-out "All schools" link
in a school page's band point to it. They render per request, because the root layout reads the
request path to pick the school colors (see `design-system.md`). They share `app/_components/static-page.tsx` (title,
optional "Last updated" line (all but `/schools`), and prose styling for `h2`, `p`, `ul`, `a`). The slugs are already
in `lib/reserved-slugs.ts`, so no school can take them.

**Policy copy** covers what the spec requires the Terms and Privacy Policy to disclose, and the
owner chose an 18+ minimum age. The copy is a plain-language draft, not legal advice: have it
reviewed before launch, and update the "Last updated" date with every change. When behaviour changes
(what is stored, who sees it, what deletion removes, which providers are used), update
`app/privacy/page.tsx` in the same PR. The safety tip and the "Deleted user" label are read from
`lib/messaging-options.ts` so they match the messaging UI.

## Canonical URLs

The root layout sets `metadataBase` from `siteUrl()`, so relative metadata URLs
(such as canonical) resolve to absolute ones, and Next does not warn at build about a missing
`metadataBase`. `/`, the five static pages, and
`/{school}` each set `alternates.canonical` to their own path; `/{school}` drops the query string,
so filtered views do not compete with the bare browse page. Tested in `tests/app/canonical.test.ts`
and `e2e/public.spec.ts`.

## Footer

`app/_components/site-footer.tsx` is mounted in the root layout after the page and pinned to the
bottom with `mt-auto` (the body is a flex column). It links the four pages and states the site is
free, student-only, and not affiliated with any university. Its first link is Schools.

**Signed-out header:** Schools and How it works links (desktop), plus Sign in and Sign up. The
brand always links to `/` for signed-out visitors, even on a school page; signed in, it links to
the current school (`header-brand.tsx`, via Clerk `useAuth`).

It renders nothing on `/messages` and `/messages/*`: that screen is sized to exactly the viewport
below the header and its stripe (`h-[calc(100dvh-4.5rem)]`), so a footer would make the whole page scroll. That is
why the footer is a client component (`usePathname`).

## Contact form (Web3Forms)

The spec planned a `mailto:` link because a form "would need email sending". The owner chose
[Web3Forms](https://docs.web3forms.com) instead: the browser posts JSON to
`https://api.web3forms.com/submit`, and Web3Forms emails the message to the address tied to the
access key. No server code, dependency, or environment variable is involved.

- **Browser-only.** Web3Forms' free plan rejects server-side submissions, so `submitContactMessage`
  (`lib/contact.ts`) runs in the client component. The access key is therefore public by design;
  it is the `WEB3FORMS_ACCESS_KEY` constant in `lib/contact.ts`, the same in every environment
  (so local and preview submissions also reach the owner's inbox). Messages go to the email the key
  was created with; change that in the Web3Forms dashboard, or swap the key. With an empty key the
  form refuses to send and says it is not set up.
- **Topics:** a required choice from `CONTACT_TOPICS` in `lib/validation/contact.ts`: General
  question (`general`, preselected), Report a bug (`bug`), Account or sign-in help (`account`), and
  Add my school (`add-school`). Add my school shows a required **School name** field (1–120). A
  link can preselect a topic with `/contact?topic=<value>`; the landing page's and `/schools`'
  "Tell us" links use `?topic=add-school`. Unknown values fall back to General question
  (`parseContactTopic`). Reports about a specific listing, message, or user still belong in the
  Report option on that item, and the page says so.
- **Validation:** `lib/validation/contact.ts` (topic, school name when adding a school, name 1–100,
  email, message 10–5,000; all trimmed), used by the form through `zodResolver`.
- **Payload:** `access_key`, `h-captcha-response`, a `subject` that starts with the topic label
  (`Report a bug: new message from the … contact form`), `from_name` naming `APP_NAME`, the `topic`
  label, `school` (only for Add my school), and the visitor's `name`, `email` (Web3Forms uses it as
  reply-to), and `message`. Web3Forms emails every field, so the topic shows in the inbox.
- **Spam:**
  - **hCaptcha** (`app/contact/hcaptcha-widget.tsx`): loaded from `js.hcaptcha.com` with
    `render=explicit&onload=onHCaptchaLoad` (no npm package) and rendered with Web3Forms' free
    sitekey (`HCAPTCHA_SITEKEY`). Web3Forms verifies the token only once hCaptcha is enabled for
    the form in its dashboard (see `launch-checklist.md`). Tokens are single-use: the widget resets
    after every send attempt. Sending without a token shows "Complete the check above to send your
    message."
  - **Cooldown** (`lib/contact-cooldown.ts`): after a successful send, another send within 60
    seconds shows "Please wait a minute before sending another message." It lives in
    `localStorage`, so it only deters casual resubmits; with storage unavailable there is none.
  - **Honeypot:** a hidden `botcheck` checkbox. If it is ticked, the form shows success without
    sending.
- **Local development:** hCaptcha refuses `localhost`. To try the real form, open
  `http://127.0.0.1:3000/contact` (`next.config.ts` allows that dev origin). E2E stubs the
  hCaptcha script instead.
- **Failures:** network errors, HTTP 429, non-JSON responses, and `success: false` all show an
  inline error; the form keeps what was typed.
- **Privacy:** Web3Forms and hCaptcha are listed as providers in the Privacy Policy.
- **Abuse reports** go through the in-app Report options, not this form; the page says so.

## robots.txt and sitemap.xml

`app/robots.ts` and `app/sitemap.ts` (Next.js metadata routes). Absolute URLs come from
`NEXT_PUBLIC_SITE_URL` through `siteUrl()` (`lib/site-url.ts`), which strips a trailing slash and
falls back to `http://localhost:3000` when unset.

- **robots.txt** allows everything except signed-in and admin routes: `/admin`, `/messages`,
  `/onboarding`, `/settings` (each as an exact `$` match plus a `/` subtree, so a future school slug
  such as `/messages-university` is not blocked), and the prefixes `/api/`, `/listings/` (create
  and edit), and `/me/`.
- **Listing pages are not disallowed.** They are kept out of search results by their `noindex` meta
  tag, and a crawler can only read that tag if it may fetch the page. Disallowing them could still
  let their bare URLs be indexed from outside links.
- **sitemap.xml** lists `/`, every active school's browse page, and the five static pages. It has
  no listing URLs. It reads schools from the database, so it is `force-dynamic` (rendered
  per request) to keep `next build` free of a database dependency.

Vercel adds `X-Robots-Tag: noindex` to every preview deployment, so the same robots file is safe in
every environment. Exception: if a custom domain (e.g. a staging subdomain) is ever assigned to a
non-production branch, Vercel omits that header and staging must add its own `noindex`.

## Tests

- `tests/lib/contact.test.ts`: schema (topics, the school name rule), `parseContactTopic`, payload,
  and every failure path of `submitContactMessage` with a fake `fetch`.
- `tests/lib/terms.test.ts`: the landing search's term list (`upcomingTerms`).
- `tests/lib/site-url.test.ts`: `siteUrl()`.
- `tests/app/robots-sitemap.test.ts`: blocked and allowed paths (with a small robots matcher) and
  the sitemap against the seeded schools.
- `e2e/static-pages.spec.ts`: pages and footer links, robots/sitemap over HTTP, and the contact
  form with the Web3Forms request intercepted (no real email is sent) and the hCaptcha script
  stubbed: token and topic in the payload, a fresh token after a failed send, the cooldown, the
  unsolved check, and `?topic=add-school` preselecting the topic and requiring a school name.
- `e2e/public.spec.ts`: the landing headline, the tape linking to a school, and the landing search
  opening a school filtered to a term (or unfiltered for Any dates).
- `tests/lib/contact-cooldown.test.ts`: the cooldown countdown and unavailable storage.

## Landing page (`/`)

`app/page.tsx` is the signed-out landing page, drawn as the **Union Board**: a corkboard with
pinned paper (see `docs/design-system.md`). Signed-in users never see it: students who still need
onboarding go to `/onboarding`, everyone else with a home school goes to `/{school}`.

Sections, top to bottom:

1. **Hero** (cork): the main flyer with **Sublet near campus.**, the lede, and the search
   (`LandingSearch`), beside a pinned sample listing print. Under them runs the school tape.
2. **Every term, someone leaves and someone arrives.** A pinned sheet with the term chart
   (`TermMatch`): Jan–Apr / May–Aug / Sep–Dec, a solid bar for a host away May–Aug and a hatched
   bar for a student who needs those months, and a **Same months** mark. School buttons recolor the
   sheet and redraw the bars.
3. **Like the board, but online.** A pinned printout of one school's browse page with sample
   listings, a sample conversation with the real safety notice, and an index card on filter, map,
   and message (`LandingPreview`). It uses Michigan when that school exists, otherwise the first
   school.
4. **Board rules.** On a painted cinderblock wall: the posting policy (students only, a short review
   period, free with no payments, unit number kept private).
5. **Questions, answered.** (`#faq`, linked from the header's **FAQ**): native `<details>`.
6. **Find a place, or fill yours.** The closing flyer with **Create your free account** (`/sign-up`)
   and "Don't see your school? Tell us" (`/contact?topic=add-school`).

Copy states only product facts; there are no counts or testimonials, and every sample listing or
person is labeled as a sample. Listings are never described as reviewed by a person or by a
deadline; the wording is "new listings go live after a short review period".

**Search** (`app/_components/landing-search.tsx`): a school select (every active school) and a
**When** select listing the current term and the two after it from `upcomingTerms()` in
`lib/terms.ts` (Spring Jan 1–Apr 30, Summer May 1–Aug 31, Fall Sep 1–Dec 31), plus **Any dates**.
It defaults to the next term. **Post or find a place** opens `/{school}?from=…&to=…`; the browse
page's date filter matches any listing whose dates overlap that range. Any dates opens `/{school}`.

**School tape** (`app/_components/school-tape.tsx`) lists every active school from
`listActiveSchools()`, so new schools appear without code changes. Each segment is a link to the
school's browse page in that school's primary color, with the name in its secondary color and the
city in its on-primary color (names are 19px+ bold so maize and gold pass AA as large text). The
list repeats until half the row covers a 2560px screen; the row then scrolls itself sideways at
100px/s and wraps at the halfway point, which makes the loop seamless. Only the first copy is in the
accessibility tree and tab order (repeats are `aria-hidden` with `tabIndex={-1}`, but stay
clickable). Motion stops while the pointer is over the tape, while anything in it has focus, during
a touch, and when the tab is hidden. The owner chose no Pause button (2026-11-07). Under
`prefers-reduced-motion` the tape shows one wrapping copy and never moves. The tape unrolls once on
load (`tape-unroll` in `app/globals.css`). It moves `scrollLeft` rather than a transform, so focus
and manual scrolling bring any segment into view.

**Reveals.** `LandingReveal` (`app/_components/landing-reveal.tsx`) finds every `[data-reveal]` block
after hydration and, for blocks still below the fold, sets `data-reveal="armed"` (sheets wait
slightly above their spot, transparent, in `app/globals.css`), then `"in"` when the block scrolls
into view, so each sheet settles onto the board. The term chart's bars draw in and the **Same
months** mark lands last. Blocks already on screen are left alone, nothing is armed under
`prefers-reduced-motion`, and without JavaScript every block renders finished. The term chart
replays on a school change by snapping to `data-reveal="reset"` and back to `"in"`.

**Images**: the sample photos are Unsplash photos saved as WebP in `public/landing/`, each with a
`.json` sidecar recording its source.
