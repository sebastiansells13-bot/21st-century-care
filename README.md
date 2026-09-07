# 21st Century Care

Website for **21st Century Care**, a Comprehensive Community Support Services (CCSS)
and Peer Support Services (PSS) provider serving Medicaid recipients in Southern New
Mexico, out of Anthony, NM. Built from
[client-site-starter](https://github.com/sebastiansells13-bot/client-site-starter):
Eleventy (11ty) + Nunjucks, Pages CMS for non-technical content editing, and GitHub
Actions build/deploy to GitHub Pages.

**Live site:** https://sebastiansells13-bot.github.io/21st-century-care/

## What's in here

- Content (business info, services list) taken from the client's print flyer — see
  `src/_data/business.json` and `src/_data/services.json`
- No custom domain yet, so the site deploys to a GitHub Pages *project* URL; see the
  "No custom domain yet" note in `AGENTS.md` for what needs to change once one is
  purchased
- No team members or contact form listed yet — see `AGENTS.md`'s "What NOT to do" for
  why those stay empty/commented out until the client supplies real content
- A three-color accent palette (green/blue/warm terracotta, see `AGENTS.md`'s
  "Color palette"), four freely-licensed New Mexico landscape photos (one per main
  page), an emoji icon per service, and an original (not traced) favicon — see
  [CREDITS.md](CREDITS.md)
- Services are grouped into four categories (Housing & Basic Needs, Health &
  Wellness, Skills & Independence, Community & Family) — see `AGENTS.md`'s
  "Service categories"
- An "In crisis right now?" callout (911 / 988 Lifeline / SAMHSA Helpline) on the
  Services and Contact pages — see `AGENTS.md`'s "Crisis resources" note before
  editing or removing it

## Local development

```bash
npm install
npm start
```

Visit http://localhost:8080/.

## Content editing

The client can edit Blog Posts, Services, and Team Members without touching code via
Pages CMS — see [CMS-GUIDE.md](CMS-GUIDE.md) for the walkthrough, or
[client-site-starter](https://github.com/sebastiansells13-bot/client-site-starter) for
the full methodology this repo was generated from.

## License

Private/internal client site — not licensed for redistribution.
