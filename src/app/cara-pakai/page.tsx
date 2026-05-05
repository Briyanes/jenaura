import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Clock, Sparkles, Droplets, Timer, Calendar, TrendingUp, Target, Scissors, Wind, Star } from 'lucide-react'
import { HERO_PRODUCT } from '@/lib/mock-data'

export const metadata: Metadata = {
  title: 'Cara Pakai',
  description: 'Panduan lengkap cara menggunakan JENAURA Keratin No-Wash Treatment. 4 langkah mudah, 2 menit, selesai.',
}

export default function CaraPakaiPage() {
  const steps = HERO_PRODUCT.howToUse
  const stepIcons = [Droplets, Sparkles, ArrowRight, Star]
  const stepLabels = ['Persiapan', 'Aplikasi', 'Penyebaran', 'Finishing']

  return (
    <main>
      {/* Hero */}
      <section className="bg-gradient-to-br from-jena-mocha to-jena-charcoal pb-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-jena-gold/8 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-3xl mx-auto px-5 sm:px-6 lg:px-8 text-center relative header-pt-page">
          <div className="inline-flex items-center gap-2 bg-jena-gold/15 border border-jena-gold/25 text-jena-gold text-xs font-bold tracking-[0.2em] uppercase px-4 py-1.5 rounded-full mb-5">
            <Clock size={12} />
            2 Menit Selesai
          </div>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white mb-4 font-bold">
            Cara Pakai <span className="text-jena-gold">JENAURA</span>
          </h1>
          <p className="text-white/50 text-base max-w-md mx-auto leading-relaxed">
            4 langkah sederhana untuk rambut bercahaya. Tanpa bilas, tanpa ribet.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="py-8 sm:py-10 bg-jena-ivory">
        <div className="relative max-w-2xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="space-y-3">
            {steps.map((step, i) => {
              const IconComponent = stepIcons[i]
              return (
                <div key={i} className="relative group">
                  {i < steps.length - 1 && (
                    <div className="hidden sm:block absolute left-[22px] top-[60px] bottom-[-16px] w-px border-l border-dashed border-jena-gold/20 z-0" />
                  )}
                  <div className="relative z-10 bg-white/70 backdrop-blur-sm rounded-2xl p-5 sm:p-6 border border-jena-peach/50 hover:border-jena-gold/40 hover:shadow-lg hover:shadow-jena-gold/8 transition-all duration-300">
                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-jena-gold to-jena-gold-dark text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-jena-gold/25 font-bold text-base">
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1.5">
                          <div className="w-6 h-6 rounded-md bg-jena-gold/10 flex items-center justify-center">
                            <IconComponent size={13} className="text-jena-gold" />
                          </div>
                          <span className="text-[10px] font-bold text-jena-gold/70 uppercase tracking-widest">{stepLabels[i]}</span>
                        </div>
                        <p className="text-base text-jena-charcoal/75 leading-relaxed">{step}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-8 bg-jena-charcoal">
        <div className="relative max-w-3xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="grid grid-cols-4 gap-2">
            {[
              { value: '2 Menit', label: 'Waktu Pakai', icon: Timer },
              { value: '0 Bilas', label: 'Tidak Perlu', icon: Sparkles },
              { value: '3–4x', label: 'Per Minggu', icon: Calendar },
              { value: '30 Hari', label: 'Hasil Optimal', icon: TrendingUp },
            ].map(({ value, label, icon: Icon }) => (
              <div key={label} className="bg-white/[0.05] border border-white/[0.08] rounded-xl p-3 text-center hover:border-jena-gold/30 transition-colors">
                <div className="w-8 h-8 mx-auto mb-2 rounded-lg bg-jena-gold/10 border border-jena-gold/15 flex items-center justify-center">
                  <Icon size={14} className="text-jena-gold" />
                </div>
                <p className="text-sm font-bold text-jena-gold leading-tight">{value}</p>
                <p className="text-[10px] text-white/40 mt-0.5 leading-tight">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tips */}
      <section className="py-8 sm:py-10 bg-jena-ivory">
        <div className="relative max-w-3xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-jena-gold text-xs tracking-[0.25em] uppercase font-bold">Pro Tips</p>
              <h2 className="font-display text-xl sm:text-2xl text-jena-mocha font-bold">Tips Hasil Optimal</h2>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              { tip: 'Gunakan 3-4x seminggu', icon: Calendar },
              { tip: 'Hindari kulit kepala langsung', icon: Target },
              { tip: 'Fokus batang hingga ujung', icon: Scissors },
              { tip: 'Sebelum atau sesudah styling', icon: Wind },
              { tip: 'Konsisten 30 hari', icon: Star },
              { tip: 'Rambut lembap setelah keramas', icon: Droplets },
            ].map(({ tip, icon: Icon }) => (
              <div key={tip} className="flex items-center gap-2.5 p-3 rounded-xl bg-white/70 backdrop-blur-sm border border-jena-peach/50 hover:border-jena-gold/40 transition-all group">
                <div className="w-7 h-7 rounded-lg bg-jena-gold/10 flex items-center justify-center flex-shrink-0 group-hover:bg-jena-gold/20 transition-colors">
                  <Icon size={13} className="text-jena-gold" />
                </div>
                <p className="text-sm text-jena-charcoal/70 leading-tight">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-8 sm:py-10 bg-gradient-to-br from-jena-mocha to-jena-charcoal">
        <div className="relative max-w-2xl mx-auto px-5 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-2xl sm:text-3xl text-white mb-3 font-bold">Siap Mulai Perawatan?</h2>
          <p className="text-white/40 text-base mb-7">Rambut bercahaya dimulai dari langkah pertama.</p>
          <Link href="/checkout" className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-jena-gold to-jena-gold-dark text-white px-8 py-3.5 rounded-full text-sm font-bold shadow-xl shadow-jena-gold/25 hover:scale-105 transition-all duration-300">
            Beli JENAURA Sekarang <ArrowRight size={15} />
          </Link>
        </div>
      </section>
    </main>
  )
}