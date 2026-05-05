import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAdminAuth } from '@/lib/api-auth'

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminAuth()
  if (!auth.authorized) return auth.response!
  if (!supabaseAdmin) return NextResponse.json({ error: 'Database not configured' }, { status: 503 })

  const { id: productId } = await params
  const body = await request.json()

  const { data: product } = await supabaseAdmin
    .from('products')
    .select('slug')
    .eq('id', productId)
    .single()

  const slug = `${product?.slug || productId}-${body.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}-${Date.now()}`

  const { data, error } = await supabaseAdmin
    .from('product_variants')
    .insert({
      product_id: productId,
      name: body.name,
      slug,
      quantity: Number(body.quantity || 1),
      price: Number(body.price),
      compare_price: body.compare_price ? Number(body.compare_price) : null,
      save_amount: Number(body.save_amount || 0),
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
