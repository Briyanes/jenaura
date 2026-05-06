'use client'

import { useState } from 'react'
import { Eye, EyeOff, CreditCard, Truck, MessageCircle, BarChart2, Database, KeyRound } from 'lucide-react'

interface SettingSection {
  title: string
  icon: React.ReactNode
  fields: { label: string; key: string; type: string; placeholder: string }[]
}

const SECTIONS: SettingSection[] = [
  {
    title: 'Duitku Payment Gateway',
    icon: <CreditCard size={16} className="text-jena-gold" />,
    fields: [
      { label: 'Merchant Code', key: 'duitku_merchant', type: 'text', placeholder: 'DS XXXXX' },
      { label: 'API Key', key: 'duitku_api', type: 'password', placeholder: 'API Key Duitku' },
    ],
  },
  {
    title: 'Biteship (Ongkos Kirim)',
    icon: <Truck size={16} className="text-jena-gold" />,
    fields: [
      { label: 'API Key', key: 'biteship_key', type: 'password', placeholder: 'API key Biteship' },
    ],
  },
  {
    title: 'WhatsApp (Fonnte)',
    icon: <MessageCircle size={16} className="text-jena-gold" />,
    fields: [
      { label: 'API Key', key: 'fonnte_key', type: 'password', placeholder: 'Token Fonnte' },
      { label: 'Nomor WhatsApp', key: 'wa_number', type: 'text', placeholder: '6281234567890' },
    ],
  },
  {
    title: 'Pixel & Analytics',
    icon: <BarChart2 size={16} className="text-jena-gold" />,
    fields: [
      { label: 'Facebook Pixel ID', key: 'fb_pixel', type: 'text', placeholder: '123456789012345' },
      { label: 'TikTok Pixel ID', key: 'tt_pixel', type: 'text', placeholder: 'C4XXXXXXXXXXXXX' },
      { label: 'Google Analytics ID', key: 'ga_id', type: 'text', placeholder: 'G-XXXXXXXXXX' },
    ],
  },
]

export default function AdminPengaturanPage() {
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({})

  function toggleShow(key: string) {
    setShowKeys((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Pengaturan</h1>
        <p className="text-sm text-gray-400 mt-1">Konfigurasi integrasi dan API keys. Simpan perubahan melalui Vercel Environment Variables.</p>
      </div>

      {/* Info banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-start gap-3">
        <KeyRound size={16} className="text-amber-600 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-amber-700 leading-relaxed">
          API keys disimpan sebagai <strong>Environment Variables di Vercel</strong>, bukan di database. Halaman ini hanya referensi. Untuk mengubah nilai, pergi ke <strong>Vercel Dashboard → Settings → Environment Variables</strong>.
        </p>
      </div>

      {SECTIONS.map((section) => (
        <div key={section.title} className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2 text-sm">
            {section.icon}
            {section.title}
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {section.fields.map((field) => (
              <div key={field.key}>
                <label className="text-xs font-medium text-gray-500 mb-1.5 block">{field.label}</label>
                <div className="relative">
                  <input
                    type={field.type === 'password' && !showKeys[field.key] ? 'password' : 'text'}
                    placeholder={field.placeholder}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm pr-9 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-jena-gold/40"
                  />
                  {field.type === 'password' && (
                    <button
                      type="button"
                      onClick={() => toggleShow(field.key)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showKeys[field.key] ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Supabase status */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2 text-sm">
          <Database size={16} className="text-jena-gold" />
          Supabase Database
        </h2>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
          <span className="text-sm text-gray-600">Terhubung via Vercel Environment Variables</span>
        </div>
        <p className="text-xs text-gray-400 mt-2">NEXT_PUBLIC_SUPABASE_URL · NEXT_PUBLIC_SUPABASE_ANON_KEY · SUPABASE_SERVICE_ROLE_KEY</p>
      </div>
    </div>
  )
}
