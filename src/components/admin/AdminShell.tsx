'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import {
  LayoutDashboard, Settings, CalendarDays, Users, Image as ImageIcon,
  HelpCircle, CreditCard, Menu, X, LogOut, ChevronRight
} from 'lucide-react'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/events', label: 'Events', icon: CalendarDays },
  { href: '/admin/gallery', label: 'Gallery', icon: ImageIcon },
  { href: '/admin/team', label: 'Team', icon: Users },
  { href: '/admin/faq', label: 'FAQ', icon: HelpCircle },
  { href: '/admin/payments', label: 'Payments', icon: CreditCard },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userEmail, setUserEmail] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) { router.push('/admin/login'); return }
      setUserEmail(data.session.user.email ?? '')
    })
  }, [router])

  async function signOut() {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href)

  return (
    <div className="flex min-h-screen bg-[#080808]">
      {/* Sidebar overlay (mobile) */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/70 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-brand-black border-r border-brand-border flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:z-auto`}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 h-16 border-b border-brand-border">
          <div className="relative w-8 h-8">
            <Image src="/logo.png" alt="KR" fill className="object-contain" />
          </div>
          <div>
            <p className="font-heading text-sm text-brand-gold tracking-wider leading-none">ADMIN PANEL</p>
            <p className="text-white/30 text-xs leading-none mt-0.5">Kallyanpur Runners</p>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="ml-auto lg:hidden text-white/40 hover:text-white">
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {navItems.map(({ href, label, icon: Icon, exact }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-colors group ${
                isActive(href, exact)
                  ? 'bg-brand-gold/10 text-brand-gold border border-brand-gold/20'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon size={18} />
              <span className="text-sm font-medium">{label}</span>
              {isActive(href, exact) && <ChevronRight size={14} className="ml-auto" />}
            </Link>
          ))}
        </nav>

        {/* User */}
        <div className="border-t border-brand-border p-4">
          <p className="text-white/40 text-xs mb-2 truncate">{userEmail}</p>
          <button
            onClick={signOut}
            className="flex items-center gap-2 text-white/50 hover:text-red-400 text-sm transition-colors w-full"
          >
            <LogOut size={14} /> Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 bg-brand-black border-b border-brand-border flex items-center px-4 gap-3 sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 text-white/60 hover:text-white"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          <Link href="/" target="_blank" className="text-white/40 hover:text-brand-gold text-xs ml-auto transition-colors">
            View site â†’
          </Link>
        </header>

        <main className="flex-1 p-4 md:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
