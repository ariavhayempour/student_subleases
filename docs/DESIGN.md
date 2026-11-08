---
name: Student Subleases
description: The student-union corkboard, online. Flyers pinned to cork, every school passing on printed packing tape.
colors:
  school: "#1a1410"
  school-deep: "#000000"
  on-school: "#ffffff"
  school-secondary: "#ffffff"
  on-school-secondary: "#1a1410"
  school-highlight: "#1a1410"
  on-school-highlight: "#ffffff"
  school-tint: "#f4f1ec"
  school-link: "#1a1410"
  ink: "#1a1410"
  ink-2: "#463a30"
  ink-3: "#6b6058"
  line: "#e4e0da"
  line-2: "#cfc8bf"
  surface-2: "#f7f5f2"
  paper: "#ffffff"
  ok: "#1d6b3a"
  ok-bg: "#e6f2ea"
  warn: "#7a4f00"
  warn-bg: "#fff3d1"
  bad: "#a4161a"
  bad-bg: "#fbe9e9"
  cork: "#c08552"
  alu-1: "#e6e8eb"
  alu-2: "#c3c7cc"
  alu-edge: "#9aa0a7"
  wall: "#2f4858"
  sticky: "#ffe36e"
  masking-tape: "rgb(238 228 200 / 0.82)"
  pin-red: "#d23a2e"
  pin-blue: "#2a5bd7"
  pin-yellow: "#f2c230"
  pin-green: "#2e9a57"
typography:
  display:
    fontFamily: "Bricolage Grotesque, sans-serif"
    fontSize: "clamp(2.7rem, 6.3vw, 5.8rem)"
    fontWeight: 800
    lineHeight: 0.9
    letterSpacing: "-0.01em"
    fontVariation: "'wdth' 78"
  headline:
    fontFamily: "Bricolage Grotesque, sans-serif"
    fontSize: "clamp(2.2rem, 4.4vw, 3.6rem)"
    fontWeight: 800
    lineHeight: 0.98
    letterSpacing: "-0.02em"
  page-title:
    fontFamily: "Bricolage Grotesque, sans-serif"
    fontSize: "clamp(1.9rem, 3.4vw, 2.75rem)"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Bricolage Grotesque, sans-serif"
    fontSize: "1.375rem"
    fontWeight: 800
    lineHeight: 1.25
    letterSpacing: "-0.015em"
  price:
    fontFamily: "Bricolage Grotesque, sans-serif"
    fontSize: "30px"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.02em"
    fontFeature: "'tnum'"
  tape:
    fontFamily: "Bricolage Grotesque, sans-serif"
    fontSize: "21px"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "0.04em"
  body:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.5
  body-reading:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.75
  label:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 700
    lineHeight: 1
  tag:
    fontFamily: "Bricolage Grotesque, sans-serif"
    fontSize: "11.5px"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "0.06em"
  scribble:
    fontFamily: "Gochi Hand, cursive"
    fontSize: "22px"
    fontWeight: 400
    lineHeight: 1.05
rounded:
  tag: "3px"
  card: "4px"
  control: "5px"
  photo: "6px"
  bubble: "12px"
  full: "9999px"
spacing:
  gutter-sm: "16px"
  gutter-md: "24px"
  gutter-lg: "32px"
  card-sm: "12px"
  card: "20px"
  sheet-top: "28px"
  sheet-bottom: "64px"
  section: "104px"
  container: "80rem"
  container-landing: "77.5rem"
  reading: "70ch"
