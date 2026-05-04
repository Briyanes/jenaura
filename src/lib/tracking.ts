// ============================================
// JENAURA Pixel Tracking System
// FB Pixel + TikTok Pixel + GTM
// ============================================

import type { PixelEventData } from '@/types'

// ---- Facebook Pixel ----
export function initFBPixel(pixelId: string) {
  if (typeof window === 'undefined' || !pixelId) return
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any
  w.fbq =
    w.fbq ||
    function () {
      // eslint-disable-next-line prefer-rest-params
      ;(w.fbq.callMethod ? w.fbq.callMethod : w.fbq.queue).push(arguments)
    }
  if (!w._fbq) w._fbq = w.fbq
  w.fbq.push = w.fbq
  w.fbq.loaded = true
  w.fbq.version = '2.0'
  w.fbq.queue = w.fbq.queue || []
  w.fbq('init', pixelId)
  w.fbq('track', 'PageView')
}

export function trackFBEvent(event: string, data?: PixelEventData) {
  if (typeof window === 'undefined') return
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any
  if (w.fbq) {
    w.fbq('track', event, data)
  }
}

// ---- TikTok Pixel ----
export function initTTPixel(pixelId: string) {
  if (typeof window === 'undefined' || !pixelId) return
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any
  w.TiktokAnalyticsObject = 'ttq'
  w.ttq = w.ttq || []
  w.ttq.methods = [
    'page',
    'track',
    'identify',
    'instances',
    'debug',
    'on',
    'off',
    'once',
    'ready',
    'alias',
    'group',
    'enableCookie',
    'disableCookie',
  ]
  w.ttq.setAndDefer = function (t: any, e: string) {
    t[e] = function () {
      // eslint-disable-next-line prefer-rest-params
      t.push([e].concat(Array.prototype.slice.call(arguments, 0)))
    }
  }
  for (let i = 0; i < w.ttq.methods.length; i++) {
    w.ttq.setAndDefer(w.ttq, w.ttq.methods[i])
  }
  w.ttq.instance = function (t: string) {
    for (var e = w.ttq._i[t] || [], n = 0; n < w.ttq.methods.length; n++)
      w.ttq.setAndDefer(e, w.ttq.methods[n])
    return e
  }
  w.ttq.load = function (t: string) {
    var e = 'https://analytics.tiktok.com/i18n/pixel/events.js'
    w.ttq._i = w.ttq._i || {}
    w.ttq._i[t] = []
    w.ttq._i[t]._u = e
    w.ttq._t = w.ttq._t || {}
    w.ttq._t[t] = +new Date()
    var n = document.createElement('script')
    n.type = 'text/javascript'
    n.async = true
    n.src = e + '?sdkid=' + encodeURIComponent(t) + '&lib=' + encodeURIComponent('ttq')
    var a = document.getElementsByTagName('script')[0]
    a.parentNode?.insertBefore(n, a)
  }
  w.ttq.load(pixelId)
  w.ttq.page()
}

export function trackTTEvent(event: string, data?: Record<string, unknown>) {
  if (typeof window === 'undefined') return
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any
  if (w.ttq) {
    w.ttq.track(event, data)
  }
}

// ---- Unified Trackers ----
export function trackViewContent(data: { productId: string; productName: string; value: number }) {
  const eventData: PixelEventData = {
    content_name: data.productName,
    content_ids: [data.productId],
    content_type: 'product',
    value: data.value,
    currency: 'IDR',
  }
  trackFBEvent('ViewContent', eventData)
  trackTTEvent('ViewContent', {
    contents: [{ content_id: data.productId, content_name: data.productName, quantity: 1, price: data.value }],
    value: data.value,
    currency: 'IDR',
  })
}

export function trackAddToCart(data: { productId: string; productName: string; value: number; quantity: number }) {
  const eventData: PixelEventData = {
    content_name: data.productName,
    content_ids: [data.productId],
    content_type: 'product',
    value: data.value,
    currency: 'IDR',
    num_items: data.quantity,
  }
  trackFBEvent('AddToCart', eventData)
  trackTTEvent('AddToCart', {
    contents: [{ content_id: data.productId, content_name: data.productName, quantity: data.quantity, price: data.value }],
    value: data.value * data.quantity,
    currency: 'IDR',
  })
}

export function trackInitiateCheckout(data: { productId: string; productName: string; value: number; numItems: number }) {
  const eventData: PixelEventData = {
    content_name: data.productName,
    content_ids: [data.productId],
    content_type: 'product',
    value: data.value,
    currency: 'IDR',
    num_items: data.numItems,
  }
  trackFBEvent('InitiateCheckout', eventData)
  trackTTEvent('InitiateCheckout', {
    contents: [{ content_id: data.productId, quantity: data.numItems, price: data.value }],
    value: data.value,
    currency: 'IDR',
  })
}

export function trackAddPaymentInfo(data: { productId: string; productName: string; value: number; paymentMethod: string }) {
  const eventData: PixelEventData = {
    content_name: data.productName,
    content_ids: [data.productId],
    content_type: 'product',
    value: data.value,
    currency: 'IDR',
    payment_method: data.paymentMethod,
  }
  trackFBEvent('AddPaymentInfo', eventData)
  trackTTEvent('AddPaymentInfo', {
    contents: [{ content_id: data.productId, price: data.value }],
    value: data.value,
    currency: 'IDR',
  })
}

export function trackPurchase(data: { orderId: string; productId: string; productName: string; value: number; numItems: number }) {
  const eventData: PixelEventData = {
    content_name: data.productName,
    content_ids: [data.productId],
    content_type: 'product',
    value: data.value,
    currency: 'IDR',
    num_items: data.numItems,
    order_id: data.orderId,
  }
  trackFBEvent('Purchase', eventData)
  trackTTEvent('CompletePayment', {
    contents: [{ content_id: data.productId, content_name: data.productName, quantity: data.numItems, price: data.value }],
    value: data.value,
    currency: 'IDR',
    order_id: data.orderId,
  })
}

export function trackPlaceAnOrder(data: { productId: string; value: number; numItems: number }) {
  trackTTEvent('PlaceAnOrder', {
    contents: [{ content_id: data.productId, quantity: data.numItems, price: data.value }],
    value: data.value,
    currency: 'IDR',
  })
}