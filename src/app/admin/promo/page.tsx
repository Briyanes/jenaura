'use client'

import { useEffect, useState, useCallback } from 'react'
import { Plus, X, Check, Tag, Clock } from 'lucide-react'
import { formatRupiah } from '@/lib/utils'
import { toast } from 'sonner'

interface PromoCode {
  id: string; code: string; type: 'fixed' | 'percent' | 'shipping'
  value: number; min_order: number; max_uses?: number; used_count: number
  starts_at?: string; expires_at?: string; is_active: boolean; created_at: string
}

const EMPTY_FORM = { code: '', type: 'fixed' as 'fixed' | 'percent' | 'shipping', value: '', min_order: '', max_uses: '', expires_at: '', is_active: true }

export default function AdminPromoPage() {
  const [promos, setPromos] = useState<PromoCode[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editPromo, setEditPromo] = useState<PromoCode | null>(null)
  const [form, setForm] = useState({ ...EMPTY_FORM })
  const [saving, setSaving] = useState(false)

  const fetchPromos = useCallback(() => {
    setLoading(true)
    fetch('/api/admin/promo').then((r) => r.json()).then(setPromos).finally(() => setLoading(false))
  }, [])

  useEffect(() => { fetchPromos() }, [fetchPromos])

  function openCreate() { setEditPromo(null); setForm({ ...EMPTY_FORM }); setShowForm(true) }
  function openEdit(p: PromoCode) {
    setEditPromo(p)
    setForm({ code: p.code, type: p.type, value: String(p.value), min_order: String(p.min_order), max_uses: String(p.max_uses || ''), expires_at: p.expires_at ? p.expires_at.split('T')[0] : '', is_active: p.is_active })
    setShowForm(true)
  }

  async function handleSave() {
    if (!form.code || !form.type) { toast.error('Kode dan tipe wajib diisi'); return }
    setSaving(true)
    try {
      const payload = { ...form, value: Number(form.value || 0), min_order: Number(form.min_order || 0), max_uses: form.max_uses ? Number(form.max_uses) : null, expires_at: form.expires_at || null }
      const res = editPromo
        ? await fetch(`/api/admin/promo/${editPromo.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
        : await fetch('/api/admin/promo', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (!res.ok) { const e = await res.json(); throw new Error(e.error || 'Gagal'); }
      toast.success(editPromo ? 'Promo diperbarui' : 'Promo dibuat')
      setShowForm(false); fetchPromos()
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Gagal menyimpan')
    } finally { setSaving(false) }
  }

  async function toggleActive(p: PromoCode) {
    await fetch(`/api/admin/promo/${p.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ is_active: !p.is_active }) })
    fetchPromos()
  }

  async function handleDelete(p: PromoCode) {
    if (!confirm(`Hapus kode "${p.code}"?`)) return
    const res = await fetch(`/api/admin/promo/${p.id}`, { method: 'DELETE' })
    if (res.ok) { toast.success('Promo dihapus'); fetchPromos() } else toast.error('Gagal menghapus')
  }

  const active = promos.filter((p) => p.is_active)
  const expiringSoon = promos.filter((p) => {
    if (!p.expires_at) return false
    const days = (new Date(p.expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    return days >= 0 && days <= 7
  })

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Promo & Diskon</h1>
        <button onClick={openCreate} className="inline-flex items-center gap-2 bg-jena-gold text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-jena-gold/90">
          <Plus size={16} /> Buat Promo
        </button>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: 'Promo Aktif', value: active.length, icon: Tag, bg: 'bg-green-50', color: 'text-green-600' },
          { label: 'Total Digunakan', value: promos.reduce((s, p) => s + p.used_count, 0), icon: Check, bg: 'bg-blue-50', color: 'text-blue-600' },
          { label: 'Segera Expired', value: expiringSoon.length, icon: Clock, bg: 'bg-amber-50', color: 'text-amber-600' },
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
        <div className="space-y-3">{[1,2,3].map((i) => <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse h-16" />)}</div>
      ) : promos.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 py-16 text-center text-sm text-gray-400">Belum ada kode promo.</div>
      ) : (
        <div className="space-y-3">
          {promos.map((p) => (
            <div key={p.id} className={`bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between ${!p.is_active ? 'opacity-60' : ''}`}>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono font-bold text-gray-900">{p.code}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${p.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{p.is_active ? 'Aktif' : 'Nonaktif'}</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {p.type === 'fixed' ? `Diskon ${formatRupiah(p.value)}` : p.type === 'percent' ? `Diskon ${p.value}%` : 'Free Ongkir'}
                  {p.min_order > 0 && ` · Min. ${formatRupiah(p.min_order)}`}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Digunakan: {p.used_count}{p.max_uses ? `/${p.max_uses}` : ''}
                  {p.expires_at && ` · Exp: ${new Date(p.expires_at).toLocaleDateString('id-ID')}`}
                </p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => toggleActive(p)} className={`px-3 py-1.5 text-xs font-medium rounded-lg ${p.is_active ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}>{p.is_active ? 'Nonaktifkan' : 'Aktifkan'}</button>
                <button onClick={() => openEdit(p)} className="px-3 py-1.5 text-xs font-medium bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">Edit</button>
                <button onClick={() => handleDelete(p)} className="px-3 py-1.5 text-xs font-medium bg-red-50 text-red-600 rounded-lg hover:bg-red-100">Hapus</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">{editPromo ? 'Edit Promo' : 'Promo Baru'}</h2>
              <button onClick={() => setShowForm(false)} className="p-2 text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">Kode Promo *</label>
                <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="JENAURA20" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">Tipe *</label>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as 'fixed' | 'percent' | 'shipping' })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
                  <option value="fixed">Diskon Nominal (Rp)</option>
                  <option value="percent">Diskon Persen (%)</option>
                  <option value="shipping">Gratis Ongkir</option>
                </select>
              </div>
              {form.type !== 'shipping' && (
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">{form.type === 'fixed' ? 'Nominal Diskon (Rp)' : 'Persen Diskon (%)'}</label>
                  <input type="number" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">Min. Order (Rp)</label>
                  <input type="number" value={form.min_order} onChange={(e) => setForm({ ...form, min_order: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">Maks. Penggunaan</label>
                  <input type="number" value={form.max_uses} onChange={(e) => setForm({ ...form, max_uses: e.target.value })} placeholder="Kosong = tak terbatas" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">Tanggal Kadaluarsa</label>
                <input type="date" value={form.expires_at} onChange={(e) => setForm({ ...form, expires_at: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="promo_active" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="w-4 h-4 accent-jena-gold" />
                <label htmlFor="promo_active" className="text-sm text-gray-700">Aktif</label>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">Batal</button>
              <button onClick={handleSave} disabled={saving} className="px-5 py-2 text-sm bg-jena-gold text-white rounded-lg font-semibold hover:bg-jena-gold/90 disabled:opacity-50 flex items-center gap-2">
                <Check size={14} />{saving ? '' : editPromo ? 'Simpan' : 'Buat Promo'}Menyimpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
