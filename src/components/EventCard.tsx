'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Calendar, MapPin, Tag, ExternalLink } from 'lucide-react'
import type { Event } from '@/lib/types'

interface EventCardProps {
  event: Event
}

export default function EventCard({ event }: EventCardProps) {
  const dateObj = new Date(event.date)
  const formattedDate = dateObj.toLocaleDateString('en-BD', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  const formattedTime = dateObj.toLocaleTimeString('en-BD', {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="bg-brand-card border border-brand-border rounded-xl overflow-hidden group"
    >
      {/* Banner */}
      <Link href={`/events/${event.slug}`} className="block relative aspect-[16/9] overflow-hidden">
        {event.banner_url ? (
          <Image
            src={event.banner_url}
            alt={event.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-brand-border to-brand-bg flex items-center justify-center">
            <span className="font-heading text-4xl text-brand-gold/30">KR</span>
          </div>
        )}
        {/* Status badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 text-xs font-heading tracking-wider rounded ${
            event.is_past ? 'bg-white/20 text-white/70' : 'bg-brand-gold text-black'
          }`}>
            {event.is_past ? 'PAST' : 'UPCOMING'}
          </span>
        </div>
        {event.price && (
          <div className="absolute top-3 right-3">
            <span className="px-2 py-1 text-xs font-heading tracking-wider rounded bg-black/70 text-brand-gold border border-brand-gold/30">
              {event.price}
            </span>
          </div>
        )}
      </Link>

      <div className="p-4 md:p-5">
        <Link href={`/events/${event.slug}`}>
          <h3 className="font-heading text-xl md:text-2xl text-white group-hover:text-brand-gold transition-colors leading-tight mb-3">
            {event.name}
          </h3>
        </Link>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-white/60 text-sm">
            <Calendar size={14} className="text-brand-gold flex-shrink-0" />
            <span>{formattedDate} · {formattedTime}</span>
          </div>
          {event.location && (
            <div className="flex items-center gap-2 text-white/60 text-sm">
              <MapPin size={14} className="text-brand-gold flex-shrink-0" />
              <span>{event.location}</span>
            </div>
          )}
          {event.categories && event.categories.length > 0 && (
            <div className="flex items-center gap-2 text-white/60 text-sm">
              <Tag size={14} className="text-brand-gold flex-shrink-0" />
              <div className="flex flex-wrap gap-1">
                {event.categories.map((cat) => (
                  <span key={cat} className="px-1.5 py-0.5 bg-brand-border text-white/70 rounded text-xs">
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {event.description && (
          <p className="text-white/50 text-sm leading-relaxed mb-4 line-clamp-2">{event.description}</p>
        )}

        <div className="flex gap-2 mt-auto">
          <Link
            href={`/events/${event.slug}`}
            className="flex-1 text-center py-2.5 border border-brand-border text-white/70 hover:text-white hover:border-white/50 text-sm font-medium rounded transition-colors"
          >
            Details
          </Link>
          {!event.is_past && event.registration_link && (
            <a
              href={event.registration_link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-brand-gold text-black text-sm font-heading tracking-wide rounded hover:bg-yellow-400 transition-colors"
            >
              REGISTER <ExternalLink size={12} />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  )
}