components:
  button-primary:
    backgroundColor: "{colors.school}"
    textColor: "{colors.on-school}"
    rounded: "{rounded.control}"
    padding: "0 16px"
    height: "40px"
  button-primary-hover:
    backgroundColor: "{colors.school-deep}"
  button-ink:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.control}"
    padding: "0 16px"
    height: "40px"
  button-highlight:
    backgroundColor: "{colors.school-highlight}"
    textColor: "{colors.on-school-highlight}"
    rounded: "{rounded.control}"
    height: "40px"
  button-outline:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    height: "40px"
  button-outline-hover:
    backgroundColor: "{colors.surface-2}"
  button-destructive:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.bad}"
    rounded: "{rounded.control}"
    height: "40px"
  button-destructive-hover:
    backgroundColor: "{colors.bad-bg}"
  button-link:
    textColor: "{colors.school-link}"
  input:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "4px 12px"
    height: "42px"
  label:
    textColor: "{colors.ink}"
    typography: "{typography.label}"
  card:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "{spacing.card}"
  tag-neutral:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.ink-2}"
    typography: "{typography.tag}"
    rounded: "{rounded.tag}"
  tag-new:
    backgroundColor: "{colors.school-highlight}"
    textColor: "{colors.on-school-highlight}"
    typography: "{typography.tag}"
    rounded: "{rounded.tag}"
  chip-filter:
    backgroundColor: "{colors.school-tint}"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    height: "32px"
  message-sent:
    backgroundColor: "{colors.school}"
    textColor: "{colors.on-school}"
    padding: "10px 14px"
  message-received:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.ink}"
    padding: "10px 14px"
  avatar:
    backgroundColor: "{colors.school}"
    textColor: "{colors.on-school}"
    rounded: "{rounded.full}"
    size: "36px"
  school-tape:
    backgroundColor: "{colors.school}"
    textColor: "{colors.school-secondary}"
    typography: "{typography.tape}"
    height: "68px"
---

# Design System: Student Subleases

## Overview

**Creative North Star: "The Union Board"**

The site is the corkboard in a student union, where sublets have always been posted. The landing and the top of every page are the board: a cork field framed in brushed aluminum, with white paper sheets held on by push pins and masking tape, tilted a degree or two the way real flyers hang. Every school passes across the board on a band of printed packing tape in its own colors. Under the board sits a clean white working sheet, where everything a visitor operates (filters, the map, forms, chat) lives flat, upright, and quiet.

The materials are honest and few: cork, aluminum, paper, pins, tape, one painted cinderblock wall, one sticky note. Type is a flyer voice (Bricolage Grotesque at weight 800, narrowed to all-caps for flyer headlines) over a calm UI sans (Hanken Grotesk). Neutrals are warm so they sit with cork and paper. Density is moderate: the board is expressive and roomy, the working sheet is a desktop-first tool with tight, legible rows.

The world was chosen against the dark hero with glows, the split hero with a badge row, and stacked icon-card sections. School identity is carried by color only, never by logos, seals, or mascots.

**Key Characteristics:**
- Two zones: the board (cork, pins, tape, tilt) and the working sheet (white, flat, untilted).
- Aluminum header and footer on every page, regardless of school.
- School color travels on packing tape and on interactive state, never on the board materials.
- Warm ink neutrals throughout; soft, warm-brown physical shadows.
- Motion is physical and brief (tape unrolls, sheets pin on and settle) and switches off entirely under reduced motion.

## Colors

A warm, physical palette of cork, aluminum, and paper, with one per-school color system layered on top for tape and interaction.

### Primary
- **School Primary** (`school`, neutral fallback Warm Ink): the school's main color, set per page from the `schools.theme` data (UW–Madison #C5050C, Michigan #00274C, UCLA #2774AE, SDSU #A6192E). Fills the packing tape, primary buttons, active nav bars, filter chip hover, the unread count, the account avatar, sent messages, term bars, focus rings, and text selection. `school-deep` is its hover.
- **School Secondary** (`school-secondary`): the color printed on the tape (the school name) and the focus ring color inside school-colored regions (Michigan and UCLA maize, white for Wisconsin and SDSU).

### Secondary
- **School Highlight** (`school-highlight`): the "Same months" match mark and NEW tags on listing photos (maize for Michigan and UCLA; charcoal for Wisconsin, black for SDSU; ink when neutral).
- **School Tint** (`school-tint`): selected rows, active filter chips, checked option chips, and the term chart sheet.
- **School Link** (`school-link`): inline links and the link button on white.

