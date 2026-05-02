export const dynamic = 'force-dynamic'
import Image from 'next/image'
import Link from 'next/link'
import { getSiteSettings } from '@/lib/settings'
import { supabase } from '@/lib/supabase'
import type { Event, GalleryPhoto } from '@/lib/types'
import CountdownTimer from '@/components/CountdownTimer'
import EventCard from '@/components/EventCard'
import FadeIn from '@/components/ui/FadeIn'
import SectionHeader from '@/components/ui/SectionHeader'
import HeroOverlay from '@/components/HeroOverlay'
import FacebookIcon from '@/components/ui/FacebookIcon'
import { ArrowRight, ChevronDown } from 'lucide-react'

async function getUpcomingEvents(): Promise<Event[]> {
  try {
    const { data } = await supabase
      .from('events')
      .select('*')
      .eq('is_past', false)
      .gte('date', new Date().toISOString())
      .order('date', { ascending: true })
      .limit(3)
    return data ?? []
  } catch { return [] }
}

async function getGalleryPreview(): Promise<GalleryPhoto[]> {
  try {
    const { data } = await supabase
      .from('gallery')
      .select('*')
      .order('sort_order', { ascending: true })
      .limit(6)
    return data ?? []
  } catch { return [] }
}

async function getNextEvent(): Promise<Event | null> {
  try {
    const { data } = await supabase
      .from('events')
      .select('*')
      .eq('is_past', false)
      .gte('date', new Date().toISOString())
      .order('date', { ascending: true })
      .limit(1)
      .single()
    return data
  } catch { return null }
}

