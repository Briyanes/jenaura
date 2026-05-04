# JENAURA — Hair Treatment At Home 🧴✨

Website e-commerce DTC (Direct-to-Consumer) untuk brand **JENAURA Hair Treatment**. Dibangun dengan Next.js 16, TypeScript, Tailwind CSS v4, dan Supabase.

## 🚀 Tech Stack

| Teknologi | Fungsi |
|-----------|--------|
| **Next.js 16** (App Router) | Framework React full-stack |
| **TypeScript** | Type safety |
| **Tailwind CSS v4** | Styling & design system |
| **Lucide React** | Icon library |
| **Supabase** | Database & auth (PostgreSQL) |
| **Midtrans** | Payment gateway |
| **RajaOngkir** | Cek ongkir & pengiriman |
| **Fonnte** | WhatsApp API notification |
| **Zod** | Schema validation |

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Homepage
│   ├── layout.tsx                  # Root layout
│   ├── loading.tsx                 # Loading state
│   ├── not-found.tsx               # 404 page
│   ├── error.tsx                   # Error page
│   ├── checkout/                   # Checkout page
│   ├── konfirmasi-pesanan/         # Order confirmation
│   ├── produk/[slug]/              # Product detail
│   ├── cara-pakai/                 # How to use
│   ├── ingredients/                # Ingredients info
│   ├── tentang-kami/               # About us
│   ├── faq/                        # FAQ
│   ├── kebijakan-privasi/          # Privacy policy
│   ├── syarat-ketentuan/           # Terms
│   ├── kebijakan-pengembalian/     # Return policy
│   └── admin/                      # Admin dashboard
│       ├── page.tsx                # Dashboard overview
│       ├── produk/                 # Product management
│       ├── pesanan/                # Order management
│       ├── promo/                  # Promo management
│       └── pengaturan/             # Settings & integrations
├── components/
│   └── layout/
│       ├── Navbar.tsx
│       ├── Footer.tsx
│       └── WhatsAppButton.tsx
├── lib/
│   ├── utils.ts                    # Utilities & helpers
│   ├── mock-data.ts                # Mock data (replace with Supabase)
│   └── tracking.ts                 # Pixel tracking (FB, TikTok)
├── types/
│   └── index.ts                    # TypeScript types
└── middleware.ts                   # Security & rate limiting
```

## 🛠️ Getting Started

### 1. Install dependencies

```bash
cd jenaura-website
npm install
```

### 2. Setup environment variables

```bash
cp .env.example .env.local
# Edit .env.local dengan credentials kamu
```

**Required Environment Variables:**
- `NEXT_PUBLIC_APP_URL` - URL aplikasi (default: http://localhost:3000)
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (untuk admin)
- `MIDTRANS_SERVER_KEY` - Midtrans server key untuk payment
- `MIDTRANS_CLIENT_KEY` - Midtrans client key
- `MIDTRANS_IS_PRODUCTION` - Set `true` untuk production
- `RAJAONGKIR_API_KEY` - API key RajaOngkir
- `NEXT_PUBLIC_WHATSAPP_NUMBER` - Nomor WhatsApp untuk notifikasi (format: 628xxx)
- `ADMIN_PASSWORD` - Password untuk admin dashboard

**Optional:**
- `NEXT_PUBLIC_FB_PIXEL_ID` - Facebook Pixel ID
- `NEXT_PUBLIC_TIKTOK_PIXEL_ID` - TikTok Pixel ID
- `NEXT_PUBLIC_GTM_ID` - Google Tag Manager ID

### 3. Setup database

Jalankan SQL di `supabase/schema.sql` ke Supabase SQL Editor.

### 4. Run development server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

## 📱 Features

### Customer-Facing
- ✅ Homepage 10 section lengkap (Hero, Benefits, How-to, Ingredients, Testimonials, FAQ, dll)
- ✅ Product Detail Page dengan variant selector
- ✅ Checkout dengan form validasi (Zod schema)
- ✅ Promo code system
- ✅ Order confirmation page
- ✅ Cara Pakai & Ingredients page
- ✅ FAQ accordion
- ✅ Halaman legal (Privacy, Terms, Return)
- ✅ WhatsApp floating button
- ✅ Mobile-first responsive design
- ✅ Facebook & TikTok Pixel tracking
- ✅ UTM parameter tracking

### Admin Dashboard
- ✅ **Admin Authentication** - Login system dengan password protection
- ✅ Dashboard overview (stats & recent orders)
- ✅ Product management
- ✅ Order management dengan status tracking
- ✅ Promo code management
- ✅ Settings & integrasi (Midtrans, RajaOngkir, Fonnte, Pixel)

### Backend API
- ✅ `/api/orders` - Create & fetch orders
- ✅ `/api/midtrans/payment` - Payment gateway integration
- ✅ `/api/shipping/check` - Calculate shipping cost with RajaOngkir
- ✅ `/api/whatsapp/notify` - WhatsApp notifications via Fonnte
- ✅ `/api/admin/login` - Admin authentication

### Technical
- ✅ **Next.js 16** dengan proxy.ts (bukan middleware.ts)
- ✅ TypeScript strict mode
- ✅ Tailwind CSS v4 custom design system (JENAURA brand colors)
- ✅ Supabase database integration dengan null-safe queries
- ✅ Rate limiting proxy (100 req/min per IP)
- ✅ Security headers & CSP
- ✅ Environment variable validation
- ✅ Error & loading states
- ✅ SEO metadata dengan metadataBase
- ✅ Zod validation untuk forms

## 🎨 Design System

| Token | Value | Usage |
|-------|-------|-------|
| `jena-mocha` | `#5C3D2E` | Primary text |
| `jena-gold` | `#C9A96E` | Accent & CTA |
| `jena-ivory` | `#FAF7F2` | Background |
| `jena-charcoal` | `#2C2C2C` | Body text |
| `jena-peach` | `#EDD5C0` | Subtle background |
| `jena-terracotta` | `#B5614A` | Secondary accent |

