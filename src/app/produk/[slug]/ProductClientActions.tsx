'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Check, ShoppingBag, ArrowRight } from 'lucide-react'
import { formatRupiah } from '@/lib/utils'
import type { Product } from '@/types'

interface Variant {
  name: string
  quantity: number
  price: number
  saveAmount: number
}

export default function ProductClientActions({ product, variants }: { product: Product; variants: Variant[] }) {
  const [selectedVariant, setSelectedVariant] = useState(2) // Default: Trio

  return (
    <div className="space-y-4">
      {/* Variant Selection */}
      <div>
        <p className="text-sm font-semibold text-jena-charcoal mb-3">Pilih Paket:</p>
        <div className="space-y-2">
          {variants.map((variant, i) => (
            <button
              key={i}
              onClick={() => setSelectedVariant(i)}
              className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all text-left ${
                selectedVariant === i
                  ? 'border-jena-gold bg-jena-gold/5'
                  : 'border-jena-gray-light bg-white hover:border-jena-gold/30'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedVariant === i ? 'border-jena-gold bg-jena-gold' : 'border-jena-gray-medium'
                }`}>
                  {selectedVariant === i && <Check size={12} className="text-white" strokeWidth={3} />}
                </div>
                <div>
                  <p className="text-sm font-medium text-jena-charcoal">{variant.name}</p>
                  {variant.saveAmount > 0 && (
                    <p className="text-xs text-jena-terracotta font-semibold">Hemat {formatRupiah(variant.saveAmount)}</p>
                  )}
                </div>
              </div>
              <p className="text-sm font-bold text-jena-mocha">{formatRupiah(variant.price)}</p>
            </button>
          ))}
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-col gap-3 mt-6">
        <Link
          href="/checkout"
          className="btn-primary text-base w-full"
        >
          <ShoppingBag size={18} />
          Beli Sekarang
        </Link>
        <Link
          href="/checkout"
          className="btn-secondary text-base w-full"
        >
          Tambah ke Keranjang
        </Link>
      </div>

      {/* Stock Info */}
      <p className="text-xs text-jena-gray-medium text-center mt-2">
        🔥 Stok tersisa: {product.stock} — Jangan sampai kehabisan!
      </p>
    </div>
  )
}