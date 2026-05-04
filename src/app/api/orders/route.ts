import { NextRequest, NextResponse } from 'next/server'
import { createOrder, getOrderByOrderNumber, getOrders } from '@/lib/db'
import { env } from '@/lib/env-validation'
import { validateOrderData } from '@/lib/validation'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate order data
    const validationResult = validateOrderData(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationResult.error },
        { status: 400 }
      )
    }

    // Check if promo code is valid
    let discountAmount = 0
    if (body.promoCode) {
      // You can add promo code validation here
      // For now, we'll skip this
    }

    // Calculate totals
    const shippingCost = body.shippingCost || 0
    const subtotal = body.subtotal
    const total = subtotal + shippingCost - discountAmount

    // Create order
    const order = await createOrder({
      customer: {
        id: crypto.randomUUID(),
        name: body.customerName,
        phone: body.customerPhone,
        email: body.customerEmail,
        createdAt: new Date().toISOString(),
      },
      items: body.items,
      subtotal,
      shippingCost,
      discountAmount,
      total,
      paymentMethod: body.paymentMethod,
      paymentStatus: 'pending',
      status: 'pending',
      courier: body.courier,
      shippingAddress: {
        name: body.customerName,
        phone: body.customerPhone,
        address: body.address,
        city: body.city,
        district: body.district || '',
        postalCode: body.postalCode,
      },
      promoCode: body.promoCode,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as any)

    return NextResponse.json({ success: true, order }, { status: 201 })
  } catch (error) {
    console.error('Order creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const orderNumber = searchParams.get('order_number')

    if (orderNumber) {
      // Get specific order
      const order = await getOrderByOrderNumber(orderNumber)
      if (!order) {
        return NextResponse.json(
          { error: 'Order not found' },
          { status: 404 }
        )
      }
      return NextResponse.json(order)
    }

    // Get all orders (for admin)
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
