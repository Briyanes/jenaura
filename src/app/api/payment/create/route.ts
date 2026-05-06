import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { updateOrderPayment } from '@/lib/db'

// Duitku payment channel codes (from getpaymentmethod API for merchant DS30359)
const PAYMENT_METHOD_MAP: Record<string, string> = {
  bca_va: 'BC',      // BCA Virtual Account
  bri_va: 'BR',      // BRI Virtual Account
  mandiri_va: 'M2',  // Mandiri VA H2H
  bni_va: 'I1',      // BNI Virtual Account
  qris: 'SP',        // ShopeePay QRIS (universal QRIS)
  dana: 'DA',        // DANA
  ovo: 'OV',         // OVO
  cod: '',           // COD - skip Duitku
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderNumber, amount, customerName, customerPhone, paymentMethod } = body

    console.log('Payment create:', { orderNumber, amount, paymentMethod })

    if (!orderNumber || !amount || !customerName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const merchantCode = process.env.DUITKU_MERCHANT_CODE
    const apiKey = process.env.DUITKU_API_KEY
    const isSandbox = process.env.DUITKU_IS_SANDBOX === 'true'

    if (!merchantCode || !apiKey) {
      return NextResponse.json({ error: 'Payment gateway not configured' }, { status: 500 })
    }

    const duitkuChannel = PAYMENT_METHOD_MAP[paymentMethod as string] || 'BC'

    const appUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') || request.nextUrl.origin
    const duitkuUrl = isSandbox
      ? 'https://sandbox.duitku.com/webapi/api/merchant/v2/inquiry'
      : 'https://passport.duitku.com/webapi/api/merchant/v2/inquiry'

    const signature = crypto
      .createHash('md5')
      .update(merchantCode + orderNumber + amount.toString() + apiKey)
      .digest('hex')

    const payload = {
      merchantCode,
      paymentAmount: amount,
      paymentMethod: duitkuChannel,
      merchantOrderId: orderNumber,
      productDetails: 'JENAURA Leave-In Keratin Hair Treatment',
      customerVaName: customerName,
      email: `order@jenaura.id`,
      phoneNumber: customerPhone || '6200000000',
      itemDetails: [
        {
          name: 'JENAURA Leave-In Keratin Hair Treatment',
          price: amount,
          quantity: 1,
        },
      ],
      callbackUrl: `${appUrl}/api/payment/callback`,
      returnUrl: `${appUrl}/konfirmasi-pesanan?id=${encodeURIComponent(orderNumber)}`,
      signature,
      expiryPeriod: 60,
    }

    console.log('Duitku request:', JSON.stringify({ ...payload, signature: '***' }))
    const res = await fetch(duitkuUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const rawText = await res.text()
    console.log('Duitku raw response:', res.status, rawText.slice(0, 500))

    let data: Record<string, unknown>
    try {
      data = JSON.parse(rawText)
    } catch {
      return NextResponse.json(
        { error: 'Respons tidak valid dari payment gateway', debug: rawText.slice(0, 200) },
        { status: 502 }
      )
    }

    if (!res.ok || data.statusCode !== '00') {
      console.error('Duitku error:', JSON.stringify(data))
      return NextResponse.json(
        { error: (data.statusMessage as string) || (data.Message as string) || 'Gagal membuat transaksi pembayaran', debug: data },
        { status: 400 }
      )
    }

    console.log('Duitku success response keys:', Object.keys(data), 'reference:', data.reference)

    // Store Duitku reference in order (non-blocking)
    await updateOrderPayment(orderNumber, (data.reference as string) || (data.merchantOrderId as string) || orderNumber)

    return NextResponse.json({
      paymentUrl: data.paymentUrl,
      reference: data.reference,
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : JSON.stringify(err)
    console.error('Payment create error:', msg, err)
    return NextResponse.json({ error: 'Gagal memproses pembayaran', debug: msg }, { status: 500 })
  }
}
