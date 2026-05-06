import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Kebijakan Privasi', description: 'Kebijakan privasi JENAURA Hair Treatment.' }

export default function PrivacyPage() {
  const sections = [
    { title: '1. Informasi yang Kami Kumpulkan', body: 'Saat kamu melakukan pembelian, kami mengumpulkan: nama lengkap, alamat pengiriman, nomor WhatsApp, dan informasi pembayaran. Kami juga mengumpulkan data browsing melalui cookies untuk meningkatkan pengalaman belanja.' },
    { title: '2. Penggunaan Informasi', body: 'Informasi kamu digunakan untuk: memproses pesanan, mengirim update pengiriman, memberikan layanan pelanggan, dan mengirimkan penawaran eksklusif (dengan persetujuan kamu).' },
    { title: '3. Perlindungan Data', body: 'Kami menggunakan enkripsi SSL dan standar keamanan industri untuk melindungi data pribadi kamu. Data pembayaran diproses oleh payment gateway terpercaya (Midtrans) dan tidak disimpan di server kami.' },
    { title: '4. Cookies & Tracking', body: 'Kami menggunakan Facebook Pixel dan TikTok Pixel untuk mengukur efektivitas iklan. Kamu bisa menonaktifkan cookies melalui pengaturan browser.' },
    { title: '5. Hubungi Kami', body: 'Jika ada pertanyaan tentang kebijakan privasi ini, hubungi kami melalui WhatsApp atau email hello@jenaura.id.' },
  ]

  return (
    <main>
      <section className="bg-gradient-to-br from-jena-mocha to-jena-charcoal pb-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-jena-gold/8 rounded-full blur-[90px] pointer-events-none" />
        <div className="max-w-3xl mx-auto px-5 sm:px-6 lg:px-8 relative header-pt-page">
          <h1 className="font-display text-4xl sm:text-5xl text-white font-bold mb-2">Kebijakan Privasi</h1>
          <p className="text-xs text-white/30">Terakhir diperbarui: Februari 2026</p>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-jena-ivory">
        <div className="max-w-3xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4">
            {sections.map(({ title, body }) => (
              <div key={title} className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-jena-peach/50">
                <h2 className="font-semibold text-jena-mocha text-sm sm:text-base mb-2">{title}</h2>
                <p className="text-base text-jena-charcoal/60 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}