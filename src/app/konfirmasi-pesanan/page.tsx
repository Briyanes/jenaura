import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle, ArrowRight, MessageCircle } from 'lucide-react'
import { SOCIAL_LINKS } from '@/lib/mock-data'

export const metadata: Metadata = {
  title: 'Pesanan Dikonfirmasi',
}

export default async function OrderConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>
}) {
  const { id } = await searchParams
  const orderId = id || 'PENDING'

  return (
    <main className="min-h-screen bg-gradient-to-br from-jena-mocha to-jena-charcoal flex items-center justify-center header-pt-page lg:pt-16 pb-16 px-5 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-80 bg-jena-gold/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-60 h-60 bg-jena-gold/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative w-full max-w-md">
        <div className="bg-white/[0.07] backdrop-blur-xl border border-white/[0.12] rounded-3xl p-8 sm:p-10 text-center shadow-2xl">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-green-500/15 border border-green-500/25 flex items-center justify-center">
            <CheckCircle size={32} className="text-green-400" strokeWidth={1.5} />
          </div>

          <h1 className="font-display text-2xl sm:text-3xl text-white font-bold mb-3">
            Pesanan Berhasil! 🎉
          </h1>
          <p className="text-sm text-white/40 mb-7 leading-relaxed">
            Terima kasih sudah mempercayakan perawatan rambutmu kepada JENAURA. Kami akan segera memproses pesananmu.
          </p>

          <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl px-5 py-4 mb-7">
            <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">Nomor Pesanan</p>
            <p className="text-base font-bold text-jena-gold font-mono tracking-wider">JEN-{orderId.slice(0, 8).toUpperCase()}</p>
          </div>

          <div className="text-left mb-8">
            <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3">Yang akan terjadi selanjutnya:</p>
            <ol className="space-y-2.5">
              {[
                'Kami akan mengirim konfirmasi via WhatsApp',
                'Pesanan diproses dalam 1x24 jam',
                'Kamu menerima nomor resi pengiriman',
                'Paket sampai di depan pintu! 📦',
              ].map((item, i) => (
                <li key={i} className="flex gap-3 text-sm text-white/50">
                  <span className="font-bold text-jena-gold flex-shrink-0">{i + 1}.</span>
                  {item}
                </li>
              ))}
            </ol>
          </div>

          <div className="flex flex-col gap-3">
            <a
              href={SOCIAL_LINKS.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-jena-gold to-jena-gold-dark text-white px-6 py-3.5 rounded-full text-sm font-bold shadow-lg shadow-jena-gold/25 hover:scale-105 transition-all"
            >
              <MessageCircle size={16} />
              Hubungi via WhatsApp
            </a>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 bg-white/10 border border-white/15 text-white px-6 py-3.5 rounded-full text-sm font-semibold hover:bg-white/15 transition-all"
            >
              Kembali ke Beranda
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}