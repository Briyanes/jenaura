import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { env } from '@/lib/env-validation'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderId, amount, customerName, customerEmail, customerPhone } = body

    // Midtrans Snap API endpoint
    const baseUrl = env.midtransIsProduction
      ? 'https://app.midtrans.com/snap/v1'
      : 'https://app.sandbox.midtrans.com/snap/v1'

    // Create transaction payload
    const transactionPayload = {
      transaction_details: {
        order_id: orderId,
        gross_amount: amount,
      },
      customer_details: {
        first_name: customerName.split(' ')[0],
        last_name: customerName.split(' ').slice(1).join(' ') || '',
        email: customerEmail || undefined,
        phone: customerPhone,
      },
      item_details: [
        {
          id: 'jenaura-treatment',
          price: amount,
          quantity: 1,
          name: 'JENAURA Hair Treatment',
        },
      ],
      enabled_payments: [
        'bca_va',
        'bni_va',
        'bri_va',
        'mandiri_va',
        'permata_va',
        'qris',
        'gopay',
        'shopeepay',
      ],
    }

    // Call Midtrans API
    const response = await fetch(`${baseUrl}/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Basic ${Buffer.from(env.midtransServerKey + ':').toString('base64')}`,
      },
      body: JSON.stringify(transactionPayload),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Midtrans error:', error)
      throw new Error('Failed to create payment transaction')
    }

    const data = await response.json()

    return NextResponse.json({
      success: true,
      token: data.token,
      redirect_url: data.redirect_url,
    })
  } catch (error) {
    console.error('Payment creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create payment' },
      { status: 500 }
    )
  }
}

// Webhook handler for Midtrans notifications
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    // Verify signature
    const signatureKey = crypto
      .createHash('sha512')
      .update(env.midtransServerKey + body.order_id + body.status_code + body.gross_amount)
      .digest('hex')

    if (signatureKey !== body.signature_key) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 403 }
      )
    }

    // Update order status based on payment status
    // You should implement this in your database
    // await updateOrderPaymentStatus(body.order_id, body.transaction_status)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
