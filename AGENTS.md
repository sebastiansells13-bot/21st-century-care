# AGENTS.md

Instructions for AI coding assistants (Claude Code, Copilot, etc.) working in this repo.
This file describes **this specific client site**, cloned from `client-site-starter`.
Keep it up to date as the site diverges from the template.

## Commands

- **Dev**: `npm start` (runs Sass + Eleventy with hot reload at http://localhost:8080/;
  writes generated pages to `dev/`, serves images/CSS/fonts straight from `src/`, and
  cleans `dev/` and `docs/` on startup and shutdown)
- **Build**: `npm run build` (cleans output, compiles Sass, builds the Eleventy site with
  original, unoptimized media into `docs/`)
- **CI build**: `npm run build:ci` (GitHub Actions only — runs `npm run build`, then
  optimizes referenced images with `scripts/optimize-media.mjs`)

## Architecture

- **SSG**: Eleventy (11ty) v3, static output, no server runtime
- **Input**: `src/` — Markdown and Nunjucks (`.njk`) templates
- **Dev output**: `dev/` (generated pages only; removed when `npm start` stops)
- **Production output**: `docs/` (generated, not committed; built in CI, deployed via
  GitHub Actions to GitHub Pages)
- **Templates**: Nunjucks for layouts and pages; Markdown for blog posts
- **Styling**: Sass, compiled from `src/_includes/css/index.scss` to a content-hashed,
  cache-busted `index.<hash>.css` (see `assetPaths` in `eleventy.config.cjs`)
- **Content editing**: Pages CMS (`.pages.yml`) — the client edits structured content
  (posts, services, team members) through a GitHub-authenticated web UI with no code
  exposure. See `CMS-GUIDE.md` for the client-facing walkthrough.
- **Data**: `src/_data/business.json` holds the client's name, tagline, contact info,
  and social links, taken from the client's print flyer. `phone`/`fax` are separate
  fields (not a single combined field) — reference `business.*` in templates rather
  than hardcoding these details.
- **No custom domain yet**: `CNAME` is empty and the site deploys to the GitHub Pages
  *project* URL (`https://sebastiansells13-bot.github.io/21st-century-care/`), so
  `pathPrefix` in `eleventy.config.cjs` is set to `/21st-century-care/` and the
  sitemap/robots/feed hostnames are hardcoded to that same project URL rather than
  using the sitemap plugin's `hostname` option (see the comment above that plugin call
  in `eleventy.config.cjs`). If the client buys a domain: set `CNAME`, switch
  `pathPrefix` back to `/`, and update those three hardcoded hostnames.
- **Deployment**: pushes to `main` build the site and deploy to GitHub Pages;
  pull requests run the build to catch errors but do not deploy.
- **Color palette**: three brand accents in `variables.scss` (`$color-accent` green,
  `$color-accent-blue`, `$color-accent-warm`) plus their pale `*-tint` backgrounds for
  section washes (`.section--tint-green/blue/warm`) — deliberately kept to these three
  plus a reserved `$color-safety` red used only by the crisis callout. Reuse these
  rather than introducing a fourth decorative hue.
