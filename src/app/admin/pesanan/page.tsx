'use client'

import { useEffect, useState, useCallback } from 'react'
import { Search, X, Check, Truck } from 'lucide-react'
import { formatRupiah } from '@/lib/utils'
import { toast } from 'sonner'

interface Order {
  id: string
  order_number: string
  customer_name: string
  customer_phone: string
  customer_email?: string
  shipping_address: string
  city: string
  total: number
  subtotal: number
  shipping_cost: number
  discount_amount: number
  status: string
  payment_status: string
  courier?: string
  tracking_number?: string
  notes?: string
  created_at: string
  product_variants?: { name: string; products?: { name: string } }
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending: { label: 'Pending', color: 'bg-gray-100 text-gray-700' },
  confirmed: { label: 'Dikonfirmasi', color: 'bg-blue-100 text-blue-700' },
  processed: { label: 'Diproses', color: 'bg-yellow-100 text-yellow-700' },
  shipped: { label: 'Dikirim', color: 'bg-indigo-100 text-indigo-700' },
  delivered: { label: 'Selesai', color: 'bg-green-100 text-green-700' },
  cancelled: { label: 'Dibatalkan', color: 'bg-red-100 text-red-700' },
}

const STATUSES = ['all', 'pending', 'confirmed', 'processed', 'shipped', 'delivered', 'cancelled']

export default function AdminPesananPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('all')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<Order | null>(null)
  const [updateStatus, setUpdateStatus] = useState('')
  const [resi, setResi] = useState('')
  const [courier, setCourier] = useState('')
  const [saving, setSaving] = useState(false)

  const fetchOrders = useCallback(() => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page) })
    if (status !== 'all') params.set('status', status)
    if (search) params.set('search', search)
    fetch(`/api/admin/orders?${params}`)
      .then((r) => r.json())
      .then((d) => { setOrders(d.orders || []); setTotal(d.total || 0) })
      .finally(() => setLoading(false))
  }, [page, status, search])

  useEffect(() => { fetchOrders() }, [fetchOrders])

  function openDetail(order: Order) {
    setSelected(order)
    setUpdateStatus(order.status)
    setResi(order.tracking_number || '')
    setCourier(order.courier || '')
  }

  async function handleSave() {
    if (!selected) return
    setSaving(true)
    const res = await fetch(`/api/admin/orders/${selected.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: updateStatus, tracking_number: resi, courier }),
    })
    if (res.ok) {
      toast.success('Pesanan diperbarui')
      setSelected(null)
      fetchOrders()
    } else {
      toast.error('Gagal menyimpan')
    }
    setSaving(false)
  }

  const totalPages = Math.ceil(total / 20)

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-gray-900">Pesanan</h1>

      {/* Filter bar */}
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <div className="flex flex-wrap gap-1.5">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => { setStatus(s); setPage(1) }}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                status === s
                  ? 'bg-jena-gold text-white border-jena-gold'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {STATUS_LABELS[s]?.label || 'Semua'}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            placeholder="Cari nama / no HP / order"
            className="pl-8 pr-4 py-2 border border-gray-200 rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-jena-gold/40"
          />
        </div>
      </div>

      {/* Orders list */}
      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
              <div className="h-3 bg-gray-100 rounded w-1/4 mb-3" />
              <div className="h-3 bg-gray-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 py-16 text-center text-sm text-gray-400">
          Tidak ada pesanan ditemukan.
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => {
            const st = STATUS_LABELS[order.status] || { label: order.status, color: 'bg-gray-100 text-gray-600' }
            return (
              <div key={order.id} className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-mono text-xs text-gray-400">{order.order_number}</p>
                    <p className="font-semibold text-gray-900 mt-0.5">{order.customer_name}</p>
                    <p className="text-xs text-gray-500">{order.customer_phone} · {order.city}</p>
                  </div>
                  <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${st.color}`}>{st.label}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-gray-400">Produk</p>
                    <p className="font-medium text-gray-700 text-xs">{order.product_variants?.name || '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Total</p>
                    <p className="font-bold">{formatRupiah(order.total)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Kurir</p>
                    <p className="text-sm">{order.courier || '-'} {order.tracking_number ? <span className="text-gray-400 text-xs">({order.tracking_number})</span> : ''}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Tanggal</p>
                    <p className="text-sm">{new Date(order.created_at).toLocaleDateString('id-ID')}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-2 truncate">{order.shipping_address}</p>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => openDetail(order)}
                    className="px-3 py-1.5 text-xs font-medium bg-jena-gold/10 text-jena-gold rounded-lg hover:bg-jena-gold/20"
                  >
                    Update Status
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">{total} pesanan total</span>
          <div className="flex gap-2">
            <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="px-3 py-1.5 border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-</button>50">
            <span className="px-3 py-1.5 text-gray-600">{page}/{totalPages}</span>
</button>
          </div>
        </div>
      )}

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <p className="font-semibold text-gray-900">{selected.customer_name}</p>
                <p className="text-xs text-gray-400 font-mono">{selected.order_number}</p>
              </div>
              <button onClick={() => setSelected(null)} className="p-2 text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><p className="text-xs text-gray-400 mb-1">No HP</p><p className="font-medium">{selected.customer_phone}</p></div>
                <div><p className="text-xs text-gray-400 mb-1">Kota</p><p className="font-medium">{selected.city}</p></div>
                <div className="col-span-2"><p className="text-xs text-gray-400 mb-1">Alamat</p><p className="font-medium">{selected.shipping_address}</p></div>
                <div><p className="text-xs text-gray-400 mb-1">Subtotal</p><p>{formatRupiah(selected.subtotal)}</p></div>
                <div><p className="text-xs text-gray-400 mb-1">Ongkir</p><p>{formatRupiah(selected.shipping_cost)}</p></div>
                {selected.discount_amount > 0 && <div><p className="text-xs text-gray-400 mb-1">Diskon</p><p className="text-green-600">-{formatRupiah(selected.discount_amount)}</p></div>}
                <div><p className="text-xs text-gray-400 mb-1">Total</p><p className="font-bold text-lg">{formatRupiah(selected.total)}</p></div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1.5">Status Pesanan</label>
                <select
                  value={updateStatus}
                  onChange={(e) => setUpdateStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-jena-gold/40"
                >
                  {Object.entries(STATUS_LABELS).map(([k, v]) => (
                    <option key={k} value={k}>{v.label}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1.5">Kurir</label>
                  <input value={courier} onChange={(e) => setCourier(e.target.value)} placeholder="JNE, " className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-jena-gold/40" />SiCepat, 
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1.5">No Resi</label>
                  <input value={resi} onChange={(e) => setResi(e.target.value)} placeholder="Nomor resi" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-jena-gold/40" />
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={() => setSelected(null)} className="px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">Batal</button>
              <button onClick={handleSave} disabled={saving} className="px-5 py-2 text-sm bg-jena-gold text-white rounded-lg font-semibold hover:bg-jena-gold/90 disabled:opacity-50 flex items-center gap-2">
                <Check size={14} />{saving ? '' : 'Simpan'}Menyimpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
