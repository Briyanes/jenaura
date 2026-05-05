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
      <section className="bg-gradient-to-br from-jena-mocha to-jena-charcoal pb-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-jena-gold/8 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-2xl mx-auto px-5 sm:px-6 lg:px-8 text-center relative header-pt-page">
          <p className="text-jena-gold text-xs tracking-[0.25em] uppercase mb-4 font-bold">Cerita Kami</p>
          <h1 className="font-display text-3xl sm:text-4xl text-white font-bold">Tentang <span className="text-jena-gold">JENAURA</span></h1>
        </div>
      </section>

      {/* Story */}
      <section className="py-8 sm:py-10 bg-jena-ivory">
        <div className="relative max-w-2xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="space-y-4 text-sm text-jena-charcoal/65 leading-relaxed mb-8">
            <p><strong className="text-jena-mocha">JENAURA</strong> lahir dari pertanyaan sederhana: mengapa perawatan rambut profesional harus selalu dilakukan di salon?</p>
            <p>Kami percaya setiap wanita Indonesia berhak merasakan rambut sehat, bercahaya, dan mudah diatur — tanpa biaya mahal atau waktu berjam-jam di salon.</p>
            <p>Itulah mengapa kami menciptakan <strong className="text-jena-mocha">JENAURA Keratin No-Wash Treatment</strong> — leave-in treatment dengan bahan premium: Hydrolyzed Keratin, Hydrolyzed Silk, dan Argan Oil. Tanpa bilas. Hasilnya terasa mulai pemakaian pertama.</p>
          </div>

          {/* Value cards — 1 row horizontal scroll mobile */}
          <div className="flex gap-3 overflow-x-auto snap-x scrollbar-hide pb-2 sm:grid sm:grid-cols-3">
            {[
              { icon: Heart, title: 'Cinta pada Rambut', desc: 'Formula dibuat dengan pemahaman mendalam kebutuhan rambut wanita Indonesia.' },
              { icon: Shield, title: 'Kualitas Terjamin', desc: 'Bahan premium, produksi ketat, standar keamanan tinggi.' },
              { icon: Users, title: 'Komunitas Driven', desc: 'Ribuan pelanggan saling berbagi hasil dan mendukung.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="w-[72vw] max-w-[240px] flex-shrink-0 snap-start sm:w-auto sm:max-w-none text-center p-4 rounded-2xl bg-white/70 backdrop-blur-sm border border-jena-peach/50 hover:border-jena-gold/40 transition-all">
                <div className="w-9 h-9 mx-auto mb-2.5 rounded-xl bg-jena-gold/10 flex items-center justify-center">
                  <Icon size={16} className="text-jena-gold" />
                </div>
                <h3 className="font-semibold text-jena-mocha text-sm mb-1">{title}</h3>
                <p className="text-xs text-jena-charcoal/55 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8 bg-jena-charcoal">
        <div className="relative max-w-2xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 gap-3 text-center">
            {[
              { num: '1000+', label: 'Pelanggan Puas' },
              { num: '4.9/5', label: 'Rating' },
              { num: '30+', label: 'Kota' },
            ].map(({ num, label }) => (
              <div key={label} className="bg-white/[0.05] border border-white/[0.08] rounded-2xl p-5 hover:border-jena-gold/30 transition-colors">
                <p className="text-2xl sm:text-3xl font-bold text-jena-gold">{num}</p>
                <p className="text-xs text-white/40 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-8 bg-jena-ivory">
        <div className="max-w-2xl mx-auto px-5 sm:px-6 lg:px-8 text-center">
          <Link href="/checkout" className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-jena-gold to-jena-gold-dark text-white px-8 py-3.5 rounded-full text-sm font-bold shadow-xl shadow-jena-gold/25 hover:scale-105 transition-all duration-300">
            Coba JENAURA Sekarang <ArrowRight size={15} />
          </Link>
        </div>
      </section>
    </main>
  )
}