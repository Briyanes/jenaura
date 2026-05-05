import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAdminAuth } from '@/lib/api-auth'

export async function GET() {
  const auth = await requireAdminAuth()
  if (!auth.authorized) return auth.response!
  if (!supabaseAdmin) return NextResponse.json({ error: 'Database not configured' }, { status: 503 })

  const { data, error } = await supabaseAdmin
    .from('orders')
    .select('customer_name, customer_phone, customer_email, city, total, status, created_at')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Aggregate by phone number
  const map = new Map<string, {
    name: string; phone: string; email: string | null; city: string;
    orderCount: number; totalSpend: number; lastOrderAt: string
  }>()

  for (const row of data || []) {
    const key = row.customer_phone
    if (map.has(key)) {
      const existing = map.get(key)!
      existing.orderCount++
      existing.totalSpend += row.total || 0
      if (row.created_at > existing.lastOrderAt) existing.lastOrderAt = row.created_at
    } else {
      map.set(key, {
        name: row.customer_name,
        phone: row.customer_phone,
        email: row.customer_email,
        city: row.city,
        orderCount: 1,
        totalSpend: row.total || 0,
        lastOrderAt: row.created_at,
      })
    }
  }

  const customers = Array.from(map.values()).sort(
    (a, b) => new Date(b.lastOrderAt).getTime() - new Date(a.lastOrderAt).getTime()
  )

  return NextResponse.json(customers)
}
