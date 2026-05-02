-- ================================================================
-- KALLYANPUR RUNNERS — SUPABASE DATABASE SCHEMA
-- Run this in your Supabase SQL Editor (project dashboard → SQL)
-- ================================================================

-- Site settings (key-value store)
create table if not exists site_settings (
  key text primary key,
  value text,
  updated_at timestamptz default now()
);

-- Events
create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  date timestamptz not null,
  location text,
  description text,
  categories text[],
  price text,
  registration_link text,
  banner_url text,
  is_past boolean default false,
  created_at timestamptz default now()
);

-- Gallery
create table if not exists gallery (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  caption text,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- Team members
create table if not exists team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  title text,
  bio text,
  photo_url text,
  facebook_url text,
  sort_order int default 0
);

-- FAQs
create table if not exists faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- Payment methods
create table if not exists payment_methods (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_url text,
  instructions text,
  sort_order int default 0
);

-- ================================================================
-- ROW LEVEL SECURITY
-- ================================================================

-- Enable RLS on all tables
alter table site_settings enable row level security;
alter table events enable row level security;
alter table gallery enable row level security;
alter table team_members enable row level security;
alter table faqs enable row level security;
alter table payment_methods enable row level security;

-- Public READ for all tables (anonymous visitors can read)
create policy "Public read site_settings" on site_settings for select using (true);
create policy "Public read events" on events for select using (true);
create policy "Public read gallery" on gallery for select using (true);
create policy "Public read team_members" on team_members for select using (true);
create policy "Public read faqs" on faqs for select using (true);
create policy "Public read payment_methods" on payment_methods for select using (true);

-- Authenticated WRITE for all tables (admin only)
create policy "Auth write site_settings" on site_settings for all using (auth.role() = 'authenticated');
create policy "Auth write events" on events for all using (auth.role() = 'authenticated');
create policy "Auth write gallery" on gallery for all using (auth.role() = 'authenticated');
create policy "Auth write team_members" on team_members for all using (auth.role() = 'authenticated');
create policy "Auth write faqs" on faqs for all using (auth.role() = 'authenticated');
create policy "Auth write payment_methods" on payment_methods for all using (auth.role() = 'authenticated');

-- ================================================================
-- STORAGE BUCKETS
-- Run each of these in the Supabase SQL editor or create manually
-- ================================================================

-- Create storage buckets (public)
insert into storage.buckets (id, name, public) values
  ('hero-images', 'hero-images', true),
  ('event-banners', 'event-banners', true),
  ('gallery-photos', 'gallery-photos', true),
  ('team-photos', 'team-photos', true),
  ('payment-logos', 'payment-logos', true)
on conflict (id) do nothing;

-- Storage policies: public read
create policy "Public read hero-images" on storage.objects for select using (bucket_id = 'hero-images');
create policy "Public read event-banners" on storage.objects for select using (bucket_id = 'event-banners');
create policy "Public read gallery-photos" on storage.objects for select using (bucket_id = 'gallery-photos');
create policy "Public read team-photos" on storage.objects for select using (bucket_id = 'team-photos');
create policy "Public read payment-logos" on storage.objects for select using (bucket_id = 'payment-logos');

-- Storage policies: auth write
create policy "Auth write hero-images" on storage.objects for all using (bucket_id = 'hero-images' and auth.role() = 'authenticated');
create policy "Auth write event-banners" on storage.objects for all using (bucket_id = 'event-banners' and auth.role() = 'authenticated');
create policy "Auth write gallery-photos" on storage.objects for all using (bucket_id = 'gallery-photos' and auth.role() = 'authenticated');
create policy "Auth write team-photos" on storage.objects for all using (bucket_id = 'team-photos' and auth.role() = 'authenticated');
create policy "Auth write payment-logos" on storage.objects for all using (bucket_id = 'payment-logos' and auth.role() = 'authenticated');

-- ================================================================
-- SEED DATA
-- ================================================================

-- Pre-seed team members
insert into team_members (name, title, sort_order) values
  ('Tanvir Ahmed Siddiqi', 'Founder', 0),
  ('Sk Shihan Fardin', 'Co-Founder', 1)
on conflict do nothing;

-- Pre-seed default site settings
insert into site_settings (key, value) values
  ('hero_tagline', 'Run With Purpose. Race With Heart.'),
  ('hero_bg_url', ''),
  ('about_snippet', 'Kallyanpur Runners is a community-driven running club based in Kallyanpur, Dhaka, dedicated to promoting fitness, camaraderie, and healthy living through organized running events.'),
  ('facebook_url', 'https://facebook.com'),
  ('contact_phone', '01787622123'),
  ('contact_email', 'ssfshadhin@gmail.com'),
  ('contact_address', 'Kallyanpur, Dhaka, Bangladesh'),
  ('footer_text', '© 2025 Kallyanpur Runners. All rights reserved.'),
  ('seo_title', 'Kallyanpur Runners — Run With Purpose'),
  ('seo_description', 'Kallyanpur Runners is Dhaka''s premier running community. Join our events, track your progress, and run with purpose.'),
  ('payment_instructions', 'Register via the Google Form link on the event page.
Send your registration fee via bKash or Nagad to the number provided on the form.
Include your full name and event name in the payment reference/note.
Take a screenshot of your payment confirmation.
Upload the screenshot in the Google Form or send it to our Facebook page.
Your spot will be confirmed within 24 hours.'),
  ('about_description', 'Founded with a passion for running and community, Kallyanpur Runners has grown into one of Dhaka''s most active running clubs. We organise regular runs, marathons, and community fitness events to inspire people of all ages and abilities to lead healthier lives.

Based in Kallyanpur, Dhaka, our club welcomes runners of all levels — from first-time 1K participants to seasoned marathon runners. Our events are designed to challenge, inspire, and bring people together.'),
  ('mission_text', 'To inspire and empower every individual in our community to embrace running as a path to physical health, mental well-being, and lasting friendships.'),
  ('vision_text', 'A Bangladesh where every neighbourhood has an active running community, and where running events bring people together across age, background, and ability.')
on conflict (key) do nothing;

-- Pre-seed some FAQs
insert into faqs (question, answer, sort_order) values
  ('How do I register for an event?', 'Click the "Register Now" button on the event page. This will take you to our Google Form where you can fill in your details and complete registration.', 0),
  ('What payment methods are accepted?', 'We accept bKash and Nagad for event registration fees. Full payment instructions are available on the Payments page.', 1),
  ('Is there a minimum age requirement?', 'Most events are open to participants aged 14 and above. Some events may have specific age categories — check the individual event details.', 2),
  ('Can I get a refund if I cannot attend?', 'Refund requests must be submitted at least 5 days before the event date. Contact us at ssfshadhin@gmail.com for refund queries.', 3),
  ('Do I need to be an experienced runner to join?', 'Not at all! Kallyanpur Runners welcomes everyone — from first-timers to seasoned marathoners. We have event categories for all fitness levels.', 4),
  ('Where do the events take place?', 'Most events are held in and around Kallyanpur, Dhaka. The specific location for each event is listed on the event details page.', 5)
on conflict do nothing;

-- Pre-seed payment methods
insert into payment_methods (name, sort_order) values
  ('bKash', 0),
  ('Nagad', 1)
on conflict do nothing;
