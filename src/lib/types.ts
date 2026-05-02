export interface Event {
  id: string
  name: string
  slug: string
  date: string
  location: string | null
  description: string | null
  categories: string[] | null
  price: string | null
  registration_link: string | null
  banner_url: string | null
  is_past: boolean
  created_at: string
}

export interface GalleryPhoto {
  id: string
  image_url: string
  caption: string | null
  sort_order: number
  created_at: string
}

export interface TeamMember {
  id: string
  name: string
  title: string | null
  bio: string | null
  photo_url: string | null
  facebook_url: string | null
  sort_order: number
}

export interface FAQ {
  id: string
  question: string
  answer: string
  sort_order: number
  created_at: string
}

export interface PaymentMethod {
  id: string
  name: string
  logo_url: string | null
  instructions: string | null
  sort_order: number
}

export interface SiteSettings {
  hero_tagline: string
  hero_bg_url: string
  about_snippet: string
  facebook_url: string
  contact_phone: string
  contact_email: string
  contact_address: string
  footer_text: string
  seo_title: string
  seo_description: string
  payment_instructions: string
  about_description: string
  mission_text: string
  vision_text: string
}
