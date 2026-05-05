import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAdminAuth } from '@/lib/api-auth'

export async function GET() {
  const auth = await requireAdminAuth()
  if (!auth.authorized) return auth.response!

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
  }

  const now = new Date()
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()

  const [allOrders, todayOrders, chart] = await Promise.all([
    supabaseAdmin.from('orders').select('total, status, payment_status'),
    supabaseAdmin.from('orders').select('total, payment_status').gte('created_at', startOfToday),
    supabaseAdmin
      .from('orders')
      .select('total, created_at, payment_status')
      .gte('created_at', sevenDaysAgo)
      .order('created_at', { ascending: true }),
  ])

  const orders = allOrders.data || []
  const paid = orders.filter((o) => o.payment_status === 'paid')
  const totalRevenue = paid.reduce((s, o) => s + (o.total || 0), 0)
  const totalOrders = orders.length
  const pendingCount = orders.filter((o) => o.status === 'pending').length
  const shippedCount = orders.filter((o) => o.status === 'shipped').length
  const todayRevenue = (todayOrders.data || [])
    .filter((o) => o.payment_status === 'paid')
    .reduce((s, o) => s + (o.total || 0), 0)

  const days: { date: string; revenue: number; orders: number }[] = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
    const dateStr = d.toISOString().split('T')[0]
    const dayOrders = (chart.data || []).filter(
      (o) => o.created_at.split('T')[0] === dateStr
    )
    days.push({
      date: dateStr,
      revenue: dayOrders
        .filter((o) => o.payment_status === 'paid')
        .reduce((s, o) => s + (o.total || 0), 0),
      orders: dayOrders.length,
    })
  }

  return NextResponse.json({ totalRevenue, totalOrders, pendingCount, shippedCount, todayRevenue, chart: days })
}
