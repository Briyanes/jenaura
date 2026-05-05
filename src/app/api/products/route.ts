import { NextResponse } from 'next/server'
import { getFirstActiveProductFull } from '@/lib/db'

// Public: returns first active product with variants for checkout
export async function GET() {
  try {
    const product = await getFirstActiveProductFull()
    if (!product) {
      return NextResponse.json({ product: null })
    }
    return NextResponse.json({ product })
  } catch (error) {
    console.error('Products fetch error:', error)
    return NextResponse.json({ product: null })
  }
}
