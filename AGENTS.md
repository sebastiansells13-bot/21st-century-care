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

## What NOT to do

- Don't commit `dev/` or `docs/` — both are build output
- Don't add a runtime backend/server — this is a static site by design
- Don't remove the `assetPaths` content-hashing — it's what makes the CDN cache safe
  to set far-future/immutable
- Don't invent named staff/team members, testimonials, or outcome stats. The flyer this
  site is built from names no individual staff — `team.json` starts empty on purpose;
  leave it empty until the client supplies real names/roles/bios (About already skips
  the Team section when it's empty)
- Don't add a contact-form backend or claim the contact form is "connected" until one
  is actually wired up — the form markup in `contact.njk` stays commented out
  (per METHODOLOGY.md in `client-site-starter`) until then
- Don't add a photo that reads as a specific real client or staff member of this
  business — the photos currently on the site are all generic New Mexico landscape
  scenery (see CREDITS.md), chosen precisely to avoid that. A photo of an actual
  person representing "our client" or "our staff" requires the client's own,
  consented photography, not a stock stand-in
