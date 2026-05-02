import type { Metadata } from 'next'
import { Bebas_Neue, Inter } from 'next/font/google'
import './globals.css'
import { getSiteSettings } from '@/lib/settings'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Toaster } from 'react-hot-toast'

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  return {
    title: settings.seo_title || 'Kallyanpur Runners — Run With Purpose',
    description: settings.seo_description || "Kallyanpur Runners is Dhaka's premier running community.",
    keywords: 'Kallyanpur Runners, marathon, running, Dhaka, Bangladesh, fitness events',
    openGraph: {
      title: settings.seo_title,
      description: settings.seo_description,
      type: 'website',
    },
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bebasNeue.variable} ${inter.variable}`}>
      <body className="bg-brand-bg text-white font-body antialiased">
        <Toaster
          position="top-right"
          toastOptions={{
            style: { background: '#111111', color: '#fff', border: '1px solid #D4AF37' },
            success: { iconTheme: { primary: '#D4AF37', secondary: '#000' } },
          }}
        />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
