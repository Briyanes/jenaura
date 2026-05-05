'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { Landmark, QrCode, Wallet, Truck, Shield, Tag, Check, X } from 'lucide-react'
import { HERO_PRODUCT, COURIER_OPTIONS, PAYMENT_METHODS } from '@/lib/mock-data'
import { formatRupiah } from '@/lib/utils'
import { trackInitiateCheckout, trackAddPaymentInfo, trackPurchase } from '@/lib/tracking'
import type { CheckoutVariant } from './page'

interface Props {
  variants: CheckoutVariant[]
  productName: string
}

export default function CheckoutForm({ variants, productName }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [selectedVariantIdx, setSelectedVariantIdx] = useState(() =>
    variants.length >= 3 ? 2 : variants.length - 1
  )
  const [selectedCourier, setSelectedCourier] = useState('jne_reg')
  const [selectedPayment, setSelectedPayment] = useState('bank_transfer')
  const [promoCode, setPromoCode] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)
  const [promoDiscount, setPromoDiscount] = useState(0)
  const [promoId, setPromoId] = useState<string | undefined>()
  const [promoMessage, setPromoMessage] = useState('')
  const [isApplyingPromo, setIsApplyingPromo] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const variant = variants[selectedVariantIdx] || variants[0]
  const courier = COURIER_OPTIONS.find(c => c.id === selectedCourier)!
  const isFreeShipping = variant.quantity >= 2
  const shippingCost = isFreeShipping ? 0 : courier.price
  const total = variant.price + shippingCost - promoDiscount

  // Capture UTM params on mount
  const utmSource = searchParams.get('utm_source') || (typeof window !== 'undefined' ? sessionStorage.getItem('utm_source') : null) || undefined
  const utmMedium = searchParams.get('utm_medium') || (typeof window !== 'undefined' ? sessionStorage.getItem('utm_medium') : null) || undefined
  const utmCampaign = searchParams.get('utm_campaign') || (typeof window !== 'undefined' ? sessionStorage.getItem('utm_campaign') : null) || undefined

  useEffect(() => {
    // Persist UTM params to sessionStorage
    const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']
    utmKeys.forEach(key => {
      const val = searchParams.get(key)
      if (val) sessionStorage.setItem(key, val)
    })
  }, [searchParams])

  // Reset promo discount when variant changes (subtotal changes)
  useEffect(() => {
    if (promoApplied) {
      setPromoApplied(false)
      setPromoDiscount(0)
      setPromoMessage('')
      setPromoId(undefined)
      toast.info('Pilih ulang varian — promo direset')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedVariantIdx])

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return
    setIsApplyingPromo(true)
    try {
      const res = await fetch('/api/promo/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: promoCode.trim(), subtotal: variant.price }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || 'Kode promo tidak valid')
        setPromoApplied(false)
        setPromoDiscount(0)
      } else {
        setPromoApplied(true)
        setPromoDiscount(data.discount || 0)
        setPromoId(data.promoId)
        setPromoMessage(data.message || 'Promo diterapkan')
        toast.success(data.message || 'Promo berhasil diterapkan')
      }
    } catch {
      toast.error('Gagal memvalidasi promo')
    } finally {
      setIsApplyingPromo(false)
    }
  }

  const handleRemovePromo = () => {
    setPromoApplied(false)
    setPromoDiscount(0)
    setPromoMessage('')
    setPromoId(undefined)
    setPromoCode('')
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const customerName = formData.get('name') as string
    const rawPhone = formData.get('phone') as string
    const address = formData.get('address') as string
    const city = formData.get('city') as string
    const postalCode = formData.get('postalCode') as string
    const notes = formData.get('notes') as string

    // Normalize phone: 08xxx → 628xxx
    const customerPhone = rawPhone.startsWith('0') ? '62' + rawPhone.slice(1) : rawPhone

    trackInitiateCheckout({
      productId: HERO_PRODUCT.id,
      productName,
      value: total,
      numItems: variant.quantity,
    })

    trackAddPaymentInfo({
      productId: HERO_PRODUCT.id,
      productName,
      value: total,
      paymentMethod: selectedPayment,
    })

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          customerPhone,
          address,
          city,
          postalCode,
          notes: notes || undefined,
          variantId: variant.id || undefined,
          variantName: variant.name,
          quantity: variant.quantity,
          courier: selectedCourier,
          paymentMethod: selectedPayment,
          subtotal: variant.price,
          shippingCost,
          discountAmount: promoDiscount,
          promoCode: promoApplied ? promoCode : undefined,
          promoId: promoId || undefined,
          utmSource,
          utmMedium,
          utmCampaign,
        }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Order failed')

      const orderId = data.order?.order_number || 'PENDING'
      trackPurchase({
        orderId,
        productId: HERO_PRODUCT.id,
        productName,
        value: total,
        numItems: variant.quantity,
      })

      router.push(`/konfirmasi-pesanan?id=${encodeURIComponent(orderId)}`)
    } catch {
      toast.error('Gagal membuat pesanan. Silakan coba lagi.')
      setIsSubmitting(false)
    }
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
                <input type="text" name="postalCode" required pattern="\d{5}" className="input-field" placeholder="12345" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-jena-charcoal mb-1.5 block">Catatan (opsional)</label>
                <input type="text" name="notes" className="input-field" placeholder="Mis: titip ke satpam, jangan diketuk, dll." />
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
                    {isFreeShipping ? <span className="text-green-600 text-xs font-bold">GRATIS</span> : formatRupiah(opt.price)}
                  </span>
                </button>
              ))}
            </div>
            {isFreeShipping && (
              <p className="text-xs text-green-600 mt-3 flex items-center gap-1">
                <Check size={12} strokeWidth={3} /> Gratis ongkir untuk pembelian 2 tube atau lebih!
              </p>
            )}
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
                <p className="text-sm font-medium text-jena-charcoal leading-tight">{productName}</p>
                <p className="text-xs text-jena-gray-medium mt-0.5">{variant?.name}</p>
              </div>
            </div>

            {/* Variant Select */}
            <div className="py-4 border-b border-jena-gray-light space-y-2">
              {variants.map((v, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedVariantIdx(i)}
                  className={`w-full flex justify-between items-center text-sm p-2.5 rounded-lg transition-colors ${
                    selectedVariantIdx === i ? 'bg-jena-gold/10 text-jena-mocha font-semibold' : 'text-jena-charcoal/60 hover:bg-jena-ivory'
                  }`}
                >
                  <span>{v.name}</span>
                  <div className="text-right">
                    <span className={selectedVariantIdx === i ? 'text-jena-mocha' : ''}>{formatRupiah(v.price)}</span>
                    {v.saveAmount > 0 && (
                      <span className="block text-[10px] text-green-600">hemat {formatRupiah(v.saveAmount)}</span>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Promo Code */}
            <div className="py-4 border-b border-jena-gray-light">
              {promoApplied ? (
                <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                  <div className="flex items-center gap-2 text-green-700">
                    <Check size={14} strokeWidth={3} />
                    <span className="text-xs font-medium">{promoMessage}</span>
                  </div>
                  <button type="button" onClick={handleRemovePromo} className="text-green-600 hover:text-red-500 transition-colors">
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-jena-gray-medium" />
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleApplyPromo())}
                      placeholder="Kode promo"
                      className="input-field pl-9 text-sm uppercase"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    disabled={isApplyingPromo || !promoCode.trim()}
                    className="btn-ghost text-jena-gold text-xs px-3 disabled:opacity-40"
                  >
                    {isApplyingPromo ? '...' : 'Pakai'}
                  </button>
                </div>
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
              {promoDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Diskon Promo</span>
                  <span>-{formatRupiah(promoDiscount)}</span>
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
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Memproses...
                </span>
              ) : (
                'Pesan Sekarang'
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