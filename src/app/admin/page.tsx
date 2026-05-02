'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import AdminShell from '@/components/admin/AdminShell'
import { CalendarDays, Image as ImgIcon, HelpCircle, Users, CreditCard, Settings, ArrowRight, Layers } from 'lucide-react'

interface Stats {
  events: number
  gallery: number
  faqs: number
  team: number
}

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<Stats>({ events: 0, gallery: 0, faqs: 0, team: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) { router.push('/admin/login'); return }
      loadStats()
    })
  }, [router])

  async function loadStats() {
    const [events, gallery, faqs, team] = await Promise.all([
      supabase.from('events').select('id', { count: 'exact', head: true }),
      supabase.from('gallery').select('id', { count: 'exact', head: true }),
      supabase.from('faqs').select('id', { count: 'exact', head: true }),
      supabase.from('team_members').select('id', { count: 'exact', head: true }),
    ])
    setStats({
      events: events.count ?? 0,
      gallery: gallery.count ?? 0,
      faqs: faqs.count ?? 0,
      team: team.count ?? 0,
    })
    setLoading(false)
  }

  const cards = [
    { label: 'Total Events', value: stats.events, icon: CalendarDays, href: '/admin/events', color: 'text-blue-400' },
    { label: 'Gallery Photos', value: stats.gallery, icon: ImgIcon, href: '/admin/gallery', color: 'text-purple-400' },
    { label: 'FAQs', value: stats.faqs, icon: HelpCircle, href: '/admin/faq', color: 'text-green-400' },
    { label: 'Team Members', value: stats.team, icon: Users, href: '/admin/team', color: 'text-brand-gold' },
  ]

  const quickLinks = [
    { href: '/admin/events', label: 'Manage Events', icon: CalendarDays },
    { href: '/admin/gallery', label: 'Upload Photos', icon: ImgIcon },
    { href: '/admin/hero', label: 'Hero Slides', icon: Layers },
    { href: '/admin/team', label: 'Edit Team', icon: Users },
    { href: '/admin/faq', label: 'Manage FAQ', icon: HelpCircle },
    { href: '/admin/payments', label: 'Payment Methods', icon: CreditCard },
    { href: '/admin/settings', label: 'Site Settings', icon: Settings },
  ]

  return (
    <AdminShell>
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="font-heading text-3xl text-white tracking-wide">DASHBOARD</h1>
          <p className="text-white/40 text-sm mt-1">Welcome back to Kallyanpur Runners admin panel.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {cards.map(({ label, value, icon: Icon, href, color }) => (
            <Link
              key={href}
              href={href}
              className="bg-brand-card border border-brand-border rounded-xl p-5 hover:border-brand-gold/30 transition-colors group"
            >
              <div className="flex items-start justify-between mb-3">
                <Icon size={20} className={color} />
                <span className={`text-3xl font-heading ${color}`}>
                  {loading ? '—' : value}
                </span>
              </div>
              <p className="text-white/50 text-sm group-hover:text-white/70 transition-colors">{label}</p>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="font-heading text-xl text-white tracking-wide mb-4">QUICK ACTIONS</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {quickLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 bg-brand-card border border-brand-border rounded-xl p-4 hover:border-brand-gold/40 hover:bg-brand-gold/5 transition-all group"
              >
                <Icon size={18} className="text-brand-gold" />
                <span className="text-white/70 group-hover:text-white text-sm transition-colors flex-1">{label}</span>
                <ArrowRight size={14} className="text-white/30 group-hover:text-brand-gold transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </AdminShell>
  )
}
