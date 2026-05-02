'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import type { GalleryPhoto } from '@/lib/types'
import FadeIn from '@/components/ui/FadeIn'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'

export default function GalleryPage() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([])
  const [loading, setLoading] = useState(true)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const { data } = await supabase.from('gallery').select('*').order('sort_order', { ascending: true })
        setPhotos(data ?? [])
      } catch { /* empty */ }
      setLoading(false)
    }
    load()
  }, [])

  const openLightbox = (i: number) => {
    setLightboxIndex(i)
    document.body.style.overflow = 'hidden'
  }

  const closeLightbox = () => {
    setLightboxIndex(null)
    document.body.style.overflow = ''
  }

  const prev = () => setLightboxIndex((i) => (i !== null ? (i - 1 + photos.length) % photos.length : null))
  const next = () => setLightboxIndex((i) => (i !== null ? (i + 1) % photos.length : null))

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  return (
    <div className="pt-20">
      <div className="relative py-20 px-4 bg-brand-black border-b border-brand-border overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-gold/5 to-transparent" />
        <div className="max-w-4xl mx-auto relative z-10">
          <FadeIn>
            <span className="text-brand-gold font-heading tracking-[0.3em] text-sm">OUR MOMENTS</span>
            <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl text-white mt-2 leading-none">GALLERY</h1>
            <div className="mt-3 h-0.5 w-16 bg-brand-gold" />
          </FadeIn>
        </div>
      </div>

      <div className="py-12 px-4 max-w-7xl mx-auto">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-square bg-brand-card border border-brand-border rounded-lg animate-pulse" />
            ))}
          </div>
        ) : photos.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
            {photos.map((photo, i) => (
              <FadeIn key={photo.id} delay={i * 0.05}>
                <button
                  onClick={() => openLightbox(i)}
                  className="block relative aspect-square rounded-lg overflow-hidden group w-full"
                  aria-label={`View photo ${i + 1}`}
                >
                  <Image
                    src={photo.image_url}
                    alt={photo.caption ?? `Gallery photo ${i + 1}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 50vw, 33vw"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <ZoomIn size={24} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </button>
              </FadeIn>
            ))}
          </div>
        ) : (
          <FadeIn>
            <div className="text-center py-20 border border-dashed border-brand-border rounded-xl">
              <p className="text-white/40 font-heading text-2xl tracking-wider">GALLERY COMING SOON</p>
              <p className="text-white/30 text-sm mt-2">Photos from our events will appear here.</p>
            </div>
          </FadeIn>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && photos[lightboxIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={closeLightbox}
          >
            <button onClick={closeLightbox} className="absolute top-4 right-4 text-white/60 hover:text-white p-2 z-10">
              <X size={28} />
            </button>
            <button onClick={(e) => { e.stopPropagation(); prev() }} className="absolute left-3 md:left-6 text-white/60 hover:text-white p-3 z-10 bg-black/50 rounded-full">
              <ChevronLeft size={28} />
            </button>
            <button onClick={(e) => { e.stopPropagation(); next() }} className="absolute right-3 md:right-6 text-white/60 hover:text-white p-3 z-10 bg-black/50 rounded-full">
              <ChevronRight size={28} />
            </button>

            <motion.div
              key={lightboxIndex}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-4xl max-h-[85vh] w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full aspect-[4/3]">
                <Image
                  src={photos[lightboxIndex].image_url}
                  alt={photos[lightboxIndex].caption ?? ''}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              {photos[lightboxIndex].caption && (
                <p className="text-center text-white/60 text-sm mt-3">{photos[lightboxIndex].caption}</p>
              )}
              <p className="text-center text-white/30 text-xs mt-1">{lightboxIndex + 1} / {photos.length}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
