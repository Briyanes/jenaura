'use client'

import { useEffect } from 'react'
import { initFBPixel, initTTPixel } from '@/lib/tracking'

export default function PixelProvider() {
  useEffect(() => {
    const fbPixelId = process.env.NEXT_PUBLIC_FB_PIXEL_ID
    const ttPixelId = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID

    if (fbPixelId) initFBPixel(fbPixelId)
    if (ttPixelId) initTTPixel(ttPixelId)
  }, [])

  return null
}
