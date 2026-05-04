'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, RefreshCw } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="section bg-jena-ivory min-h-[60vh] flex items-center">
      <div className="container-wide px-4 sm:px-6 lg:px-8 text-center max-w-md mx-auto">
        <p className="font-display text-8xl text-jena-terracotta/20 mb-4">500</p>
        <h1 className="heading-1 text-2xl text-jena-mocha mb-3">Terjadi Kesalahan</h1>
        <p className="text-sm text-jena-charcoal/60 mb-8">
          Maaf, terjadi kesalahan teknis. Silakan coba lagi atau kembali ke beranda.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={reset} className="btn-primary">
            <RefreshCw size={16} />
            Coba Lagi
          </button>
          <Link href="/" className="btn-secondary">
            <ArrowLeft size={16} />
            Kembali
          </Link>
        </div>
      </div>
    </div>
  )
}