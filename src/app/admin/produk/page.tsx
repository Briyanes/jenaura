import { Plus, Edit, Trash2, Eye } from 'lucide-react'
import { HERO_PRODUCT, PRODUCT_VARIANTS } from '@/lib/mock-data'
import { formatRupiah } from '@/lib/utils'

export default function AdminProdukPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Produk</h1>
        <button className="inline-flex items-center gap-2 bg-jena-gold text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-jena-gold/90">
          <Plus size={16} /> Tambah Produk
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">Produk</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">Varian</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">Harga</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">Stok</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">Status</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-jena-peach/30 flex items-center justify-center text-xs font-bold text-jena-gold">JEN</div>
                    <div>
                      <p className="font-medium text-gray-900">{HERO_PRODUCT.name}</p>
                      <p className="text-xs text-gray-500">{HERO_PRODUCT.weight}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600">{PRODUCT_VARIANTS.length} varian</td>
                <td className="px-6 py-4">
                  <p className="font-semibold">{formatRupiah(HERO_PRODUCT.price)}</p>
                  {HERO_PRODUCT.comparePrice && <p className="text-xs text-gray-400 line-through">{formatRupiah(HERO_PRODUCT.comparePrice)}</p>}
                </td>
                <td className="px-6 py-4"><span className="font-medium text-green-600">{HERO_PRODUCT.stock}</span></td>
                <td className="px-6 py-4"><span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-medium">Aktif</span></td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 text-gray-400 hover:text-blue-600 rounded" title="Lihat"><Eye size={16} /></button>
                    <button className="p-1.5 text-gray-400 hover:text-yellow-600 rounded" title="Edit"><Edit size={16} /></button>
                    <button className="p-1.5 text-gray-400 hover:text-red-600 rounded" title="Hapus"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Variants */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Varian Produk</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {PRODUCT_VARIANTS.map((v, i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-4">
              <p className="font-medium text-gray-900">{v.name}</p>
              <p className="text-lg font-bold text-jena-mocha mt-1">{formatRupiah(v.price)}</p>
              <p className="text-xs text-gray-500 mt-1">Qty: {v.quantity} pcs</p>
              {v.saveAmount > 0 && <p className="text-xs text-green-600 mt-1">Hemat {formatRupiah(v.saveAmount)}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}