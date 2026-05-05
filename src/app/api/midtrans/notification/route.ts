import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { env } from '@/lib/env-validation'

interface MidtransNotification {
  order_id: string
  status_code: string
  gross_amount: string
  signature_key: string
  transaction_status: string
  fraud_status?: string
}

// Midtrans sends webhook notifications as POST
export async function POST(request: NextRequest) {
  try {
    const body: MidtransNotification = await request.json()

    // Verify Midtrans signature
    const signatureKey = crypto
      .createHash('sha512')
      .update(
        env.midtransServerKey +
          body.order_id +
          body.status_code +
          body.gross_amount
      )
      .digest('hex')

    if (signatureKey !== body.signature_key) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 403 })
    }

    // TODO: update order payment status in database
    // const paymentStatus = ['capture', 'settlement'].includes(body.transaction_status) ? 'paid' : 'failed'
    // await updateOrderPaymentStatus(body.order_id, paymentStatus)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Midtrans webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
