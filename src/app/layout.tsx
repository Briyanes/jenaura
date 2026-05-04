import type { Metadata } from 'next'
import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import { Toaster } from 'sonner'
import SiteHeader from '@/components/layout/SiteHeader'
import Footer from '@/components/layout/Footer'
import WhatsAppButton from '@/components/layout/WhatsAppButton'
import './globals.css'

const cormorant = Cormorant_Garamond({
  variable: '--font-cormorant',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  display: 'swap',
})

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: {
    default: 'JENAURA — Hair Treatment At Home',
    template: '%s | JENAURA',
  },
  description:
    'JENAURA adalah leave-in treatment profesional yang bisa kamu pakai sendiri di rumah. Keratin No-Wash Treatment dengan Hydrolyzed Keratin, Silk & Argan Oil.',
  keywords: [
    'hair treatment',
    'keratin treatment',
    'perawatan rambut',
    'hair care',
    'leave in treatment',
    'jenaura',
    'no wash treatment',
  ],
  authors: [{ name: 'JENAURA' }],
  creator: 'JENAURA',
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    siteName: 'JENAURA',
    title: 'JENAURA — Hair Treatment At Home',
    description:
      'Keratin No-Wash Treatment untuk rambut yang bercahaya. Tanpa bilas. Tanpa ribet.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'JENAURA Hair Treatment' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JENAURA — Hair Treatment At Home',
    description: 'Keratin No-Wash Treatment untuk rambut yang bercahaya.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="id"
      className={`${cormorant.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-jena-ivory">
        {/* SiteHeader is position:fixed — no spacer needed, hero fills behind it */}
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppButton />
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
              fontSize: '0.875rem',
            },
          }}
        />
      </body>
    </html>
  )
}