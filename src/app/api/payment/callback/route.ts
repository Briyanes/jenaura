import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { updateOrderPaymentStatus } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { merchantCode, amount, merchantOrderId, resultCode, signature: receivedSignature } = body

    const apiKey = process.env.DUITKU_API_KEY
    if (!apiKey) {
      return new NextResponse('CONFIGURATION_ERROR', { status: 500 })
    }

    // Verify signature from Duitku
    const expectedSignature = crypto
      .createHash('md5')
      .update(merchantCode + amount + merchantOrderId + apiKey)
      .digest('hex')

    if (receivedSignature !== expectedSignature) {
      console.error('Duitku callback: invalid signature')
      return new NextResponse('INVALID_SIGNATURE', { status: 401 })
    }

    if (resultCode === '00') {
      // Payment successful
      await updateOrderPaymentStatus(merchantOrderId, 'paid', 'confirmed')
    } else {
      // Payment failed or pending
      await updateOrderPaymentStatus(merchantOrderId, 'failed')
    }

    // Duitku requires exactly "OK" in the response body
    return new NextResponse('OK', { status: 200 })
  } catch (err) {
    console.error('Payment callback error:', err)
    return new NextResponse('ERROR', { status: 500 })
  }
}
