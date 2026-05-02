'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import AdminShell from '@/components/admin/AdminShell'
import { Upload, Trash2, ArrowUp, ArrowDown, ImagePlus, Loader2 } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'

interface HeroSlide {
  id: string
  image_url: string
  sort_order: number
}

export default function AdminHeroSlidesPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [slides, setSlides] = useState<HeroSlide[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) { router.push('/admin/login'); return }
      fetchSlides()
    })
  }, [router])

  async function fetchSlides() {
    const { data } = await supabase
      .from('hero_slides')
      .select('*')
      .order('sort_order', { ascending: true })
    setSlides(data ?? [])
    setLoading(false)
  }

  async function uploadFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    setUploading(true)

    const toUpload = Array.from(files).filter(f => f.type.startsWith('image/'))
    if (toUpload.length === 0) {
      toast.error('Please select image files only.')
      setUploading(false)
      return
    }

    let nextOrder = slides.length > 0 ? Math.max(...slides.map(s => s.sort_order)) + 1 : 0

    for (const file of toUpload) {
      const ext = file.name.split('.').pop()
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('hero-images')
        .upload(filename, file, { cacheControl: '3600', upsert: false })

      if (uploadError) {
        toast.error(`Failed to upload ${file.name}`)
        continue
      }

      const { data: urlData } = supabase.storage.from('hero-images').getPublicUrl(filename)

      await supabase.from('hero_slides').insert({
        image_url: urlData.publicUrl,
        sort_order: nextOrder++,
      })
    }

    toast.success(`${toUpload.length} slide(s) uploaded!`)
    await fetchSlides()
    setUploading(false)
  }

  async function deleteSlide(slide: HeroSlide) {
    if (!confirm('Remove this slide from the hero?')) return

    // Extract filename from URL
    const parts = slide.image_url.split('/')
    const filename = parts[parts.length - 1]

    await supabase.storage.from('hero-images').remove([filename])
    await supabase.from('hero_slides').delete().eq('id', slide.id)

    toast.success('Slide removed.')
    await fetchSlides()
  }

  async function moveSlide(index: number, direction: 'up' | 'down') {
    const newSlides = [...slides]
    const swapWith = direction === 'up' ? index - 1 : index + 1
    if (swapWith < 0 || swapWith >= newSlides.length) return

    // Swap sort_order values
    const aOrder = newSlides[index].sort_order
    const bOrder = newSlides[swapWith].sort_order

    await Promise.all([
      supabase.from('hero_slides').update({ sort_order: bOrder }).eq('id', newSlides[index].id),
      supabase.from('hero_slides').update({ sort_order: aOrder }).eq('id', newSlides[swapWith].id),
    ])

    await fetchSlides()
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    uploadFiles(e.dataTransfer.files)
  }

  return (
    <AdminShell>
      <Toaster position="top-right" />
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="font-heading text-3xl text-white tracking-wide">HERO SLIDES</h1>
          <p className="text-white/40 text-sm mt-1">
            These images cycle automatically in the homepage hero section.
          </p>
        </div>

        {/* Upload zone */}
        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => !uploading && fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all mb-8 ${
            dragOver
              ? 'border-brand-gold bg-brand-gold/5'
              : 'border-brand-border hover:border-brand-gold/50 hover:bg-white/[0.02]'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={e => uploadFiles(e.target.files)}
          />
          {uploading ? (
            <div className="flex flex-col items-center gap-3 text-white/60">
              <Loader2 size={32} className="animate-spin text-brand-gold" />
              <p className="text-sm">Uploading slides...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 text-white/50">
              <ImagePlus size={32} className="text-brand-gold/60" />
              <div>
                <p className="text-white/70 font-medium">Drop images here or click to upload</p>
                <p className="text-xs mt-1">PNG, JPG, WEBP — you can select multiple at once</p>
              </div>
              <div className="flex items-center gap-2 mt-1 px-4 py-2 border border-brand-border rounded-lg text-sm">
                <Upload size={14} />
                Choose Files
              </div>
            </div>
          )}
        </div>

        {/* Slides grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20 text-white/30">
            <Loader2 size={24} className="animate-spin mr-2" /> Loading slides...
          </div>
        ) : slides.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-brand-border rounded-xl">
            <p className="text-white/30 font-heading text-xl tracking-wider">NO SLIDES YET</p>
            <p className="text-white/20 text-sm mt-2">Upload images above to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {slides.map((slide, i) => (
              <div
                key={slide.id}
                className="relative group rounded-xl overflow-hidden border border-brand-border bg-brand-card aspect-video"
              >
                <Image
                  src={slide.image_url}
                  alt={`Slide ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-colors duration-200" />

                {/* Slide number badge */}
                <div className="absolute top-2 left-2 w-7 h-7 rounded-full bg-black/70 flex items-center justify-center text-white/70 text-xs font-heading">
                  {i + 1}
                </div>

                {/* Controls — visible on hover */}
                <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={() => moveSlide(i, 'up')}
                    disabled={i === 0}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title="Move up"
                  >
                    <ArrowUp size={16} />
                  </button>
                  <button
                    onClick={() => moveSlide(i, 'down')}
                    disabled={i === slides.length - 1}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title="Move down"
                  >
                    <ArrowDown size={16} />
                  </button>
                  <button
                    onClick={() => deleteSlide(slide)}
                    className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/40 text-red-400 transition-colors"
                    title="Delete slide"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {slides.length > 0 && (
          <p className="text-white/30 text-xs text-center mt-4">
            {slides.length} slide{slides.length !== 1 ? 's' : ''} • cycles every 5 seconds on the homepage
          </p>
        )}
      </div>
    </AdminShell>
  )
}
