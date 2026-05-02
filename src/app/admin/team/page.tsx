'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import type { TeamMember } from '@/lib/types'
import AdminShell from '@/components/admin/AdminShell'
import toast from 'react-hot-toast'
import { Save, Upload } from 'lucide-react'

const inputCls = "w-full bg-brand-bg border border-brand-border rounded-lg px-4 py-2.5 text-white placeholder-white/30 focus:border-brand-gold focus:outline-none transition-colors text-sm"

export default function AdminTeam() {
  const router = useRouter()
  const [members, setMembers] = useState<TeamMember[]>([])
  const [saving, setS] = useState<string | null>(null)
  const [uploading, setU] = useState<string | null>(null)
  const [forms, setForms] = useState<Record<string, TeamMember>>({})

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) { router.push('/admin/login'); return }
      load()
    })
  }, [router])

  async function load() {
    const { data } = await supabase.from('team_members').select('*').order('sort_order', { ascending: true })
    const list = data ?? []
    setMembers(list)
    const fm: Record<string, TeamMember> = {}
    list.forEach((m) => { fm[m.id] = { ...m } })
    setForms(fm)
  }

  function set(id: string, key: keyof TeamMember, value: string) {
    setForms((f) => ({ ...f, [id]: { ...f[id], [key]: value } }))
  }

  async function uploadPhoto(memberId: string, file: File) {
    setU(memberId)
    const path = `member-${memberId}-${Date.now()}.${file.name.split('.').pop()}`
    const { error } = await supabase.storage.from('team-photos').upload(path, file, { upsert: true })
    if (error) { toast.error('Upload failed'); setU(null); return }
    const { data } = supabase.storage.from('team-photos').getPublicUrl(path)
    set(memberId, 'photo_url', data.publicUrl)
    toast.success('Photo uploaded!')
    setU(null)
  }

  async function save(id: string) {
    setS(id)
    const m = forms[id]
    const { error } = await supabase.from('team_members').update({
      name: m.name, title: m.title, bio: m.bio,
      photo_url: m.photo_url, facebook_url: m.facebook_url,
    }).eq('id', id)
    if (error) { toast.error(error.message) } else { toast.success('Saved!') }
    setS(null)
  }

  return (
    <AdminShell>
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="font-heading text-3xl text-white tracking-wide">TEAM</h1>
          <p className="text-white/40 text-sm mt-1">Edit founder & team member profiles</p>
        </div>

        <div className="space-y-6">
          {members.map((member) => {
            const f = forms[member.id]
            if (!f) return null
            return (
              <div key={member.id} className="bg-brand-card border border-brand-border rounded-xl p-5 md:p-6">
                <div className="flex items-start gap-5 mb-5">
                  {/* Photo */}
                  <div className="flex-shrink-0">
                    <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-brand-border bg-brand-bg">
                      {f.photo_url ? (
                        <Image src={f.photo_url} alt={f.name} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="font-heading text-2xl text-brand-gold/30">{f.name.charAt(0)}</span>
                        </div>
                      )}
                    </div>
                    <label className="mt-2 flex items-center justify-center gap-1 text-xs text-white/40 hover:text-brand-gold cursor-pointer transition-colors">
                      <Upload size={11} />
                      {uploading === member.id ? 'Uploading...' : 'Upload'}
                      <input type="file" accept="image/*" className="hidden" disabled={uploading === member.id}
                        onChange={(e) => e.target.files?.[0] && uploadPhoto(member.id, e.target.files[0])} />
                    </label>
                  </div>

                  <div className="flex-1 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-white/50 text-xs mb-1 uppercase tracking-wider">Name</label>
                        <input className={inputCls} value={f.name} onChange={(e) => set(member.id, 'name', e.target.value)} />
                      </div>
                      <div>
                        <label className="block text-white/50 text-xs mb-1 uppercase tracking-wider">Title</label>
                        <input className={inputCls} placeholder="Founder" value={f.title ?? ''} onChange={(e) => set(member.id, 'title', e.target.value)} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-white/50 text-xs mb-1 uppercase tracking-wider">Facebook URL</label>
                      <input type="url" className={inputCls} placeholder="https://facebook.com/..." value={f.facebook_url ?? ''} onChange={(e) => set(member.id, 'facebook_url', e.target.value)} />
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-white/50 text-xs mb-1 uppercase tracking-wider">Bio</label>
                  <textarea rows={3} className={inputCls + ' resize-none'} placeholder="Short bio..." value={f.bio ?? ''} onChange={(e) => set(member.id, 'bio', e.target.value)} />
                </div>

                <button
                  onClick={() => save(member.id)}
                  disabled={saving === member.id}
                  className="flex items-center gap-2 px-5 py-2.5 bg-brand-gold text-black font-heading tracking-wide rounded-lg hover:bg-yellow-400 transition-colors text-sm disabled:opacity-60"
                >
                  {saving === member.id ? <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : <Save size={14} />}
                  SAVE CHANGES
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </AdminShell>
  )
}
