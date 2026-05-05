import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAdminAuth } from '@/lib/api-auth'

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminAuth()
  if (!auth.authorized) return auth.response!
  if (!supabaseAdmin) return NextResponse.json({ error: 'Database not configured' }, { status: 503 })

  const { id } = await params
  const body = await request.json()
  const updates: Record<string, unknown> = {}
  const allowed = ['name', 'price', 'compare_price', 'save_amount', 'quantity', 'is_active']
  for (const key of allowed) {
    if (body[key] !== undefined) updates[key] = body[key]
  }
  if (body.price) updates.price = Number(body.price)
  if (body.compare_price) updates.compare_price = Number(body.compare_price)

  const { data, error } = await supabaseAdmin
    .from('product_variants')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminAuth()
  if (!auth.authorized) return auth.response!
  if (!supabaseAdmin) return NextResponse.json({ error: 'Database not configured' }, { status: 503 })

  const { id } = await params
  const { error } = await supabaseAdmin.from('product_variants').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