## 🚢 Deployment

### Vercel (Recommended)

```bash
npm run build
# Deploy ke Vercel via CLI atau Git integration
```

**Environment Variables di Vercel:**
1. Go to Project Settings → Environment Variables
2. Add semua required environment variables dari `.env.example`
3. Redeploy aplikasi

### Production Checklist

Sebelum deploy ke production:
- [ ] Update `NEXT_PUBLIC_APP_URL` dengan production domain
- [ ] Set `MIDTRANS_IS_PRODUCTION=true`
- [ ] Gunakan production Midtrans keys
- [ ] Setup Supabase production project
- [ ] Jalankan `supabase/schema.sql` di production database
- [ ] Update Facebook Pixel & TikTok Pixel IDs
- [ ] Test payment gateway di production mode
- [ ] Test WhatsApp notifications

## 📋 Recent Updates (v0.1.0)

### ✅ Completed Features
- ✅ Migrated to Next.js 16 (proxy.ts instead of middleware.ts)
- ✅ Supabase client & database utilities
- ✅ Environment variable validation system
- ✅ Complete API routes (orders, payment, shipping, WhatsApp)
- ✅ Admin authentication dengan session management
- ✅ Zod validation untuk semua forms
- ✅ Type-safe database queries
- ✅ Security headers & rate limiting
- ✅ Production-ready error handling

### 🔧 Development Notes
- Project menggunakan **mock data** ketika Supabase belum dikonfigurasi
- Build akan berhasil walaupun tanpa environment variables (development mode)
- Di production, environment variables akan divalidasi
- Admin dashboard accessible via `/admin/login`

### 🚧 TODO / Future Enhancements
- [ ] Replace mock data dengan real Supabase queries di components
- [ ] Image upload ke Supabase Storage
- [ ] Email notifications (Resend/SendGrid)
- [ ] Advanced analytics dashboard
- [ ] Product review system dengan photo uploads
- [ ] SMS notifications (optional)
- [ ] Loyalty program system
- [ ] Affiliate/referral system

---

Built with 💛 for JENAURA

**Tech Stack:** Next.js 16 · TypeScript · Tailwind CSS v4 · Supabase · Midtrans