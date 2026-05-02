'use client'

import { motion } from 'framer-motion'

export default function HeroOverlay() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Animated gold lines */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-px bg-gradient-to-r from-transparent via-brand-gold/20 to-transparent w-full"
          style={{ top: `${20 + i * 15}%` }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 1.5, delay: i * 0.2, ease: 'easeInOut' }}
        />
      ))}
      {/* Corner accents */}
      <div className="absolute top-20 left-4 md:left-10 w-8 h-8 border-t-2 border-l-2 border-brand-gold/40" />
      <div className="absolute top-20 right-4 md:right-10 w-8 h-8 border-t-2 border-r-2 border-brand-gold/40" />
      <div className="absolute bottom-20 left-4 md:left-10 w-8 h-8 border-b-2 border-l-2 border-brand-gold/40" />
      <div className="absolute bottom-20 right-4 md:right-10 w-8 h-8 border-b-2 border-r-2 border-brand-gold/40" />
    </div>
  )
}
