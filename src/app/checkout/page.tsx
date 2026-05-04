import type { Metadata } from 'next'
import CheckoutForm from './CheckoutForm'

export const metadata: Metadata = {
  title: 'Checkout',
  description: 'Selesaikan pesanan JENAURA Hair Treatment kamu.',
}

export default function CheckoutPage() {
  return (
    <main className="bg-jena-charcoal min-h-screen header-pt pb-8 sm:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-display text-2xl sm:text-3xl text-white font-bold mb-8">Checkout</h1>
        <CheckoutForm />
      </div>
    </main>
  )
}