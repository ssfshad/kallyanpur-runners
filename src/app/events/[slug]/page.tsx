import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import FadeIn from '@/components/ui/FadeIn'
import { Calendar, MapPin, Tag, ExternalLink, ArrowLeft, DollarSign } from 'lucide-react'
import type { Metadata } from 'next'

interface Props {
  params: { slug: string }
}

async function getEvent(slug: string) {
  try {
    const { data } = await supabase.from('events').select('*').eq('slug', slug).single()
    return data
  } catch { return null }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const event = await getEvent(params.slug)
  if (!event) return { title: 'Event Not Found' }
  return {
    title: `${event.name} | Kallyanpur Runners`,
    description: event.description ?? `Join us for ${event.name}`,
  }
}

export default async function EventDetailPage({ params }: Props) {
  const event = await getEvent(params.slug)
  if (!event) notFound()

  const dateObj = new Date(event.date)
  const formattedDate = dateObj.toLocaleDateString('en-BD', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  const formattedTime = dateObj.toLocaleTimeString('en-BD', { hour: '2-digit', minute: '2-digit' })

  return (
    <div className="pt-20">
      {/* Banner */}
      <div className="relative w-full aspect-[21/9] max-h-[500px] overflow-hidden bg-brand-black">
        {event.banner_url ? (
          <Image src={event.banner_url} alt={event.name} fill className="object-cover" priority />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-brand-border to-brand-bg flex items-center justify-center">
            <span className="font-heading text-6xl text-brand-gold/20 tracking-wider">KR</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-bg via-transparent to-black/30" />
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <FadeIn>
          <Link href="/events" className="inline-flex items-center gap-2 text-white/50 hover:text-brand-gold transition-colors text-sm mb-6">
            <ArrowLeft size={14} /> Back to Events
          </Link>

          <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
            <div>
              <span className={`px-2 py-1 text-xs font-heading tracking-wider rounded ${event.is_past ? 'bg-white/20 text-white/70' : 'bg-brand-gold text-black'}`}>
                {event.is_past ? 'PAST EVENT' : 'UPCOMING'}
              </span>
              <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl text-white mt-3 leading-none">{event.name}</h1>
            </div>
            {event.price && (
              <div className="flex items-center gap-2 bg-brand-card border border-brand-border rounded-lg px-4 py-2">
                <DollarSign size={16} className="text-brand-gold" />
                <span className="font-heading text-xl text-brand-gold">{event.price}</span>
              </div>
            )}
          </div>

          {/* Meta */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="flex items-center gap-3 bg-brand-card border border-brand-border rounded-lg p-4">
              <Calendar size={18} className="text-brand-gold flex-shrink-0" />
              <div>
                <p className="text-white/40 text-xs uppercase tracking-wider">Date & Time</p>
                <p className="text-white text-sm">{formattedDate}</p>
                <p className="text-white/60 text-xs">{formattedTime}</p>
              </div>
            </div>
            {event.location && (
              <div className="flex items-center gap-3 bg-brand-card border border-brand-border rounded-lg p-4">
                <MapPin size={18} className="text-brand-gold flex-shrink-0" />
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-wider">Location</p>
                  <p className="text-white text-sm">{event.location}</p>
                </div>
              </div>
            )}
            {event.categories && event.categories.length > 0 && (
              <div className="flex items-start gap-3 bg-brand-card border border-brand-border rounded-lg p-4">
                <Tag size={18} className="text-brand-gold flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Categories</p>
                  <div className="flex flex-wrap gap-1">
                    {event.categories.map((cat: string) => (
                      <span key={cat} className="px-2 py-0.5 bg-brand-border text-white/70 rounded text-xs">{cat}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          {event.description && (
            <div className="bg-brand-card border border-brand-border rounded-xl p-6 md:p-8 mb-8">
              <h2 className="font-heading text-2xl text-white mb-4 tracking-wide">ABOUT THIS EVENT</h2>
              <div className="prose-dark">
                {event.description.split('\n\n').map((para: string, i: number) => (
                  <p key={i} className="text-white/70 leading-relaxed mb-3">{para}</p>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          {!event.is_past && event.registration_link && (
            <a
              href={event.registration_link}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-10 py-4 bg-brand-gold text-black font-heading text-xl tracking-wider rounded hover:bg-yellow-400 transition-all hover:scale-105 shadow-lg shadow-brand-gold/30"
            >
              REGISTER NOW <ExternalLink size={18} />
            </a>
          )}
        </FadeIn>
      </div>
    </div>
  )
}