### Tertiary (board materials)
- **Corkboard Tan** (`cork`): the board field, always drawn with its three-layer SVG granule texture, never flat.
- **Brushed Aluminum** (`alu-1` to `alu-2`, edged by `alu-edge`): the frame: header, footer, and the strip above the wall.
- **Painted Cinderblock** (`wall`): one wall, behind the landing's posting policy only.
- **Sticky Yellow** (`sticky`): the one sticky note.
- **Masking Tape** (`masking-tape`): translucent cream strips at the corners of a taped sheet.
- **Pin Red, Blue, Yellow, Green** (`pin-*`): push-pin heads. Red is the default and the brand mark's pin.

### Neutral
- **Warm Ink** (`ink`): all primary text, the ink button, the admin sidebar.
- **Walnut** (`ink-2`): secondary text, descriptions, metadata.
- **Driftwood** (`ink-3`): placeholders, timeline month labels, input hover borders.
- **Paper White** (`paper`): sheets, the working sheet, cards, inputs.
- **Oat** (`surface-2`): muted fills, received messages, neutral tags, photo placeholders.
- **Rule** (`line`) and **Strong Rule** (`line-2`): dividers and card rings; input and outline-button borders.
- **Status** (`ok`, `warn`, `bad`, each with a `-bg`): status tags and notices; `bad` is the destructive color.

### Named Rules
**The Tape Carries the School Rule.** School color appears on printed packing tape (the landing tape, the school-page tape band, flat strips on school cards) and on interactive state: primary buttons, active states, the avatar, sent messages, term bars. The cork, the paper, the pins, and the aluminum header never take school color.

**The Warm Ink Rule.** Every neutral is warm-shifted to sit with cork and paper. New grays come from the ink and line families, not from a cool gray scale.

**The Colors-Only Rule.** A school is identified by its colors and its name, never by a logo, seal, or mascot. Every `on-*` pairing must pass WCAG AA before a school ships.

## Typography

**Display Font:** Bricolage Grotesque (variable, `opsz` and `wdth` axes), via `--font-display`
**Body Font:** Hanken Grotesk (with system-ui), via `--font-sans`
**Scribble Font:** Gochi Hand (not preloaded), via `--font-scribble`
**Mono:** Geist Mono, for code-like values only

**Character:** Bricolage at 800 is the flyer: loud, a little quirky, hand-set; narrowed to width 78 and set in caps it becomes the poster headline. Hanken Grotesk is the even, readable desk voice beneath it.

### Hierarchy
- **Display** (flyer caps: 800, width 78, uppercase, up to 5.8rem, 0.9): flyer headlines only: the landing hero, the closing flyer, the sign-in flyer, the posting policy.
- **Headline** (800, up to 3.6rem, 0.98, -0.02em): landing section headings on pinned sheets and on the wall.
- **Page Title** (800, up to 2.75rem, 1): the title on the pinned sheet in each page's board band, sentence case.
- **Title** (800, 1.375rem to 1.6rem, tight): card titles and reading-page section headings.
- **Price** (800, 30px, tabular figures): rent on listing tiles; display face also sets school names and tape text.
- **Body** (400, 15px, 1.5): UI and working-sheet text. Reading pages step up to 16px with 1.75 line height in a 70ch column.
- **Label** (700, 13px): form labels. The landing's fill-in lines use a 12.5px uppercase label at 0.08em.
- **Tag** (Bricolage 800, 11.5px, 0.06em, uppercase): status tags, NEW, the sample-listing label, timeline block labels.
- **Scribble** (Gochi Hand 400, 22px): the sticky note.

### Named Rules
**The Flyer Voice Rule.** Narrowed all-caps (flyer caps) belongs to flyers on the board. Page titles, section heads, and anything on the working sheet use Bricolage in sentence case.

**The One Sticky Note Rule.** Gochi Hand appears only on a sticky note, as decoration. It never sets body copy, UI, or a heading.

## Layout

