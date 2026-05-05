import type { Product, Review, FAQ } from '@/types'

export const HERO_PRODUCT: Product = {
  id: 'prod_001',
  name: 'JENAURA Keratin No-Wash Treatment',
  slug: 'jenaura-keratin-no-wash-treatment',
  description:
    'JENAURA adalah leave-in treatment profesional yang bisa kamu pakai sendiri di rumah — tanpa perlu bilas. Diformulasikan dengan Hydrolyzed Keratin, Hydrolyzed Silk, dan Argan Oil — bahan-bahan premium yang biasa ditemukan di perawatan salon kelas atas, kini hadir dalam format yang praktis dan terjangkau.',
  shortDescription:
    'Keratin No-Wash Treatment untuk rambut yang bercahaya. Tanpa bilas. Tanpa ribet.',
  price: 149000,
  comparePrice: 199000,
  stock: 250,
  images: [
    '/images/product-hero.jpg',
    '/images/product-2.jpg',
    '/images/product-3.jpg',
    '/images/product-4.jpg',
  ],
  heroIngredients: [
    {
      id: 'ing_001',
      name: 'Hydrolyzed Keratin',
      description:
        'Protein rambut yang mengisi celah-celah rambut rusak dari dalam. Hasilnya: rambut lebih kuat, lebih halus, dan lebih mudah diatur.',
      icon: 'sparkles',
    },
    {
      id: 'ing_002',
      name: 'Hydrolyzed Silk',
      description:
        'Melapisi kutikula rambut dengan lapisan proteksi lembut. Memberikan kilau natural dan tekstur sutra yang terasa nyata.',
      icon: 'droplets',
    },
    {
      id: 'ing_003',
      name: 'Argan Oil',
      description:
        '"Liquid gold" dari Maroko. Menutrisi ujung rambut, melembapkan tanpa terasa berminyak, dan melindungi dari panas styling.',
      icon: 'leaf',
    },
  ],
  benefits: [
    'Rambut lebih lembut dan mudah diatur mulai pemakaian pertama',
    'Kilau natural yang terlihat sehat, bukan greasy',
    'Ujung rambut lebih kuat, bercabang berkurang',
    'Rambut terlindungi dari panas & polusi sepanjang hari',
    'Aroma lembut yang tahan lama',
    'Tanpa bilas — hemat waktu, bisa langsung styling',
  ],
  howToUse: [
    'Keramas dan keringkan rambut dengan handuk sampai lembap (tidak basah kuyup)',
    'Ambil secukupnya JENAURA (1-2 pump atau seukuran koin untuk rambut panjang)',
    'Ratakan dari tengah rambut ke ujung — hindari kulit kepala',
    'Sisir dan styling seperti biasa — tidak perlu dibilas',
  ],
  ingredientList:
    'Purified Water, Propylene Glycol, Cetearyl Alcohol, Dimethicone, Cyclopentasiloxane, Stear Trimonium Chloride, Isopropyl Myristate, Argan Kernel Oil, Amodimethicone, Fragrance, Alpha-isomethyl Ionone, Benzyl Alcohol, Benzyl Benzoate, Citronellol, Coumarin, Limonene, Eugenol, Geraniol, Hydroxy Citronellal, Linalool, Sodium Dilauramidoglutamylsine, Phenoxyethanol, Disodium EDTA, Tocopheryl Acetate, Betaine, Sodium PCA, Sorbitol, Serine, Glycine, Glutamic Acid, Alanine, Lysine, Arginine, Threonine, Proline, Hydrolyzed Keratin, Hydrolyzed Silk, Lactic Acid',
  weight: '100ml',
  isFeatured: true,
  isActive: true,
  createdAt: '2026-01-01',
}

export const PRODUCT_VARIANTS = [
  { name: 'Single (1 Tube)', quantity: 1, price: 149000, saveAmount: 0 },
  { name: 'Paket Duo (2 Tube)', quantity: 2, price: 279000, saveAmount: 19000 },
  { name: 'Paket Trio (3 Tube)', quantity: 3, price: 399000, saveAmount: 48000 },
]

