import { Plus, Tag, Clock, Check } from 'lucide-react'
import { formatRupiah } from '@/lib/utils'

const PROMOS = [
  { id: 1, code: 'JENAURA15', type: 'fixed', value: 15000, minOrder: 189000, usage: 47, maxUsage: 100, expires: '28 Feb 2026', active: true },
  { id: 2, code: 'LAUNCH20', type: 'percent', value: 20, minOrder: 345000, usage: 123, maxUsage: 200, expires: '15 Feb 2026', active: true },
  { id: 3, code: 'FREEONGKIR', type: 'shipping', value: 0, minOrder: 189000, usage: 89, maxUsage: 500, expires: '31 Mar 2026', active: true },
]

export default function AdminPromoPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Promo & Diskon</h1>
        <button className="inline-flex items-center gap-2 bg-jena-gold text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-jena-gold/90">
          <Plus size={16} /> Buat Promo
        </button>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center"><Tag size={18} className="text-green-600" /></div>
            <span className="text-sm text-gray-500">Promo Aktif</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">3</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center"><Check size={18} className="text-blue-600" /></div>
            <span className="text-sm text-gray-500">Total Digunakan</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">259</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-lg bg-yellow-100 flex items-center justify-center"><Clock size={18} className="text-yellow-600" /></div>
            <span className="text-sm text-gray-500">Segera Expired</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">1</p>
        </div>
      </div>

      <div className="space-y-3">
        {PROMOS.map((promo) => (
          <div key={promo.id} className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-gray-900">{promo.code}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${promo.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {promo.active ? 'Aktif' : 'Nonaktif'}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {promo.type === 'fixed' ? `Diskon ${formatRupiah(promo.value)}` :
                 promo.type === 'percent' ? `Diskon ${promo.value}%` : 'Free Ongkir'}
                {' · Min. belanja '}{formatRupiah(promo.minOrder)}
              </p>
              <p className="text-xs text-gray-400 mt-1">Digunakan {promo.usage}/{promo.maxUsage} · Exp: {promo.expires}</p>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200">Edit</button>
              <button className="px-3 py-1.5 text-xs font-medium bg-red-50 text-red-600 rounded-lg hover:bg-red-100">Hapus</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}