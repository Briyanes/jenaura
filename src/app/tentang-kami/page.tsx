import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Heart, Shield, Users } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Tentang Kami',
  description: 'Cerita di balik JENAURA — Hair Treatment At Home.',
}

export default function TentangKamiPage() {
  return (
    <main>
      {/* Hero */}
      <section className="bg-gradient-to-br from-jena-mocha to-jena-charcoal pb-12 lg:pb-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-jena-gold/8 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 relative header-pt-page">
          <p className="text-jena-gold text-xs tracking-[0.25em] uppercase mb-4 font-bold">Cerita Kami</p>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white font-bold max-w-xl">Tentang <span className="text-jena-gold">JENAURA</span></h1>
        </div>
      </section>

      {/* Story */}
      <section className="py-8 sm:py-10 lg:py-16 bg-jena-ivory">
        <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-start">

            {/* Text */}
            <div className="space-y-4 text-lg text-jena-charcoal/65 leading-relaxed mb-8 lg:mb-0">
              <p><strong className="text-jena-mocha">JENAURA</strong> lahir dari pertanyaan sederhana: mengapa perawatan rambut profesional harus selalu dilakukan di salon?</p>
              <p>Kami percaya setiap wanita Indonesia berhak merasakan rambut sehat, bercahaya, dan mudah diatur — tanpa biaya mahal atau waktu berjam-jam di salon.</p>
              <p>Itulah mengapa kami menciptakan <strong className="text-jena-mocha">JENAURA Leave-In Keratin Hair Treatment</strong> — leave-in treatment dengan bahan premium: Hydrolyzed Keratin, Hydrolyzed Silk, dan Argan Oil. Tanpa bilas. Hasilnya terasa mulai pemakaian pertama.</p>
            </div>

            {/* Value cards */}
            <div className="flex gap-3 overflow-x-auto snap-x scrollbar-hide pb-2 lg:overflow-visible lg:flex-col lg:gap-2">
              {[
                { icon: Heart, title: 'Cinta pada Rambut', desc: 'Formula dibuat dengan pemahaman mendalam kebutuhan rambut wanita Indonesia.' },
                { icon: Shield, title: 'Kualitas Terjamin', desc: 'Bahan premium, produksi ketat, standar keamanan tinggi.' },
                { icon: Users, title: 'Komunitas Driven', desc: 'Ribuan pelanggan saling berbagi hasil dan mendukung.' },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="w-[72vw] max-w-[240px] flex-shrink-0 snap-start lg:w-auto lg:max-w-none lg:flex-shrink p-4 rounded-2xl bg-white/70 lg:bg-white border border-jena-peach/50 hover:border-jena-gold/40 transition-all lg:flex lg:items-start lg:gap-4 lg:text-left">
                  <div className="w-9 h-9 mx-auto mb-2.5 lg:mx-0 lg:mb-0 lg:mt-0.5 lg:flex-shrink-0 rounded-xl bg-jena-gold/10 flex items-center justify-center">
                    <Icon size={16} className="text-jena-gold" />
                  </div>
                  <div className="text-center lg:text-left">
                    <h3 className="font-semibold text-jena-mocha text-sm mb-1">{title}</h3>
                    <p className="text-base text-jena-charcoal/55 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-8 lg:py-14 bg-jena-ivory">
        <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <p className="text-jena-mocha/60 text-lg mb-4 lg:mb-0 text-center lg:text-left">Rasakan perbedaannya mulai hari ini.</p>
          <Link href="/checkout" className="flex items-center justify-center gap-2 bg-gradient-to-r from-jena-gold to-jena-gold-dark text-white px-8 py-3.5 rounded-full text-sm font-bold shadow-xl shadow-jena-gold/25 hover:scale-105 transition-all duration-300 lg:inline-flex lg:w-auto">
            Coba JENAURA Sekarang <ArrowRight size={15} />
          </Link>
        </div>
      </section>
    </main>
  )
}