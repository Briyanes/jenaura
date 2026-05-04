import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Syarat & Ketentuan', description: 'Syarat dan ketentuan penggunaan website JENAURA.' }

export default function TermsPage() {
  const sections = [
    { title: '1. Ketentuan Umum', body: 'Dengan mengakses dan melakukan pembelian di website JENAURA, kamu menyetujui semua syarat dan ketentuan yang berlaku. JENAURA berhak mengubah ketentuan ini kapan saja tanpa pemberitahuan terlebih dahulu.' },
    { title: '2. Produk & Harga', body: 'Semua harga yang tertera sudah termasuk PPN. Harga dapat berubah sewaktu-waktu. JENAURA berhak membatalkan pesanan jika terjadi kesalahan harga atau informasi produk.' },
    { title: '3. Pemesanan & Pembayaran', body: 'Pesanan dianggap sah setelah pembayaran berhasil dikonfirmasi. Kami menerima pembayaran melalui transfer bank, QRIS, e-wallet, dan COD (tertentu). Pembayaran harus dilakukan dalam waktu yang ditentukan.' },
    { title: '4. Pengiriman', body: 'Waktu pengiriman estimasi 2-5 hari kerja tergantung lokasi. JENAURA tidak bertanggung jawab atas keterlambatan yang disebabkan oleh pihak kurir atau force majeure.' },
    { title: '5. Garansi & Pengembalian', body: 'JENAURA memberikan garansi 100% kepuasan. Jika produk tidak sesuai, kamu bisa mengajukan pengembalian dalam 7 hari setelah penerimaan. Lihat halaman Kebijakan Pengembalian untuk detail lengkap.' },
    { title: '6. Privasi', body: 'Data pribadi kamu dilindungi sesuai Kebijakan Privasi kami. Kami tidak akan menjual data kamu kepada pihak ketiga.' },
  ]

  return (
    <main>
      <section className="bg-gradient-to-br from-jena-mocha to-jena-charcoal pb-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-jena-gold/8 rounded-full blur-[90px] pointer-events-none" />
        <div className="max-w-3xl mx-auto px-5 sm:px-6 lg:px-8 relative header-pt">
          <h1 className="font-display text-3xl sm:text-4xl text-white font-bold mb-2">Syarat & Ketentuan</h1>
          <p className="text-xs text-white/30">Terakhir diperbarui: Februari 2026</p>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-jena-ivory">
        <div className="max-w-3xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4">
            {sections.map(({ title, body }) => (
              <div key={title} className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-jena-peach/50">
                <h2 className="font-semibold text-jena-mocha text-sm sm:text-base mb-2">{title}</h2>
                <p className="text-sm text-jena-charcoal/60 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}