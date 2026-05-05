import type { Metadata } from 'next'
import { ChevronRight } from 'lucide-react'
import { MOCK_FAQS } from '@/lib/mock-data'

export const metadata: Metadata = {
  title: 'FAQ',
  description: 'Pertanyaan yang sering ditanyakan tentang JENAURA Hair Treatment.',
}

export default function FAQPage() {
  const categories = ['keamanan', 'penggunaan', 'pemesanan']
  const catLabel: Record<string, string> = { keamanan: 'Keamanan', penggunaan: 'Penggunaan', pemesanan: 'Pemesanan' }

  return (
    <main>
      {/* Hero */}
      <section className="bg-gradient-to-br from-jena-mocha to-jena-charcoal pb-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-jena-gold/8 rounded-full blur-[90px] pointer-events-none" />
        <div className="max-w-2xl mx-auto px-5 sm:px-6 lg:px-8 text-center relative header-pt-page">
          <p className="text-jena-gold text-xs tracking-[0.25em] uppercase mb-4 font-bold">Pertanyaan Umum</p>
          <h1 className="font-display text-3xl sm:text-4xl text-white font-bold">FAQ</h1>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-12 sm:py-16 bg-jena-ivory relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-jena-peach/25 via-transparent to-transparent pointer-events-none" />
        <div className="relative max-w-2xl mx-auto px-5 sm:px-6 lg:px-8">
          {categories.map((cat) => {
            const faqs = MOCK_FAQS.filter(f => f.category === cat)
            return (
              <div key={cat} className="mb-10">
                <p className="text-[10px] font-bold text-jena-gold/70 uppercase tracking-widest mb-4">{catLabel[cat]}</p>
                <div className="flex flex-col gap-2">
                  {faqs.map((faq) => (
                    <details key={faq.id} className="group bg-white/70 backdrop-blur-sm rounded-2xl overflow-hidden border border-jena-peach/50 hover:border-jena-gold/40 transition-all duration-300 hover:shadow-md hover:shadow-jena-gold/6">
                      <summary className="flex items-center justify-between p-5 cursor-pointer list-none select-none">
                        <span className="text-base font-semibold text-jena-charcoal pr-4">{faq.question}</span>
                        <div className="w-7 h-7 rounded-full border border-jena-gold/25 flex items-center justify-center flex-shrink-0 group-open:bg-jena-gold group-open:border-jena-gold transition-all duration-200">
                          <ChevronRight size={14} className="text-jena-gold group-open:text-jena-charcoal group-open:rotate-90 transition-transform duration-200" />
                        </div>
                      </summary>
                      <div className="px-5 pb-5 border-t border-jena-peach/40">
                        <p className="text-base text-jena-charcoal/60 leading-relaxed pt-4">{faq.answer}</p>
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </main>
  )
}