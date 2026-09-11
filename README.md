# 21st Century Care

Website for **21st Century Care**, a Comprehensive Community Support Services (CCSS)
and Peer Support Services (PSS) provider serving Medicaid recipients in Southern New
Mexico, out of Anthony, NM. Built from
[client-site-starter](https://github.com/sebastiansells13-bot/client-site-starter):
Eleventy (11ty) + Nunjucks, Pages CMS for non-technical content editing, and GitHub
Actions build/deploy to GitHub Pages.

**Live site:** https://sebastiansells13-bot.github.io/21st-century-care/

## ⚠️ Before sharing this site as "the real thing"

Several sections (Team, Testimonials, Hours, Insurance & Payment specifics, Careers
listings, social media handles, and the email address) currently hold **fictitious,
placeholder content**, added so the finished site could be reviewed end to end before
real information exists. Each is marked with a visible "sample" note on the page
itself. **See AGENTS.md's "Needs client review" section for the full list before
publicizing this site or its live URL to real prospective clients.**

## What's in here

- Content (business info, services list) taken from the client's print flyer — see
  `src/_data/business.json` and `src/_data/services.json`
- No custom domain yet, so the site deploys to a GitHub Pages *project* URL; see the
  "No custom domain yet" note in `AGENTS.md` for what needs to change once one is
  purchased
- A three-color accent palette (green/blue/warm terracotta, see `AGENTS.md`'s
  "Color palette"), four freely-licensed New Mexico landscape photos (one per main
  page), an emoji icon per service, and an original (not traced) favicon — see
  [CREDITS.md](CREDITS.md)
- Services grouped into four categories (Housing & Basic Needs, Health & Wellness,
  Skills & Independence, Community & Family) — see `AGENTS.md`'s "Service categories"
- An "In crisis right now?" callout (911 / 988 Lifeline / SAMHSA Helpline) on the
  Services and Contact pages — see `AGENTS.md`'s "Crisis resources" note before
  editing or removing it
- An FAQ page, a "How to Get Started" walkthrough, an Accessibility statement, a
  Careers page, a downloadable referral-form PDF, footer social links, and a
  homepage testimonials section — see `AGENTS.md`'s architecture notes for each
- A Resources page (`/resources/`), "A Guide to Mental Wellness" — real content
  transcribed from the client's own printed pamphlet, not a placeholder. See
  `AGENTS.md`'s "Resources page" note before editing hotline numbers or figures
- A full English/Spanish language toggle in the header (see `AGENTS.md`'s
  "Spanish-language toggle") covering the site's static chrome and hardcoded
  copy — not CMS-edited content, which stays single-language

## Local development

```bash
npm install
npm start
```

Visit http://localhost:8080/.

## Content editing

The client can edit Blog Posts, Services, Team Members, FAQ, and Testimonials
without touching code via Pages CMS — see [CMS-GUIDE.md](CMS-GUIDE.md) for the
walkthrough, or [client-site-starter](https://github.com/sebastiansells13-bot/client-site-starter)
for the full methodology this repo was generated from.

## License

Private/internal client site — not licensed for redistribution.
