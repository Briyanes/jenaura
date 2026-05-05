'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'
import { PRODUCT_VARIANTS, HERO_PRODUCT } from '@/lib/mock-data'
import { formatRupiah } from '@/lib/utils'

interface VariantItem {
  name: string
  quantity: number
  price: number
  saveAmount: number
}

interface PricingCarouselProps {
  variants?: VariantItem[]
  productSlug?: string
  productImage?: string
}

export function PricingCarousel({ variants, productSlug, productImage }: PricingCarouselProps = {}) {
  const displayVariants = variants?.length ? variants : PRODUCT_VARIANTS
  const slug = productSlug || HERO_PRODUCT.slug
  const image = productImage || HERO_PRODUCT.images[0]

  return (
    /* py-6 on wrapper gives hover-lift headroom without clipping */
    <div className="py-6 -my-6">
      {/* Mobile: horizontal scroll | Desktop: 3-col grid */}
      <div className="flex gap-4 overflow-x-auto snap-x scrollbar-hide sm:grid sm:grid-cols-3 sm:gap-5 lg:gap-8 sm:overflow-visible pb-4 sm:pb-0 -mx-5 px-5 sm:mx-0 sm:px-0">
        {displayVariants.map((variant, i) => (
          <Link
            key={i}
            href={`/produk/${slug}?variant=${i}`}
            className="group relative flex flex-col rounded-2xl bg-white/[0.06] border border-white/10 hover:border-jena-gold/40 overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-jena-gold/10 w-[72vw] max-w-[280px] flex-shrink-0 sm:w-auto sm:max-w-none snap-start"
          >
            {/* Best Value badge */}
            {i === displayVariants.length - 1 && displayVariants.length > 1 && (
              <div className="absolute top-3 right-3 z-10 flex items-center gap-1 bg-jena-gold text-jena-charcoal text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                <Sparkles size={10} />
                Best Value
              </div>
            )}

            {/* Image area */}
            <div className="relative w-full aspect-[4/5] bg-jena-charcoal/60 overflow-hidden">
              <Image
                src={image}
                alt={variant.name}
                fill
                className="object-contain object-center p-8 transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 80vw, 33vw"
              />
              {/* Tube count pill */}
              <div className="absolute bottom-3 left-3 bg-black/40 backdrop-blur-sm text-white text-[11px] font-semibold px-3 py-1 rounded-full">
                {variant.quantity} Tube
              </div>
            </div>

            {/* Info area */}
            <div className="flex flex-col flex-1 p-5">
              <p className="text-[10px] font-bold text-jena-gold/70 uppercase tracking-widest mb-1.5">Hair Treatment</p>
              <h3 className="font-display text-lg text-white font-bold leading-snug mb-3">
                {variant.name}
              </h3>

              <div className="mt-auto">
                {variant.saveAmount > 0 && (
                  <p className="text-xs text-jena-gold/80 font-semibold mb-1">Hemat {formatRupiah(variant.saveAmount)}</p>
                )}
                <p className="text-xl font-bold text-white mb-1">{formatRupiah(variant.price)}</p>
                <p className="text-xs text-white/40 mb-4">{formatRupiah(Math.round(variant.price / variant.quantity))} / tube</p>

                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-jena-gold uppercase tracking-widest group-hover:gap-2.5 transition-all duration-200">
                  Lihat Produk
                  <ArrowRight size={12} />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
