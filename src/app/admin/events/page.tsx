'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import type { Event } from '@/lib/types'
import AdminShell from '@/components/admin/AdminShell'
import toast from 'react-hot-toast'
import { Plus, Trash2, Edit2, X, Save, Upload, Calendar } from 'lucide-react'

const inputCls = "w-full bg-brand-bg border border-brand-border rounded-lg px-4 py-2.5 text-white placeholder-white/30 focus:border-brand-gold focus:outline-none transition-colors text-sm"
const textareaCls = inputCls + " resize-none"

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

const emptyForm = {
  name: '', slug: '', date: '', location: '', description: '',
  categories: '', price: '', registration_link: '', banner_url: '', is_past: false,
}

export default function AdminEvents() {
  const router = useRouter()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) { router.push('/admin/login'); return }
      load()
    })
  }, [router])

  async function load() {
    const { data } = await supabase.from('events').select('*').order('date', { ascending: false })
    setEvents(data ?? [])
    setLoading(false)
  }

  function openNew() {
    setForm(emptyForm)
    setEditId(null)
    setShowForm(true)
  }

  function openEdit(ev: Event) {
    const d = new Date(ev.date)
    const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
    setForm({
      name: ev.name, slug: ev.slug, date: local,
      location: ev.location ?? '', description: ev.description ?? '',
      categories: (ev.categories ?? []).join(', '), price: ev.price ?? '',
      registration_link: ev.registration_link ?? '', banner_url: ev.banner_url ?? '',
      is_past: ev.is_past,
    })
    setEditId(ev.id)
    setShowForm(true)
  }

  async function uploadBanner(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const path = `banner-${Date.now()}.${file.name.split('.').pop()}`
    const { error } = await supabase.storage.from('event-banners').upload(path, file, { upsert: true })
    if (error) { toast.error('Upload failed'); setUploading(false); return }
    const { data } = supabase.storage.from('event-banners').getPublicUrl(path)
    setForm((f) => ({ ...f, banner_url: data.publicUrl }))
    toast.success('Banner uploaded!')
    setUploading(false)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const payload = {
      name: form.name, slug: form.slug, date: form.date,
      location: form.location || null, description: form.description || null,
      categories: form.categories ? form.categories.split(',').map((c) => c.trim()).filter(Boolean) : [],
      price: form.price || null, registration_link: form.registration_link || null,
      banner_url: form.banner_url || null, is_past: form.is_past,
    }
    const { error } = editId
      ? await supabase.from('events').update(payload).eq('id', editId)
      : await supabase.from('events').insert(payload)
    if (error) { toast.error(error.message); setSaving(false); return }
    toast.success(editId ? 'Event updated!' : 'Event created!')
    setShowForm(false)
    load()
    setSaving(false)
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"?`)) return
    const { error } = await supabase.from('events').delete().eq('id', id)
    if (error) { toast.error(error.message); return }
    toast.success('Deleted')
    load()
  }

  return (
    <AdminShell>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-heading text-3xl text-white tracking-wide">EVENTS</h1>
            <p className="text-white/40 text-sm mt-1">Manage all events</p>
          </div>
          <button onClick={openNew} className="flex items-center gap-2 px-4 py-2.5 bg-brand-gold text-black font-heading tracking-wide rounded-lg hover:bg-yellow-400 transition-colors text-sm">
            <Plus size={16} /> NEW EVENT
          </button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-start justify-center p-4 overflow-y-auto">
            <div className="bg-brand-card border border-brand-border rounded-2xl w-full max-w-2xl my-8">
              <div className="flex items-center justify-between p-5 border-b border-brand-border">
                <h2 className="font-heading text-xl text-white tracking-wide">{editId ? 'EDIT EVENT' : 'NEW EVENT'}</h2>
                <button onClick={() => setShowForm(false)} className="text-white/40 hover:text-white"><X size={20} /></button>
              </div>
              <form onSubmit={handleSave} className="p-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/60 text-xs mb-1.5 uppercase tracking-wider">Event Name *</label>
                    <input required className={inputCls} value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value, slug: editId ? f.slug : slugify(e.target.value) }))} />
                  </div>
                  <div>
                    <label className="block text-white/60 text-xs mb-1.5 uppercase tracking-wider">Slug *</label>
                    <input required className={inputCls} value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: slugify(e.target.value) }))} />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/60 text-xs mb-1.5 uppercase tracking-wider">Date & Time *</label>
                    <input required type="datetime-local" className={inputCls} value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} />
                  </div>
                  <div>
                    <label className="block text-white/60 text-xs mb-1.5 uppercase tracking-wider">Location</label>
                    <input className={inputCls} placeholder="Kallyanpur, Dhaka" value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} />
                  </div>
                </div>
                <div>
                  <label className="block text-white/60 text-xs mb-1.5 uppercase tracking-wider">Description</label>
                  <textarea rows={4} className={textareaCls} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/60 text-xs mb-1.5 uppercase tracking-wider">Categories (comma-separated)</label>
                    <input className={inputCls} placeholder="10K, 5K, 1K" value={form.categories} onChange={(e) => setForm((f) => ({ ...f, categories: e.target.value }))} />
                  </div>
                  <div>
                    <label className="block text-white/60 text-xs mb-1.5 uppercase tracking-wider">Price</label>
                    <input className={inputCls} placeholder="BDT 500" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} />
                  </div>
                </div>
                <div>
                  <label className="block text-white/60 text-xs mb-1.5 uppercase tracking-wider">Registration Link (Google Form)</label>
                  <input type="url" className={inputCls} placeholder="https://forms.google.com/..." value={form.registration_link} onChange={(e) => setForm((f) => ({ ...f, registration_link: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-white/60 text-xs mb-1.5 uppercase tracking-wider">Banner Image</label>
                  <div className="flex items-center gap-2">
                    <input className={inputCls} placeholder="https://..." value={form.banner_url} onChange={(e) => setForm((f) => ({ ...f, banner_url: e.target.value }))} />
                    <label className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2.5 bg-brand-border rounded-lg text-white/60 hover:text-white cursor-pointer text-xs">
                      {uploading ? <span className="w-4 h-4 border border-white/30 border-t-white rounded-full animate-spin" /> : <Upload size={14} />}
                      <input type="file" accept="image/*" className="hidden" onChange={uploadBanner} disabled={uploading} />
                    </label>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <input type="checkbox" id="is_past" checked={form.is_past} onChange={(e) => setForm((f) => ({ ...f, is_past: e.target.checked }))} className="w-4 h-4 accent-brand-gold" />
                  <label htmlFor="is_past" className="text-white/60 text-sm">Mark as past event</label>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2.5 border border-brand-border text-white/60 hover:text-white rounded-lg text-sm transition-colors">Cancel</button>
                  <button type="submit" disabled={saving} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-brand-gold text-black font-heading tracking-wide rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-60 text-sm">
                    {saving ? <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : <Save size={14} />}
                    SAVE
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* List */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => <div key={i} className="h-20 bg-brand-card border border-brand-border rounded-xl animate-pulse" />)}
          </div>
        ) : events.length > 0 ? (
          <div className="space-y-3">
            {events.map((ev) => (
              <div key={ev.id} className="bg-brand-card border border-brand-border rounded-xl p-4 flex items-center gap-4">
                <div className="relative w-16 h-12 rounded overflow-hidden flex-shrink-0 bg-brand-border">
                  {ev.banner_url ? <Image src={ev.banner_url} alt="" fill className="object-cover" /> : <div className="w-full h-full flex items-center justify-center"><Calendar size={14} className="text-brand-gold/40" /></div>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-sm truncate">{ev.name}</p>
                  <p className="text-white/40 text-xs mt-0.5">{new Date(ev.date).toLocaleDateString('en-BD')} · {ev.location}</p>
                </div>
                <span className={`px-2 py-0.5 text-xs font-heading tracking-wide rounded flex-shrink-0 ${ev.is_past ? 'bg-white/10 text-white/50' : 'bg-brand-gold/20 text-brand-gold'}`}>
                  {ev.is_past ? 'PAST' : 'UPCOMING'}
                </span>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => openEdit(ev)} className="p-2 text-white/40 hover:text-brand-gold transition-colors"><Edit2 size={15} /></button>
                  <button onClick={() => handleDelete(ev.id, ev.name)} className="p-2 text-white/40 hover:text-red-400 transition-colors"><Trash2 size={15} /></button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border border-dashed border-brand-border rounded-xl">
            <p className="text-white/40 font-heading text-xl tracking-wider">NO EVENTS YET</p>
            <button onClick={openNew} className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-brand-gold/10 border border-brand-gold/30 text-brand-gold rounded-lg text-sm hover:bg-brand-gold/20 transition-colors">
              <Plus size={14} /> Create First Event
            </button>
          </div>
        )}
      </div>
    </AdminShell>
  )
}
