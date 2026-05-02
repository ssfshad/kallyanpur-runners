export const dynamic = 'force-dynamic'
import Image from 'next/image'
import Link from 'next/link'
import { getSiteSettings } from '@/lib/settings'
import { supabase } from '@/lib/supabase'
import type { PaymentMethod } from '@/lib/types'
import FadeIn from '@/components/ui/FadeIn'
import SectionHeader from '@/components/ui/SectionHeader'
import { ExternalLink, AlertCircle } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Payments | Kallyanpur Runners',
  description: 'Payment methods and instructions for Kallyanpur Runners events.',
}

async function getPaymentMethods(): Promise<PaymentMethod[]> {
  try {
    const { data } = await supabase.from('payment_methods').select('*').order('sort_order', { ascending: true })
    return data ?? []
  } catch { return [] }
}

export default async function PaymentsPage() {
  const [settings, methods] = await Promise.all([getSiteSettings(), getPaymentMethods()])

  const steps = settings.payment_instructions
    .split('\n')
    .filter((l: string) => l.trim())
    .map((l: string) => l.replace(/^\d+\.\s*/, '').trim())

  return (
    <div className="pt-20">
      <div className="relative py-20 px-4 bg-brand-black border-b border-brand-border overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-gold/5 to-transparent" />
        <div className="max-w-4xl mx-auto relative z-10">
          <FadeIn>
            <span className="text-brand-gold font-heading tracking-[0.3em] text-sm">REGISTRATION</span>
            <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl text-white mt-2 leading-none">PAYMENTS</h1>
            <div className="mt-3 h-0.5 w-16 bg-brand-gold" />
          </FadeIn>
        </div>
      </div>

      <div className="py-12 px-4 max-w-4xl mx-auto">
        {/* Note */}
        <FadeIn>
          <div className="flex items-start gap-3 bg-brand-gold/10 border border-brand-gold/30 rounded-xl p-4 md:p-5 mb-10">
            <AlertCircle size={20} className="text-brand-gold flex-shrink-0 mt-0.5" />
            <p className="text-white/80 text-sm leading-relaxed">
              Registration is completed via our Google Form. After filling in the form, complete your payment using one of the methods below to confirm your spot.{' '}
              <Link href="/events" className="text-brand-gold hover:underline">Browse events →</Link>
            </p>
          </div>
        </FadeIn>

        {/* Payment Methods */}
        {methods.length > 0 && (
          <>
            <SectionHeader eyebrow="ACCEPTED" title="PAYMENT METHODS" centered={false} />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-12">
              {methods.map((method, i) => (
                <FadeIn key={method.id} delay={i * 0.1}>
                  <div className="bg-brand-card border border-brand-border rounded-xl p-5 flex flex-col items-center gap-3 text-center hover:border-brand-gold/40 transition-colors">
                    {method.logo_url ? (
                      <div className="relative w-16 h-10">
                        <Image src={method.logo_url} alt={method.name} fill className="object-contain" />
                      </div>
                    ) : (
                      <div className="w-16 h-10 bg-brand-border rounded flex items-center justify-center">
                        <span className="text-brand-gold/50 text-xs">LOGO</span>
                      </div>
                    )}
                    <p className="font-heading text-lg text-white tracking-wide">{method.name}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </>
        )}

        {/* Instructions */}
        <FadeIn>
          <SectionHeader eyebrow="HOW TO PAY" title="PAYMENT INSTRUCTIONS" centered={false} />
          <div className="bg-brand-card border border-brand-border rounded-xl p-6 md:p-8">
            <ol className="space-y-4">
              {steps.map((step: string, i: number) => (
                <li key={i} className="flex gap-4">
                  <div className="flex-shrink-0 w-7 h-7 rounded-full bg-brand-gold text-black font-heading text-sm flex items-center justify-center">
                    {i + 1}
                  </div>
                  <p className="text-white/70 leading-relaxed pt-0.5">{step}</p>
                </li>
              ))}
            </ol>
          </div>
        </FadeIn>

        {/* CTA */}
        <FadeIn className="mt-10 text-center">
          <p className="text-white/50 text-sm mb-4">Ready to register?</p>
          <Link
            href="/events"
            className="inline-flex items-center gap-2 px-8 py-3 bg-brand-gold text-black font-heading text-lg tracking-wider rounded hover:bg-yellow-400 transition-colors"
          >
            VIEW EVENTS <ExternalLink size={16} />
          </Link>
        </FadeIn>
      </div>
    </div>
  )
}
