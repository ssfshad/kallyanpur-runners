'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Event } from '@/lib/types'
import EventCard from '@/components/EventCard'
import FadeIn from '@/components/ui/FadeIn'
import Image from 'next/image'

export default function EventsPage() {
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming')
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchEvents() {
      setLoading(true)
      try {
        const now = new Date().toISOString()
        const query = tab === 'upcoming'
          ? supabase.from('events').select('*').eq('is_past', false).gte('date', now).order('date', { ascending: true })
          : supabase.from('events').select('*').or(`is_past.eq.true,date.lt.${now}`).order('date', { ascending: false })

        const { data } = await query
        setEvents(data ?? [])
      } catch {
        setEvents([])
      } finally {
        setLoading(false)
      }
    }
    fetchEvents()
  }, [tab])

  return (
    <div className="pt-20">
      {/* Header */}
      <div className="relative py-20 px-4 bg-brand-black border-b border-brand-border overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-gold/5 to-transparent" />
        <div className="max-w-4xl mx-auto relative z-10">
          <FadeIn>
            <span className="text-brand-gold font-heading tracking-[0.3em] text-sm">JOIN THE RACE</span>
            <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl text-white mt-2 leading-none">EVENTS</h1>
            <div className="mt-3 h-0.5 w-16 bg-brand-gold" />
          </FadeIn>
        </div>
      </div>

      <div className="py-12 px-4 max-w-7xl mx-auto">
        {/* Tabs */}
        <div className="flex gap-1 bg-brand-card border border-brand-border rounded-xl p-1 w-fit mx-auto mb-10">
          {(['upcoming', 'past'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-6 py-2.5 font-heading text-lg tracking-wider rounded-lg transition-all min-touch ${
                tab === t ? 'bg-brand-gold text-black' : 'text-white/60 hover:text-white'
              }`}
            >
              {t === 'upcoming' ? 'UPCOMING' : 'PAST EVENTS'}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-brand-card border border-brand-border rounded-xl overflow-hidden animate-pulse">
                <div className="aspect-[16/9] bg-brand-border" />
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-brand-border rounded w-3/4" />
                  <div className="h-4 bg-brand-border rounded w-1/2" />
                  <div className="h-4 bg-brand-border rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : events.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {events.map((event, i) => (
              <FadeIn key={event.id} delay={i * 0.08}>
                <EventCard event={event} />
              </FadeIn>
            ))}
          </div>
        ) : (
          <FadeIn>
            <div className="text-center py-20 border border-dashed border-brand-border rounded-xl">
              <div className="relative w-16 h-16 mx-auto mb-4 opacity-20">
                <Image src="/logo.png" alt="" fill className="object-contain" />
              </div>
              <p className="text-white/40 font-heading text-2xl tracking-wider">
                {tab === 'upcoming' ? 'NO UPCOMING EVENTS' : 'NO PAST EVENTS'}
              </p>
              <p className="text-white/30 text-sm mt-2">
                {tab === 'upcoming' ? 'Check back soon â€” something exciting is on the way!' : 'Past events will appear here.'}
              </p>
            </div>
          </FadeIn>
        )}
      </div>
    </div>
  )
}
