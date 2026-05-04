'use client'

import { useState } from 'react'
import { Save, Eye, EyeOff, TestTube, CreditCard, Truck } from 'lucide-react'

export default function AdminPengaturanPage() {
  const [showSecret, setShowSecret] = useState(false)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Pengaturan & Integrasi</h1>

      {/* Midtrans */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <CreditCard size={18} className="text-jena-gold" />
          Midtrans Payment Gateway
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1.5 block">Server Key</label>
            <div className="relative">
              <input type={showSecret ? 'text' : 'password'} defaultValue="SB-Mid-server-xxx" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm pr-10" />
              <button type="button" onClick={() => setShowSecret(!showSecret)} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
                {showSecret ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1.5 block">Client Key</label>
            <input type="text" defaultValue="SB-Mid-client-xxx" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1.5 block">Environment</label>
            <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
              <option>Sandbox</option>
              <option>Production</option>
            </select>
          </div>
        </div>
      </div>

      {/* RajaOngkir */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Truck size={18} className="text-jena-gold" />
          RajaOngkir API
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1.5 block">API Key</label>
            <input type="password" defaultValue="rajaongkir-api-key" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1.5 block">Kota Asal</label>
            <input type="text" defaultValue="Jakarta" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
          </div>
        </div>
      </div>

      {/* Fonnte (WhatsApp) */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-900 mb-4">💬 Fonnte (WhatsApp API)</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1.5 block">API Key</label>
            <input type="password" defaultValue="fonnte-api-key" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1.5 block">Nomor WhatsApp</label>
            <input type="text" defaultValue="6281234567890" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
          </div>
        </div>
      </div>

      {/* Pixel Tracking */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-900 mb-4">📊 Pixel Tracking</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1.5 block">Facebook Pixel ID</label>
            <input type="text" placeholder="Masukkan Pixel ID" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1.5 block">TikTok Pixel ID</label>
            <input type="text" placeholder="Masukkan Pixel ID" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
          </div>
        </div>
      </div>

      {/* Supabase */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-900 mb-4">🗄️ Supabase Database</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1.5 block">Supabase URL</label>
            <input type="text" placeholder="https://xxx.supabase.co" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1.5 block">Anon Key</label>
            <input type="password" placeholder="eyJ..." className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button className="inline-flex items-center gap-2 bg-jena-gold text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-jena-gold/90">
          <Save size={16} /> Simpan Pengaturan
        </button>
        <button className="inline-flex items-center gap-2 border border-gray-200 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">
          <TestTube size={16} /> Test Koneksi
        </button>
      </div>
    </div>
  )
}