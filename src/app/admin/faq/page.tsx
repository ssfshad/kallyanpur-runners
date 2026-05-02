'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { FAQ } from '@/lib/types'
import AdminShell from '@/components/admin/AdminShell'
import toast from 'react-hot-toast'
import { Plus, Trash2, Save, X, GripVertical, Edit2 } from 'lucide-react'

const inputCls = "w-full bg-brand-bg border border-brand-border rounded-lg px-4 py-2.5 text-white placeholder-white/30 focus:border-brand-gold focus:outline-none transition-colors text-sm"

const emptyForm = { question: '', answer: '' }

export default function AdminFAQ() {
  const router = useRouter()
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) { router.push('/admin/login'); return }
      load()
    })
  }, [router])

  async function load() {
    const { data } = await supabase.from('faqs').select('*').order('sort_order', { ascending: true })
    setFaqs(data ?? [])
    setLoading(false)
  }

  function openNew() { setForm(emptyForm); setEditId(null); setShowForm(true) }
  function openEdit(faq: FAQ) { setForm({ question: faq.question, answer: faq.answer }); setEditId(faq.id); setShowForm(true) }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const payload = { question: form.question, answer: form.answer, sort_order: faqs.length }
    const { error } = editId
      ? await supabase.from('faqs').update(payload).eq('id', editId)
      : await supabase.from('faqs').insert(payload)
    if (error) { toast.error(error.message) } else { toast.success(editId ? 'Updated!' : 'Added!'); setShowForm(false); load() }
    setSaving(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this FAQ?')) return
    await supabase.from('faqs').delete().eq('id', id)
    toast.success('Deleted')
    load()
  }

  return (
    <AdminShell>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-heading text-3xl text-white tracking-wide">FAQ</h1>
            <p className="text-white/40 text-sm mt-1">Manage frequently asked questions</p>
          </div>
          <button onClick={openNew} className="flex items-center gap-2 px-4 py-2.5 bg-brand-gold text-black font-heading tracking-wide rounded-lg hover:bg-yellow-400 transition-colors text-sm">
            <Plus size={16} /> ADD FAQ
          </button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
            <div className="bg-brand-card border border-brand-border rounded-2xl w-full max-w-lg">
              <div className="flex items-center justify-between p-5 border-b border-brand-border">
                <h2 className="font-heading text-xl text-white">{editId ? 'EDIT FAQ' : 'NEW FAQ'}</h2>
                <button onClick={() => setShowForm(false)} className="text-white/40 hover:text-white"><X size={20} /></button>
              </div>
              <form onSubmit={handleSave} className="p-5 space-y-4">
                <div>
                  <label className="block text-white/60 text-xs mb-1.5 uppercase tracking-wider">Question *</label>
                  <input required className={inputCls} value={form.question} onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))} placeholder="What is the registration fee?" />
                </div>
                <div>
                  <label className="block text-white/60 text-xs mb-1.5 uppercase tracking-wider">Answer *</label>
                  <textarea required rows={4} className={inputCls + ' resize-none'} value={form.answer} onChange={(e) => setForm((f) => ({ ...f, answer: e.target.value }))} placeholder="The registration fee is..." />
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
          <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="h-16 bg-brand-card border border-brand-border rounded-xl animate-pulse" />)}</div>
        ) : faqs.length > 0 ? (
          <div className="space-y-2">
            {faqs.map((faq) => (
              <div key={faq.id} className="bg-brand-card border border-brand-border rounded-xl p-4 flex items-start gap-3">
                <div className="text-white/20 pt-0.5"><GripVertical size={16} /></div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium">{faq.question}</p>
                  <p className="text-white/40 text-xs mt-1 line-clamp-2">{faq.answer}</p>
                </div>
                <div className="flex gap-1.5 flex-shrink-0">
                  <button onClick={() => openEdit(faq)} className="p-1.5 text-white/40 hover:text-brand-gold transition-colors"><Edit2 size={14} /></button>
                  <button onClick={() => handleDelete(faq.id)} className="p-1.5 text-white/40 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border border-dashed border-brand-border rounded-xl">
            <p className="text-white/40 font-heading text-xl tracking-wider">NO FAQS YET</p>
            <button onClick={openNew} className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-brand-gold/10 border border-brand-gold/30 text-brand-gold rounded-lg text-sm hover:bg-brand-gold/20 transition-colors">
              <Plus size={14} /> Add First FAQ
            </button>
          </div>
        )}
      </div>
    </AdminShell>
  )
}
