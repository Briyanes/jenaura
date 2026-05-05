import { NextRequest, NextResponse } from 'next/server'
import { env } from '@/lib/env-validation'

interface OrderItem {
  product_name: string
  quantity: number
}

interface OrderPayload {
  order_number: string
  customer_name: string
  customer_phone: string
  items: OrderItem[]
  total: number
  payment_method: string
  courier: string
  tracking_number?: string
  notes?: string
  shipping_address: {
    address: string
    city: string
    postal_code: string
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { order, type = 'new_order' }: { order: OrderPayload; type: string } = body

    if (type === 'new_order') {
      // Send new order notification to admin
      const message = `🆕 *PESANAN BARU*

*Order ID:* ${order.order_number}
*Nama:* ${order.customer_name}
*WhatsApp:* ${order.customer_phone}

📦 *Detail Pesanan:*
${order.items.map((item) => `- ${item.product_name} x${item.quantity}`).join('\n')}

💰 *Total:* ${formatRupiah(order.total)}
*Pembayaran:* ${order.payment_method}
*Kurir:* ${order.courier}

📍 *Alamat Pengiriman:*
${order.shipping_address.address}
${order.shipping_address.city}, ${order.shipping_address.postal_code}

_Catatan: ${order.notes || '-'}_`

      await sendWhatsAppMessage(env.whatsappNumber, message)
    } else if (type === 'payment_confirmation') {
      // Send payment confirmation to customer
      const message = `✅ *Pembayaran Dikonfirmasi*

Halo ${order.customer_name}!

Pembayaran untuk pesanan *${order.order_number}* telah kami terima.

📦 *Pesanan Anda:*
${order.items.map((item) => `- ${item.product_name} x${item.quantity}`).join('\n')}

💰 *Total:* ${formatRupiah(order.total)}
*Estimasi Pengiriman:* 2-3 hari kerja

Kami akan menginformasikan nomor resi segera setelah pesanan dikirim.

Terima kasih telah berbelanja di JENAURA! 💛`

      await sendWhatsAppMessage(order.customer_phone, message)
    } else if (type === 'shipping_notification') {
      // Send shipping notification to customer
      const message = `🚚 *Pesanan Dikirim*

Halo ${order.customer_name}!

Pesanan *${order.order_number}* telah dikirim.

📦 *Kurir:* ${order.courier}
📍 *Nomor Resi:* ${order.tracking_number}

Estimasi pengiriman 2-3 hari kerja. Anda dapat melacak pengiriman melalui website kurir.

Terima kasih telah berbelanja di JENAURA! 💛`

      await sendWhatsAppMessage(order.customer_phone, message)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('WhatsApp notification error:', error)
    return NextResponse.json(
      { error: 'Failed to send WhatsApp notification' },
      { status: 500 }
    )
  }
}

async function sendWhatsAppMessage(number: string, message: string) {
  // Format number (remove +, spaces, etc.)
  const formattedNumber = number.replace(/\D/g, '')

  // Using Fonnte API
  const response = await fetch('https://api.fonnte.com/send', {
    method: 'POST',
    headers: {
      Authorization: process.env.FONNTE_API_KEY || '',
    },
    body: JSON.stringify({
      target: formattedNumber,
      message: message,
      countryCode: '62',
    }),
  })

  if (!response.ok) {
    throw new Error('Fonnte API error')
  }

  return await response.json()
}

function formatRupiah(amount: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)
}
