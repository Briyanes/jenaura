import { DollarSign, ShoppingCart, Package, TrendingUp, Users } from 'lucide-react'
import { formatRupiah } from '@/lib/utils'

const STATS = [
  { label: 'Total Pendapatan', value: formatRupiah(45800000), icon: DollarSign, change: '+12.5%', color: 'text-green-600' },
  { label: 'Total Pesanan', value: '127', icon: ShoppingCart, change: '+8.2%', color: 'text-green-600' },
  { label: 'Produk Terjual', value: '234', icon: Package, change: '+15.3%', color: 'text-green-600' },
  { label: 'Pelanggan Baru', value: '89', icon: Users, change: '+22.1%', color: 'text-green-600' },
]

const RECENT_ORDERS = [
  { id: 'JEN-A1B2C3D4', name: 'Sari Dewi', product: 'Paket Trio', total: formatRupiah(485000), status: 'Dikirim', date: '5 Feb 2026' },
  { id: 'JEN-E5F6G7H8', name: 'Anita Putri', product: 'Paket Duo', total: formatRupiah(345000), status: 'Diproses', date: '5 Feb 2026' },
  { id: 'JEN-I9J0K1L2', name: 'Maya Sari', product: 'Satuan', total: formatRupiah(189000), status: 'Selesai', date: '4 Feb 2026' },
  { id: 'JEN-M3N4O5P6', name: 'Rina Ayu', product: 'Paket Trio', total: formatRupiah(485000), status: 'Selesai', date: '4 Feb 2026' },
  { id: 'JEN-Q7R8S9T0', name: 'Dina Lestari', product: 'Paket Duo', total: formatRupiah(345000), status: 'Pending', date: '3 Feb 2026' },
]

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map(({ label, value, icon: Icon, change, color }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-gray-500">{label}</span>
              <div className="w-9 h-9 rounded-lg bg-jena-gold/10 flex items-center justify-center">
                <Icon size={18} className="text-jena-gold" strokeWidth={1.5} />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className={`text-xs mt-1 ${color}`}>{change} dari bulan lalu</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Pesanan Terbaru</h2>
          <a href="/admin/pesanan" className="text-xs text-jena-gold hover:underline">Lihat Semua</a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">Order ID</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">Pelanggan</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">Produk</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">Total</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">Status</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">Tanggal</th>
              </tr>
            </thead>
            <tbody>
              {RECENT_ORDERS.map((order) => (
                <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-6 py-3 font-mono text-xs">{order.id}</td>
                  <td className="px-6 py-3">{order.name}</td>
                  <td className="px-6 py-3 text-gray-600">{order.product}</td>
                  <td className="px-6 py-3 font-semibold">{order.total}</td>
                  <td className="px-6 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                      order.status === 'Selesai' ? 'bg-green-100 text-green-700' :
                      order.status === 'Dikirim' ? 'bg-blue-100 text-blue-700' :
                      order.status === 'Diproses' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-gray-500">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}