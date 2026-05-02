'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { Eye, EyeOff, LogIn } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/admin')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#080808]">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <Image src="/logo.png" alt="Kallyanpur Runners" fill className="object-contain" />
          </div>
          <h1 className="font-heading text-3xl text-white tracking-wide">ADMIN LOGIN</h1>
          <p className="text-white/40 text-sm mt-1">Kallyanpur Runners</p>
        </div>

        <form onSubmit={handleLogin} className="bg-brand-card border border-brand-border rounded-2xl p-6 space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-red-400 text-sm">
              {error}
            </div>
          )}
          <div>
            <label className="block text-white/60 text-xs uppercase tracking-wider mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-brand-bg border border-brand-border rounded-lg px-4 py-3 text-white placeholder-white/30 focus:border-brand-gold focus:outline-none transition-colors"
              placeholder="admin@example.com"
            />
          </div>
          <div>
            <label className="block text-white/60 text-xs uppercase tracking-wider mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-brand-bg border border-brand-border rounded-lg px-4 py-3 pr-11 text-white placeholder-white/30 focus:border-brand-gold focus:outline-none transition-colors"
                placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70"
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-brand-gold text-black font-heading text-lg tracking-wider rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            ) : (
              <><LogIn size={18} /> SIGN IN</>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
