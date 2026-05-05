'use client'

import { useEffect, useState } from 'react'
import { Users, Phone, MapPin, ShoppingBag } from 'lucide-react'
import { formatRupiah } from '@/lib/utils'

interface Customer {
  name: string; phone: string; email: string | null; city: string
  orderCount: number; totalSpend: number; lastOrderAt: string
}

export default function AdminPelangganPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/customers').then((r) => r.json()).then(setCustomers).finally(() => setLoading(false))
  }, [])

  const totalCustomers = customers.length
  const totalRevenue = customers.reduce((s, c) => s + c.totalSpend, 0)
  const repeatBuyers = customers.filter((c) => c.orderCount > 1).length

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-gray-900">Pelanggan</h1>

      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Pelanggan', value: String(totalCustomers), icon: Users, bg: 'bg-blue-50', color: 'text-blue-600' },
          { label: 'Total Belanja', value: formatRupiah(totalRevenue), icon: ShoppingBag, bg: 'bg-emerald-50', color: 'text-emerald-600' },
          { label: 'Repeat Buyer', value: String(repeatBuyers), icon: Users, bg: 'bg-purple-50', color: 'text-purple-600' },
        ].map(({ label, value, icon: Icon, bg, color }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center`}><Icon size={18} className={color} /></div>
              <span className="text-sm text-gray-500">{label}</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-5 animate-pulse space-y-3">{[1,2,3,4,5].map((i) => <div key={i} className="h-3 bg-gray-100 rounded" />)}</div>
        </div>
      ) : customers.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 py-16 text-center text-sm text-gray-400">Belum ada data pelanggan.</div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {['Pelanggan', 'No HP', 'Kota', 'Pesanan', 'Total Belanja', 'Terakhir Beli'].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-medium text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {customers.map((c, i) => (
                <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-jena-gold/10 flex items-center justify-center text-xs font-bold text-jena-gold flex-shrink-0">
                        {c.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{c.name}</p>
                        {c.email && <p className="text-xs text-gray-400">{c.email}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1.5 text-gray-600">
                      <Phone size={12} className="text-gray-400" />
                      {c.phone}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1.5 text-gray-600">
                      <MapPin size={12} className="text-gray-400" />
                      {c.city}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${c.orderCount > 1 ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
                      {c.orderCount}x {c.orderCount > 1 ? 'Repeat' : ''}
                    </span>
                  </td>
                  <td className="px-5 py-3 font-semibold">{formatRupiah(c.totalSpend)}</td>
                  <td className="px-5 py-3 text-gray-500 text-xs">{new Date(c.lastOrderAt).toLocaleDateString('id-ID')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
