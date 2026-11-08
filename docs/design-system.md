# Design system and school theming

The UI follows the **Union Board** direction (owner-approved 2026-11-07): the site is the
corkboard in a student union, where students have always posted sublet flyers. Marketing and page
titles are paper pinned or taped to cork inside an aluminum frame; everything a visitor operates
(filters, map, forms, chat) sits on a clean white working sheet. Each school's pages still wear that
school's colors, carried by a band of printed packing tape. Product facts and brand rules live in
`PRODUCT.md` (same folder); the visual system is recorded in `DESIGN.md`, and the landing's direction
contract in `.impeccable/surfaces/app-page-tsx.md`.

## School colors are data

`schools` carries the branding (migration `0009_school-branding.sql` adds the columns,
`0010_school-branding-seed.sql` fills the launch schools, `0013_seed-sdsu.sql` adds SDSU with its
branding in one `INSERT`):

| column        | use                                                                |
| ------------- | ------------------------------------------------------------------ |
| `short_name`  | the name on the school tape, header tag, and cards ("Michigan")    |
| `city`        | the tape's sub-line ("Ann Arbor, MI")                              |
| `campus_name` | distances read "to {campus_name}" ("the Diag")                     |
| `theme`       | jsonb, `SchoolTheme` in `lib/school-theme.ts` (validated with Zod) |

All four are nullable. A school added without them still works: `schoolBrand()` in
`server/services/schools.ts` falls back to the full name, "campus", and `NEUTRAL_THEME`, and a
malformed `theme` also falls back to neutral (tested in `tests/services/schools.test.ts`).

`SchoolTheme` fields: `primary` (the packing tape, primary buttons, active states, map pins, the
avatar, sent messages), `primaryDeep` (hover), `secondary` (the school name printed on the tape,
the active-chip mark), `highlight` (the "Same months" mark, NEW tags; Wisconsin uses charcoal),
`tint` (selected rows, the term chart sheet), `link`, and an `on*` text color for each fill. Every `on*`
pairing must pass WCAG AA; check new schools before adding them. No logos, seals, or mascots,
only colors.

Adding a school = one custom migration with the `INSERT` plus its branding values.

## Which school a page wears

`resolveThemeSchool()` (`lib/theme-school.ts`, tested in `tests/lib/theme-school.test.ts`):

1. A route whose first segment is a school slug (`/umich`, `/umich/listings/…`) wears that school.
2. `/admin/**` and the landing page `/` stay neutral (ink); the landing page dresses each segment of
   its school tape, its term chart, and its preview in a school's colors with `schoolThemeStyle`.
3. Anything else wears the signed-in viewer's home school; visitors without one get neutral.

The colors reach CSS as custom properties (`--school`, `--on-school`, `--school-secondary`,
`--school-highlight`, …) set on `<html>`:

- **First paint (server):** `proxy.ts` copies the request path into the `x-pathname` header
  (`lib/request-headers.ts`); the root layout's `getThemeContext()` (`app/_lib/theme-school.ts`)
  resolves the school and renders the style on `<html>`, so there is no flash of the wrong
  colors. Reading headers makes every page dynamically rendered, including the static pages.
- **Client navigation:** the root layout stays mounted across navigations, so
  `SchoolThemeProvider` (`app/_components/school-theme.tsx`) re-resolves on every path change
  and rewrites the properties. `useThemeSchool()` gives components the current school.

To make one element wear a specific school (onboarding cards, admin swatches), spread
`schoolThemeStyle(theme)` into its `style`.

## Tokens (`app/globals.css`)