The page is a vertical stack: aluminum header (64px), the board band, the white working sheet, aluminum footer. Containers are centered at 80rem with 16px, 24px, and 32px gutters at the base, `sm`, and `lg` breakpoints; the landing runs a slightly narrower 77.5rem. The working sheet pads 20px to 28px on top and 48px to 64px below, and sits over the band with a soft upward shadow so it reads as the sheet the board is pinned above. Full-bleed layouts (browse list beside map, messages) drop the container and fill the sheet.

The landing alternates cork sections (72px to 104px vertical padding) holding one pinned heading sheet each, then an aluminum strip, the cinderblock wall, a plain warm-white FAQ, and a final cork flyer. Packing tape always runs wider than the viewport (106% to 112%) at a slight angle so its ends leave the frame.

Desktop-first and responsive to phone width: tilts flatten to 0deg below `sm`, header nav collapses to a menu below `md`, the board-band aside hides below `lg`, and Messages becomes icon-only on phones. Admin is desktop-only with its own ink sidebar.

### Named Rules
**The Board and the Sheet Rule.** Cork, pins, tape, and tilt belong to the board: landing sections and the title band at the top of each page (including a pinned aside note in that band). Inside the white working sheet there is no cork, no pin, and no rotation.

## Elevation & Depth

Depth is physical. Paper casts a soft, warm-brown shadow onto the cork, pins cast a small offset shadow with an inner shade, tape has a glossy sheen and a drop shadow, and the aluminum header casts a short shadow down onto the board. On the working sheet, surfaces are flat and separated by rings and rules; shadow appears only on hover lift (school cards, the ink button) and on popovers.

### Shadow Vocabulary
- **Paper on cork** (`box-shadow: 0 1px 1px rgb(40 20 5 / 0.18), 0 14px 22px -12px rgb(40 20 5 / 0.55)`): every pinned or taped sheet.
- **Pin** (`box-shadow: inset -2px -3px 4px rgb(0 0 0 / 0.28), 3px 5px 5px -1px rgb(30 15 5 / 0.45)`): push-pin heads.
- **Packing tape** (`box-shadow: 0 2px 3px rgb(40 20 5 / 0.28), 0 12px 20px -10px rgb(40 20 5 / 0.55)`): school tape bands, plus a screen-blended gloss overlay.
- **Frame drop** (`box-shadow: 0 6px 10px -6px rgb(40 20 5 / 0.45)`): the aluminum header onto the page.
- **Sheet lip** (`box-shadow: 0 -6px 14px -8px rgb(40 20 5 / 0.45)`): the working sheet's top edge over the band.
- **Popover** (`box-shadow: 0 10px 30px -8px rgb(40 20 5 / 0.35)`): the account menu and similar floating panels.
- **Hover lift** (`box-shadow: 0 6px 14px -8px rgb(26 20 16 / 0.7)` with a 1px rise): the ink button.

### Named Rules
**The Soft Shadow Rule.** Shadows are warm brown, blurred, and physically plausible. No hard offset shadows, no colored glows.

## Shapes

Corners are barely softened, like trimmed paper and cut tape: 3px for tags and tape marks, 4px for cards and the menu, 5px for every control (buttons, inputs, selects, option chips), 6px for listing photos. Pills (full radius) are reserved for the active-filter chips, the avatar, and counts; chat bubbles are 12px with a 4px tail corner toward the sender. Paper sheets are square-cornered. Controls carry a 1.5px border; the landing's flyer fill-in lines are a bare 2px ink underline instead of a box.

## Components

### Buttons
Firm, flat, and bold (700 weight), with a 1px press-down on active.
- **Shape:** gently squared (5px), 1.5px border; heights 40px default, 36px small, 48px large.
- **Primary (`default`):** school fill with on-school text; hovers to school-deep.
- **Ink:** the board's own black button (Post a listing, Create free account, the landing's flyer actions); hover rises 1px with a warm shadow.
- **Highlight:** school highlight fill for a celebratory secondary action.
- **Outline:** white with a strong-rule border; hover darkens the border to Driftwood and fills Oat.
- **Ghost / Secondary:** Oat on hover or at rest; for low-emphasis actions.
- **Destructive:** outlined, not filled: white with a translucent red border and red text; hover fills `bad-bg`.
- **Link:** school-link text, underlined, underline drops on hover.
- **Focus:** a 3px school-color outline at 2px offset; inside school-colored regions the ring switches to the school secondary.

