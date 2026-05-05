import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Heart, Shield, Users, Sparkles, Star, Leaf, FlameKindling } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Tentang Kami',
  description: 'Cerita di balik JENAURA — Hair Treatment At Home.',
}

export default function TentangKamiPage() {
  return (
    <main className="overflow-hidden">

      {/* ── HERO ── */}
      <section className="relative bg-jena-charcoal overflow-hidden">
        {/* Ambient orbs */}
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-jena-gold/8 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-jena-rose/6 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 header-pt-page pb-16 sm:pb-20">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 bg-jena-gold/10 border border-jena-gold/20 text-jena-gold text-[11px] font-bold tracking-[0.3em] uppercase px-4 py-2 rounded-full mb-8">
            <Sparkles size={11} />
            Our Story
          </div>

          {/* Headline */}
          <h1 className="font-display text-5xl sm:text-6xl lg:text-8xl text-white font-bold leading-[1.05] mb-6">
            Di balik setiap<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-jena-gold via-jena-peach to-jena-gold">
              helai rambut
            </span>
          </h1>
          <p className="text-white/50 text-base sm:text-lg max-w-xl leading-relaxed">
            JENAURA adalah jawaban atas pertanyaan yang selalu kami tanyakan — mengapa perawatan rambut salon harus semahal dan sesulit itu?
          </p>
        </div>
      </section>

      {/* ── ORIGIN STORY ── */}
      <section className="bg-jena-ivory py-14 sm:py-20">
        <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-center">

            {/* Text */}
            <div>
              <p className="text-jena-gold text-[11px] tracking-[0.3em] uppercase font-bold mb-5">Awal Mula</p>
              <div className="space-y-4 text-[15px] text-jena-charcoal/65 leading-[1.85]">
                <p>
                  <strong className="text-jena-mocha font-semibold">JENAURA</strong> lahir dari kegelisahan nyata — rambut yang kering, kasar, dan susah diatur setelah keramas. Produk salon mahal, waktu terbatas, dan hasilnya pun tidak bertahan lama.
                </p>
                <p>
                  Kami percaya setiap wanita Indonesia berhak merasakan rambut sehat dan bercahaya — <em className="not-italic text-jena-mocha font-medium">di rumah, kapan saja, dengan harga yang masuk akal.</em>
                </p>
                <p>
                  Itulah lahirnya <strong className="text-jena-mocha font-semibold">JENAURA Keratin No-Wash Treatment</strong> — formula leave-in dengan Hydrolyzed Keratin, Hydrolyzed Silk, dan Argan Oil. Tanpa bilas. Hasilnya terasa mulai pemakaian pertama.
                </p>
              </div>
            </div>

            {/* Pull-quote card */}
            <div className="relative">
              <div className="bg-jena-mocha rounded-3xl p-8 sm:p-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-jena-gold/15 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-36 h-36 bg-jena-rose/10 rounded-full blur-2xl pointer-events-none" />
                <div className="relative">
                  <p className="font-display text-4xl sm:text-5xl text-jena-gold leading-[1.1] font-bold mb-6">
                    &ldquo;Salon quality. Home simplicity.&rdquo;
                  </p>
                  <div className="h-px w-12 bg-jena-gold/40 mb-5" />
                  <p className="text-white/50 text-sm tracking-wide">— Misi JENAURA</p>
                </div>
              </div>
              {/* Floating badge */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-jena-gold to-jena-gold-dark rounded-2xl flex flex-col items-center justify-center shadow-xl shadow-jena-gold/30 rotate-3">
                <p className="text-white font-bold text-lg leading-none">4.9</p>
                <div className="flex gap-0.5 mt-0.5">
                  {[1,2,3,4,5].map(i=><Star key={i} size={8} className="text-white fill-white"/>)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── BENTO VALUES ── */}
      <section className="bg-jena-charcoal py-14 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-jena-gold/4 via-transparent to-transparent pointer-events-none" />
        <div className="relative max-w-5xl mx-auto px-5 sm:px-6 lg:px-8">

          <div className="text-center mb-10">
            <p className="text-jena-gold text-[11px] tracking-[0.3em] uppercase font-bold mb-3">Nilai Kami</p>
            <h2 className="font-display text-3xl sm:text-4xl text-white font-bold">Yang kami percaya</h2>
          </div>

          {/* Bento grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { icon: Heart, title: 'Cinta', desc: 'Setiap formula dibuat dengan pemahaman mendalam kebutuhan rambut wanita Indonesia.', span: false },
              { icon: Shield, title: 'Kualitas', desc: 'Bahan premium, produksi ketat, dan standar keamanan yang tidak pernah dikompromikan.', span: false },
              { icon: Users, title: 'Komunitas', desc: 'Ribuan pelanggan yang saling berbagi hasil dan mendukung satu sama lain.', span: false },
              { icon: Leaf, title: 'Alami', desc: 'Bahan-bahan pilihan yang ramah kulit dan telah teruji secara dermatologis.', span: false },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="group bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5 hover:border-jena-gold/30 hover:bg-white/[0.07] transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-jena-gold/10 border border-jena-gold/15 flex items-center justify-center mb-4 group-hover:bg-jena-gold/20 transition-colors">
                  <Icon size={18} className="text-jena-gold" />
                </div>
                <h3 className="text-white font-semibold text-sm mb-2">{title}</h3>
                <p className="text-white/40 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="bg-jena-ivory py-14 sm:py-20">
        <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { num: '1000+', label: 'Pelanggan Puas', icon: Users },
              { num: '4.9', label: 'Rating Bintang', icon: Star },
              { num: '30+', label: 'Kota di Indonesia', icon: FlameKindling },
              { num: '100%', label: 'Garansi Uang Kembali', icon: Shield },
            ].map(({ num, label, icon: Icon }) => (
              <div key={label} className="relative group bg-white border border-jena-peach/60 rounded-2xl p-5 sm:p-7 hover:border-jena-gold/50 hover:shadow-lg hover:shadow-jena-gold/8 transition-all duration-300 overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-jena-gold/5 rounded-full blur-2xl" />
                <Icon size={16} className="text-jena-gold mb-3 opacity-70" />
                <p className="font-display text-3xl sm:text-4xl font-bold text-jena-mocha leading-none mb-2">{num}</p>
                <p className="text-xs text-jena-charcoal/45 font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MANIFESTO ── */}
      <section className="bg-gradient-to-br from-jena-mocha to-jena-charcoal py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-jena-gold/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-jena-rose/8 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative max-w-3xl mx-auto px-5 sm:px-6 lg:px-8 text-center">
          <Sparkles size={24} className="text-jena-gold mx-auto mb-6 opacity-60" />
          <p className="font-display text-3xl sm:text-4xl lg:text-5xl text-white font-bold leading-[1.2] mb-8">
            Rambut sehat bukan{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-jena-gold via-jena-peach to-jena-gold">
              kemewahan.
            </span>
            <br />Itu adalah hak setiap wanita.
          </p>
          <p className="text-white/45 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
            Kami ada untuk membuktikan bahwa perawatan rambut berkualitas bisa dilakukan sendiri di rumah — tanpa keahlian khusus, tanpa biaya besar.
          </p>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-jena-ivory py-14 sm:py-16">
        <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 text-center">
          <p className="text-jena-mocha/40 text-xs tracking-[0.25em] uppercase font-bold mb-4">Bergabung Bersama Kami</p>
          <h2 className="font-display text-2xl sm:text-3xl text-jena-mocha font-bold mb-8">
            Rasakan perbedaannya hari ini
          </h2>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/checkout"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-jena-gold to-jena-gold-dark text-white px-8 py-4 rounded-full text-sm font-bold shadow-xl shadow-jena-gold/25 hover:scale-105 hover:-translate-y-0.5 transition-all duration-300"
            >
              <Sparkles size={15} />
              Coba JENAURA Sekarang
              <ArrowRight size={15} />
            </Link>
            <Link
              href="/produk/jenaura-keratin-treatment"
              className="inline-flex items-center justify-center gap-2 bg-white border border-jena-peach text-jena-mocha px-8 py-4 rounded-full text-sm font-semibold hover:border-jena-gold/50 hover:shadow-md transition-all duration-300"
            >
              Lihat Produk
            </Link>
          </div>
        </div>
      </section>

    </main>
  )
}