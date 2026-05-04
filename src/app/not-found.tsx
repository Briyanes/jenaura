import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="section bg-jena-ivory min-h-[60vh] flex items-center">
      <div className="container-wide px-4 sm:px-6 lg:px-8 text-center max-w-md mx-auto">
        <p className="font-display text-8xl text-jena-gold/20 mb-4">404</p>
        <h1 className="heading-1 text-2xl text-jena-mocha mb-3">Halaman Tidak Ditemukan</h1>
        <p className="text-sm text-jena-charcoal/60 mb-8">
          Maaf, halaman yang kamu cari tidak ada atau sudah dipindahkan.
        </p>
        <Link href="/" className="btn-primary">
          <ArrowLeft size={16} />
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  )
}