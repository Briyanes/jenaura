import { NextRequest, NextResponse } from 'next/server'
import { createOrder, getOrderByOrderNumber, getOrders } from '@/lib/db'
import { validateOrderData } from '@/lib/validation'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const validationResult = validateOrderData(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationResult.error },
        { status: 400 }
      )
    }

    const shippingCost = body.shippingCost || 0
    const discountAmount = body.discountAmount || 0
    const subtotal = body.subtotal
    const total = subtotal + shippingCost - discountAmount

    const order = await createOrder({
      customer_name: body.customerName,
      customer_phone: body.customerPhone,
      customer_email: body.customerEmail || null,
      shipping_address: body.address,
      city: body.city,
      postal_code: body.postalCode,
      notes: body.notes || null,
      variant_id: body.variantId || null,
      quantity: body.quantity || 1,
      subtotal,
      shipping_cost: shippingCost,
      discount_amount: discountAmount,
      total,
      courier: body.courier,
      payment_method: body.paymentMethod,
      payment_status: 'unpaid',
      status: 'pending',
      utm_source: body.utmSource || null,
      utm_medium: body.utmMedium || null,
      utm_campaign: body.utmCampaign || null,
    })

    // Fire-and-forget: WhatsApp notification to admin
    try {
      const baseUrl = request.nextUrl.origin
      fetch(`${baseUrl}/api/whatsapp/notify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'new_order',
          order: {
            order_number: order.order_number,
            customer_name: order.customer_name,
            customer_phone: order.customer_phone,
            items: [{ product_name: body.variantName || 'JENAURA Treatment', quantity: order.quantity }],
            total: order.total,
            payment_method: order.payment_method,
            courier: order.courier,
            shipping_address: {
              address: order.shipping_address,
              city: order.city,
              postal_code: order.postal_code,
            },
          },
        }),
      }).catch(() => {})
    } catch {
      // Don't fail order creation if WA notification fails
    }

    return NextResponse.json({ success: true, order }, { status: 201 })
  } catch (error) {
    console.error('Order creation error:', error)
    const message =
      error instanceof Error ? error.message : String(error)
    return NextResponse.json(
      { error: message || 'Failed to create order' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const orderNumber = searchParams.get('order_number')

    if (orderNumber) {
      const order = await getOrderByOrderNumber(orderNumber)
      if (!order) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 })
      }
      return NextResponse.json(order)
    }

    const orders = await getOrders(100)
    return NextResponse.json(orders)
  } catch (error) {
    console.error('Orders fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}
