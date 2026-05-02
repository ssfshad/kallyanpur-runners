---
name: Kallyanpur Runners Website
description: Full Next.js 14 website for Kallyanpur Runners running club — project context and tech decisions
type: project
---

Full production website built for Kallyanpur Runners (Kallyanpur, Dhaka, Bangladesh).

**Stack:** Next.js 14 App Router · Supabase · Tailwind CSS · Framer Motion · Netlify

**Key files:**
- `supabase-schema.sql` — run this in Supabase SQL Editor to create all tables + seed data
- `.env.local.example` — copy to `.env.local` with real Supabase credentials
- `netlify.toml` — Netlify deployment config with `@netlify/plugin-nextjs`
- `public/logo.svg` — placeholder logo (replace with real KR logo)

**Brand colors:** gold `#D4AF37`, bg `#0A0A0A`, card `#111111`
**Fonts:** Bebas Neue (headings), Inter (body) via Google Fonts

**Admin panel:** `/admin` — Supabase Auth email/password login. Manages: site settings, events, gallery, team, FAQ, payment methods.

**Why:** build succeeded clean — 17 routes, 0 TS errors.

**Next steps for user:**
1. Create Supabase project, run `supabase-schema.sql`
2. Add `.env.local` with Supabase URL + anon key
3. Replace `public/logo.svg` with real logo
4. Create admin user in Supabase Auth
5. Deploy to Netlify with env vars set
