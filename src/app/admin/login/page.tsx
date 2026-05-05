'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Lock } from 'lucide-react'
import { toast } from 'sonner'

export default function AdminLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (response.ok) {
        toast.success('Login berhasil')
        window.location.href = '/admin'
      } else {
        toast.error('Password salah')
      }
    } catch {
      toast.error('Terjadi kesalahan')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-jena-ivory flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl text-jena-mocha mb-2">JENAURA</h1>
            <p className="text-sm text-gray-400">Admin Dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-xs font-medium text-jena-charcoal mb-2 block">
                Password Admin
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-jena-gold focus:border-transparent outline-none transition-all"
                  placeholder="Masukkan password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-jena-gold text-white py-3 rounded-xl font-semibold hover:bg-jena-gold/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Memproses...' : 'Login'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/" className="text-sm text-jena-gold hover:underline">
              ← Kembali ke Website
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
