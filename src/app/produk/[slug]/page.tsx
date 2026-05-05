import type { Metadata } from 'next'
import Link from 'next/link'
import { Star, Check, Truck, Shield, RotateCcw, Sparkles, Droplets, Leaf, ArrowLeft } from 'lucide-react'
import { HERO_PRODUCT, PRODUCT_VARIANTS, MOCK_REVIEWS } from '@/lib/mock-data'
import { formatRupiah } from '@/lib/utils'
import ProductClientActions from './ProductClientActions'

export function generateMetadata(): Metadata {
  return {
    title: HERO_PRODUCT.name,
    description: HERO_PRODUCT.shortDescription,
    openGraph: {
      title: `${HERO_PRODUCT.name} | JENAURA`,
      description: HERO_PRODUCT.shortDescription,
    },
  }
}

export default function ProductDetailPage() {
  const product = HERO_PRODUCT

  return (
    <main>
      {/* Product Detail */}
      <section className="bg-jena-charcoal relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-jena-gold/6 rounded-full blur-[120px] pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 header-pt-page pb-8 sm:pb-12">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-white/30 mb-8">
            <Link href="/" className="hover:text-jena-gold transition-colors flex items-center gap-1">
              <ArrowLeft size={12} /> Home
            </Link>
            <span>/</span>
            <span className="text-white/50">Produk</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14">
            {/* Image placeholder */}
            <div className="space-y-3">
              <div className="aspect-square bg-white/[0.04] border border-white/[0.08] rounded-3xl flex items-center justify-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-jena-gold/8 via-transparent to-jena-rose/5" />
                <div className="absolute -top-16 -right-16 w-48 h-48 bg-jena-gold/15 rounded-full blur-3xl group-hover:bg-jena-gold/20 transition-colors duration-500" />
                <div className="relative text-center">
                  <p className="font-display text-5xl font-bold text-white tracking-[0.2em] mb-3">JENAURA</p>
                  <div className="h-px w-20 bg-gradient-to-r from-transparent via-jena-gold to-transparent mx-auto mb-3" />
                  <p className="text-xs text-white/30 tracking-wider">{product.weight}</p>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="aspect-square bg-white/[0.04] border border-white/[0.06] rounded-xl flex items-center justify-center cursor-pointer hover:border-jena-gold/30 transition-all">
                    <Sparkles size={16} className="text-jena-gold/20" />
                  </div>
                ))}
              </div>
            </div>

            {/* Info */}
            <div>
              <p className="text-[10px] font-bold text-jena-gold/60 uppercase tracking-widest mb-3">Hair Treatment</p>
              <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl text-white font-bold mb-2">{product.name}</h1>
              <p className="text-xs text-white/30 mb-4">{product.weight}</p>

              <div className="flex items-center gap-2 mb-5">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} className="text-jena-gold fill-jena-gold" />
                  ))}
                </div>
                <span className="text-xs text-white/30">4.9 (1000+ reviews)</span>
              </div>

              <div className="flex items-baseline gap-3 mb-5">
                <span className="text-3xl font-bold text-white">{formatRupiah(product.price)}</span>
                {product.comparePrice && (
                  <>
                    <span className="text-sm text-white/30 line-through">{formatRupiah(product.comparePrice)}</span>
                    <span className="text-[10px] font-bold text-jena-charcoal bg-jena-gold px-2.5 py-0.5 rounded-full">
                      HEMAT {Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}%
                    </span>
                  </>
                )}
              </div>

              <p className="text-sm text-white/50 leading-relaxed mb-6">{product.description}</p>

              <ProductClientActions product={product} variants={PRODUCT_VARIANTS} />

              <div className="grid grid-cols-3 gap-2 mt-6">
                {[
                  { icon: Truck, label: 'Free Ongkir*' },
                  { icon: Shield, label: 'Garansi 100%' },
                  { icon: RotateCcw, label: 'Easy Return' },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2 p-3 bg-white/[0.04] border border-white/[0.06] rounded-xl hover:border-jena-gold/25 transition-colors">
                    <Icon size={14} className="text-jena-gold flex-shrink-0" />
                    <span className="text-xs text-white/40">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-8 sm:py-10 bg-jena-ivory">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <p className="text-[10px] font-bold text-jena-gold/70 uppercase tracking-widest mb-1">Manfaat</p>
          <h2 className="font-display text-xl sm:text-2xl text-jena-mocha font-bold mb-4">Kenapa JENAURA?</h2>
          <div className="flex gap-3 overflow-x-auto snap-x scrollbar-hide pb-2 sm:grid sm:grid-cols-2 lg:grid-cols-4">
            {product.benefits.map((benefit, i) => (
              <div key={i} className="w-[70vw] max-w-[240px] flex-shrink-0 snap-start sm:w-auto sm:max-w-none flex items-start gap-2.5 p-3.5 rounded-xl bg-white/70 backdrop-blur-sm border border-jena-peach/50 hover:border-jena-gold/35 transition-colors">
                <div className="w-5 h-5 rounded-md bg-jena-gold/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check size={11} className="text-jena-gold" strokeWidth={2.5} />
                </div>
                <p className="text-xs text-jena-charcoal/70 leading-relaxed">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hero Ingredients + Full */}
      <section className="py-8 sm:py-10 bg-jena-charcoal">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <p className="text-[10px] font-bold text-jena-gold/60 uppercase tracking-widest mb-1">Bahan Aktif</p>
          <h2 className="font-display text-xl sm:text-2xl text-white font-bold mb-4">Hero Ingredients</h2>
          <div className="flex gap-3 overflow-x-auto snap-x scrollbar-hide pb-2 sm:grid sm:grid-cols-3 mb-4">
            {product.heroIngredients.map((ing, i) => {
              const IconComponent = [Sparkles, Droplets, Leaf][i]
              return (
                <div key={ing.id} className="w-[72vw] max-w-[260px] flex-shrink-0 snap-start sm:w-auto sm:max-w-none bg-white/[0.05] border border-white/[0.08] rounded-2xl p-5 hover:border-jena-gold/30 transition-all">
                  <div className="w-10 h-10 mb-3 rounded-xl bg-jena-gold/10 border border-jena-gold/15 flex items-center justify-center">
                    <IconComponent size={18} className="text-jena-gold" />
                  </div>
                  <h3 className="font-display text-sm text-white font-bold mb-1">{ing.name}</h3>
                  <p className="text-xs text-white/40 leading-relaxed">{ing.description}</p>
                </div>
              )
            })}
          </div>
          <div className="bg-white/[0.04] border border-white/[0.06] rounded-xl px-4 py-3">
            <span className="text-[10px] font-bold text-white/25 uppercase tracking-widest mr-2">Kandungan:</span>
            <span className="text-xs text-white/35 leading-relaxed">{product.ingredientList}</span>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-8 sm:py-10 bg-jena-ivory">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <p className="text-[10px] font-bold text-jena-gold/70 uppercase tracking-widest mb-1">Ulasan</p>
          <h2 className="font-display text-xl sm:text-2xl text-jena-mocha font-bold mb-4">Yang Mereka Rasakan</h2>
          <div className="flex gap-3 overflow-x-auto snap-x scrollbar-hide pb-2 sm:grid sm:grid-cols-3 lg:grid-cols-4">
            {MOCK_REVIEWS.map((review) => (
              <div key={review.id} className="w-[72vw] max-w-[280px] flex-shrink-0 snap-start sm:w-auto sm:max-w-none bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-jena-peach/50 hover:border-jena-gold/35 transition-colors">
                <div className="flex gap-0.5 mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={12} className={i < review.rating ? 'text-jena-gold fill-jena-gold' : 'text-jena-peach/40'} />
                  ))}
                </div>
                <p className="text-xs text-jena-charcoal/65 leading-relaxed mb-2">&ldquo;{review.comment}&rdquo;</p>
                <p className="text-[10px] text-jena-mocha/40">{review.customerName}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
