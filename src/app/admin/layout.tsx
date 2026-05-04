'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Package, ShoppingCart, Tag, Settings, Menu, X, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/produk', label: 'Produk', icon: Package },
  { href: '/admin/pesanan', label: 'Pesanan', icon: ShoppingCart },
  { href: '/admin/promo', label: 'Promo', icon: Tag },
  { href: '/admin/pengaturan', label: 'Pengaturan', icon: Settings },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={cn(
        'fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transition-transform duration-200 lg:translate-x-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <Link href="/admin" className="font-display text-xl tracking-wider text-jena-mocha">JENAURA</Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1"><X size={20} /></button>
        </div>
        <nav className="p-4 space-y-1">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors',
                pathname === href
                  ? 'bg-jena-gold/10 text-jena-gold font-semibold'
                  : 'text-gray-600 hover:bg-gray-100'
              )}
            >
              <Icon size={18} strokeWidth={1.5} />
              {label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <Link href="/" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-500 hover:text-gray-700">
            <LogOut size={16} strokeWidth={1.5} />
            Kembali ke Website
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2">
            <Menu size={20} />
          </button>
          <p className="text-sm text-gray-500">Admin Panel</p>
          <div className="w-8 h-8 rounded-full bg-jena-gold/10 flex items-center justify-center text-xs font-bold text-jena-gold">A</div>
        </header>
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  )
}