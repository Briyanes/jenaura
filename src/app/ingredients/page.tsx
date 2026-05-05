import type { Metadata } from 'next'
import Link from 'next/link'
import { Sparkles, Droplets, Leaf, ArrowRight } from 'lucide-react'
import { HERO_PRODUCT } from '@/lib/mock-data'

export const metadata: Metadata = {
  title: 'Ingredients',
  description: 'Bahan-bahan premium dalam JENAURA: Hydrolyzed Keratin, Hydrolyzed Silk, dan Argan Oil.',
}

export default function IngredientsPage() {
  return (
    <main>
      {/* Hero */}
      <section className="bg-gradient-to-br from-jena-mocha to-jena-charcoal pb-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-jena-gold/8 rounded-full blur-[90px] pointer-events-none" />
        <div className="max-w-3xl mx-auto px-5 sm:px-6 lg:px-8 text-center relative header-pt-page">
          <p className="text-jena-gold text-xs tracking-[0.25em] uppercase mb-4 font-bold">Formula Premium</p>
          <h1 className="font-display text-3xl sm:text-4xl text-white font-bold mb-3">Ingredients <span className="text-jena-gold">JENAURA</span></h1>
          <p className="text-sm text-white/40 max-w-md mx-auto">Diformulasikan dengan bahan berkualitas tinggi yang terbukti efektif.</p>
        </div>
      </section>

      {/* Hero Ingredients */}
      <section className="py-8 sm:py-10 bg-jena-ivory">
        <div className="relative max-w-3xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="flex gap-3 overflow-x-auto snap-x scrollbar-hide pb-2 sm:grid sm:grid-cols-3 mb-4">
            {HERO_PRODUCT.heroIngredients.map((ing, i) => {
              const IconComponent = [Sparkles, Droplets, Leaf][i]
              return (
                <div key={ing.id} className="w-[72vw] max-w-[240px] flex-shrink-0 snap-start sm:w-auto sm:max-w-none bg-white/70 backdrop-blur-sm rounded-2xl p-5 border border-jena-peach/50 hover:border-jena-gold/40 hover:shadow-lg hover:shadow-jena-gold/8 transition-all">
                  <div className="w-10 h-10 mb-3 rounded-xl bg-jena-gold/10 border border-jena-gold/20 flex items-center justify-center">
                    <IconComponent size={18} className="text-jena-gold" />
                  </div>
                  <h2 className="font-display text-sm text-jena-mocha font-bold mb-1.5">{ing.name}</h2>
                  <p className="text-xs text-jena-charcoal/60 leading-relaxed">{ing.description}</p>
                </div>
              )
            })}
          </div>

          {/* Full list */}
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-jena-peach/50 mb-6">
            <p className="text-[10px] font-bold text-jena-gold/70 uppercase tracking-widest mb-2">Kandungan Lengkap</p>
            <p className="text-xs text-jena-charcoal/60 leading-relaxed">{HERO_PRODUCT.ingredientList}</p>
          </div>

          <div className="text-center">
            <Link href="/checkout" className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-jena-gold to-jena-gold-dark text-white px-8 py-3.5 rounded-full text-sm font-bold shadow-xl shadow-jena-gold/25 hover:scale-105 transition-all duration-300">
              Beli JENAURA Sekarang <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}