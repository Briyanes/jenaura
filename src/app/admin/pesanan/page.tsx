import { formatRupiah } from '@/lib/utils'

const ORDERS = [
  { id: 'JEN-A1B2C3D4', name: 'Sari Dewi', phone: '08123456789', product: 'Paket Trio', total: 485000, status: 'Dikirim', courier: 'JNE Reg', resi: 'JNE1234567890', date: '5 Feb 2026', address: 'Jl. Sudirman No. 12, Jakarta Selatan' },
  { id: 'JEN-E5F6G7H8', name: 'Anita Putri', phone: '08987654321', product: 'Paket Duo', total: 345000, status: 'Diproses', courier: 'SiCepat', resi: '-', date: '5 Feb 2026', address: 'Jl. Asia Afrika No. 5, Bandung' },
  { id: 'JEN-I9J0K1L2', name: 'Maya Sari', phone: '08765432198', product: 'Satuan', total: 189000, status: 'Selesai', courier: 'JNE Reg', resi: 'JNE9876543210', date: '4 Feb 2026', address: 'Jl. Malioboro No. 8, Yogyakarta' },
  { id: 'JEN-M3N4O5P6', name: 'Rina Ayu', phone: '08234567890', product: 'Paket Trio', total: 485000, status: 'Selesai', courier: 'J&T', resi: 'JT5678901234', date: '4 Feb 2026', address: 'Jl. Pemuda No. 3, Surabaya' },
  { id: 'JEN-Q7R8S9T0', name: 'Dina Lestari', phone: '08567890123', product: 'Paket Duo', total: 345000, status: 'Pending', courier: '-', resi: '-', date: '3 Feb 2026', address: 'Jl. Teuku Umar No. 7, Denpasar' },
  { id: 'JEN-U1V2W3X4', name: 'Budi Santika', phone: '08112233445', product: 'Paket Trio', total: 485000, status: 'Dikirim', courier: 'SiCepat', resi: 'SC2468135790', date: '3 Feb 2026', address: 'Jl. Ahmad Yani No. 15, Semarang' },
]

export default function AdminPesananPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Pesanan</h1>
        <div className="flex gap-2">
          {['Semua', 'Pending', 'Diproses', 'Dikirim', 'Selesai'].map((s) => (
            <button key={s} className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600">
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {ORDERS.map((order) => (
          <div key={order.id} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-mono text-xs text-gray-500">{order.id}</p>
                <p className="font-medium text-gray-900 mt-0.5">{order.name}</p>
                <p className="text-xs text-gray-500">{order.phone}</p>
              </div>
              <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                order.status === 'Selesai' ? 'bg-green-100 text-green-700' :
                order.status === 'Dikirim' ? 'bg-blue-100 text-blue-700' :
                order.status === 'Diproses' ? 'bg-yellow-100 text-yellow-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {order.status}
              </span>
            </div>
            <div className="grid sm:grid-cols-4 gap-3 text-sm">
              <div><p className="text-xs text-gray-500">Produk</p><p className="font-medium">{order.product}</p></div>
              <div><p className="text-xs text-gray-500">Total</p><p className="font-semibold">{formatRupiah(order.total)}</p></div>
              <div><p className="text-xs text-gray-500">Kurir</p><p>{order.courier} {order.resi !== '-' && <span className="text-xs text-gray-400">({order.resi})</span>}</p></div>
              <div><p className="text-xs text-gray-500">Tanggal</p><p>{order.date}</p></div>
            </div>
            <p className="text-xs text-gray-400 mt-2">{order.address}</p>
            <div className="flex gap-2 mt-3">
              <button className="px-3 py-1.5 text-xs font-medium bg-jena-gold/10 text-jena-gold rounded-lg hover:bg-jena-gold/20">Update Status</button>
              <button className="px-3 py-1.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200">Detail</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}