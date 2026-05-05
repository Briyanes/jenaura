import type { Metadata } from 'next'
import { Suspense } from 'react'
import { getFirstActiveProductFull } from '@/lib/db'
import { PRODUCT_VARIANTS, HERO_PRODUCT } from '@/lib/mock-data'
import CheckoutForm from './CheckoutForm'

export const metadata: Metadata = {
  title: 'Checkout',
  description: 'Selesaikan pesanan JENAURA Hair Treatment kamu.',
}

export interface CheckoutVariant {
  id: string
  name: string
  quantity: number
  price: number
  comparePrice?: number
  saveAmount: number
}

export default async function CheckoutPage() {
  let variants: CheckoutVariant[] = []
  let productName = HERO_PRODUCT.name

  try {
    const product = await getFirstActiveProductFull()
    if (product && product.product_variants?.length) {
      productName = product.name
      variants = product.product_variants
        .filter((v: { is_active: boolean }) => v.is_active)
        .sort((a: { price: number }, b: { price: number }) => a.price - b.price)
        .map((v: {
          id: string; name: string; quantity: number; price: number;
          compare_price?: number; save_amount?: number
        }) => ({
          id: v.id,
          name: v.name,
          quantity: v.quantity,
          price: v.price,
          comparePrice: v.compare_price,
          saveAmount: v.save_amount || 0,
        }))
    }
  } catch {
    // fallback below
  }

  // Fallback to mock data (no real IDs)
  if (!variants.length) {
    variants = PRODUCT_VARIANTS.map(v => ({ ...v, id: '', comparePrice: undefined }))
  }

  return (
    <main className="bg-jena-charcoal min-h-screen header-pt-page pb-8 sm:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-display text-2xl sm:text-3xl text-white font-bold mb-8">Checkout</h1>
        <Suspense fallback={<div className="text-white/60 text-center py-12">Memuat...</div>}>
          <CheckoutForm variants={variants} productName={productName} />
        </Suspense>
      </div>
    </main>
  )
}