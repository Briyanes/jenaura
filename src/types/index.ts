// ============================================
// JENAURA Type Definitions
// ============================================

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  shortDescription: string
  price: number
  comparePrice?: number
  stock: number
  images: string[]
  heroIngredients: Ingredient[]
  benefits: string[]
  howToUse: string[]
  ingredientList: string
  weight: string
  isFeatured: boolean
  isActive: boolean
  createdAt: string
}

export interface Ingredient {
  id: string
  name: string
  description: string
  icon: string
}

export interface Review {
  id: string
  productId: string
  customerName: string
  rating: number
  comment: string
  images?: string[]
  isApproved: boolean
  createdAt: string
}

export interface CartItem {
  product: Product
  quantity: number
  variant?: string
}

export interface Order {
  id: string
  orderNumber: string
  customer: Customer
  items: OrderItem[]
  subtotal: number
  shippingCost: number
  discountAmount: number
  promoCode?: string
  total: number
  paymentMethod: string
  paymentStatus: 'pending' | 'paid' | 'failed' | 'expired'
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  courier: string
  trackingNumber?: string
  shippingAddress: ShippingAddress
  createdAt: string
  updatedAt: string
}

export interface OrderItem {
  id: string
  productId: string
  productName: string
  price: number
  quantity: number
}

export interface Customer {
  id: string
  name: string
  phone: string
  email?: string
  createdAt: string
}

export interface ShippingAddress {
  name: string
  phone: string
  address: string
  city: string
  district: string
  postalCode: string
}

export interface PromoCode {
  id: string
  code: string
  type: 'percentage' | 'fixed' | 'free_shipping'
  value: number
  minOrder?: number
  maxUses?: number
  usedCount: number
  isActive: boolean
  expiresAt?: string
}

export interface FAQ {
  id: string
  question: string
  answer: string
  category: string
}

export interface SiteSetting {
  key: string
  value: string
  updatedAt: string
}

export interface PixelConfig {
  gtmId: string
  fbPixelId: string
  ttPixelId: string
  gaId: string
  googleAdsId: string
  clarityId: string
}

// Pixel Event Types
export interface PixelEventData {
  content_name?: string
  content_ids?: string[]
  content_type?: string
  value?: number
  currency?: string
  num_items?: number
  order_id?: string
  payment_method?: string
  search_string?: string
}