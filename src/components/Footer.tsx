import Link from 'next/link'
import Image from 'next/image'
import { getSiteSettings } from '@/lib/settings'
import { Phone, Mail, MapPin } from 'lucide-react'
import FacebookIcon from '@/components/ui/FacebookIcon'

export default async function Footer() {
  const settings = await getSiteSettings()

  const quickLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About Us' },
    { href: '/events', label: 'Events' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/faq', label: 'FAQ' },
    { href: '/payments', label: 'Payments' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <footer className="bg-brand-black border-t border-brand-border mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="relative w-12 h-12">
                <Image src="/logo.png" alt="Kallyanpur Runners" fill className="object-contain" />
              </div>
              <div>
                <p className="font-heading text-xl text-brand-gold tracking-wider leading-none">KALLYANPUR</p>
                <p className="font-heading text-sm text-white tracking-widest leading-none">RUNNERS</p>
              </div>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed mb-4">
              Dhaka&apos;s premier running community. Run with purpose, race with heart.
            </p>
            {settings.facebook_url && (
              <a
                href={settings.facebook_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-white/60 hover:text-brand-gold transition-colors"
                aria-label="Facebook"
              >
                <FacebookIcon size={20} />
              </a>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading text-xl text-brand-gold tracking-wider mb-4">QUICK LINKS</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-brand-gold text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading text-xl text-brand-gold tracking-wider mb-4">CONTACT</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href={`tel:${settings.contact_phone}`}
                  className="flex items-center gap-2 text-white/60 hover:text-brand-gold text-sm transition-colors"
                >
                  <Phone size={14} />
                  {settings.contact_phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${settings.contact_email}`}
                  className="flex items-center gap-2 text-white/60 hover:text-brand-gold text-sm transition-colors"
                >
                  <Mail size={14} />
                  {settings.contact_email}
                </a>
              </li>
              <li>
                <span className="flex items-start gap-2 text-white/60 text-sm">
                  <MapPin size={14} className="mt-0.5 flex-shrink-0" />
                  {settings.contact_address}
                </span>
              </li>
            </ul>
          </div>

          {/* Newsletter / CTA */}
          <div>
            <h3 className="font-heading text-xl text-brand-gold tracking-wider mb-4">JOIN US</h3>
            <p className="text-white/60 text-sm leading-relaxed mb-4">
              Ready to start your running journey? Browse our upcoming events and register today.
            </p>
            <Link
              href="/events"
              className="inline-flex items-center px-5 py-2.5 bg-brand-gold text-black font-heading text-base tracking-wider rounded hover:bg-yellow-400 transition-colors"
            >
              VIEW EVENTS
            </Link>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-brand-border flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-white/40 text-sm text-center">{settings.footer_text}</p>
          <p className="text-white/30 text-xs">
            Built with â¤ï¸ for runners of Dhaka
          </p>
        </div>
      </div>
    </footer>
  )
}
