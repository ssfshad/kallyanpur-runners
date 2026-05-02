'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { getSiteSettings, updateSiteSetting } from '@/lib/settings'
import AdminShell from '@/components/admin/AdminShell'
import type { SiteSettings } from '@/lib/types'
import toast from 'react-hot-toast'
import { Save, Upload } from 'lucide-react'

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-white/70 text-sm font-medium mb-1.5">{label}</label>
      {hint && <p className="text-white/30 text-xs mb-2">{hint}</p>}
      {children}
    </div>
  )
}

const inputCls = "w-full bg-brand-bg border border-brand-border rounded-lg px-4 py-3 text-white placeholder-white/30 focus:border-brand-gold focus:outline-none transition-colors text-sm"
const textareaCls = inputCls + " resize-none"

export default function AdminSettings() {
  const router = useRouter()
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) { router.push('/admin/login'); return }
      getSiteSettings().then(setSettings)
    })
  }, [router])

  function set(key: keyof SiteSettings, value: string) {
    setSettings((s) => s ? { ...s, [key]: value } : s)
  }

  async function save(e: React.FormEvent) {
    e.preventDefault()
    if (!settings) return
    setSaving(true)
    try {
      await Promise.all(
        Object.entries(settings).map(([k, v]) => updateSiteSetting(k, v))
      )
      toast.success('Settings saved!')
    } catch {
      toast.error('Failed to save settings.')
    } finally {
      setSaving(false)
    }
  }

  async function uploadHeroImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !settings) return
    setUploading(true)
    const ext = file.name.split('.').pop()
    const path = `hero-${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('hero-images').upload(path, file, { upsert: true })
    if (error) { toast.error('Upload failed'); setUploading(false); return }
    const { data } = supabase.storage.from('hero-images').getPublicUrl(path)
    set('hero_bg_url', data.publicUrl)
    toast.success('Image uploaded!')
    setUploading(false)
  }

  if (!settings) return (
    <AdminShell>
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-brand-gold/30 border-t-brand-gold rounded-full animate-spin" />
      </div>
    </AdminShell>
  )

  return (
    <AdminShell>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="font-heading text-3xl text-white tracking-wide">SITE SETTINGS</h1>
          <p className="text-white/40 text-sm mt-1">Edit all global site content from here.</p>
        </div>
        <form onSubmit={save} className="space-y-6">
          {/* Hero */}
          <section className="bg-brand-card border border-brand-border rounded-xl p-5 space-y-4">
            <h2 className="font-heading text-lg text-brand-gold tracking-wide">HERO SECTION</h2>
            <Field label="Tagline" hint="Main headline shown below the logo on the homepage">
              <input type="text" value={settings.hero_tagline} onChange={(e) => set('hero_tagline', e.target.value)} className={inputCls} />
            </Field>
            <Field label="Hero Background Image">
              <div className="flex items-center gap-3">
                <input type="text" value={settings.hero_bg_url} onChange={(e) => set('hero_bg_url', e.target.value)} className={inputCls} placeholder="https://..." />
                <label className="flex-shrink-0 flex items-center gap-1.5 px-3 py-3 bg-brand-border rounded-lg text-white/60 hover:text-white cursor-pointer text-xs">
                  {uploading ? <span className="w-4 h-4 border border-white/30 border-t-white rounded-full animate-spin" /> : <Upload size={14} />}
                  Upload
                  <input type="file" accept="image/*" className="hidden" onChange={uploadHeroImage} disabled={uploading} />
                </label>
              </div>
            </Field>
          </section>

          {/* About */}
          <section className="bg-brand-card border border-brand-border rounded-xl p-5 space-y-4">
            <h2 className="font-heading text-lg text-brand-gold tracking-wide">ABOUT</h2>
            <Field label="Homepage About Snippet" hint="Short blurb shown on the homepage">
              <textarea rows={3} value={settings.about_snippet} onChange={(e) => set('about_snippet', e.target.value)} className={textareaCls} />
            </Field>
            <Field label="Full About Page Description" hint="Full description on the About page. Use double newlines for paragraphs.">
              <textarea rows={6} value={settings.about_description} onChange={(e) => set('about_description', e.target.value)} className={textareaCls} />
            </Field>
            <Field label="Mission Statement">
              <textarea rows={3} value={settings.mission_text} onChange={(e) => set('mission_text', e.target.value)} className={textareaCls} />
            </Field>
            <Field label="Vision Statement">
              <textarea rows={3} value={settings.vision_text} onChange={(e) => set('vision_text', e.target.value)} className={textareaCls} />
            </Field>
          </section>

          {/* Contact */}
          <section className="bg-brand-card border border-brand-border rounded-xl p-5 space-y-4">
            <h2 className="font-heading text-lg text-brand-gold tracking-wide">CONTACT INFO</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Phone">
                <input type="text" value={settings.contact_phone} onChange={(e) => set('contact_phone', e.target.value)} className={inputCls} />
              </Field>
              <Field label="Email">
                <input type="email" value={settings.contact_email} onChange={(e) => set('contact_email', e.target.value)} className={inputCls} />
              </Field>
            </div>
            <Field label="Address">
              <input type="text" value={settings.contact_address} onChange={(e) => set('contact_address', e.target.value)} className={inputCls} />
            </Field>
            <Field label="Facebook URL">
              <input type="url" value={settings.facebook_url} onChange={(e) => set('facebook_url', e.target.value)} className={inputCls} placeholder="https://facebook.com/..." />
            </Field>
          </section>

          {/* SEO & Footer */}
          <section className="bg-brand-card border border-brand-border rounded-xl p-5 space-y-4">
            <h2 className="font-heading text-lg text-brand-gold tracking-wide">SEO & FOOTER</h2>
            <Field label="SEO Page Title">
              <input type="text" value={settings.seo_title} onChange={(e) => set('seo_title', e.target.value)} className={inputCls} />
            </Field>
            <Field label="SEO Meta Description">
              <textarea rows={2} value={settings.seo_description} onChange={(e) => set('seo_description', e.target.value)} className={textareaCls} />
            </Field>
            <Field label="Footer Text">
              <input type="text" value={settings.footer_text} onChange={(e) => set('footer_text', e.target.value)} className={inputCls} />
            </Field>
          </section>

          {/* Payments */}
          <section className="bg-brand-card border border-brand-border rounded-xl p-5 space-y-4">
            <h2 className="font-heading text-lg text-brand-gold tracking-wide">PAYMENT INSTRUCTIONS</h2>
            <Field label="Instructions" hint="Each line becomes a step. Use plain text.">
              <textarea rows={5} value={settings.payment_instructions} onChange={(e) => set('payment_instructions', e.target.value)} className={textareaCls} />
            </Field>
          </section>

          <button
            type="submit"
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-brand-gold text-black font-heading text-lg tracking-wider rounded-xl hover:bg-yellow-400 transition-colors disabled:opacity-60"
          >
            {saving ? <span className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : <Save size={18} />}
            SAVE SETTINGS
          </button>
        </form>
      </div>
    </AdminShell>
  )
}
