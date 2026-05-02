import { supabase } from './supabase'
import { SiteSettings } from './types'

const defaults: SiteSettings = {
  hero_tagline: 'Run With Purpose. Race With Heart.',
  hero_bg_url: '',
  about_snippet:
    'Kallyanpur Runners is a community-driven running club based in Kallyanpur, Dhaka, dedicated to promoting fitness, camaraderie, and healthy living through organized running events.',
  facebook_url: 'https://facebook.com',
  contact_phone: '01787622123',
  contact_email: 'ssfshadhin@gmail.com',
  contact_address: 'Kallyanpur, Dhaka, Bangladesh',
  footer_text: '© 2025 Kallyanpur Runners. All rights reserved.',
  seo_title: 'Kallyanpur Runners — Run With Purpose',
  seo_description:
    'Kallyanpur Runners is Dhaka\'s premier running community. Join our events, track your progress, and run with purpose.',
  payment_instructions:
    'Send payment via bKash or Nagad to complete your registration. Include your name and event name in the reference.',
  about_description:
    'Founded with a passion for running and community, Kallyanpur Runners has grown into one of Dhaka\'s most active running clubs. We organise regular runs, marathons, and community fitness events to inspire people of all ages and abilities to lead healthier lives.\n\nBased in Kallyanpur, Dhaka, our club welcomes runners of all levels — from first-time 1K participants to seasoned marathon runners. Our events are designed to challenge, inspire, and bring people together.',
  mission_text:
    'To inspire and empower every individual in our community to embrace running as a path to physical health, mental well-being, and lasting friendships.',
  vision_text:
    'A Bangladesh where every neighbourhood has an active running community, and where running events bring people together across age, background, and ability.',
}

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const { data, error } = await supabase.from('site_settings').select('key, value')
    if (error || !data) return defaults

    const settings = { ...defaults }
    for (const row of data) {
      if (row.key in settings) {
        ;(settings as Record<string, string>)[row.key] = row.value ?? ''
      }
    }
    return settings
  } catch {
    return defaults
  }
}

export async function updateSiteSetting(key: string, value: string): Promise<void> {
  await supabase.from('site_settings').upsert({ key, value, updated_at: new Date().toISOString() })
}