export const MOCK_REVIEWS: Review[] = [
  {
    id: 'rev_001',
    productId: 'prod_001',
    customerName: 'L.A.',
    rating: 5,
    comment:
      'Rambutku yang rebonding jadi jauh lebih lembut, gak kering lagi! Worth banget. Pemakaian pertama aja udah kerasa bedanya.',
    createdAt: '2026-04-15',
    isApproved: true,
  },
  {
    id: 'rev_002',
    productId: 'prod_001',
    customerName: 'R.S.',
    rating: 5,
    comment:
      'Udah 2 minggu pakai, bekas highlight di rambutku jadi lebih halus dan berkilau. Teksturnya ringan, gak berat sama sekali.',
    createdAt: '2026-04-20',
    isApproved: true,
  },
  {
    id: 'rev_003',
    productId: 'prod_001',
    customerName: 'M.D.',
    rating: 5,
    comment:
      'Aku yang rambutnya kering banget akhirnya nemu produk yang cocok. Repeat order! Aromanya juga enak banget, subtle.',
    createdAt: '2026-05-01',
    isApproved: true,
  },
  {
    id: 'rev_004',
    productId: 'prod_001',
    customerName: 'S.P.',
    rating: 4,
    comment:
      'Baru pakai 3 hari, rambut emang jadi lebih lembut. Harapannya bisa lebih halus lagi kalau rutin pakai 30 hari.',
    createdAt: '2026-05-10',
    isApproved: true,
  },
]

export const MOCK_FAQS: FAQ[] = [
  {
    id: 'faq_001',
    question: 'Apakah JENAURA aman untuk rambut yang sudah di-rebonding?',
    answer:
      'Ya, sangat aman. Justru JENAURA membantu mempertahankan hasil treatment salon lebih lama.',
    category: 'keamanan',
  },
  {
    id: 'faq_002',
    question: 'Apakah bisa untuk kulit kepala sensitif?',
    answer:
      'JENAURA diformulasikan untuk batang rambut, bukan kulit kepala. Aplikasikan dari tengah ke ujung rambut, hindari area akar.',
    category: 'keamanan',
  },
  {
    id: 'faq_003',
    question: 'Berapa lama 1 tube habis?',
    answer:
      'Untuk rambut panjang sebahu, 1 tube bisa bertahan 6–8 minggu pemakaian rutin 3x seminggu.',
    category: 'penggunaan',
  },
  {
    id: 'faq_004',
    question: 'Berapa lama baru terlihat hasilnya?',
    answer:
      'Kelembutan terasa mulai pemakaian pertama. Untuk perbaikan kerusakan rambut yang signifikan, gunakan konsisten selama 30 hari.',
    category: 'penggunaan',
  },
  {
    id: 'faq_005',
    question: 'Apakah bisa dipakai setiap hari?',
    answer: 'Bisa. Namun untuk rambut normal, 3–4x seminggu sudah optimal.',
    category: 'penggunaan',
  },
  {
    id: 'faq_006',
    question: 'Apakah cocok untuk rambut berminyak?',
    answer:
      'Ya, karena JENAURA tidak dioleskan ke kulit kepala. Formula ringannya tidak menambah rasa berminyak di batang rambut.',
    category: 'keamanan',
  },
  {
    id: 'faq_007',
    question: 'Apakah perlu dibilas?',
    answer:
      'Tidak perlu. Tinggal oleskan dari tengah ke ujung rambut, sisir, dan styling seperti biasa.',
    category: 'penggunaan',
  },
  {
    id: 'faq_008',
    question: 'Apakah tersedia paket hemat?',
    answer:
      'Ya! Tersedia Paket Duo (2 tube) Rp279.000 hemat Rp19.000 dan Paket Trio (3 tube) Rp399.000 hemat Rp48.000.',
    category: 'pemesanan',
  },
]

export const COURIER_OPTIONS = [
  { id: 'jne_reg', name: 'JNE REG', price: 15000, estimate: '2-3 hari' },
  { id: 'jnt', name: 'J&T Express', price: 13000, estimate: '2-3 hari' },
  { id: 'sicepat', name: 'SiCepat', price: 12000, estimate: '2-4 hari' },
]

export const PAYMENT_METHODS = [
  { id: 'bank_transfer', name: 'Transfer Bank', description: 'BCA / BRI / BNI', icon: 'landmark' },
  { id: 'qris', name: 'QRIS', description: 'Scan QR dari aplikasi manapun', icon: 'qr-code' },
  { id: 'ewallet', name: 'E-Wallet', description: 'GoPay / OVO / Dana', icon: 'wallet' },
  { id: 'cod', name: 'COD', description: 'Bayar di tempat', icon: 'hand-coins' },
]

export const SOCIAL_LINKS = {
  instagram: 'https://instagram.com/jenaura.id',
  tiktok: 'https://tiktok.com/@jenaura.id',
  youtube: 'https://youtube.com/@jenaura_id',
  facebook: 'https://facebook.com/jenauraofficialid',
  whatsapp: 'https://wa.me/6281234567890',
}

export const NAV_LINKS = [
  {
    label: 'Produk',
    href: '/produk/jenaura-keratin-no-wash-treatment',
    children: [
      { label: 'Keratin No-Wash Treatment', href: '/produk/jenaura-keratin-no-wash-treatment' },
    ],
  },
  { label: 'Cara Pakai', href: '/cara-pakai' },
  { label: 'Tentang Kami', href: '/tentang-kami' },
  { label: 'FAQ', href: '/faq' },
]