Tailwind colors: `school`, `school-deep`, `on-school`, `school-secondary`, `on-school-secondary`,
`highlight`, `on-highlight`, `school-tint`, `school-link`, `ink`, `ink-2`, `ink-3`, `line`,
`line-2`, `surface-2`, `ok`/`warn`/`bad` (+ `-bg`), and the board materials `cork`, `sticky`,
`alu-edge`. Inks and rules are warm (`ink` #1a1410) so they sit with cork and paper. The shadcn
variables (`--primary`, `--ring`, `--border`, …) point at these, so stock components follow the
school.

Material classes (one CSS block in `globals.css`):

| class                                                         | what it draws                                                         |
| ------------------------------------------------------------- | --------------------------------------------------------------------- |
| `cork`                                                        | the corkboard: tan field with fine granules (SVG noise data URIs)     |
| `alu`                                                         | the brushed aluminum frame (header, footer, the strip above the wall) |
| `paper`                                                       | a white sheet with a soft drop shadow; `--r` tilts it                 |
| `pin` + `pin-red`/`-blue`/`-yellow`/`-green`                  | a push pin, placed with absolute utilities                            |
| `masking-tape`                                                | a translucent strip of tape; `--tr` angles it                         |
| `wall`                                                        | painted cinderblock in running bond (the landing's Board rules)       |
| `packing-tape`                                                | the glossy sheen over a band of school-colored tape                   |
| `board-display`                                               | Bricolage Grotesque 800, tight, for headings                          |
| `flyer-caps`                                                  | the flyer voice: Bricolage narrowed (`wdth` 78), all caps             |
| `scribble`                                                    | Gochi Hand, for the odd sticky note only                              |
| `select-chevron`                         | a drawn chevron for native selects (the post-a-listing form)          |
| `term-bar`, `term-bar-host`, `term-bar-guest`, `term-matched` | the term chart's bars and mark                                        |

Rules: cork, pins, tape, and tilt belong to the board (landing sections and the title band at the
top of each page). Inside the white working sheet there is no cork, no pin, and no rotation.
`on-school` still marks a school-colored region so focus rings switch to the secondary color.

Fonts (`next/font/google`, no package): **Bricolage Grotesque** (variable, optical-size and width
axes) for display, headings, prices, and school names, `--font-display`; **Hanken Grotesk** for body
and UI, `--font-sans`; **Gochi Hand** (not preloaded) for sticky-note scribbles, `--font-scribble`.

Motion (`globals.css`, all off under `prefers-reduced-motion`): `tape-unroll` (the landing tape),
`pin-on` (hero sheets pinning on), and the `[data-reveal]` armed/in states that settle sheets onto
the board as they scroll in.

## Shared components

| component                                 | what it is                                                                                          |
| ----------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `site-header.tsx` + `header-brand.tsx`    | the aluminum strip: push-pin wordmark (+ school tag on wide screens), nav, Post a listing, account  |
| `header-nav.tsx`                          | Browse, Saved, My listings, Settings; the current page gets `aria-current` and a school-color bar   |
| `messages-nav-link.tsx`                   | Messages with an unread count in the school color (icon only on phones)                             |
| `account-menu.tsx`                        | initials avatar in school colors: Settings, Clerk profile, Sign out (replaces Clerk's `UserButton`) |
| `site-footer.tsx`                         | the aluminum footer (hidden on `/messages`)                                                         |
| `board-band.tsx`: `BoardBand`             | the cork band at the top of a page with the title on a pinned sheet; optional back link and aside   |
| `board-band.tsx`: `SchoolTapeBand`        | static printed packing tape in a school's colors (school pages pass `school` to `BoardBand`)        |
| `board-band.tsx`: `BoardWork`             | the white working sheet under the band                                                              |
| `static-page.tsx`                         | About, Terms, Privacy, Contact: `BoardBand` + a reading column on `BoardWork`                       |
| `auth-shell.tsx`                          | sign-in and sign-up: a pinned flyer on cork beside Clerk's form                                     |
| `school-tape.tsx`                         | the landing's drifting school tape (see `site-pages.md`)                                            |
| `listing-tile.tsx`                        | photo (4:3), rent, facts, distance + dates, timeline                                                |
| `term-timeline.tsx` (`lib/term-timeline`) | the stay drawn to scale on a shared 12-month axis                                                   |
| `listing-badge.tsx` (`Tag`)               | status tags (Live, In review, Rejected: …)                                                          |
| `[school]/_components/active-filters.tsx` | one removable school-colored chip per active filter (`lib/active-filters.ts`)                       |

The timeline is a twelve-month axis of three four-month blocks (Jan–Apr, May–Aug, Sep–Dec), each
labeled with its year. Browse and Saved pass today's date as `axisStart`, so every card shares one
axis and bars compare; the listing and admin detail pages anchor the axis at the stay's own
move-in. Stays that start before or run past the axis are clamped (the detail page says so).

Cards show a NEW tag (highlight color) when the listing was approved within the last 7 days
(`ListingCard.isNew`, computed from `reviewed_at` in `server/services/listing-cards.ts`).

Buttons (`components/ui/button.tsx`): `default` (school), `ink` (the board's black button: Post a
listing, Create free account), `highlight`, `outline`, `ghost`, `destructive` (outlined in red),
`link`; 5px radius, 1.5px border; sizes default 40px, `sm` 36px, `lg` 48px. Inputs are 42px with a
1.5px `line-2` border and a school-colored focus ring.