- **Photo hero** (`.hero--photo` in `components.scss`, used by Home/Services/Contact):
  the `::before` overlay layers two radial glows (warm bottom-left, blue top-right)
  over the green→blue diagonal wash, so all three accents show on every photo
  regardless of that photo's own colors. `.hero__eyebrow` is the small pill label
  above the `<h1>` (translated via `data-i18n`, plain text only — see each page for
  its own label, e.g. "What We Offer"). `components/hero-wave.njk`, included at the
  end of every `.hero--photo` block, draws the bottom wave edge — its fill is a
  literal `#ffffff` (not a Sass variable, since it isn't compiled through Sass); keep
  it in sync if `$color-bg` ever stops being white. The plain (non-photo) `.hero`
  used by About/Services-category-intro/FAQ/Careers/Accessibility/Contact-details
  doesn't have a wave — only the three photo heroes do.
- **Service categories**: each entry in `src/_data/services.json` carries a
  `category` (Housing & Basic Needs / Health & Wellness / Skills & Independence /
  Community & Family — set in `.pages.yml` as a `creatable` select, so the client can
  add a new category from the CMS if needed). `services.njk` groups the flat list
  into one colored band per category via `services.list | groupby("category")` and
  the `tintClass` filter; the homepage keeps a flat `head(6)` slice instead of
  grouping, since it's only showing a preview.
- **Service icons**: `serviceIcon` filter (`eleventy.config.cjs`) maps a service title
  to an emoji by keyword, shown in a `.service-card__badge` circle that cycles through
  the three accent tints via `nth-child`. This is a stand-in for a real per-service
  icon/photo — if `service.icon` (the CMS's image field) is set, both `index.njk` and
  `services.njk` prefer that instead. Add a new keyword pair there before falling back
  to the generic "✨" for a service that doesn't match anything.
- **Crisis resources**: `components/crisis-callout.njk` (911 / 988 Suicide & Crisis
  Lifeline / SAMHSA National Helpline) is included on Services and Contact. This is
  general public-safety information, not claimed as 21st Century Care's own hotline —
  don't reword it to imply otherwise, and don't remove it without a reason beyond
  "the flyer didn't mention it" (it's standard duty-of-care content for a
  behavioral-health-adjacent site, independent of what's on the flyer).
- **Favicon/fonts**: `src/_includes/favicons/favicon.svg` (+ rasterized PNGs) is
  original artwork, not traced from the flyer's photographed logo — see CREDITS.md.
  Headings use Google Fonts "Poppins" (loaded in `base.njk`); body text stays the
  system font stack for performance.
- **Social share image**: `base.njk`'s Open Graph/Twitter tags default to the
  homepage hero photo; a page can override it with an `ogImage: /img/...` front-matter
  value (About/Services/Contact all do — see their own hero photo).
- **`siteUrl` vs. `siteOrigin`**: both are global data defined once in
  `eleventy.config.cjs` so the absolute GitHub Pages project URL isn't hardcoded
  separately in four files. `siteUrl` already includes the `/21st-century-care` path
  (use it standalone, e.g. `feed.njk`, `robots.txt.njk`). `siteOrigin` is the bare
  origin — use it only where it's combined with something already piped through the
  `url` filter (which adds the path prefix itself), e.g. `sitemap.xml.njk`'s
  `item.url | url` and `base.njk`'s `page.url | url` / `pageImage`. Using `siteUrl` in
  those spots doubles the path prefix — see the comment by `siteOrigin`'s definition.
- **FAQ / Testimonials**: CMS-editable data files (`src/_data/faq.json`,
  `src/_data/testimonials.json`, wired up in `.pages.yml` the same way as
  `services`/`team`) rendered by `src/faq.njk` and `components/testimonials.njk`
  (skipped entirely when `testimonials.list` is empty, same pattern as `team.list`).
- **Careers**: `src/careers.njk` is a plain static page (not CMS-managed) — its two
  sample listings are hardcoded. If the client wants to self-edit job openings later,
  follow "Adding a new content type to the CMS" below rather than editing the
  hardcoded cards in place.
- **Referral PDF**: `src/_includes/files/referral-form.pdf` is a fillable AcroForm
  PDF (built with reportlab — see the form-field code if it ever needs a field added)
  passed through to `/files/referral-form.pdf` (`eleventy.config.cjs`'s
  `src/_includes/files` → `files` passthrough copy). Linked from Contact's "How to
  Get Started" section.
- **Spanish-language toggle**: same architecture as the one on `julia-ketsaa-remax` —
  `src/_includes/js/i18n-runtime.js` (loads first; exposes `window.t(key)` /
  `window.i18nLang()` from the `#i18n-data` JSON island in `base.njk`) and
  `src/_includes/js/i18n.js` (loads second; applies `[data-i18n]` text replacement
  and `[data-i18n-lang]` show/hide to the DOM, and powers the EN/ES buttons in the
  header) power the toggle, backed by the flat dictionary at `src/_data/i18n.json`.
  The choice persists per visitor via `localStorage`.
  - **What gets translated**: this site's own static chrome and hardcoded template
    copy — nav, footer, buttons, the Home/About/Services/FAQ/Careers/Accessibility/404
    pages' headings and prose, the "How to Get Started" steps, the crisis callout, and
    the insurance info block.
  - **What does NOT get translated, by design**: anything edited through the CMS
    (the services list, FAQ answers, team bios, testimonials, blog posts) or the
    Careers page's two sample job listings — there's no translation pipeline for
    content that changes as often as those do, so it stays in whatever language it
    was written in, same as any real i18n setup with a single-language content
    source. This means service **category names** (CMS data) stay English even
    when a visitor switches to Spanish — a known, accepted limitation, not a bug.
  - **Markup contract**: `data-i18n="key"` on an element with ONLY text as its
    child replaces its `textContent` — never put it on an element that also has a
    nested tag (a link, `<strong>`, etc.), since that would delete the nested tag.
    For a string that needs an embedded link/`<strong>`/interpolated
    `business.*` value, use the `bilingual(en, es, tag, isSafe)` macro
    (`macros/bilingual.njk`) instead — it renders full `en`/`es` HTML as sibling
    elements and toggles which one is visible via `data-i18n-lang` +
    `hidden`, rather than doing a text-only swap. See `crisis-callout.njk` or
    `insurance-info.njk` for the pattern, and `business.taglineEs` for how a
    `business.json` field gets an optional `*Es` sibling instead of a dictionary
    entry.
  - **`.sample-tag` disclaimers are never translated** (no `data-i18n`, always
    shown in English) — they're an editorial note for whoever manages the site,
    not real content for a visitor to read in their preferred language.
  - Reuse an existing key (`nav.services`, `cta.getDirections`, etc.) before adding
    a new one for the same word.

## Code style

- 2-space indentation, LF line endings, trim trailing whitespace, UTF-8 (per `.editorconfig`)
- Template formats: `.md`, `.njk`, `.html`
- Dates: UTC, Luxon filters `readableDate` (display) / `htmlDateString` (machine-readable)
- Passthrough assets live under `src/_includes/{img,favicons}`; don't reference images
  from anywhere else or the build won't copy them
- Don't hardcode content that a non-technical client might want to change — put it in
  `src/_data/` or a Pages CMS collection instead

## Adding a new page

1. Create `src/<page-name>.njk` with front matter `layout: layouts/page.njk`
2. Add it to `src/_data/navigation.json` if it belongs in the nav
3. If the client should be able to edit its content, add a matching entry to `.pages.yml`

## Adding a new content type to the CMS

1. Add a `collection` block to `.pages.yml` (see the `posts` entry as a template)
2. Create the corresponding Nunjucks layout under `src/_includes/layouts/`
3. Add a listing/index template if the content type needs its own index page
4. Document the new field set in `CMS-GUIDE.md` in plain language for the client

## Needs client review before this site is shared as "the real thing"

At the client's request, several sections were built out and populated with
**fictitious, clearly-placeholder content** so the finished shape of the site could
be seen before real information exists. Every one of these is flagged in the UI
with a `.sample-tag` (a dashed, muted-red note — see `components.scss`) and/or an
explicit comment in the relevant file. **Do not let any of the following be mistaken
for real information about this business without the client confirming it first:**

- **Team** (`src/_data/team.json`) — "Maria Gonzales," "James Whitfield," and
  "Destiny Ortiz" are invented names with invented bios. Their "photos" are
  generated initial-avatar SVGs (`src/_includes/img/team/avatar-*.svg`), not real
  photographs of anyone — deliberately, so nothing on the site could be mistaken
  for a real person's likeness. Replace with real staff (or leave `team.list`
  empty) once the client provides names/roles/bios/photos.
- **Testimonials** (`src/_data/testimonials.json`) — both quotes are invented,
  attributed only to "Program participant" (never a fake full name). Replace with
  real, consented client feedback, or leave `testimonials.list` empty — the
  homepage already skips the section when it's empty.
- **Hours** (`business.hours` in `business.json`) — Monday–Friday 8–5 is a
  generic placeholder, not confirmed with the client.
- **Insurance & Payment** (`components/insurance-info.njk`) — the Turquoise
  Care/Centennial Care rename is a verified public fact (New Mexico's Medicaid
  managed care program was renamed effective 7/1/24), but which specific managed
  care plan(s) this business is actually contracted with is NOT stated as fact —
  it's left as an explicit bracketed prompt for the client to fill in. Don't turn
  that bracket into an assertion without the client confirming it.
- **Careers listings** (`src/careers.njk`) — "Community Support Worker" and
  "Certified Peer Support Specialist" are sample job postings, not confirmed open
  positions.
- **Social handles** (`business.social` in `business.json`) — "21stcenturycarenm"
  (Instagram) and "21stCenturyCareNM" (Facebook) are placeholder handles chosen to
  be unlikely to collide with an unrelated real account, but they are NOT verified
  to belong to this business. Confirm the client's actual handles (or that these
  don't already belong to someone else) before treating the footer icons as real,
  working links.
- **Email address** (`business.email`) — `info@21stcenturycarenm.com` is invented;
  the original flyer had no email address at all.
- **"How to Get Started" steps** (`components/get-started-steps.njk`) and the
  **FAQ answers** (`src/_data/faq.json`) — reasonable, generically-correct
  restatements of how CCSS/PSS work, but not confirmed against this specific
  business's actual intake process, hours, or policies (e.g. the FAQ's
  confidentiality answer is a standard boilerplate, not a reviewed legal
  statement).

## What NOT to do

- Don't commit `dev/` or `docs/` — both are build output
- Don't add a runtime backend/server — this is a static site by design
- Don't remove the `assetPaths` content-hashing — it's what makes the CDN cache safe
  to set far-future/immutable
- Don't add a contact-form backend or claim the contact form is "connected" until one
  is actually wired up — the form markup in `contact.njk` stays commented out
  (per METHODOLOGY.md in `client-site-starter`) until then
- Don't add a photo that reads as a specific real client or staff member of this
  business — the landscape photos (see CREDITS.md) and the team avatars (see
  "Needs client review" above) were both deliberately chosen to avoid that. A photo
  of an actual person representing "our client" or "our staff" requires the
  client's own, consented photography, not a stock stand-in
- Don't quietly turn any item in "Needs client review" above into unflagged,
  presented-as-fact content — if a fictitious value gets replaced with a real one,
  remove its `.sample-tag`/flag in the same change; if it's still a placeholder,
  keep the flag
