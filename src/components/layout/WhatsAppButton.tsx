'use client'

import { X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { env } from '@/lib/env-validation'

// WhatsApp SVG Icon Component
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

export default function WhatsAppButton() {
  const [isVisible, setIsVisible] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)

  // Show button after scrolling down
  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Check initial position

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // WhatsApp link with pre-filled message
  const whatsappNumber = env.whatsappNumber
  const message = encodeURIComponent('Halo JENAURA, saya ingin bertanya tentang produk hair treatment Anda.')
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${message}`

  if (!isVisible) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Chat Window */}
      {isChatOpen && (
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden w-80 sm:w-96 animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-[#25D366] p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <WhatsAppIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">JENAURA Support</p>
                <p className="text-white/80 text-xs">Online · Fast Response</p>
              </div>
            </div>
            <button
              onClick={() => setIsChatOpen(false)}
              className="text-white/80 hover:text-white transition-colors p-1"
              aria-label="Tutup chat"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 bg-gray-50">
            <p className="text-sm text-gray-700 leading-relaxed">
              Halo! 👋 Ada yang bisa kami bantu seputar perawatan rambut JENAURA?
            </p>
            <div className="mt-4 space-y-2">
              <a
                href={`${whatsappLink}&text=${encodeURIComponent('Halo, saya ingin info lebih lanjut tentang JENAURA Hair Treatment.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center bg-[#25D366] text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-[#20BD5A] transition-colors"
              >
                Chat via WhatsApp
              </a>
              <button
                onClick={() => setIsChatOpen(false)}
                className="block w-full text-center text-gray-600 text-sm hover:text-gray-800 transition-colors py-2"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="group relative bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 focus-ring"
        aria-label="Chat via WhatsApp"
      >
        <WhatsAppIcon className="w-7 h-7" />

        {/* Tooltip */}
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs font-medium px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Chat dengan Kami
          {/* Arrow */}
          <span className="absolute top-1/2 -translate-y-1/2 -right-1 w-2 h-2 bg-gray-900 rotate-45" />
        </span>

        {/* Pulse Animation */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20" />
      </button>
    </div>
  )
}