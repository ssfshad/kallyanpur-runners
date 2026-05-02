'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/events', label: 'Events' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/faq', label: 'FAQ' },
  { href: '/payments', label: 'Payments' },
  { href: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const isAdmin = pathname.startsWith('/admin')
  if (isAdmin) return null

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-brand-bg/95 backdrop-blur-md shadow-lg shadow-black/50' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="relative w-10 h-10 md:w-12 md:h-12">
                <Image
                  src="/logo.png"
                  alt="Kallyanpur Runners"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div className="hidden sm:block">
                <p className="font-heading text-xl text-brand-gold leading-none tracking-wider">KALLYANPUR</p>
                <p className="font-heading text-sm text-white leading-none tracking-widest">RUNNERS</p>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 text-sm font-medium tracking-wide transition-colors duration-200 hover:text-brand-gold ${
                    pathname === link.href ? 'text-brand-gold' : 'text-white/80'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* CTA + Hamburger */}
            <div className="flex items-center gap-3">
              <Link
                href="/events"
                className="hidden sm:inline-flex items-center px-4 py-2 bg-brand-gold text-black font-heading text-base tracking-wider rounded hover:bg-yellow-400 transition-colors min-touch"
              >
                GET TICKET
              </Link>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden p-2 text-white hover:text-brand-gold transition-colors min-touch"
                aria-label={isOpen ? 'Close menu' : 'Open menu'}
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-72 bg-brand-card border-l border-brand-border flex flex-col"
            >
              <div className="flex items-center justify-between p-4 border-b border-brand-border">
                <div className="flex items-center gap-2">
                  <div className="relative w-9 h-9">
                    <Image src="/logo.png" alt="Logo" fill className="object-contain" />
                  </div>
                  <span className="font-heading text-lg text-brand-gold tracking-wider">KALLYANPUR RUNNERS</span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 text-white/60 hover:text-white"
                  aria-label="Close"
                >
                  <X size={20} />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto py-4">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      className={`flex items-center px-6 py-4 text-base font-medium border-b border-brand-border/50 transition-colors hover:bg-brand-gold/10 hover:text-brand-gold ${
                        pathname === link.href ? 'text-brand-gold bg-brand-gold/5' : 'text-white/80'
                      }`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <div className="p-4 border-t border-brand-border">
                <Link
                  href="/events"
                  className="flex items-center justify-center w-full py-3 bg-brand-gold text-black font-heading text-lg tracking-wider rounded hover:bg-yellow-400 transition-colors"
                >
                  GET TICKET
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
