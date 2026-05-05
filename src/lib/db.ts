import { supabase } from './supabase'
import type { Product, Order, Review, FAQ, PromoCode } from '@/types'

// Helper function to check if Supabase is configured
function checkSupabase() {
  if (!supabase) {
    throw new Error('Supabase client is not configured. Please set environment variables.')
  }
  return supabase
}

// Products
export async function getActiveProducts(): Promise<Product[]> {
  const client = checkSupabase()
  const { data, error } = await client
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as Product[]
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const client = checkSupabase()
  const { data, error } = await client
    .from('products')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null // Not found
    throw error
  }
  return data as Product
}

export async function getProductsWithVariants() {
  const client = checkSupabase()
  const { data, error } = await client
    .from('products')
    .select(`
      *,
      product_variants(*)
    `)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

// Fetch full product with variants + hero_ingredients by slug
export async function getProductFullBySlug(slug: string) {
  const client = checkSupabase()
  const { data, error } = await client
    .from('products')
    .select(`
      *,
      product_variants(*),
      hero_ingredients(*)
    `)
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    return null
  }
  return data
}

// Fetch first active product with variants + hero_ingredients (for homepage)
export async function getFirstActiveProductFull() {
  const client = checkSupabase()
  const { data, error } = await client
    .from('products')
    .select(`
      *,
      product_variants(*),
      hero_ingredients(*)
    `)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) return null
  return data
}

// Orders
export async function createOrder(order: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>) {
  const client = checkSupabase()
  const { data, error } = await client
    .from('orders')
    .insert({
      ...order,
      order_number: `JEN-${Date.now().toString(36).toUpperCase()}`,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getOrderByOrderNumber(orderNumber: string) {
  const client = checkSupabase()
  const { data, error } = await client
    .from('orders')
    .select('*')
    .eq('order_number', orderNumber)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null // Not found
    throw error
  }
  return data
}

export async function updateOrderStatus(orderId: string, status: Order['status']) {
  const client = checkSupabase()
  const { data, error } = await client
    .from('orders')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', orderId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getOrders(limit = 50, offset = 0) {
  const client = checkSupabase()
  const { data, error } = await client
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) throw error
  return data
}

// Reviews
export async function getApprovedReviews(productId?: string): Promise<Review[]> {
  const client = checkSupabase()
  const query = client
    .from('testimonials')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (productId) {
    // For now, return all since testimonials table doesn't have product_id
    // You may want to add this column or use a different table
  }

  const { data, error } = await query
  if (error) throw error
  return data as Review[]
}

// FAQ
export async function getActiveFAQs(): Promise<FAQ[]> {
  const client = checkSupabase()
  const { data, error } = await client
    .from('faqs')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  if (error) throw error
  return data as FAQ[]
}

// Promo Codes
export async function validatePromoCode(code: string): Promise<PromoCode | null> {
  const client = checkSupabase()
  const { data, error } = await client
    .from('promo_codes')
    .select('*')
    .eq('code', code.toUpperCase())
    .eq('is_active', true)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }

  // Check if expired
  if (data.expires_at && new Date(data.expires_at) < new Date()) {
    return null
  }

  // Check if max uses reached
  if (data.max_uses && data.used_count >= data.max_uses) {
    return null
  }

  return data as PromoCode
}

export async function usePromoCode(codeId: string) {
  const client = checkSupabase()
  const { data: currentData } = await client
    .from('promo_codes')
    .select('used_count')
    .eq('id', codeId)
    .single()

  const { data, error } = await client
    .from('promo_codes')
    .update({ used_count: (currentData?.used_count || 0) + 1 })
    .eq('id', codeId)
    .select()
    .single()

  if (error) throw error
  return data
}

// Stats for admin dashboard
export async function getOrderStats() {
  const client = checkSupabase()
  const { data, error } = await client
    .from('orders')
    .select('total, status, created_at')

  if (error) throw error

  const totalRevenue = data?.reduce((sum, order) => sum + (order.total || 0), 0) || 0
  const totalOrders = data?.length || 0
  const completedOrders = data?.filter(o => o.status === 'delivered').length || 0

  return {
    totalRevenue,
    totalOrders,
    completedOrders,
  }
}
