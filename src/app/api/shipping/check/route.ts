import { NextRequest, NextResponse } from 'next/server'
import { env } from '@/lib/env-validation'

interface RajaOngkirCity {
  city_id: string
  city_name: string
  type: string
  postal_code: string
}

interface RajaOngkirCost {
  service: string
  description: string
  cost: [
    {
      value: number
      etd: string
      note: string
    }
  ]
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const destination = searchParams.get('city')
    const weight = searchParams.get('weight') || '1000'

    if (!destination) {
      return NextResponse.json(
        { error: 'City parameter is required' },
        { status: 400 }
      )
    }

    // Call RajaOngkir API
    const response = await fetch('https://api.rajaongkir.com/starter/cost', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        key: env.rajaongkirApiKey,
      },
      body: JSON.stringify({
        origin: process.env.RAJAONGKIR_ORIGIN_CITY || '153', // Jakarta
        destination: parseInt(destination),
        weight: parseInt(weight),
        courier: 'jne:jnt:sicepat',
      }),
    })

    if (!response.ok) {
      throw new Error('RajaOngkir API error')
    }

    const data = await response.json()
    const results = data.rajaongkir.results

    // Format response
    const shippingOptions = results.flatMap((result: { code: string; name: string; costs: RajaOngkirCost[] }) =>
      result.costs.map((cost: RajaOngkirCost) => ({
        id: `${result.code}_${cost.service.toLowerCase()}`,
        courier: result.name,
        service: cost.service,
        description: cost.description,
        cost: cost.cost[0].value,
        estimate: cost.cost[0].etd,
      }))
    )

    return NextResponse.json({
      success: true,
      shipping_options: shippingOptions,
    })
  } catch (error) {
    console.error('Shipping cost error:', error)
    return NextResponse.json(
      { error: 'Failed to calculate shipping cost' },
      { status: 500 }
    )
  }
}

// Get cities list for autocomplete
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { query = '' } = body

    if (query.length < 3) {
      return NextResponse.json({ cities: [] })
    }

    // Call RajaOngkir cities API
    const response = await fetch(`https://api.rajaongkir.com/starter/city?key=${env.rajaongkirApiKey}&query=${query}`)

    if (!response.ok) {
      throw new Error('RajaOngkir API error')
    }

    const data = await response.json()
    const cities: RajaOngkirCity[] = data.rajaongkir.results.cities || []

    return NextResponse.json({
      success: true,
      cities: cities.map((city) => ({
        id: city.city_id,
        name: `${city.type} ${city.city_name}`,
        postal_code: city.postal_code,
      })),
    })
  } catch (error) {
    console.error('Cities fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch cities' },
      { status: 500 }
    )
  }
}
