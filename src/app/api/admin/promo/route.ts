import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAdminAuth } from '@/lib/api-auth'

export async function GET() {
  const auth = await requireAdminAuth()
  if (!auth.authorized) return auth.response!
  if (!supabaseAdmin) return NextResponse.json({ error: 'Database not configured' }, { status: 503 })

  const { data, error } = await supabaseAdmin
    .from('promo_codes')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  const auth = await requireAdminAuth()
  if (!auth.authorized) return auth.response!
  if (!supabaseAdmin) return NextResponse.json({ error: 'Database not configured' }, { status: 503 })

  const body = await request.json()

  const { data, error } = await supabaseAdmin
    .from('promo_codes')
    .insert({
      code: body.code.toUpperCase(),
      type: body.type,
      value: Number(body.value || 0),
      min_order: Number(body.min_order || 0),
      max_uses: body.max_uses ? Number(body.max_uses) : null,
      starts_at: body.starts_at || null,
      expires_at: body.expires_at || null,
      is_active: body.is_active ?? true,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: error.code === '23505' ? 409 : 500 })
  return NextResponse.json(data, { status: 201 })
}
