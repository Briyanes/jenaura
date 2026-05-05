import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Kebijakan Pengembalian', description: 'Kebijakan pengembalian produk JENAURA Hair Treatment.' }

export default function ReturnPage() {
  return (
    <main>
      <section className="bg-gradient-to-br from-jena-mocha to-jena-charcoal pb-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-jena-gold/8 rounded-full blur-[90px] pointer-events-none" />
        <div className="max-w-3xl mx-auto px-5 sm:px-6 lg:px-8 relative header-pt-page">
          <h1 className="font-display text-3xl sm:text-4xl text-white font-bold mb-2">Kebijakan Pengembalian</h1>
          <p className="text-xs text-white/30">Terakhir diperbarui: Februari 2026</p>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-jena-ivory">
        <div className="max-w-3xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-jena-peach/50">
              <h2 className="font-semibold text-jena-mocha text-sm sm:text-base mb-2">Garansi 100% Kepuasan</h2>
              <p className="text-sm text-jena-charcoal/60 leading-relaxed">Kami yakin kamu akan mencintai JENAURA. Jika kamu tidak puas dengan produk yang diterima, kami menawarkan garansi pengembalian 100% dalam 7 hari setelah penerimaan.</p>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-jena-peach/50">
              <h2 className="font-semibold text-jena-mocha text-sm sm:text-base mb-3">Syarat Pengembalian</h2>
              <ul className="space-y-2">
                {[
                  'Pengembalian diajukan maksimal 7 hari setelah produk diterima',
                  'Produk dalam kondisi belum digunakan atau baru digunakan 1-2x',
                  'Kemasan masih lengkap (botol + dus)',
                  'Menyertakan bukti pembelian (screenshot email konfirmasi atau nomor pesanan)',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-jena-charcoal/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-jena-gold/60 mt-1.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-jena-peach/50">
              <h2 className="font-semibold text-jena-mocha text-sm sm:text-base mb-3">Cara Mengajukan Pengembalian</h2>
              <ol className="space-y-2">
                {[
                  'Hubungi kami via WhatsApp dengan menyertakan nomor pesanan',
                  'Kirimkan foto produk yang akan dikembalikan',
                  'Tunggu konfirmasi dari tim kami (1x24 jam)',
                  'Kirim produk ke alamat yang diberikan',
                  'Refund diproses dalam 3-5 hari kerja',
                ].map((item, i) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-jena-charcoal/60">
                    <span className="font-bold text-jena-gold flex-shrink-0">{i + 1}.</span>
                    {item}
                  </li>
                ))}
              </ol>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-jena-peach/50">
              <h2 className="font-semibold text-jena-mocha text-sm sm:text-base mb-2">Pengecualian</h2>
              <p className="text-sm text-jena-charcoal/60 leading-relaxed">Pengembalian tidak berlaku untuk produk yang sudah digunakan lebih dari 3x, rusak karena kelalaian pembeli, atau dibeli lebih dari 30 hari yang lalu.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}