'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Landmark, QrCode, Wallet, Truck, Shield, Tag, X, ChevronDown, Check } from 'lucide-react'
import { HERO_PRODUCT, PRODUCT_VARIANTS, COURIER_OPTIONS, PAYMENT_METHODS } from '@/lib/mock-data'
import { formatRupiah } from '@/lib/utils'
import { trackInitiateCheckout, trackAddPaymentInfo, trackPurchase } from '@/lib/tracking'

export default function CheckoutForm() {
  const router = useRouter()
  const [selectedVariant, setSelectedVariant] = useState(2)
  const [selectedCourier, setSelectedCourier] = useState('jne_reg')
  const [selectedPayment, setSelectedPayment] = useState('bank_transfer')
  const [promoCode, setPromoCode] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const variant = PRODUCT_VARIANTS[selectedVariant]
  const courier = COURIER_OPTIONS.find(c => c.id === selectedCourier)!
  const isFreeShipping = variant.quantity >= 2
  const shippingCost = isFreeShipping ? 0 : courier.price
  const discountAmount = promoApplied ? 15000 : 0
  const total = variant.price + shippingCost - discountAmount

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    trackInitiateCheckout({
      productId: HERO_PRODUCT.id,
      productName: HERO_PRODUCT.name,
      value: total,
      numItems: variant.quantity,
    })

    trackAddPaymentInfo({
      productId: HERO_PRODUCT.id,
      productName: HERO_PRODUCT.name,
      value: total,
      paymentMethod: selectedPayment,
    })

    // Simulate order creation
    await new Promise(resolve => setTimeout(resolve, 1500))

    const orderId = crypto.randomUUID()
    trackPurchase({
      orderId,
      productId: HERO_PRODUCT.id,
      productName: HERO_PRODUCT.name,
      value: total,
      numItems: variant.quantity,
    })

    router.push(`/konfirmasi-pesanan?id=${orderId}`)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left: Form Fields (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Info */}
          <div className="card p-6">
            <h2 className="heading-3 text-lg text-jena-mocha mb-5 flex items-center gap-2">
              <Truck size={20} className="text-jena-gold" />
              Informasi Pengiriman
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-jena-charcoal mb-1.5 block">Nama Lengkap *</label>
                <input type="text" name="name" required className="input-field" placeholder="Nama sesuai KTP" />
              </div>
              <div>
                <label className="text-xs font-medium text-jena-charcoal mb-1.5 block">No. WhatsApp *</label>
                <input type="tel" name="phone" required className="input-field" placeholder="08xxxxxxxxxx" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-jena-charcoal mb-1.5 block">Alamat Lengkap *</label>
                <textarea name="address" required className="input-field min-h-[80px] resize-none" placeholder="Jl. Nama Jalan No. xx, RT/RW, Kelurahan, Kecamatan" />
              </div>
              <div>
                <label className="text-xs font-medium text-jena-charcoal mb-1.5 block">Kota *</label>
                <input type="text" name="city" required className="input-field" placeholder="Jakarta, Bandung, dll." />
              </div>
              <div>
                <label className="text-xs font-medium text-jena-charcoal mb-1.5 block">Kode Pos *</label>
                <input type="text" name="postalCode" required className="input-field" placeholder="12345" />
              </div>
            </div>
          </div>

          {/* Courier */}
          <div className="card p-6">
            <h2 className="heading-3 text-lg text-jena-mocha mb-5">Pilih Kurir</h2>
            <div className="space-y-2">
              {COURIER_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSelectedCourier(opt.id)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                    selectedCourier === opt.id ? 'border-jena-gold bg-jena-gold/5' : 'border-jena-gray-light bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border-2 ${selectedCourier === opt.id ? 'border-jena-gold bg-jena-gold' : 'border-jena-gray-medium'}`} />
                    <div className="text-left">
                      <p className="text-sm font-medium text-jena-charcoal">{opt.name}</p>
                      <p className="text-xs text-jena-gray-medium">Estimasi {opt.estimate}</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-jena-mocha">
                    {isFreeShipping ? <span className="text-green-600">GRATIS</span> : formatRupiah(opt.price)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Payment */}
          <div className="card p-6">
            <h2 className="heading-3 text-lg text-jena-mocha mb-5">Metode Pembayaran</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {PAYMENT_METHODS.map((method) => {
                const icons: Record<string, typeof Landmark> = { bank_transfer: Landmark, qris: QrCode, ewallet: Wallet, cod: Truck }
                const Icon = icons[method.id] || Wallet
                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setSelectedPayment(method.id)}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                      selectedPayment === method.id ? 'border-jena-gold bg-jena-gold/5' : 'border-jena-gray-light bg-white'
                    }`}
                  >
                    <Icon size={20} className="text-jena-gold flex-shrink-0" strokeWidth={1.5} />
                    <div>
                      <p className="text-sm font-medium text-jena-charcoal">{method.name}</p>
                      <p className="text-xs text-jena-gray-medium">{method.description}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="lg:col-span-1">
          <div className="card-elevated p-6 sticky top-24">
            <h2 className="heading-3 text-lg text-jena-mocha mb-5">Ringkasan Pesanan</h2>

            {/* Product */}
            <div className="flex items-center gap-4 pb-4 border-b border-jena-gray-light">
              <div className="w-16 h-16 rounded-lg bg-jena-peach/30 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-jena-gold">JEN</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-jena-charcoal">{HERO_PRODUCT.name}</p>
                <p className="text-xs text-jena-gray-medium">{variant.name}</p>
              </div>
            </div>

            {/* Variant Quick Select */}
            <div className="py-4 border-b border-jena-gray-light space-y-2">
              {PRODUCT_VARIANTS.map((v, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedVariant(i)}
                  className={`w-full flex justify-between text-sm p-2 rounded-lg transition-colors ${
                    selectedVariant === i ? 'bg-jena-gold/10 text-jena-mocha font-semibold' : 'text-jena-charcoal/60 hover:bg-jena-ivory'
                  }`}
                >
                  <span>{v.name}</span>
                  <span>{formatRupiah(v.price)}</span>
                </button>
              ))}
            </div>

            {/* Promo Code */}
            <div className="py-4 border-b border-jena-gray-light">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-jena-gray-medium" />
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Kode promo"
                    className="input-field pl-9 text-sm"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => { if (promoCode) setPromoApplied(!promoApplied) }}
                  className="btn-ghost text-jena-gold text-xs px-3"
                >
                  {promoApplied ? 'Batal' : 'Pakai'}
                </button>
              </div>
              {promoApplied && (
                <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                  <Check size={12} strokeWidth={3} /> Promo diterapkan — Hemat {formatRupiah(discountAmount)}
                </p>
              )}
            </div>

            {/* Totals */}
            <div className="py-4 space-y-2 text-sm">
              <div className="flex justify-between text-jena-charcoal/70">
                <span>Subtotal</span>
                <span>{formatRupiah(variant.price)}</span>
              </div>
              <div className="flex justify-between text-jena-charcoal/70">
                <span>Ongkos Kirim</span>
                <span>{isFreeShipping ? <span className="text-green-600">GRATIS</span> : formatRupiah(shippingCost)}</span>
              </div>
              {promoApplied && (
                <div className="flex justify-between text-green-600">
                  <span>Diskon</span>
                  <span>-{formatRupiah(discountAmount)}</span>
                </div>
              )}
              <hr className="border-jena-gray-light" />
              <div className="flex justify-between text-lg font-bold text-jena-mocha">
                <span>Total</span>
                <span>{formatRupiah(total)}</span>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full text-base mt-4"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                  Memproses...
                </span>
              ) : (
                'Bayar Sekarang'
              )}
            </button>

            <div className="flex items-center justify-center gap-4 mt-4 text-xs text-jena-gray-medium">
              <span className="flex items-center gap-1"><Shield size={12} /> Pembayaran Aman</span>
              <span className="flex items-center gap-1"><Truck size={12} /> Garansi Pengiriman</span>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}