# Kallyanpur Runners Website

Production-ready website for **Kallyanpur Runners** — a marathon/running events organization based in Kallyanpur, Dhaka, Bangladesh.

**Stack:** Next.js 14 (App Router) · Supabase · Tailwind CSS · Framer Motion · Netlify

---

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Copy `.env.local.example` to `.env.local` and fill in your Supabase credentials:

```bash
cp .env.local.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Find these in your Supabase project: **Settings → API**.

### 3. Set Up Supabase Database

1. Go to your Supabase project dashboard
2. Open **SQL Editor**
3. Paste and run the entire contents of [`supabase-schema.sql`](./supabase-schema.sql)

This creates all tables, RLS policies, storage buckets, and inserts seed data (team members, default site settings, FAQs, payment methods).

> **Note:** If the storage bucket INSERT lines fail (due to existing buckets), run them separately or create the buckets manually in Supabase → Storage. Create 5 public buckets: `hero-images`, `event-banners`, `gallery-photos`, `team-photos`, `payment-logos`.

### 4. Create the Admin User

1. In Supabase dashboard → **Authentication → Users**
2. Click **Add User → Create New User**
3. Enter your admin email and a strong password
4. Log in at `/admin/login` with those credentials

### 5. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Logo

Replace `/public/logo.svg` with the official Kallyanpur Runners logo.
- SVG format preferred for crisp rendering at all sizes
- Transparent or black background works best on the dark theme
- If you use a PNG instead: rename it `logo.png` and do a find+replace of `logo.svg` → `logo.png` in the `src/` directory

---

## Deploy to Netlify

### Via Netlify Dashboard

1. Push this repository to GitHub
2. Go to [netlify.com](https://netlify.com) → **Add new site → Import from Git**
3. Select your repo — build settings are pre-configured via `netlify.toml`
4. Add environment variables under **Site Settings → Environment Variables**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Click **Deploy**

### Via Netlify CLI

```bash
npm install -g netlify-cli
netlify init
netlify env:set NEXT_PUBLIC_SUPABASE_URL your_url
netlify env:set NEXT_PUBLIC_SUPABASE_ANON_KEY your_key
netlify deploy --prod
```

### Connecting a Custom Domain

1. Netlify dashboard → **Domain settings → Add custom domain**
2. Enter your domain (e.g. `kallyanpurrunners.com`)
3. Update DNS: add a `CNAME` record pointing to your Netlify subdomain
4. SSL certificate is provisioned automatically by Netlify

---

## Admin Panel

Access at `/admin` — auto-redirects to `/admin/login` if not authenticated.

| Section | What you can manage |
|---|---|
| **Dashboard** | Stats overview — event count, gallery, FAQ, team |
| **Events** | Create, edit, delete events with banner image, categories, price, Google Form link |
| **Gallery** | Upload photos (drag & drop or browse), delete photos |
| **Team** | Edit founder profiles — name, title, bio, photo, Facebook link |
| **FAQ** | Add, edit, delete questions and answers |
| **Payments** | Add, edit, delete payment method cards (name + logo) |
| **Settings** | Hero tagline, hero background, about text, contact info, social links, SEO, footer |

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx                # Home (hero, countdown, events preview, gallery preview)
│   ├── about/page.tsx          # About page (description, founders, mission/vision)
│   ├── events/
│   │   ├── page.tsx            # Events listing with Upcoming / Past tabs
│   │   └── [slug]/page.tsx     # Event detail page
│   ├── gallery/page.tsx        # Photo grid with lightbox
│   ├── faq/page.tsx            # Accordion FAQ
│   ├── payments/page.tsx       # Payment methods + step-by-step instructions
│   ├── contact/page.tsx        # Contact info + embedded Google Maps
│   └── admin/                  # Full admin panel
│       ├── page.tsx            # Dashboard
│       ├── login/page.tsx      # Login page
│       ├── settings/page.tsx   # Site settings editor
│       ├── events/page.tsx     # Events manager
│       ├── gallery/page.tsx    # Gallery manager
│       ├── team/page.tsx       # Team editor
│       ├── faq/page.tsx        # FAQ manager
│       └── payments/page.tsx   # Payment methods manager
├── components/
│   ├── Navbar.tsx              # Sticky transparent nav + mobile hamburger drawer
│   ├── Footer.tsx              # Footer with quick links + contact
│   ├── EventCard.tsx           # Event card with hover animation
│   ├── CountdownTimer.tsx      # Live countdown to next event
│   ├── HeroOverlay.tsx         # Animated gold line overlay for hero
│   ├── ui/
│   │   ├── FadeIn.tsx          # Scroll-triggered fade-in (Framer Motion)
│   │   └── SectionHeader.tsx   # Consistent eyebrow + title + gold divider
│   └── admin/
│       └── AdminShell.tsx      # Admin sidebar layout
└── lib/
    ├── supabase.ts             # Supabase client
    ├── settings.ts             # getSiteSettings / updateSiteSetting helpers
    └── types.ts                # TypeScript interfaces for all DB tables
```

---

## Placeholder Content to Replace via Admin

After deploying, log in to `/admin` and update:

1. **Settings → Hero background image** — upload a running/event photo
2. **Settings → Facebook URL** — set your actual Facebook page URL
3. **Team → Tanvir Ahmed Siddiqi** — add photo, bio, Facebook link
4. **Team → Sk Shihan Fardin** — add photo, bio, Facebook link
5. **Payments → Add bKash/Nagad** — the cards are pre-seeded but without logos; upload logos
6. **Settings → Payment instructions** — update with your actual bKash/Nagad number
7. **Events** — create your first event

---

## Color Palette

| Token | Value | Usage |
|---|---|---|
| `brand-gold` | `#D4AF37` | Accents, CTAs, headings |
| `brand-black` | `#000000` | Section backgrounds |
| `brand-bg` | `#0A0A0A` | Page background |
| `brand-card` | `#111111` | Card backgrounds |
| `brand-border` | `#1F1F1F` | Borders, dividers |
