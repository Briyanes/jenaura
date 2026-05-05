'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { ShoppingBag, Search, Menu, X, ChevronDown, ChevronRight } from 'lucide-react'
import { NAV_LINKS } from '@/lib/mock-data'

const PROMO_ITEMS = [
  'FREE ONGKIR min. Rp189.000',
  'CASHBACK Rp15.000 min. Rp345.000',
  'GRATIS KONSULTASI RAMBUT ONLINE',
  'HASIL TERLIHAT DALAM 14 HARI',
]

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const drawerRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  useEffect(() => {
    if (!mobileOpen) return
    const handler = (e: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) setMobileOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [mobileOpen])

  useEffect(() => {
    if (!searchOpen) return
    searchInputRef.current?.focus()
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [searchOpen])

  // Adaptive colors based on scroll state
  const logoClass = scrolled ? 'text-jena-mocha' : 'text-white'
  const linkClass = scrolled
    ? 'text-jena-mocha/60 hover:text-jena-mocha'
    : 'text-white/75 hover:text-white'
  const iconClass = scrolled
    ? 'text-jena-mocha/60 hover:text-jena-mocha hover:bg-jena-mocha/8'
    : 'text-white/75 hover:text-white hover:bg-white/10'

  return (
    <>
      {/* ═══════════════════════════════════════
          FIXED HEADER
          ═══════════════════════════════════════ */}
      <header className="fixed top-0 left-0 right-0 z-40">

        {/* Promo Bar — slides out on scroll */}
        <div
          className={`bg-jena-mocha text-white overflow-hidden transition-all duration-400 ease-in-out ${
            scrolled ? 'max-h-0' : 'max-h-10'
          }`}
        >
          <div className="animate-marquee whitespace-nowrap py-2 text-xs font-medium tracking-wide">
            {[...Array(4)].map((_, i) => (
              <span key={i} className="inline-flex items-center">
                {PROMO_ITEMS.map((item, j) => (
                  <span key={j} className="inline-flex items-center">
                    <span className="px-5">{item}</span>
                    <span className="text-jena-gold">✦</span>
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>

        {/* Navbar — transparent → solid white */}
        <nav
          className={`w-full transition-all duration-300 ${
            scrolled ? 'header-nav-scrolled' : 'bg-transparent'
          }`}
        >
          <div className="mx-auto max-w-7xl px-4 lg:px-8 flex items-center justify-between h-16">

            {/* Logo */}
            <Link
              href="/"
              className={`font-display text-[1.35rem] tracking-[0.18em] font-extrabold shrink-0 transition-colors duration-300 ${logoClass}`}
            >
              JENAURA
            </Link>

            {/* Desktop nav links */}
            <ul className="hidden lg:flex flex-1 items-center justify-center gap-0.5">
              {NAV_LINKS.map((link) => (
                <li
                  key={link.href}
                  className="relative"
                  onMouseEnter={() => link.children && setOpenDropdown(link.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <Link
                    href={link.href}
                    className={`flex items-center gap-1 px-4 py-2 text-[11px] font-bold tracking-[0.1em] uppercase transition-colors duration-150 ${
                      openDropdown === link.label
                        ? scrolled ? 'text-jena-mocha' : 'text-white'
                        : linkClass
                    }`}
                  >
                    {link.label}
                    {link.children && (
                      <ChevronDown
                        size={11}
                        strokeWidth={2.5}
                        className={`transition-transform duration-200 ${openDropdown === link.label ? 'rotate-180' : ''}`}
                      />
                    )}
                  </Link>

                  {/* Active underline */}
                  <span
                    className={`absolute bottom-0 left-4 right-4 h-[2px] rounded-full transition-opacity duration-150 ${
                      scrolled ? 'bg-jena-gold' : 'bg-white'
                    } ${openDropdown === link.label ? 'opacity-100' : 'opacity-0'}`}
                  />

                  {/* Dropdown */}
                  {link.children && (
                    <div
                      className={`absolute top-full left-0 pt-1 w-52 transition-all duration-200 ${
                        openDropdown === link.label
                          ? 'opacity-100 translate-y-0 pointer-events-auto'
                          : 'opacity-0 -translate-y-1 pointer-events-none'
                      }`}
                    >
                      <div className="bg-white border border-jena-gold/15 rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.10)] overflow-hidden py-1.5">
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="flex items-center gap-2 px-4 py-2.5 text-[12px] font-semibold text-jena-mocha/65 hover:text-jena-mocha hover:bg-jena-gold/6 transition-colors"
                          >
                            <span className="w-1 h-1 rounded-full bg-jena-gold/50 shrink-0" />
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>

            {/* Right icons */}
            <div className="flex items-center gap-1 shrink-0">
              {/* Search */}
              <div className="relative" ref={searchRef}>
                <button
                  onClick={() => setSearchOpen(!searchOpen)}
                  aria-label="Cari"
                  className={`flex items-center justify-center w-10 h-10 rounded-xl transition-colors ${iconClass}`}
                >
                  <Search size={18} strokeWidth={2} />
                </button>
                <div
                  className={`absolute right-0 top-full mt-2 w-72 transition-all duration-200 ${
                    searchOpen
                      ? 'opacity-100 translate-y-0 pointer-events-auto'
                      : 'opacity-0 -translate-y-1 pointer-events-none'
                  }`}
                >
                  <div className="bg-white border border-jena-gold/15 rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.12)] px-3 py-2.5 flex items-center gap-2">
                    <Search size={14} strokeWidth={2} className="text-jena-mocha/40 shrink-0" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Cari produk…"
                      className="flex-1 text-sm text-jena-mocha placeholder:text-jena-mocha/35 outline-none bg-transparent"
                      onKeyDown={(e) => e.key === 'Escape' && setSearchOpen(false)}
                    />
                  </div>
                </div>
              </div>

              {/* Desktop CTA */}
              <Link
                href="/checkout"
                className={`hidden lg:flex items-center gap-1.5 text-[12px] font-bold px-4 py-2 rounded-xl transition-all duration-300 ml-1 ${
                  scrolled
                    ? 'bg-jena-mocha hover:bg-jena-gold text-white'
                    : 'bg-white/15 hover:bg-white/25 text-white border border-white/30 backdrop-blur-sm'
                }`}
              >
                <ShoppingBag size={14} strokeWidth={2.5} />
                Beli Sekarang
              </Link>

              {/* Mobile cart */}
              <Link
                href="/checkout"
                aria-label="Keranjang"
                className={`lg:hidden flex items-center justify-center w-10 h-10 rounded-xl transition-colors ${iconClass}`}
              >
                <ShoppingBag size={18} strokeWidth={2} />
              </Link>

              {/* Hamburger */}
              <button
                onClick={() => setMobileOpen(true)}
                aria-label="Buka menu"
                className={`lg:hidden flex items-center justify-center w-10 h-10 rounded-xl transition-colors ${iconClass}`}
              >
                <Menu size={20} strokeWidth={2} />
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* ═══════════════════════════════════════
          MOBILE OVERLAY + DRAWER
          ═══════════════════════════════════════ */}
      <div
        className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden="true"
      />

      <div
        ref={drawerRef}
        className={`fixed top-0 right-0 z-[60] h-full w-72 bg-white flex flex-col shadow-2xl transition-transform duration-300 ease-out lg:hidden ${
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-5 h-16 border-b border-jena-gold/15 shrink-0">
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className="font-display text-lg tracking-[0.15em] text-jena-mocha font-extrabold"
          >
            JENAURA
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            aria-label="Tutup menu"
            className="flex items-center justify-center w-9 h-9 rounded-xl text-jena-mocha/40 hover:text-jena-mocha hover:bg-jena-gold/8 transition-colors"
          >
            <X size={18} strokeWidth={2} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-2">
          {NAV_LINKS.map((link) => (
            <div key={link.href}>
              <Link
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between px-5 py-3.5 text-[12px] font-bold tracking-[0.08em] uppercase text-jena-mocha/65 hover:text-jena-mocha hover:bg-jena-gold/6 border-b border-jena-mocha/5 transition-colors group"
              >
                {link.label}
                <ChevronRight size={14} className="text-jena-mocha/25 group-hover:text-jena-gold transition-colors" />
              </Link>
              {link.children?.map((child) => (
                <Link
                  key={child.href}
                  href={child.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 pl-8 pr-5 py-2.5 text-[11px] font-semibold text-jena-mocha/45 hover:text-jena-mocha hover:bg-jena-gold/4 border-b border-jena-mocha/4 transition-colors"
                >
                  <span className="w-1 h-1 rounded-full bg-jena-gold/50 shrink-0" />
                  {child.label}
                </Link>
              ))}
            </div>
          ))}
        </div>

        <div className="p-5 border-t border-jena-gold/15 shrink-0">
          <Link
            href="/checkout"
            onClick={() => setMobileOpen(false)}
            className="flex items-center justify-center gap-2 w-full bg-jena-mocha hover:bg-jena-gold text-white font-bold text-sm py-3.5 rounded-xl transition-colors duration-200 shadow-lg shadow-jena-mocha/20"
          >
            <ShoppingBag size={16} strokeWidth={2.5} />
            Beli Sekarang
          </Link>
        </div>
      </div>
    </>
  )
}
