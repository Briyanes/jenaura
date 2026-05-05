import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Tentang Kami',
  description: 'Cerita di balik JENAURA — Hair Treatment At Home.',
}

export default function TentangKamiPage() {
  return (
    <main className="bg-jena-charcoal min-h-screen">
      <div className="max-w-2xl mx-auto px-5 sm:px-6 pt-[5rem] sm:pt-[7.5rem] lg:pt-32 pb-20">

        <p className="text-jena-gold text-xs tracking-[0.25em] uppercase font-semibold mb-6">Tentang Kami</p>

        <h1 className="font-display text-4xl sm:text-5xl text-white font-bold leading-tight mb-8">
          Perawatan rambut salon,<br />dari rumah kamu.
        </h1>

        <div className="space-y-5 text-[15px] text-white/60 leading-[1.9]">
          <p>
            JENAURA lahir dari kegelisahan sederhana — rambut kering dan rusak, tapi perawatan salon terlalu mahal dan menyita waktu.
          </p>
          <p>
            Kami percaya setiap wanita berhak punya rambut sehat tanpa harus repot. Karena itu kami buat <strong className="text-white font-semibold">JENAURA Keratin No-Wash Treatment</strong> — formula leave-in dengan Hydrolyzed Keratin, Hydrolyzed Silk, dan Argan Oil. Tinggal oleskan, tidak perlu dibilas.
          </p>
          <p>
            Hasilnya terasa sejak pemakaian pertama.
          </p>
        </div>

        <div className="border-t border-white/10 mt-12 pt-10">
          <p className="text-sm text-white/30 mb-6">Ada pertanyaan? Kami senang membantu.</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/checkout"
              className="inline-flex items-center justify-center bg-jena-gold text-white px-7 py-1 rounded-full text-sm font-semibold hover:bg-jena-gold-dark transition-colors"
            >
              Coba Sekarang
            </Link>
            <Link
              href="/produk/jenaura-keratin-treatment"
              className="inline-flex items-center justify-center border border-white/20 text-white/70 px-7 py-1 rounded-full text-sm font-semibold hover:border-jena-gold/50 hover:text-white transition-colors"
            >
              Lihat Produk
            </Link>
          </div>
        </div>

      </div>
    </main>
  )
}