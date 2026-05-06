// Environment variable validation
const getEnvVar = (key: string, defaultValue?: string) => {
  const value = process.env[key]
  if (!value && defaultValue === undefined && process.env.NODE_ENV === 'production') {
    throw new Error(`Missing required environment variable: ${key}`)
  }
  return value ?? defaultValue ?? ''
}

export function validateEnv() {
  return {
    appUrl: getEnvVar('NEXT_PUBLIC_APP_URL', 'http://localhost:3000'),
    supabaseUrl: getEnvVar('NEXT_PUBLIC_SUPABASE_URL', ''),
    supabaseAnonKey: getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY', ''),
    duitkuMerchantCode: getEnvVar('DUITKU_MERCHANT_CODE', ''),
    duitkuApiKey: getEnvVar('DUITKU_API_KEY', ''),
    duitkuIsSandbox: process.env.DUITKU_IS_SANDBOX === 'true',
    rajaongkirApiKey: getEnvVar('RAJAONGKIR_API_KEY', ''),
    biteshipApiKey: getEnvVar('BITESHIP_API_KEY', ''),
    biteshipOriginAreaId: getEnvVar('BITESHIP_ORIGIN_AREA_ID', ''),
    whatsappNumber: getEnvVar('NEXT_PUBLIC_WHATSAPP_NUMBER', '6281234567890'),
    adminPassword: getEnvVar('ADMIN_PASSWORD', 'admin123'),
  }
}

export const env = validateEnv()

