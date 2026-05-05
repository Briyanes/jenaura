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
  const allowed = ['code', 'type', 'value', 'min_order', 'max_uses', 'starts_at', 'expires_at', 'is_active']
  for (const key of allowed) {
    if (body[key] !== undefined) updates[key] = body[key]
  }
  if (body.code) updates.code = (body.code as string).toUpperCase()

  const { data, error } = await supabaseAdmin
    .from('promo_codes')
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
  const { error } = await supabaseAdmin.from('promo_codes').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
