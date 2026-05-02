'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import type { PaymentMethod } from '@/lib/types'
import AdminShell from '@/components/admin/AdminShell'
import toast from 'react-hot-toast'
import { Plus, Trash2, Save, X, Edit2, Upload } from 'lucide-react'

const inputCls = "w-full bg-brand-bg border border-brand-border rounded-lg px-4 py-2.5 text-white placeholder-white/30 focus:border-brand-gold focus:outline-none transition-colors text-sm"
const emptyForm = { name: '', logo_url: '', instructions: '' }

export default function AdminPayments() {
  const router = useRouter()
  const [methods, setMethods] = useState<PaymentMethod[]>([])
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
    const { data } = await supabase.from('payment_methods').select('*').order('sort_order', { ascending: true })
    setMethods(data ?? [])
    setLoading(false)
  }

  function openNew() { setForm(emptyForm); setEditId(null); setShowForm(true) }
  function openEdit(m: PaymentMethod) { setForm({ name: m.name, logo_url: m.logo_url ?? '', instructions: m.instructions ?? '' }); setEditId(m.id); setShowForm(true) }

  async function uploadLogo(file: File) {
    setUploading(true)
    const path = `logo-${Date.now()}.${file.name.split('.').pop()}`
    const { error } = await supabase.storage.from('payment-logos').upload(path, file, { upsert: true })
    if (error) { toast.error('Upload failed'); setUploading(false); return }
    const { data } = supabase.storage.from('payment-logos').getPublicUrl(path)
    setForm((f) => ({ ...f, logo_url: data.publicUrl }))
    toast.success('Logo uploaded!')
    setUploading(false)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const payload = { name: form.name, logo_url: form.logo_url || null, instructions: form.instructions || null, sort_order: methods.length }
    const { error } = editId
      ? await supabase.from('payment_methods').update(payload).eq('id', editId)
      : await supabase.from('payment_methods').insert(payload)
    if (error) { toast.error(error.message) } else { toast.success(editId ? 'Updated!' : 'Added!'); setShowForm(false); load() }
    setSaving(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this payment method?')) return
    await supabase.from('payment_methods').delete().eq('id', id)
    toast.success('Deleted')
    load()
  }

  return (
    <AdminShell>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-heading text-3xl text-white tracking-wide">PAYMENTS</h1>
            <p className="text-white/40 text-sm mt-1">Manage payment methods shown on the payments page</p>
          </div>
          <button onClick={openNew} className="flex items-center gap-2 px-4 py-2.5 bg-brand-gold text-black font-heading tracking-wide rounded-lg hover:bg-yellow-400 transition-colors text-sm">
            <Plus size={16} /> ADD METHOD
          </button>
        </div>

        <div className="bg-brand-card border border-brand-border rounded-xl p-4 mb-6">
          <p className="text-white/50 text-sm">
            💡 Payment instructions text is managed in <a href="/admin/settings" className="text-brand-gold hover:underline">Site Settings</a>.
          </p>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
            <div className="bg-brand-card border border-brand-border rounded-2xl w-full max-w-md">
              <div className="flex items-center justify-between p-5 border-b border-brand-border">
                <h2 className="font-heading text-xl text-white">{editId ? 'EDIT METHOD' : 'ADD METHOD'}</h2>
                <button onClick={() => setShowForm(false)} className="text-white/40 hover:text-white"><X size={20} /></button>
              </div>
              <form onSubmit={handleSave} className="p-5 space-y-4">
                <div>
                  <label className="block text-white/60 text-xs mb-1.5 uppercase tracking-wider">Name *</label>
                  <input required className={inputCls} value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="bKash" />
                </div>
                <div>
                  <label className="block text-white/60 text-xs mb-1.5 uppercase tracking-wider">Logo</label>
                  <div className="flex gap-2">
                    <input className={inputCls} placeholder="https://..." value={form.logo_url} onChange={(e) => setForm((f) => ({ ...f, logo_url: e.target.value }))} />
                    <label className="flex-shrink-0 flex items-center gap-1 px-3 py-2.5 bg-brand-border rounded-lg text-white/60 hover:text-white cursor-pointer text-xs">
                      {uploading ? <span className="w-4 h-4 border border-white/30 border-t-white rounded-full animate-spin" /> : <Upload size={14} />}
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && uploadLogo(e.target.files[0])} disabled={uploading} />
                    </label>
                  </div>
                </div>
                <div className="flex gap-3">
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
          <div className="grid grid-cols-2 gap-3">{[...Array(4)].map((_, i) => <div key={i} className="h-20 bg-brand-card border border-brand-border rounded-xl animate-pulse" />)}</div>
        ) : methods.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {methods.map((m) => (
              <div key={m.id} className="bg-brand-card border border-brand-border rounded-xl p-4 flex flex-col items-center gap-2 relative group">
                {m.logo_url ? (
                  <div className="relative w-16 h-10"><Image src={m.logo_url} alt={m.name} fill className="object-contain" /></div>
                ) : (
                  <div className="w-16 h-10 bg-brand-border rounded flex items-center justify-center"><span className="text-white/20 text-xs">LOGO</span></div>
                )}
                <p className="font-heading text-sm text-white tracking-wide">{m.name}</p>
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(m)} className="w-6 h-6 bg-brand-gold/20 rounded flex items-center justify-center text-brand-gold hover:bg-brand-gold/40"><Edit2 size={10} /></button>
                  <button onClick={() => handleDelete(m.id)} className="w-6 h-6 bg-red-500/20 rounded flex items-center justify-center text-red-400 hover:bg-red-500/40"><Trash2 size={10} /></button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border border-dashed border-brand-border rounded-xl">
            <p className="text-white/40 font-heading text-xl tracking-wider">NO METHODS YET</p>
            <button onClick={openNew} className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-brand-gold/10 border border-brand-gold/30 text-brand-gold rounded-lg text-sm hover:bg-brand-gold/20 transition-colors">
              <Plus size={14} /> Add Payment Method
            </button>
          </div>
        )}
      </div>
    </AdminShell>
  )
}
