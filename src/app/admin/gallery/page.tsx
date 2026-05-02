'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import type { GalleryPhoto } from '@/lib/types'
import AdminShell from '@/components/admin/AdminShell'
import toast from 'react-hot-toast'
import { Upload, Trash2 } from 'lucide-react'

export default function AdminGallery() {
  const router = useRouter()
  const [photos, setPhotos] = useState<GalleryPhoto[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) { router.push('/admin/login'); return }
      load()
    })
  }, [router])

  async function load() {
    const { data } = await supabase.from('gallery').select('*').order('sort_order', { ascending: true })
    setPhotos(data ?? [])
    setLoading(false)
  }

  async function uploadFiles(files: FileList | File[]) {
    const fileArr = Array.from(files)
    setUploading(true)
    let count = 0
    const maxOrder = photos.length
    for (const file of fileArr) {
      const path = `photo-${Date.now()}-${Math.random().toString(36).slice(2)}.${file.name.split('.').pop()}`
      const { error: upErr } = await supabase.storage.from('gallery-photos').upload(path, file)
      if (upErr) { toast.error(`Failed: ${file.name}`); continue }
      const { data } = supabase.storage.from('gallery-photos').getPublicUrl(path)
      await supabase.from('gallery').insert({ image_url: data.publicUrl, sort_order: maxOrder + count })
      count++
    }
    if (count > 0) toast.success(`${count} photo(s) uploaded!`)
    await load()
    setUploading(false)
  }

  async function deletePhoto(photo: GalleryPhoto) {
    if (!confirm('Delete this photo?')) return
    await supabase.from('gallery').delete().eq('id', photo.id)
    toast.success('Deleted')
    load()
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    if (e.dataTransfer.files.length) uploadFiles(e.dataTransfer.files)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photos])

  return (
    <AdminShell>
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="font-heading text-3xl text-white tracking-wide">GALLERY</h1>
          <p className="text-white/40 text-sm mt-1">Upload and manage gallery photos</p>
        </div>

        {/* Upload zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          className={`relative border-2 border-dashed rounded-xl p-10 text-center mb-8 transition-colors ${dragOver ? 'border-brand-gold bg-brand-gold/5' : 'border-brand-border hover:border-brand-gold/40'}`}
        >
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-brand-gold/10 flex items-center justify-center">
              <Upload size={20} className="text-brand-gold" />
            </div>
            <div>
              <p className="text-white font-medium text-sm">Drag & drop photos here</p>
              <p className="text-white/40 text-xs mt-1">or click to browse</p>
            </div>
            <label className="px-5 py-2 bg-brand-gold text-black font-heading tracking-wide rounded-lg text-sm hover:bg-yellow-400 transition-colors cursor-pointer">
              {uploading ? 'Uploading...' : 'SELECT FILES'}
              <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => e.target.files && uploadFiles(e.target.files)} disabled={uploading} />
            </label>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {[...Array(8)].map((_, i) => <div key={i} className="aspect-square bg-brand-card border border-brand-border rounded-lg animate-pulse" />)}
          </div>
        ) : photos.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {photos.map((photo) => (
              <div key={photo.id} className="relative group aspect-square rounded-lg overflow-hidden border border-brand-border">
                <Image src={photo.image_url} alt={photo.caption ?? ''} fill className="object-cover" sizes="25vw" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors" />
                <button
                  onClick={() => deletePhoto(photo)}
                  className="absolute top-2 right-2 w-7 h-7 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  aria-label="Delete"
                >
                  <Trash2 size={12} className="text-white" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 border border-dashed border-brand-border rounded-xl">
            <p className="text-white/40 font-heading text-xl tracking-wider">NO PHOTOS YET</p>
            <p className="text-white/30 text-sm mt-1">Upload photos above to get started.</p>
          </div>
        )}
      </div>
    </AdminShell>
  )
}
