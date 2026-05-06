import { NextRequest, NextResponse } from 'next/server'

const BITESHIP_API_KEY = process.env.BITESHIP_API_KEY || ''
const ORIGIN_AREA_ID = process.env.BITESHIP_ORIGIN_AREA_ID || ''

const FLAT_RATES = [
  { id: 'jne_reg', name: 'JNE Reguler', price: 15000, estimate: '2-3 hari' },
  { id: 'jnt_ez', name: 'J&T Express', price: 13000, estimate: '2-3 hari' },
  { id: 'sicepat_best', name: 'SiCepat BEST', price: 12000, estimate: '2-4 hari' },
]

interface BiteshipArea {
  id: string
  administrative_division_level_1_name: string
  administrative_division_level_2_name: string
  administrative_division_level_3_name: string
  postal_code: string | number
}

interface BiteshipPricing {
  available: boolean
  courier_code: string
  courier_service_code: string
  courier_name: string
  courier_service_name: string
  price: number
  duration: string
}

// GET: search areas by query (for city autocomplete)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('search') || ''

  if (query.length < 3) return NextResponse.json({ areas: [] })
  if (!BITESHIP_API_KEY) return NextResponse.json({ areas: [] })

  try {
    const res = await fetch(
      `https://api.biteship.com/v1/maps/areas?input=${encodeURIComponent(query)}&type=single&country_code=ID`,
      { headers: { Authorization: `Bearer ${BITESHIP_API_KEY}` } }
    )
    const data = await res.json()
    const areas = (data.areas || []) as BiteshipArea[]

    return NextResponse.json({
      areas: areas.slice(0, 8).map((a) => ({
        id: a.id,
        label: `${a.administrative_division_level_3_name}, ${a.administrative_division_level_2_name}, ${a.administrative_division_level_1_name}`,
        city: a.administrative_division_level_2_name,
        province: a.administrative_division_level_1_name,
        postal_code: String(a.postal_code),
      })),
    })
  } catch {
    return NextResponse.json({ areas: [] })
  }
}

// POST: get real-time shipping rates from Biteship
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { destination_area_id, quantity = 1 } = body

    if (!BITESHIP_API_KEY || !ORIGIN_AREA_ID || !destination_area_id) {
      const reason = !BITESHIP_API_KEY ? 'no_api_key' : !ORIGIN_AREA_ID ? 'no_origin_area_id' : 'no_destination_area_id'
      console.error('[Biteship] Fallback reason:', reason)
      return NextResponse.json({ success: true, fallback: true, fallback_reason: reason, pricing: FLAT_RATES })
    }

    const res = await fetch('https://api.biteship.com/v1/rates/couriers', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${BITESHIP_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        origin_area_id: ORIGIN_AREA_ID,
        destination_area_id,
        couriers: 'jne,jnt,sicepat,anteraja',
        items: [{
          name: 'JENAURA Leave-In Keratin Hair Treatment',
          value: 149000,
          length: 5,
          width: 5,
          height: 15,
          weight: 200 * Math.max(quantity, 1),
          quantity: Math.max(quantity, 1),
        }],
      }),
    })

    const data = await res.json()
    console.log('[Biteship] Response success:', data.success, 'status:', res.status)
    if (!data.success) throw new Error(`Biteship rates error: ${JSON.stringify(data)}`)

    const allPricing = (data.pricing as BiteshipPricing[])
    const pricing = allPricing
      .filter((p) => p.available)
      .sort((a, b) => a.price - b.price)
      .slice(0, 5)
      .map((p) => ({
        id: `${p.courier_code}_${p.courier_service_code}`.toLowerCase(),
        name: `${p.courier_name} ${p.courier_service_name}`,
        price: p.price,
        estimate: `${p.duration} hari`,
      }))

    if (!pricing.length) {
      return NextResponse.json({ 
        success: true, fallback: true, fallback_reason: 'no_available_rates',
        debug_total: allPricing.length,
        debug_sample: allPricing.slice(0, 2),
        pricing: FLAT_RATES 
      })
    }

    return NextResponse.json({ success: true, pricing })
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : String(err)
    console.error('[Biteship] Error:', errMsg)
    return NextResponse.json({ success: true, fallback: true, fallback_reason: 'api_error', error_debug: errMsg, pricing: FLAT_RATES })
  }
}
