import { z } from 'zod'

// Order validation schema
export const orderSchema = z.object({
  customerName: z.string().min(3, 'Nama minimal 3 karakter'),
  customerPhone: z.string().regex(/^62\d{8,12}$/, 'Format WhatsApp tidak valid (contoh: 628123456789)'),
  customerEmail: z.string().email('Email tidak valid').optional().or(z.literal('')),
  address: z.string().min(10, 'Alamat terlalu singkat'),
  city: z.string().min(3, 'Kota wajib diisi'),
  district: z.string().optional(),
  postalCode: z.string().regex(/^\d{5}$/, 'Kode pos harus 5 digit').optional().or(z.literal('')),
  variantId: z.string().optional(),
  quantity: z.number().min(1).max(10),
  courier: z.string().min(1, 'Pilih kurir pengiriman'),
  paymentMethod: z.enum(['bca_va', 'bri_va', 'mandiri_va', 'bni_va', 'qris', 'dana', 'ovo', 'cod']),
  promoCode: z.string().optional(),
  notes: z.string().optional(),
})

export type OrderInput = z.infer<typeof orderSchema>

export function validateOrderData(data: Record<string, unknown>) {
  try {
    const validated = orderSchema.parse(data)
    return { success: true, data: validated }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues }
    }
    return { success: false, error: ['Validation failed'] }
  }
}

// Promo code validation
export const promoCodeSchema = z.object({
  code: z.string().min(3).max(20),
  orderId: z.string().optional(),
})

// Product review validation
export const reviewSchema = z.object({
  productId: z.string(),
  customerName: z.string().min(3),
  rating: z.number().min(1).max(5),
  comment: z.string().min(10).max(1000),
})

// Contact form validation
export const contactSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  subject: z.string().min(5),
  message: z.string().min(20),
})
