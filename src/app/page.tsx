import Link from 'next/link'
import {
  Sparkles, Droplets, Star,
  ArrowRight, ChevronRight, Truck, RotateCcw,
  Heart, Hand, ArrowDown,
  Scissors, AlertCircle, Wind, Palette,
  BadgeCheck, FlameKindling,
  ShoppingBag,
} from 'lucide-react'
import { HERO_PRODUCT, MOCK_FAQS } from '@/lib/mock-data'
import { formatRupiah } from '@/lib/utils'
import { PricingCarousel } from '@/components/PricingCarousel'

export default function HomePage() {
  return (
    <main>

      {/* ========== HERO ========== */}
      <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-top bg-no-repeat"
          style={{ backgroundImage: "url('/image-hero.webp')" }}
        />
        {/* Dark overlay agar teks terbaca */}
        <div className="absolute inset-0 bg-gradient-to-br from-jena-mocha/80 via-[#4a2e1f]/75 to-jena-charcoal/85" />

        {/* Background orbs */}
        <div className="absolute top-16 right-16 w-80 h-80 bg-jena-gold/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-16 left-8 w-96 h-96 bg-jena-rose/8 rounded-full blur-[140px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 w-full header-pt pb-16 sm:pb-14 lg:pb-14">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Text Content */}
            <div className="text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-jena-gold/15 border border-jena-gold/25 text-jena-gold text-xs font-bold tracking-[0.25em] uppercase px-4 py-2 rounded-full mb-6">
                <Sparkles size={12} />
                Hair Treatment At Home
              </div>

              {/* Headline */}
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white leading-[1.15] mb-6 font-bold">
                Anti-Kesat<br className="hidden sm:block" /> Sehabis Keramas,{' '}
                <em className="not-italic text-transparent bg-clip-text bg-gradient-to-r from-jena-gold via-jena-peach to-jena-gold">
                  Tanpa Bilas!
                </em>
              </h1>

              {/* Subtext */}
              <p className="text-white/65 text-base sm:text-lg mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                Keratin No-Wash Treatment yang bikin rambut lembut dan halus seketika.
                Hasil salon — bisa kamu lakukan sendiri di rumah.
              </p>

              {/* Price Box */}
              <div className="inline-flex items-center gap-4 justify-center lg:justify-start mb-8 bg-white/8 backdrop-blur-md rounded-2xl px-6 py-4 border border-white/15">
                <span className="text-3xl sm:text-4xl font-extrabold text-white">
                  {formatRupiah(HERO_PRODUCT.price)}
                </span>
                {HERO_PRODUCT.comparePrice && (
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-white/40 line-through">{formatRupiah(HERO_PRODUCT.comparePrice)}</span>
                    <span className="text-[11px] font-bold text-jena-mocha bg-gradient-to-r from-jena-gold to-jena-peach px-2.5 py-1 rounded-full inline-flex items-center gap-1">
                      <Sparkles size={10} />
                      HEMAT {Math.round(((HERO_PRODUCT.comparePrice - HERO_PRODUCT.price) / HERO_PRODUCT.comparePrice) * 100)}%
                    </span>
                  </div>
                )}
              </div>

              {/* CTAs */}
              <div className="flex flex-row gap-3 justify-center lg:justify-start mb-8">
                <Link
                  href="/checkout"
                  className="group inline-flex items-center justify-center gap-1.5 bg-gradient-to-r from-jena-gold to-jena-gold-dark text-white px-5 py-3 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 shadow-xl shadow-jena-gold/30 hover:shadow-2xl hover:shadow-jena-gold/40 hover:scale-105 hover:-translate-y-0.5 flex-1 sm:flex-none whitespace-nowrap"
                >
                  <ShoppingBag size={14} />
                  Beli Sekarang
                  <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href={`/produk/${HERO_PRODUCT.slug}`}
                  className="inline-flex items-center justify-center gap-2 bg-white/10 border border-white/20 text-white px-5 py-3 rounded-full text-xs sm:text-sm font-semibold hover:bg-white/18 transition-all duration-300 flex-1 sm:flex-none whitespace-nowrap"
                >
                  Lihat Detail
                </Link>
              </div>
            </div>

            {/* Product Visual Card */}
            <div className="hidden lg:flex items-center justify-center relative">
              <div className="absolute w-[400px] h-[480px] bg-jena-gold/8 rounded-3xl blur-3xl" />
              <div className="relative w-[360px] h-[440px] bg-white/8 backdrop-blur-2xl rounded-3xl border border-white/15 shadow-2xl overflow-hidden group hover:scale-[1.02] transition-transform duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-jena-gold/10 via-transparent to-jena-rose/5" />
                <div className="absolute -top-16 -right-16 w-48 h-48 bg-jena-gold/20 rounded-full blur-3xl group-hover:bg-jena-gold/30 transition-colors duration-500" />
                <div className="relative z-10 text-center p-10 flex flex-col items-center justify-center h-full gap-4">
                  <div>
                    <p className="font-display text-5xl font-bold text-white tracking-[0.2em] mb-2">JENAURA</p>
                    <div className="h-px w-20 bg-gradient-to-r from-transparent via-jena-gold to-transparent mx-auto" />
                  </div>
                  <p className="text-sm text-white/50 tracking-[0.18em] font-medium">Keratin Treatment</p>
                  <p className="text-xs text-white/30 tracking-wider">{HERO_PRODUCT.weight}</p>
                  <div className="flex items-center gap-1.5 mt-2">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} size={16} className="text-jena-gold fill-jena-gold" />
                    ))}
                  </div>
                  <p className="text-xs text-white/35 font-medium">4.9 · 1000+ Reviews</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-2 text-white/30">
          <span className="text-xs tracking-[0.15em] uppercase">Scroll</span>
          <ArrowDown size={16} className="animate-bounce" />
        </div>
      </section>

      {/* ========== TRUST BAR ========== */}
      <section className="bg-jena-ivory border-y border-jena-gold/10 py-5">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-0 sm:justify-between overflow-x-auto scrollbar-hide -mx-5 px-5 sm:mx-0 sm:px-0">
            {[
              { icon: BadgeCheck, label: 'BPOM Certified', sublabel: 'Aman & Terdaftar' },
              { icon: Star, label: '4.9/5 Rating', sublabel: '1000+ Happy Customers' },
              { icon: Truck, label: 'Free Ongkir', sublabel: 'Min. Rp189.000' },
              { icon: RotateCcw, label: 'Garansi 100%', sublabel: 'Money Back' },
              { icon: FlameKindling, label: 'Terlaris 2025', sublabel: '#1 Hair Treatment' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-1 flex-shrink-0">
                <div className="w-9 h-9 rounded-full bg-jena-gold/10 flex items-center justify-center flex-shrink-0">
                  <item.icon size={16} className="text-jena-gold" />
                </div>
                <div>
                  <p className="text-sm font-bold text-jena-mocha">{item.label}</p>
                  <p className="text-xs text-gray-400">{item.sublabel}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== PROBLEM → SOLUTION ========== */}
      <section className="py-10 sm:py-16 bg-jena-charcoal relative overflow-hidden">
        {/* subtle bg glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-jena-gold/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-8">
            <p className="text-jena-gold text-xs tracking-[0.25em] uppercase mb-3 font-bold">Masalah Rambut</p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white mb-4 font-bold">
              Masih <span className="text-jena-gold">Kesat</span> Sehabis Keramas?
            </h2>
            <p className="text-sm text-white/40 max-w-lg mx-auto leading-relaxed">
              6 masalah rambut yang sering diabaikan — semuanya bisa diatasi.
            </p>
          </div>

          {/* Problem Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 max-w-5xl mx-auto mb-8">
            {[
              { icon: Scissors, text: 'Rambut kering & kasar setelah rebonding' },
              { icon: AlertCircle, text: 'Ujung rambut bercabang & mudah patah' },
              { icon: Sparkles, text: 'Rambut kusam, tidak bercahaya' },
              { icon: Wind, text: 'Susah diatur setelah keramas' },
              { icon: Heart, text: 'Rambut rontok berlebihan' },
              { icon: Palette, text: 'Warna rambut cepat memudar' },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 sm:p-5 rounded-2xl bg-white/[0.04] border border-white/[0.08] hover:border-jena-gold/30 hover:bg-white/[0.07] transition-all duration-300 group"
              >
                <div className="w-10 h-10 rounded-xl bg-jena-gold/10 border border-jena-gold/20 flex items-center justify-center flex-shrink-0 group-hover:bg-jena-gold/20 transition-colors">
                  <item.icon size={16} className="text-jena-gold" />
                </div>
                <p className="text-sm font-medium text-white/70 group-hover:text-white/90 transition-colors">{item.text}</p>
              </div>
            ))}
          </div>

          {/* Solution CTA */}
          <div className="text-center">
            <div className="inline-flex flex-col items-center gap-3">
              <div className="inline-flex items-center gap-2 bg-jena-gold text-jena-charcoal px-7 py-3.5 rounded-full text-sm font-bold shadow-xl shadow-jena-gold/25">
                <Sparkles size={15} />
                Solusi: JENAURA dalam 2 Menit
              </div>
              <p className="text-sm text-white/40 max-w-md leading-relaxed">
                <span className="font-semibold text-white/70">Leave-in treatment profesional</span> — tanpa bilas, tanpa ribet, hasilnya langsung terasa.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========== HOW TO USE ========== */}
      <section className="py-10 sm:py-16 bg-jena-ivory relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-jena-peach/30 via-transparent to-transparent pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-8">
            <p className="text-jena-gold text-xs tracking-[0.25em] uppercase mb-4 font-bold">Cara Pakai</p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-jena-mocha mb-4 font-bold">
              4 Langkah,{' '}
              <span className="text-jena-gold">2 Menit</span>
            </h2>
            <p className="text-sm text-jena-mocha/50 max-w-md mx-auto">Semudah skincare routine — tanpa bilas, tanpa ribet.</p>
          </div>

          {/* Steps — horizontal on desktop, vertical on mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto mb-8">
            {HERO_PRODUCT.howToUse.map((step, i) => {
              const icons = [Droplets, Hand, ArrowDown, Sparkles]
              const IconComponent = icons[i]
              return (
                <div key={i} className="relative group">
                  {/* Connector line (desktop only) */}
                  {i < 3 && (
                    <div className="hidden lg:block absolute top-10 left-[calc(100%_-_12px)] w-6 h-px bg-jena-gold/25 z-10" />
                  )}
                  <div className="bg-white/70 backdrop-blur-sm border border-jena-peach/60 rounded-2xl p-4 sm:p-6 h-full hover:border-jena-gold/40 hover:shadow-lg hover:shadow-jena-gold/8 hover:-translate-y-1 transition-all duration-300">
                    {/* Number + Icon */}
                    <div className="flex items-center gap-3 mb-3 sm:mb-5">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-jena-gold to-jena-gold-dark flex items-center justify-center text-white font-bold text-base shadow-md shadow-jena-gold/25 flex-shrink-0">
                        {i + 1}
                      </div>
                      <div className="w-8 h-8 rounded-lg bg-jena-gold/10 flex items-center justify-center">
                        <IconComponent size={15} className="text-jena-gold" />
                      </div>
                    </div>
                    <p className="text-[11px] font-bold text-jena-mocha/40 uppercase tracking-widest mb-2">Langkah {i + 1}</p>
                    <p className="text-sm text-jena-charcoal/75 leading-relaxed">{step}</p>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="text-center">
            <Link
              href="/cara-pakai"
              className="inline-flex items-center gap-2 bg-jena-mocha text-white px-7 py-3.5 rounded-full text-sm font-semibold hover:bg-jena-mocha/90 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 group"
            >
              Panduan Lengkap
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* ========== PRICING ========== */}
      <section className="py-10 sm:py-16 bg-jena-charcoal relative overflow-hidden" id="harga">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-jena-gold/4 rounded-full blur-[140px] pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <p className="text-jena-gold text-xs tracking-[0.25em] uppercase mb-3 font-bold">Pilih Paket</p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white mb-4 font-bold">
              Mulai dari <span className="text-jena-gold">{formatRupiah(HERO_PRODUCT.price)}</span>
            </h2>
            <p className="text-sm text-white/40">Hemat lebih banyak dengan paket bundling.</p>
          </div>
          <PricingCarousel />
        </div>
      </section>

      {/* ========== FAQ ========== */}
      <section className="py-10 sm:py-16 bg-jena-ivory relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-jena-peach/25 via-transparent to-transparent pointer-events-none" />

        <div className="relative max-w-3xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <p className="text-jena-gold text-xs tracking-[0.25em] uppercase mb-4 font-bold">FAQ</p>
            <h2 className="font-display text-3xl sm:text-4xl text-jena-mocha mb-4 font-bold">
              Pertanyaan Umum
            </h2>
            <p className="text-sm text-jena-mocha/50">Semua yang perlu kamu tahu sebelum membeli.</p>
          </div>

          <div className="flex flex-col gap-2">
            {MOCK_FAQS.slice(0, 6).map((faq) => (
              <details key={faq.id} className="group bg-white/70 backdrop-blur-sm rounded-2xl overflow-hidden border border-jena-peach/50 hover:border-jena-gold/40 transition-all duration-300 hover:shadow-md hover:shadow-jena-gold/6">
                <summary className="flex items-center justify-between p-5 cursor-pointer list-none select-none">
                  <span className="text-sm sm:text-base font-semibold text-jena-charcoal pr-4">{faq.question}</span>
                  <div className="w-7 h-7 rounded-full border border-jena-gold/25 flex items-center justify-center flex-shrink-0 group-open:bg-jena-gold group-open:border-jena-gold transition-all duration-200">
                    <ChevronRight size={14} className="text-jena-gold group-open:text-jena-charcoal group-open:rotate-90 transition-transform duration-200" />
                  </div>
                </summary>
                <div className="px-5 pb-5 border-t border-jena-peach/40">
                  <p className="text-sm text-jena-charcoal/60 leading-relaxed pt-4">{faq.answer}</p>
                </div>
              </details>
            ))}
          </div>

          <div className="text-center mt-6">
            <Link
              href="/faq"
              className="inline-flex items-center gap-1.5 text-sm text-jena-gold font-semibold hover:text-jena-gold-dark transition-colors group"
            >
              Lihat semua FAQ
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* ========== FINAL CTA ========== */}
      <section className="py-8 sm:py-10 bg-gradient-to-br from-jena-mocha to-jena-charcoal overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-jena-gold/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-jena-rose/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
          {/* 2-col on desktop, stacked on mobile */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 lg:gap-16">

            {/* Left: Text */}
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-jena-gold/15 border border-jena-gold/25 text-jena-gold text-xs font-bold tracking-[0.2em] uppercase px-4 py-1.5 rounded-full mb-4">
                <Heart size={12} />
                Hair Treatment At Home
              </div>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white mb-4 font-bold leading-tight">
                <span className="text-jena-gold">Anti-Kesat Sehabis Keramas,</span><br />
                Tanpa Bilas!
              </h2>
            </div>

            {/* Right: CTA */}
            <div className="flex flex-col items-center lg:items-end gap-4 flex-shrink-0">
              <Link
                href="/checkout"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-jena-gold to-jena-gold-dark text-white px-8 py-4 rounded-full text-sm sm:text-base font-bold shadow-xl shadow-jena-gold/30 hover:scale-105 hover:-translate-y-0.5 transition-all duration-300 whitespace-nowrap w-full lg:w-auto"
              >
                <ShoppingBag size={18} />
                Beli Sekarang — {formatRupiah(HERO_PRODUCT.price)}
              </Link>
            </div>

          </div>
        </div>
      </section>

    </main>
  )
}
