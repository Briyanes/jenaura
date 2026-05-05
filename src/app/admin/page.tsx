'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { DollarSign, ShoppingCart, Clock, Truck, TrendingUp, TrendingDown } from 'lucide-react'
import { formatRupiah } from '@/lib/utils'

interface Stats {
  totalRevenue: number
  totalOrders: number
  pendingCount: number
  shippedCount: number
  todayRevenue: number
  chart: { date: string; revenue: number; orders: number }[]
}

interface Order {
  id: string
  order_number: string
  customer_name: string
  total: number
  status: string
  created_at: string
}

function MiniBar({ value, max }: { value: number; max: number }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0
  return (
    <div className="flex items-end gap-0.5 h-8">
      <div className="w-full bg-jena-gold/20 rounded-sm" style={{ height: `${Math.max(pct, 4)}%` }} />
    </div>
  )
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/stats').then((r) => r.json()),
      fetch('/api/admin/orders?page=1').then((r) => r.json()),
    ]).then(([s, o]) => {
      setStats(s)
      setRecentOrders(o.orders?.slice(0, 5) || [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const maxChartRev = stats ? Math.max(...stats.chart.map((d) => d.revenue), 1) : 1

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
              <div className="h-3 bg-gray-100 rounded w-1/2 mb-4" />
              <div className="h-7 bg-gray-100 rounded w-2/3" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  const STAT_CARDS = [
    {
      label: 'Total Pendapatan',
      value: formatRupiah(stats?.totalRevenue || 0),
      sub: `Hari ini: ${formatRupiah(stats?.todayRevenue || 0)}`,
      icon: DollarSign,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      label: 'Total Pesanan',
      value: String(stats?.totalOrders || 0),
      sub: 'Semua waktu',
      icon: ShoppingCart,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: 'Menunggu Proses',
      value: String(stats?.pendingCount || 0),
      sub: 'Perlu tindakan',
      icon: Clock,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
    {
      label: 'Sedang Dikirim',
      value: String(stats?.shippedCount || 0),
      sub: 'Dalam pengiriman',
      icon: Truck,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <span className="text-xs text-gray-400">{new Date().toLocaleDateString('id-ID', { dateStyle: 'long' })}</span>
      </div>

      {/* Stat cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map(({ label, value, sub, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-gray-500">{label}</span>
              <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center`}>
                <Icon size={18} className={color} strokeWidth={1.5} />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-xs mt-1 text-gray-400">{sub}</p>
          </div>
        ))}
      </div>

      {/* Chart 7 hari */}
      {stats && stats.chart.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <TrendingUp size={16} className="text-jena-gold" />
              Penjualan 7 Hari Terakhir
            </h2>
            <span className="text-xs text-gray-400">Revenue (Rp)</span>
          </div>
          <div className="flex items-end gap-2 h-24">
            {stats.chart.map((day) => {
              const pct = Math.max((day.revenue / maxChartRev) * 100, 4)
              const label = new Date(day.date).toLocaleDateString('id-ID', { weekday: 'short' })
              return (
                <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[9px] text-gray-400">{day.orders > 0 ? day.orders : ''}</span>
                  <div className="w-full flex items-end" style={{ height: '64px' }}>
                    <div
                      className={`w-full rounded-t transition-all ${day.revenue > 0 ? 'bg-jena-gold' : 'bg-gray-100'}`}
                      style={{ height: `${pct}%` }}
                      title={formatRupiah(day.revenue)}
                    />
                  </div>
                  <span className="text-[9px] text-gray-400">{label}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Recent Orders */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Pesanan Terbaru</h2>
          <Link href="/admin/pesanan" className="text-xs text-jena-gold hover:underline">Lihat Semua</Link>
        </div>
        {recentOrders.length === 0 ? (
          <div className="px-6 py-10 text-center text-sm text-gray-400">
            {stats ? 'Belum ada pesanan.' : 'Gagal memuat data.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {['Order ID', 'Pelanggan', 'Total', 'Status', 'Tanggal'].map((h) => (
                    <th key={h} className="text-left px-6 py-3 text-xs font-medium text-gray-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-6 py-3 font-mono text-xs text-gray-500">{order.order_number}</td>
                    <td className="px-6 py-3 font-medium">{order.customer_name}</td>
                    <td className="px-6 py-3 font-semibold">{formatRupiah(order.total)}</td>
                    <td className="px-6 py-3">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-3 text-gray-500 text-xs">
                      {new Date(order.created_at).toLocaleDateString('id-ID')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: 'bg-gray-100 text-gray-700',
    confirmed: 'bg-blue-100 text-blue-700',
    processed: 'bg-yellow-100 text-yellow-700',
    shipped: 'bg-indigo-100 text-indigo-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
    returned: 'bg-orange-100 text-orange-700',
  }
  const label: Record<string, string> = {
    pending: 'Pending', confirmed: 'Dikonfirmasi', processed: 'Diproses',
    shipped: 'Dikirim', delivered: 'Selesai', cancelled: 'Dibatalkan', returned: 'Dikembalikan',
  }
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${map[status] || 'bg-gray-100 text-gray-600'}`}>
      {label[status] || status}
    </span>
  )
}
