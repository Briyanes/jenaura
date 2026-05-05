'use client'

import { useEffect, useState, useCallback } from 'react'
import { Plus, Edit2, Trash2, ChevronDown, ChevronRight, X, Check, Eye, EyeOff } from 'lucide-react'
import { formatRupiah } from '@/lib/utils'
import { toast } from 'sonner'

interface Variant { id: string; name: string; quantity: number; price: number; save_amount: number; is_active: boolean }
interface Product {
  id: string; name: string; slug: string; description?: string;
  price: number; compare_price?: number; weight?: string; stock: number;
  badge?: string; is_active: boolean; created_at: string;
  product_variants: Variant[]
}

const EMPTY_PRODUCT = { name: '', slug: '', description: '', price: '', compare_price: '', weight: '', stock: '0', badge: '', is_active: true }
const EMPTY_VARIANT = { name: '', quantity: '1', price: '', save_amount: '0' }

export default function AdminProdukPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editProduct, setEditProduct] = useState<Product | null>(null)
  const [form, setForm] = useState(EMPTY_PRODUCT)
  const [variants, setVariants] = useState([{ ...EMPTY_VARIANT }])
  const [saving, setSaving] = useState(false)

  const [variantForm, setVariantForm] = useState<{ productId: string } | null>(null)
  const [newVariant, setNewVariant] = useState({ ...EMPTY_VARIANT })

  const fetchProducts = useCallback(() => {
    setLoading(true)
    fetch('/api/admin/products')
      .then((r) => r.json())
      .then(setProducts)
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  function openCreate() {
    setEditProduct(null)
    setForm(EMPTY_PRODUCT)
    setVariants([{ ...EMPTY_VARIANT }])
    setShowForm(true)
  }

  function openEdit(product: Product) {
    setEditProduct(product)
    setForm({
      name: product.name, slug: product.slug,
      description: product.description || '',
      price: String(product.price),
      compare_price: String(product.compare_price || ''),
      weight: product.weight || '',
      stock: String(product.stock),
      badge: product.badge || '',
      is_active: product.is_active,
    })
    setVariants([{ ...EMPTY_VARIANT }])
    setShowForm(true)
  }

  async function handleSave() {
    if (!form.name || !form.price) { toast.error('Nama dan harga wajib diisi'); return }
    setSaving(true)
    try {
      if (editProduct) {
        const res = await fetch(`/api/admin/products/${editProduct.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, price: Number(form.price), compare_price: form.compare_price ? Number(form.compare_price) : null, stock: Number(form.stock) }),
        })
        if (!res.ok) throw new Error()
        toast.success('Produk diperbarui')
      } else {
        const validVariants = variants.filter((v) => v.name && v.price)
        const res = await fetch('/api/admin/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, price: Number(form.price), compare_price: form.compare_price ? Number(form.compare_price) : null, stock: Number(form.stock), variants: validVariants }),
        })
        if (!res.ok) throw new Error()
        toast.success('Produk berhasil dibuat')
      }
      setShowForm(false)
      fetchProducts()
    } catch {
      toast.error('Gagal menyimpan')
    } finally {
      setSaving(false)
    }
  }

  async function toggleActive(product: Product) {
    await fetch(`/api/admin/products/${product.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: !product.is_active }),
    })
    fetchProducts()
  }

  async function handleDelete(product: Product) {
    if (!confirm(`Hapus produk "${product.name}"?`)) return
    const res = await fetch(`/api/admin/products/${product.id}`, { method: 'DELETE' })
    if (res.ok) { toast.success('Produk dihapus'); fetchProducts() }
    else toast.error('Gagal menghapus')
  }

  async function addVariant(productId: string) {
    if (!newVariant.name || !newVariant.price) { toast.error('Nama dan harga varian wajib diisi'); return }
    setSaving(true)
    const res = await fetch(`/api/admin/products/${productId}/variants`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newVariant, price: Number(newVariant.price), quantity: Number(newVariant.quantity), save_amount: Number(newVariant.save_amount) }),
    })
    setSaving(false)
    if (res.ok) { toast.success('Varian ditambahkan'); setVariantForm(null); setNewVariant({ ...EMPTY_VARIANT }); fetchProducts() }
    else toast.error('Gagal menambah varian')
  }

  async function deleteVariant(variantId: string) {
    if (!confirm('Hapus varian ini?')) return
    const res = await fetch(`/api/admin/variants/${variantId}`, { method: 'DELETE' })
    if (res.ok) { toast.success('Varian dihapus'); fetchProducts() }
    else toast.error('Gagal menghapus varian')
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Produk</h1>
        <button onClick={openCreate} className="inline-flex items-center gap-2 bg-jena-gold text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-jena-gold/90">
          <Plus size={16} /> Tambah Produk
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2].map((i) => <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse h-20" />)}</div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 py-16 text-center text-sm text-gray-400">
          Belum ada produk. Klik "Tambah Produk" untuk mulai.
        </div>
      ) : (
        <div className="space-y-3">
          {products.map((product) => (
            <div key={product.id} className={`bg-white rounded-xl border transition-colors ${product.is_active ? 'border-gray-200' : 'border-gray-100 opacity-60'}`}>
              <div className="p-5 flex items-center gap-4">
                <button onClick={() => setExpanded(expanded === product.id ? null : product.id)} className="text-gray-400 hover:text-gray-600">
                  {expanded === product.id ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                </button>
                <div className="w-10 h-10 rounded-lg bg-jena-peach/30 flex items-center justify-center text-xs font-bold text-jena-gold flex-shrink-0">
                  {product.name.substring(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{product.name}</p>
                  <p className="text-xs text-gray-500">Stok: {product.stock} · {product.weight} · {product.product_variants?.length || 0} varian</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-bold">{formatRupiah(product.price)}</p>
                  {product.compare_price && <p className="text-xs text-gray-400 line-through">{formatRupiah(product.compare_price)}</p>}
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button onClick={() => toggleActive(product)} title={product.is_active ? 'Nonaktifkan' : 'Aktifkan'} className="p-1.5 text-gray-400 hover:text-amber-500 rounded">{product.is_active ? <Eye size={16} /> : <EyeOff size={16} />}</button>
                  <button onClick={() => openEdit(product)} className="p-1.5 text-gray-400 hover:text-blue-500 rounded"><Edit2 size={16} /></button>
                  <button onClick={() => handleDelete(product)} className="p-1.5 text-gray-400 hover:text-red-500 rounded"><Trash2 size={16} /></button>
                </div>
              </div>

              {expanded === product.id && (
                <div className="border-t border-gray-100 px-5 pb-5">
                  <div className="pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-gray-700">Varian</h3>
                      <button onClick={() => { setVariantForm({ productId: product.id }); setNewVariant({ ...EMPTY_VARIANT }) }} className="text-xs text-jena-gold hover:underline flex items-center gap-1"><Plus size={12} />Tambah Varian</button>
                    </div>
                    {product.product_variants?.length === 0 ? (
                      <p className="text-xs text-gray-400">Belum ada varian.</p>
                    ) : (
                      <div className="grid sm:grid-cols-3 gap-3">
                        {product.product_variants?.map((v) => (
                          <div key={v.id} className="border border-gray-100 rounded-lg p-3 flex items-start justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-800">{v.name}</p>
                              <p className="text-sm font-bold text-jena-mocha">{formatRupiah(v.price)}</p>
                              <p className="text-xs text-gray-400">Qty: {v.quantity}</p>
                              {v.save_amount > 0 && <p className="text-xs text-green-600">Hemat {formatRupiah(v.save_amount)}</p>}
                            </div>
                            <button onClick={() => deleteVariant(v.id)} className="text-gray-300 hover:text-red-400 p-1"><X size={14} /></button>
                          </div>
                        ))}
                      </div>
                    )}

                    {variantForm?.productId === product.id && (
                      <div className="mt-4 border border-dashed border-gray-300 rounded-lg p-4 space-y-3">
                        <p className="text-sm font-medium text-gray-700">Varian Baru</p>
                        <div className="grid grid-cols-2 gap-3">
                          <div><label className="text-xs text-gray-500">Nama Varian</label><input value={newVariant.name} onChange={(e) => setNewVariant({ ...newVariant, name: e.target.value })} placeholder="Paket Duo" className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" /></div>
                          <div><label className="text-xs text-gray-500">Qty (pcs)</label><input type="number" value={newVariant.quantity} onChange={(e) => setNewVariant({ ...newVariant, quantity: e.target.value })} className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" /></div>
                          <div><label className="text-xs text-gray-500">Harga (Rp)</label><input type="number" value={newVariant.price} onChange={(e) => setNewVariant({ ...newVariant, price: e.target.value })} className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" /></div>
                          <div><label className="text-xs text-gray-500">Hemat (Rp)</label><input type="number" value={newVariant.save_amount} onChange={(e) => setNewVariant({ ...newVariant, save_amount: e.target.value })} className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" /></div>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => setVariantForm(null)} className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg text-gray-600">Batal</button>
                          <button onClick={() => addVariant(product.id)} disabled={saving} className="px-4 py-1.5 text-xs bg-jena-gold text-white rounded-lg font-medium disabled:opacity-50">Simpan</button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl my-4">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">{editProduct ? 'Edit Produk' : 'Produk Baru'}</h2>
              <button onClick={() => setShowForm(false)} className="p-2 text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-xs font-medium text-gray-600 block mb-1">Nama Produk *</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="JENAURA Keratin Treatment" />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-medium text-gray-600 block mb-1">Slug (URL)</label>
                  <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono" />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-medium text-gray-600 block mb-1">Deskripsi</label>
                  <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">Harga (Rp) *</label>
                  <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">Harga Coret (Rp)</label>
                  <input type="number" value={form.compare_price} onChange={(e) => setForm({ ...form, compare_price: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">Berat/Ukuran</label>
                  <input value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} placeholder="100ml" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">Stok</label>
                  <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">Badge (opsional)</label>
                  <input value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} placeholder="NEW, BESTSELLER" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <input type="checkbox" id="is_active" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="w-4 h-4 accent-jena-gold" />
                  <label htmlFor="is_active" className="text-sm text-gray-700">Produk aktif (tampil di website)</label>
                </div>
              </div>

              {!editProduct && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-medium text-gray-600">Varian (opsional)</label>
                    <button onClick={() => setVariants([...variants, { ...EMPTY_VARIANT }])} className="text-xs text-jena-gold hover:underline flex items-center gap-1"><Plus size={12} />Tambah</button>
                  </div>
                  {variants.map((v, i) => (
                    <div key={i} className="grid grid-cols-4 gap-2 mb-2">
                      <input value={v.name} onChange={(e) => { const n = [...variants]; n[i].name = e.target.value; setVariants(n) }} placeholder="Nama varian" className="col-span-2 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                      <input type="number" value={v.price} onChange={(e) => { const n = [...variants]; n[i].price = e.target.value; setVariants(n) }} placeholder="Harga" className="px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                      <div className="flex gap-1">
                        <input type="number" value={v.quantity} onChange={(e) => { const n = [...variants]; n[i].quantity = e.target.value; setVariants(n) }} placeholder="Qty" className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                        {variants.length > 1 && <button onClick={() => setVariants(variants.filter((_, j) => j !== i))} className="p-2 text-gray-400 hover:text-red-400"><X size={14} /></button>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">Batal</button>
              <button onClick={handleSave} disabled={saving} className="px-5 py-2 text-sm bg-jena-gold text-white rounded-lg font-semibold hover:bg-jena-gold/90 disabled:opacity-50 flex items-center gap-2">
                <Check size={14} />{saving ? '' : editProduct ? 'Simpan Perubahan' : 'Buat Produk'}Menyimpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