export default async function HomePage() {
  const [settings, upcomingEvents, galleryPhotos, nextEvent] = await Promise.all([
    getSiteSettings(),
    getUpcomingEvents(),
    getGalleryPreview(),
    getNextEvent(),
  ])

  return (
    <>
      {/* â”€â”€ HERO â”€â”€ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        {settings.hero_bg_url ? (
          <Image src={settings.hero_bg_url} alt="Hero background" fill priority className="object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-black via-[#0a0a0a] to-[#111111]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-brand-bg" />
        <HeroOverlay />

        <div className="relative z-10 flex flex-col items-center text-center px-4 pt-20">
          <div className="relative w-28 h-28 md:w-40 md:h-40 mb-6 drop-shadow-[0_0_30px_rgba(212,175,55,0.4)]">
            <Image src="/logo.png" alt="Kallyanpur Runners" fill className="object-contain" priority />
          </div>
          <h1 className="font-heading text-5xl sm:text-6xl md:text-8xl text-white leading-none tracking-wide mb-2">
            KALLYANPUR
          </h1>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl text-brand-gold leading-none tracking-[0.3em] mb-6">
            RUNNERS
          </h2>
          <p className="text-white/80 text-lg md:text-xl max-w-xl leading-relaxed mb-8 font-body">
            {settings.hero_tagline}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Link
              href="/events"
              className="px-8 py-4 bg-brand-gold text-black font-heading text-xl tracking-wider rounded hover:bg-yellow-400 transition-all hover:scale-105 shadow-lg shadow-brand-gold/30 inline-flex items-center justify-center min-touch"
            >
              GET TICKET
            </Link>
            <Link
              href="/about"
              className="px-8 py-4 border border-white/30 text-white font-heading text-xl tracking-wider rounded hover:border-brand-gold hover:text-brand-gold transition-colors inline-flex items-center justify-center min-touch"
            >
              LEARN MORE
            </Link>
          </div>
          {settings.facebook_url && (
            <a
              href={settings.facebook_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 flex items-center gap-2 text-white/50 hover:text-brand-gold transition-colors text-sm"
            >
              <FacebookIcon size={18} />
              Follow us on Facebook
            </a>
          )}
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <ChevronDown size={24} className="text-white/40" />
        </div>
      </section>

      {/* â”€â”€ COUNTDOWN â”€â”€ */}
      {nextEvent && (
        <section className="py-12 bg-brand-black border-y border-brand-border">
          <div className="max-w-4xl mx-auto px-4">
            <FadeIn>
              <CountdownTimer targetDate={nextEvent.date} eventName={nextEvent.name} />
            </FadeIn>
          </div>
        </section>
      )}

      {/* â”€â”€ ABOUT SNIPPET â”€â”€ */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <FadeIn direction="right">
            <div className="relative w-full aspect-square max-w-md mx-auto md:mx-0 rounded-2xl overflow-hidden border border-brand-border bg-brand-card">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/10 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-48 h-48">
                  <Image src="/logo.png" alt="Kallyanpur Runners" fill className="object-contain opacity-20" />
                </div>
              </div>
              <div className="absolute top-6 left-6 w-16 h-0.5 bg-brand-gold" />
              <div className="absolute top-6 left-6 w-0.5 h-16 bg-brand-gold" />
              <div className="absolute bottom-6 right-6 w-16 h-0.5 bg-brand-gold" />
              <div className="absolute bottom-6 right-6 w-0.5 h-16 bg-brand-gold" />
              <p className="absolute bottom-8 left-0 right-0 text-center font-heading text-5xl text-brand-gold/20 tracking-widest">SINCE 2024</p>
            </div>
          </FadeIn>
          <FadeIn direction="left" delay={0.1}>
            <span className="text-brand-gold font-heading tracking-[0.3em] text-sm">ABOUT US</span>
            <h2 className="font-heading text-4xl md:text-5xl text-white mt-2 mb-4 leading-none">
              WE RUN.<br />WE INSPIRE.<br />WE GROW.
            </h2>
            <p className="text-white/60 leading-relaxed mb-6">{settings.about_snippet}</p>
            <Link href="/about" className="inline-flex items-center gap-2 text-brand-gold font-heading tracking-wider hover:gap-3 transition-all">
              READ MORE <ArrowRight size={16} />
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* â”€â”€ UPCOMING EVENTS â”€â”€ */}
      <section className="py-20 px-4 bg-brand-black border-y border-brand-border">
        <div className="max-w-7xl mx-auto">
          <SectionHeader eyebrow="WHAT'S NEXT" title="UPCOMING EVENTS" subtitle="Push your limits. Register for our next race and be part of the Kallyanpur Runners family." />
          {upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {upcomingEvents.map((event, i) => (
                <FadeIn key={event.id} delay={i * 0.1}>
                  <EventCard event={event} />
                </FadeIn>
              ))}
            </div>
          ) : (
            <FadeIn>
              <div className="text-center py-16 border border-dashed border-brand-border rounded-xl">
                <div className="relative w-16 h-16 mx-auto mb-4 opacity-20">
                  <Image src="/logo.png" alt="" fill className="object-contain" />
                </div>
                <p className="text-white/40 font-heading text-2xl tracking-wider">NO UPCOMING EVENTS</p>
                <p className="text-white/30 text-sm mt-2">Check back soon â€” something exciting is coming!</p>
              </div>
            </FadeIn>
          )}
          {upcomingEvents.length > 0 && (
            <FadeIn className="text-center mt-10">
              <Link href="/events" className="inline-flex items-center gap-2 px-8 py-3 border border-brand-gold text-brand-gold font-heading text-lg tracking-wider rounded hover:bg-brand-gold hover:text-black transition-all">
                ALL EVENTS <ArrowRight size={18} />
              </Link>
            </FadeIn>
          )}
        </div>
      </section>

      {/* â”€â”€ GALLERY PREVIEW â”€â”€ */}
      {galleryPhotos.length > 0 && (
        <section className="py-20 px-4 max-w-7xl mx-auto">
          <SectionHeader eyebrow="MOMENTS" title="FROM THE TRACK" subtitle="Captured moments from our community runs and events." />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
            {galleryPhotos.map((photo, i) => (
              <FadeIn key={photo.id} delay={i * 0.07}>
                <Link href="/gallery" className="block relative aspect-square rounded-lg overflow-hidden group">
                  <Image src={photo.image_url} alt={photo.caption ?? 'Gallery photo'} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 50vw, 33vw" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
                </Link>
              </FadeIn>
            ))}
          </div>
          <FadeIn className="text-center mt-8">
            <Link href="/gallery" className="inline-flex items-center gap-2 text-brand-gold font-heading tracking-wider hover:gap-3 transition-all text-lg">
              VIEW FULL GALLERY <ArrowRight size={16} />
            </Link>
          </FadeIn>
        </section>
      )}

      {/* â”€â”€ CTA BANNER â”€â”€ */}
      <section className="py-16 px-4 bg-brand-gold">
        <FadeIn className="max-w-3xl mx-auto text-center">
          <h2 className="font-heading text-4xl md:text-6xl text-black leading-none mb-4">READY TO RUN?</h2>
          <p className="text-black/70 text-base md:text-lg mb-8">Join hundreds of runners across Dhaka. Register for our next event today.</p>
          <Link href="/events" className="inline-flex items-center gap-2 px-10 py-4 bg-black text-brand-gold font-heading text-xl tracking-wider rounded hover:bg-gray-900 transition-colors shadow-xl">
            REGISTER NOW <ArrowRight size={18} />
          </Link>
        </FadeIn>
      </section>
    </>
  )
}
