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
- Don't add stock photography of "clients" or "staff" to represent this real
  organization — there's no licensed photography of the actual business on hand; a real
  photo requires the client's own, not a stand-in