### Chips
- **Active filters:** 32px pills in school tint with a faint school ring, each with a round remove control that fills school color on hover.
- **Option chips (forms):** 5px boxes with a 1.5px strong-rule border; checked turns the border school and the fill school tint.

### Cards / Containers
- **Corner Style:** 4px.
- **Background:** Paper White, with a 1px Rule ring instead of a shadow; footers sit on Oat.
- **Internal Padding:** 20px (12px for the small size).
- **Listing tile:** no box at all: a 4:3 photo (6px corners, slow 1.035 zoom on hover), then price, title, facts, distance and dates, and a compact term timeline.
- **School cards (/schools, onboarding):** a flat strip of school tape across the top (no gloss, no shadow), then name and city; hover darkens the border and lifts with a soft shadow.

### Inputs / Fields
- **Style:** 42px, white, 1.5px strong-rule border, 5px corners; hover darkens the border to Driftwood.
- **Focus:** border turns school color with a 3px translucent school ring.
- **Native selects:** the same box with a drawn Walnut chevron.
- **Error / Disabled:** red border and ring; disabled at half opacity.

### Navigation
- **Header:** brushed aluminum, 64px, on every page. Left, the push-pin wordmark in Bricolage 800 with a small school-color name tag on wide screens. Right, Hanken 14.5px semibold ink links that brighten on hover; the current page goes extra-bold with a 4px school-color bar along its bottom edge. Post a listing is the ink button; the account avatar is a school-color initials disc.
- **Footer:** the matching aluminum strip with semibold ink links; hidden on Messages.
- **Admin:** an ink sidebar of its own; fonts and colors from this system, no board materials.

### Board Band (signature)
The top of every working page: a cork strip holding the page title on a pinned paper sheet (tilted -0.6deg from `sm` up), an optional back link and description on the sheet, and an optional pinned note to the side. On school pages a static band of packing tape runs beneath it, repeating the school's short name, city, and campus.

### School Tape (signature)
On the landing, full-bleed packing tape made of one segment per school (school primary fill, secondary name, on-primary city), angled about -1.4deg. It unrolls on load, then drifts at 100px per second, holding still under hover, focus, or touch; under reduced motion it is a static, wrapping row.

### Term Timeline and Term Chart
A twelve-month axis of three four-month blocks. Tiles show a 6px compact bar; the detail page shows a 32px bar with month labels. On the landing's term chart, the host's months are a solid school bar and the guest's are hatched school stripes; the bars grow in and a highlight "Same months" mark stamps on after them.

### Messages
Sent bubbles are school color with on-school text; received bubbles are Oat with a Rule border. The messages page uses a slim cork band with a small pinned title.

## Do's and Don'ts

### Do:
- **Do** keep cork, pins, masking tape, and tilt in the board: landing sections and the band at the top of each page.
- **Do** put everything a visitor operates on the white working sheet, flat and upright.
- **Do** carry school color on packing tape and on interactive state (primary buttons, active states, avatar, sent messages, term bars).
- **Do** use the ink button for the board's own actions (Post a listing, Create free account) and the school button for actions on the working sheet.
- **Do** draw cork with its granule texture and paper with the paper-on-cork shadow.
- **Do** label sample content as a sample, in a tag.
- **Do** switch all motion off under reduced motion; the tape becomes a static row.

### Don't:
- **Don't** put cork, a pin, or a rotation inside the working sheet.
- **Don't** paint the header, footer, cork, or paper in school color; the header is aluminum everywhere.
- **Don't** use a school logo, seal, or mascot.
- **Don't** use flyer caps or Gochi Hand outside the board.
- **Don't** use cool grays; take neutrals from the warm ink and line families.
- **Don't** use hard offset shadows or colored glows.
