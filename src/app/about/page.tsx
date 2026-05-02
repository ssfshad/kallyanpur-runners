export const dynamic = 'force-dynamic'
import Image from 'next/image'
import { getSiteSettings } from '@/lib/settings'
import { supabase } from '@/lib/supabase'
import type { TeamMember } from '@/lib/types'
import FadeIn from '@/components/ui/FadeIn'
import SectionHeader from '@/components/ui/SectionHeader'
import { Target, Eye } from 'lucide-react'
import FacebookIcon from '@/components/ui/FacebookIcon'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About | Kallyanpur Runners',
  description: 'Learn about Kallyanpur Runners — our story, founders, mission and vision.',
}

async function getTeamMembers(): Promise<TeamMember[]> {
  try {
    const { data } = await supabase.from('team_members').select('*').order('sort_order', { ascending: true })
    return data ?? []
  } catch { return [] }
}

export default async function AboutPage() {
  const [settings, team] = await Promise.all([getSiteSettings(), getTeamMembers()])

  return (
    <div className="pt-20">
      {/* ── PAGE HEADER ── */}
      <div className="relative py-20 px-4 bg-brand-black border-b border-brand-border overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-gold/5 to-transparent" />
        <div className="max-w-4xl mx-auto relative z-10">
          <FadeIn>
            <span className="text-brand-gold font-heading tracking-[0.3em] text-sm">OUR STORY</span>
            <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl text-white mt-2 leading-none">ABOUT US</h1>
            <div className="mt-3 h-0.5 w-16 bg-brand-gold" />
          </FadeIn>
        </div>
      </div>

      {/* ── DESCRIPTION ── */}
      <section className="py-16 px-4 max-w-4xl mx-auto">
        <FadeIn>
          <div className="prose-dark space-y-4">
            {settings.about_description.split('\n\n').map((para, i) => (
              <p key={i} className="text-white/70 leading-relaxed text-base md:text-lg">{para}</p>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* ── FOUNDERS ── */}
      {team.length > 0 && (
        <section className="py-16 px-4 bg-brand-black border-y border-brand-border">
          <div className="max-w-5xl mx-auto">
            <SectionHeader eyebrow="THE TEAM" title="MEET THE FOUNDERS" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
              {team.map((member, i) => (
                <FadeIn key={member.id} delay={i * 0.15}>
                  <div className="bg-brand-card border border-brand-border rounded-xl p-6 md:p-8 text-center group hover:border-brand-gold/40 transition-colors">
                    <div className="relative w-28 h-28 md:w-36 md:h-36 mx-auto mb-5 rounded-full overflow-hidden border-2 border-brand-border group-hover:border-brand-gold transition-colors">
                      {member.photo_url ? (
                        <Image src={member.photo_url} alt={member.name} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full bg-brand-border flex items-center justify-center">
                          <span className="font-heading text-3xl text-brand-gold/40">
                            {member.name.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    <h3 className="font-heading text-2xl md:text-3xl text-white tracking-wide">{member.name}</h3>
                    {member.title && (
                      <p className="text-brand-gold font-heading tracking-[0.2em] text-sm mt-1">{member.title}</p>
                    )}
                    {member.bio && (
                      <p className="text-white/60 text-sm leading-relaxed mt-4">{member.bio}</p>
                    )}
                    {member.facebook_url && (
                      <a
                        href={member.facebook_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 mt-4 text-white/40 hover:text-brand-gold transition-colors text-sm"
                      >
                        <FacebookIcon size={16} /> Facebook
                      </a>
                    )}
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── MISSION & VISION ── */}
      <section className="py-16 px-4 max-w-5xl mx-auto">
        <SectionHeader eyebrow="PURPOSE" title="MISSION & VISION" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FadeIn delay={0.1}>
            <div className="bg-brand-card border border-brand-border rounded-xl p-6 md:p-8 h-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-brand-gold/10 flex items-center justify-center">
                  <Target size={20} className="text-brand-gold" />
                </div>
                <h3 className="font-heading text-2xl text-white tracking-wide">OUR MISSION</h3>
              </div>
              <p className="text-white/60 leading-relaxed">{settings.mission_text}</p>
            </div>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div className="bg-brand-card border border-brand-border rounded-xl p-6 md:p-8 h-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-brand-gold/10 flex items-center justify-center">
                  <Eye size={20} className="text-brand-gold" />
                </div>
                <h3 className="font-heading text-2xl text-white tracking-wide">OUR VISION</h3>
              </div>
              <p className="text-white/60 leading-relaxed">{settings.vision_text}</p>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  )
}
