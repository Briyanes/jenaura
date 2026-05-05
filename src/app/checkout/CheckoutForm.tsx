'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { Landmark, QrCode, Wallet, Truck, Shield, Tag, Check, X, Search, MapPin } from 'lucide-react'
import { HERO_PRODUCT, COURIER_OPTIONS, PAYMENT_METHODS } from '@/lib/mock-data'
import { formatRupiah } from '@/lib/utils'
import { trackInitiateCheckout, trackAddPaymentInfo, trackPurchase } from '@/lib/tracking'
import type { CheckoutVariant } from './page'

interface Props {
  variants: CheckoutVariant[]
  productName: string
}

interface AreaOption {
  id: string
  label: string
  city: string
  province: string
  postal_code: string
}

interface CourierOption {
  id: string
  name: string
  price: number
  estimate: string
}

const DEFAULT_COURIERS: CourierOption[] = COURIER_OPTIONS.map(c => ({
  id: c.id, name: c.name, price: c.price, estimate: c.estimate,
}))

export default function CheckoutForm({ variants, productName }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const cityDropdownRef = useRef<HTMLDivElement>(null)
  const citySearchTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

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

  // City search & real-time shipping
  const [cityQuery, setCityQuery] = useState('')
  const [areaResults, setAreaResults] = useState<AreaOption[]>([])
  const [showAreaDropdown, setShowAreaDropdown] = useState(false)
  const [selectedArea, setSelectedArea] = useState<AreaOption | null>(null)
  const [isSearchingArea, setIsSearchingArea] = useState(false)
  const [postalCode, setPostalCode] = useState('')
  const [couriers, setCouriers] = useState<CourierOption[]>(DEFAULT_COURIERS)
  const [isLoadingRates, setIsLoadingRates] = useState(false)
  const [isFlatRate, setIsFlatRate] = useState(true)

  const variant = variants[selectedVariantIdx] || variants[0]
  const activeCourier = couriers.find(c => c.id === selectedCourier) || couriers[0]
  const isFreeShipping = variant.quantity >= 2
  const shippingCost = isFreeShipping ? 0 : (activeCourier?.price || 0)
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

  // Reset promo when variant changes; re-fetch rates if area selected
  useEffect(() => {
    if (promoApplied) {
      setPromoApplied(false)
      setPromoDiscount(0)
      setPromoMessage('')
      setPromoId(undefined)
      toast.info('Pilih ulang varian — promo direset')
    }
    if (selectedArea) fetchRates(selectedArea.id, variant.quantity)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedVariantIdx])

  // Close city dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(e.target as Node)) {
        setShowAreaDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const fetchRates = useCallback(async (areaId: string, quantity: number) => {
    setIsLoadingRates(true)
    try {
      const res = await fetch('/api/shipping/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ destination_area_id: areaId, quantity }),
      })
      const data = await res.json()
      if (data.success && data.pricing?.length) {
        setCouriers(data.pricing)
        setIsFlatRate(data.fallback || false)
        setSelectedCourier(data.pricing[0].id)
      }
    } catch {
      // keep flat rates
    } finally {
      setIsLoadingRates(false)
    }
  }, [])

  const handleCityInput = (value: string) => {
    setCityQuery(value)
    setSelectedArea(null)
    if (citySearchTimer.current) clearTimeout(citySearchTimer.current)
    if (value.length < 3) { setAreaResults([]); setShowAreaDropdown(false); return }
    citySearchTimer.current = setTimeout(async () => {
      setIsSearchingArea(true)
      try {
        const res = await fetch(`/api/shipping/check?search=${encodeURIComponent(value)}`)
        const data = await res.json()
        setAreaResults(data.areas || [])
        setShowAreaDropdown((data.areas || []).length > 0)
      } catch { setAreaResults([]) } finally { setIsSearchingArea(false) }
    }, 500)
  }

  const handleSelectArea = (area: AreaOption) => {
    setSelectedArea(area)
    setCityQuery(area.city)
    setPostalCode(area.postal_code)
    setShowAreaDropdown(false)
    setAreaResults([])
    fetchRates(area.id, variant.quantity)
  }

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
    const notes = formData.get('notes') as string

    const city = cityQuery
    const postal = postalCode

    if (!city) {
      toast.error('Harap isi kota tujuan')
      setIsSubmitting(false)
      return
    }
    if (!postal || !/^\d{5}$/.test(postal)) {
      toast.error('Harap isi kode pos yang valid (5 digit)')
      setIsSubmitting(false)
      return
    }

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
          postalCode: postal,
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
      if (!response.ok) {
        const msg = data.details
          ? data.details.map((d: { message: string }) => d.message).join(', ')
          : data.error || 'Gagal membuat pesanan'
        throw new Error(msg)
      }

      const orderId = data.order?.order_number || 'PENDING'
      trackPurchase({
        orderId,
        productId: HERO_PRODUCT.id,
        productName,
        value: total,
        numItems: variant.quantity,
      })

      router.push(`/konfirmasi-pesanan?id=${encodeURIComponent(orderId)}`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal membuat pesanan. Silakan coba lagi.')
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
              {/* City autocomplete - full width */}
              <div ref={cityDropdownRef} className="relative sm:col-span-2">
                <label className="text-xs font-medium text-jena-charcoal mb-1.5 block">Kota / Kecamatan *</label>
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-jena-gray-medium pointer-events-none" />
                  <input
                    type="text"
                    value={cityQuery}
                    onChange={(e) => handleCityInput(e.target.value)}
                    onFocus={() => areaResults.length > 0 && setShowAreaDropdown(true)}
                    required
                    className="input-field pl-9"
                    placeholder="Ketik kota / kecamatan untuk cari tarif pengiriman..."
                    autoComplete="off"
                  />
                  {isSearchingArea && (
                    <svg className="animate-spin absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-jena-gold" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  )}
                </div>
                {showAreaDropdown && areaResults.length > 0 && (
                  <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-jena-gray-light rounded-xl shadow-lg overflow-hidden max-h-56 overflow-y-auto">
                    {areaResults.map((area) => (
                      <button
                        key={area.id}
                        type="button"
                        onMouseDown={() => handleSelectArea(area)}
                        className="w-full flex items-start gap-3 px-4 py-3 hover:bg-jena-ivory text-left border-b border-jena-gray-light/50 last:border-0 transition-colors"
                      >
                        <MapPin size={14} className="text-jena-gold mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-jena-charcoal">{area.city}</p>
                          <p className="text-xs text-jena-gray-medium">{area.label}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                {selectedArea && (
                  <p className="text-xs text-green-600 mt-1.5 flex items-center gap-1">
                    <Check size={11} strokeWidth={3} /> {selectedArea.label}
                  </p>
                )}
              </div>
              <div>
                <label className="text-xs font-medium text-jena-charcoal mb-1.5 block">Kode Pos *</label>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  required
                  className="input-field"
                  placeholder="Auto-isi saat pilih kota"
                />
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
            {isFreeShipping ? (
              <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-center">
                <p className="text-sm font-semibold text-green-700 flex items-center justify-center gap-2">
                  <Truck size={16} /> Gratis Ongkir untuk 2+ pcs!
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {!isFlatRate && selectedArea && (
                  <p className="text-xs text-green-600 flex items-center gap-1 mb-2">
                    <Check size={11} strokeWidth={3} /> Tarif real-time ke {selectedArea.city}
                  </p>
                )}
                {isFlatRate && (
                  <p className="text-xs text-jena-gray-medium mb-2">
                    {selectedArea ? 'Menggunakan tarif estimasi. ' : 'Pilih kota untuk tarif real-time. '}
                    Isi kota terlebih dahulu untuk tarif akurat.
                  </p>
                )}
                {isLoadingRates ? (
                  <div className="flex items-center gap-2 text-sm text-jena-gray-medium p-3">
                    <svg className="animate-spin w-4 h-4 text-jena-gold" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Mengambil tarif pengiriman...
                  </div>
                ) : (
                  couriers.map(c => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setSelectedCourier(c.id)}
                      className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                        selectedCourier === c.id ? 'border-jena-gold bg-jena-gold/5' : 'border-jena-gray-light bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full border-2 ${selectedCourier === c.id ? 'border-jena-gold bg-jena-gold' : 'border-jena-gray-medium'}`} />
                        <div className="text-left">
                          <p className="text-sm font-medium text-jena-charcoal">{c.name}</p>
                          <p className="text-xs text-jena-gray-medium">Estimasi {c.estimate}</p>
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-jena-mocha">{formatRupiah(c.price)}</span>
                    </button>
                  ))
                )}
              </div>
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
                <div className="flex items-stretch gap-0 border-2 border-jena-gray-light rounded-xl overflow-hidden focus-within:border-jena-gold transition-colors">
                  <div className="flex-1 relative">
                    <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-jena-gray-medium pointer-events-none" />
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleApplyPromo())}
                      placeholder="Kode promo"
                      className="w-full pl-9 pr-3 py-3 text-sm uppercase bg-transparent outline-none text-jena-charcoal placeholder-jena-gray-medium"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    disabled={isApplyingPromo || !promoCode.trim()}
                    className="px-4 text-sm font-semibold text-jena-gold border-l border-jena-gray-light hover:bg-jena-gold/5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
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