import { NextRequest, NextResponse } from 'next/server'
import { validatePromoCode } from '@/lib/db'
import { formatRupiah } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const { code, subtotal } = await request.json()

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ error: 'Kode promo wajib diisi' }, { status: 400 })
    }

    const promo = await validatePromoCode(code.trim().toUpperCase())

    if (!promo) {
      return NextResponse.json(
        { error: 'Kode promo tidak valid atau sudah kedaluwarsa' },
        { status: 400 }
      )
    }

    // Check min order
    if (promo.min_order && subtotal < promo.min_order) {
      return NextResponse.json(
        { error: `Minimum pembelian ${formatRupiah(promo.min_order)} untuk memakai promo ini` },
        { status: 400 }
      )
    }

    let discount = 0
    let message = ''

    if (promo.type === 'fixed') {
      discount = promo.value
      message = `Hemat ${formatRupiah(discount)}`
    } else if (promo.type === 'percent') {
      discount = Math.round(subtotal * promo.value / 100)
      message = `Hemat ${promo.value}% (${formatRupiah(discount)})`
    } else if (promo.type === 'shipping') {
      discount = promo.value
      message = `Diskon ongkir ${formatRupiah(discount)}`
    }

    return NextResponse.json({
      success: true,
      discount,
      type: promo.type as string,
      promoId: promo.id,
      message: `Promo diterapkan — ${message}`,
    })
  } catch (error) {
    console.error('Promo validate error:', error)
    return NextResponse.json({ error: 'Gagal validasi promo' }, { status: 500 })
  }
}
