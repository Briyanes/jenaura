import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { updateOrderPayment } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderNumber, amount, customerName, customerPhone } = body

    if (!orderNumber || !amount || !customerName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const merchantCode = process.env.DUITKU_MERCHANT_CODE
    const apiKey = process.env.DUITKU_API_KEY
    const isSandbox = process.env.DUITKU_IS_SANDBOX === 'true'

    if (!merchantCode || !apiKey) {
      return NextResponse.json({ error: 'Payment gateway not configured' }, { status: 500 })
    }

    const baseUrl = request.nextUrl.origin
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
      callbackUrl: `${baseUrl}/api/payment/callback`,
      returnUrl: `${baseUrl}/konfirmasi-pesanan?id=${encodeURIComponent(orderNumber)}`,
      signature,
      expiryPeriod: 60,
    }

    const res = await fetch(duitkuUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const data = await res.json()

    if (!res.ok || data.statusCode !== '00') {
      console.error('Duitku error:', data)
      return NextResponse.json(
        { error: data.statusMessage || 'Gagal membuat transaksi pembayaran' },
        { status: 400 }
      )
    }

    // Store Duitku reference in order
    await updateOrderPayment(orderNumber, data.reference)

    return NextResponse.json({
      paymentUrl: data.paymentUrl,
      reference: data.reference,
    })
  } catch (err) {
    console.error('Payment create error:', err)
    return NextResponse.json({ error: 'Gagal memproses pembayaran' }, { status: 500 })
  }
}
