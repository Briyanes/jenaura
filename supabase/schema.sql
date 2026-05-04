-- JENAURA Database Schema (Supabase / PostgreSQL)
-- =============================================

-- Products
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  compare_price INTEGER,
  weight TEXT,
  stock INTEGER DEFAULT 0,
  images TEXT[] DEFAULT '{}',
  badge TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Product Variants
CREATE TABLE product_variants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  price INTEGER NOT NULL,
  compare_price INTEGER,
  save_amount INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Hero Ingredients
CREATE TABLE hero_ingredients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER DEFAULT 0
);

-- Orders
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  shipping_address TEXT NOT NULL,
  city TEXT NOT NULL,
  province TEXT,
  postal_code TEXT,
  notes TEXT,
  variant_id UUID REFERENCES product_variants(id),
  quantity INTEGER DEFAULT 1,
  subtotal INTEGER NOT NULL,
  shipping_cost INTEGER DEFAULT 0,
  discount_amount INTEGER DEFAULT 0,
  total INTEGER NOT NULL,
  courier TEXT,
  tracking_number TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','confirmed','processed','shipped','delivered','cancelled','returned')),
  payment_method TEXT,
  payment_status TEXT DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid','paid','failed','refunded')),
  midtrans_transaction_id TEXT,
  midtrans_response JSONB,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Promo Codes
CREATE TABLE promo_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('fixed','percent','shipping')),
  value INTEGER NOT NULL DEFAULT 0,
  min_order INTEGER DEFAULT 0,
  max_uses INTEGER,
  used_count INTEGER DEFAULT 0,
  starts_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- FAQ
CREATE TABLE faqs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true
);

-- Testimonials
CREATE TABLE testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT,
  rating INTEGER DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  text TEXT NOT NULL,
  avatar_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);
CREATE INDEX idx_orders_number ON orders(order_number);
CREATE INDEX idx_promo_code ON promo_codes(code) WHERE is_active = true;

-- Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;

-- Public read for products
CREATE POLICY "Products are publicly readable" ON products FOR SELECT USING (is_active = true);
CREATE POLICY "Variants are publicly readable" ON product_variants FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can create orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read own order" ON orders FOR SELECT USING (true);