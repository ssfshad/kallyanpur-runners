'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { FAQ } from '@/lib/types'
import FadeIn from '@/components/ui/FadeIn'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'

function FAQItem({ faq, index }: { faq: FAQ; index: number }) {
  const [open, setOpen] = useState(false)
  return (
    <FadeIn delay={index * 0.05}>
      <div className={`border rounded-xl overflow-hidden transition-colors ${open ? 'border-brand-gold/50' : 'border-brand-border'}`}>
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between gap-4 p-5 md:p-6 text-left min-touch"
          aria-expanded={open}
        >
          <span className="font-heading text-lg md:text-xl text-white tracking-wide pr-2">{faq.question}</span>
          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-brand-gold/10 border border-brand-gold/30 flex items-center justify-center text-brand-gold">
            {open ? <Minus size={14} /> : <Plus size={14} />}
          </span>
        </button>
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <div className="px-5 md:px-6 pb-5 md:pb-6 border-t border-brand-border">
                <p className="text-white/60 leading-relaxed pt-4">{faq.answer}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </FadeIn>
  )
}

export default function FAQPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const { data } = await supabase.from('faqs').select('*').order('sort_order', { ascending: true })
        setFaqs(data ?? [])
      } catch { /* empty */ }
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div className="pt-20">
      <div className="relative py-20 px-4 bg-brand-black border-b border-brand-border overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-gold/5 to-transparent" />
        <div className="max-w-4xl mx-auto relative z-10">
          <FadeIn>
            <span className="text-brand-gold font-heading tracking-[0.3em] text-sm">GOT QUESTIONS?</span>
            <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl text-white mt-2 leading-none">FAQ</h1>
            <div className="mt-3 h-0.5 w-16 bg-brand-gold" />
          </FadeIn>
        </div>
      </div>

      <div className="py-12 px-4 max-w-3xl mx-auto">
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-brand-card border border-brand-border rounded-xl animate-pulse" />
            ))}
          </div>
        ) : faqs.length > 0 ? (
          <div className="space-y-3">
            {faqs.map((faq, i) => <FAQItem key={faq.id} faq={faq} index={i} />)}
          </div>
        ) : (
          <FadeIn>
            <div className="text-center py-16 border border-dashed border-brand-border rounded-xl">
              <p className="text-white/40 font-heading text-2xl tracking-wider">NO FAQS YET</p>
              <p className="text-white/30 text-sm mt-2">Frequently asked questions will appear here.</p>
            </div>
          </FadeIn>
        )}
      </div>
    </div>
  )
}
