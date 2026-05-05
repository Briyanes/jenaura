import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAdminAuth } from '@/lib/api-auth'

export async function GET() {
  const auth = await requireAdminAuth()
  if (!auth.authorized) return auth.response!
  if (!supabaseAdmin) return NextResponse.json({ error: 'Database not configured' }, { status: 503 })

  const { data, error } = await supabaseAdmin
    .from('products')
    .select('*, product_variants(*)')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  const auth = await requireAdminAuth()
  if (!auth.authorized) return auth.response!
  if (!supabaseAdmin) return NextResponse.json({ error: 'Database not configured' }, { status: 503 })

  const body = await request.json()
  const { variants, ...productData } = body

  // Create product
  const { data: product, error: productError } = await supabaseAdmin
    .from('products')
    .insert({
      name: productData.name,
      slug: productData.slug || productData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      description: productData.description,
      price: Number(productData.price),
      compare_price: productData.compare_price ? Number(productData.compare_price) : null,
      weight: productData.weight,
      stock: Number(productData.stock || 0),
      badge: productData.badge,
      is_active: productData.is_active ?? true,
    })
    .select()
    .single()

  if (productError) return NextResponse.json({ error: productError.message }, { status: 500 })

  // Create variants if provided
  if (variants && variants.length > 0) {
    const variantRows = variants.map((v: { name: string; quantity: number; price: number; compare_price?: number; save_amount?: number }) => ({
      product_id: product.id,
      name: v.name,
      slug: `${product.slug}-${v.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`,
      quantity: Number(v.quantity || 1),
      price: Number(v.price),
      compare_price: v.compare_price ? Number(v.compare_price) : null,
      save_amount: Number(v.save_amount || 0),
    }))

    const { error: variantError } = await supabaseAdmin
      .from('product_variants')
      .insert(variantRows)

    if (variantError) return NextResponse.json({ error: variantError.message }, { status: 500 })
  }

  return NextResponse.json(product, { status: 201 })
}
