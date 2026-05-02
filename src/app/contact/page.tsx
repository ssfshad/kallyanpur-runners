export const dynamic = 'force-dynamic'
import { getSiteSettings } from '@/lib/settings'
import FadeIn from '@/components/ui/FadeIn'
import { Phone, Mail, MapPin } from 'lucide-react'
import FacebookIcon from '@/components/ui/FacebookIcon'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact | Kallyanpur Runners',
  description: 'Get in touch with Kallyanpur Runners.',
}

export default async function ContactPage() {
  const settings = await getSiteSettings()

  return (
    <div className="pt-20">
      <div className="relative py-20 px-4 bg-brand-black border-b border-brand-border overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-gold/5 to-transparent" />
        <div className="max-w-4xl mx-auto relative z-10">
          <FadeIn>
            <span className="text-brand-gold font-heading tracking-[0.3em] text-sm">REACH OUT</span>
            <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl text-white mt-2 leading-none">CONTACT</h1>
            <div className="mt-3 h-0.5 w-16 bg-brand-gold" />
          </FadeIn>
        </div>
      </div>

      <div className="py-12 px-4 max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 mb-10">
          {/* Contact Info */}
          <FadeIn direction="right">
            <h2 className="font-heading text-2xl text-white tracking-wide mb-6">GET IN TOUCH</h2>
            <div className="space-y-5">
              <a
                href={`tel:${settings.contact_phone}`}
                className="flex items-center gap-4 group"
              >
                <div className="w-12 h-12 rounded-full bg-brand-gold/10 border border-brand-gold/30 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-gold/20 transition-colors">
                  <Phone size={18} className="text-brand-gold" />
                </div>
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-wider">Phone</p>
                  <p className="text-white group-hover:text-brand-gold transition-colors">{settings.contact_phone}</p>
                </div>
              </a>

              <a
                href={`mailto:${settings.contact_email}`}
                className="flex items-center gap-4 group"
              >
                <div className="w-12 h-12 rounded-full bg-brand-gold/10 border border-brand-gold/30 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-gold/20 transition-colors">
                  <Mail size={18} className="text-brand-gold" />
                </div>
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-wider">Email</p>
                  <p className="text-white group-hover:text-brand-gold transition-colors break-all">{settings.contact_email}</p>
                </div>
              </a>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-brand-gold/10 border border-brand-gold/30 flex items-center justify-center flex-shrink-0">
                  <MapPin size={18} className="text-brand-gold" />
                </div>
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-wider">Address</p>
                  <p className="text-white">{settings.contact_address}</p>
                </div>
              </div>

              {settings.facebook_url && (
                <a
                  href={settings.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 group"
                >
                  <div className="w-12 h-12 rounded-full bg-brand-gold/10 border border-brand-gold/30 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-gold/20 transition-colors">
                    <FacebookIcon size={18} className="text-brand-gold" />
                  </div>
                  <div>
                    <p className="text-white/40 text-xs uppercase tracking-wider">Facebook</p>
                    <p className="text-white group-hover:text-brand-gold transition-colors">Follow us on Facebook</p>
                  </div>
                </a>
              )}
            </div>
          </FadeIn>

          {/* Map */}
          <FadeIn direction="left" delay={0.1}>
            <div className="rounded-xl overflow-hidden border border-brand-border h-72 md:h-full min-h-[300px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3650.9!2d90.35!3d23.78!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c0f4b3dc6e8f%3A0x5e1b8b5dfc47b57!2sKallyanpur%2C+Dhaka!5e0!3m2!1sen!2sbd!4v1"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '300px' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Kallyanpur, Dhaka map"
              />
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  )
}
