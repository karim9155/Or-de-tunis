'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/context/language-context'
import { useAuth } from '@/context/auth-context'

interface OrderItem {
  id: string
  quantity: number
  price_at_order: number
  plates: { name_en: string; name_fr: string; name_ar: string; image_url: string | null } | null
}

interface Order {
  id: string
  event_date: string
  event_type: string
  guest_count: number
  status: string
  created_at: string
  order_items: OrderItem[]
}

const t = {
  en: {
    title: 'My Orders',
    noOrders: 'You have no orders yet.',
    browseMenu: 'Browse Menu',
    guests: 'guests',
    total: 'Total',
    orderDate: 'Ordered',
    backToMenu: '← Back to Menu',
    signIn: 'Sign In to View Orders',
    currency: 'TND',
  },
  fr: {
    title: 'Mes Commandes',
    noOrders: "Vous n'avez pas encore de commandes.",
    browseMenu: 'Parcourir le menu',
    guests: 'invités',
    total: 'Total',
    orderDate: 'Commandé le',
    backToMenu: '← Retour au menu',
    signIn: 'Connectez-vous pour voir vos commandes',
    currency: 'TND',
  },
  ar: {
    title: 'طلباتي',
    noOrders: 'ليس لديك طلبات حتى الآن.',
    browseMenu: 'تصفح القائمة',
    guests: 'ضيوف',
    total: 'المجموع',
    orderDate: 'تاريخ الطلب',
    backToMenu: '← العودة للقائمة',
    signIn: 'سجل الدخول لعرض طلباتك',
    currency: 'دينار',
  },
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-800',
  accepted: 'bg-blue-100 text-blue-800',
  preparing: 'bg-purple-100 text-purple-800',
  ready: 'bg-emerald-100 text-emerald-800',
  delivered: 'bg-gray-100 text-gray-600',
  rejected: 'bg-red-100 text-red-800',
}

function getName(item: { name_en: string; name_fr: string; name_ar: string }, lang: string) {
  return lang === 'ar' ? item.name_ar : lang === 'fr' ? item.name_fr : item.name_en
}

export default function UserOrdersPage() {
  const { language } = useLanguage()
  const { user, loading: authLoading } = useAuth()
  const text = t[language] || t.en
  const isArabic = language === 'ar'

  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }
    const supabase = createClient()
    supabase
      .from('orders')
      .select(`*, order_items(id, quantity, price_at_order, plates(name_en, name_fr, name_ar, image_url))`)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setOrders(data || [])
        setLoading(false)
      })
  }, [user])

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f3f0ed]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#064e3b]" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f3f0ed] px-4" dir={isArabic ? 'rtl' : 'ltr'}>
        <div className="text-center">
          <p className="text-gray-500 mb-4">{text.signIn}</p>
          <Link
            href="/auth?redirect=/menu/orders"
            className="px-6 py-3 bg-[#064e3b] text-white rounded-lg font-medium hover:bg-[#065f46] transition"
          >
            {text.signIn}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f3f0ed]" dir={isArabic ? 'rtl' : 'ltr'}>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/menu" className="text-sm text-[#064e3b] hover:underline font-medium">
            {text.backToMenu}
          </Link>
          <span className="font-playfair text-lg font-bold text-[#064e3b]">L&apos;Or de Tunis</span>
          <div />
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="font-playfair text-3xl font-bold text-gray-900 mb-8">{text.title}</h1>

        {orders.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm">
            <p className="text-4xl mb-3">📋</p>
            <p className="text-gray-500 mb-4">{text.noOrders}</p>
            <Link
              href="/menu"
              className="inline-flex px-6 py-3 bg-[#064e3b] text-white rounded-lg font-medium hover:bg-[#065f46] transition"
            >
              {text.browseMenu}
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => {
              const orderTotal = order.order_items.reduce(
                (sum, i) => sum + i.quantity * Number(i.price_at_order), 0
              )
              return (
                <div key={order.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="p-5">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium capitalize ${STATUS_COLORS[order.status] || ''}`}>
                        {order.status}
                      </span>
                      <span className="text-sm text-gray-500 capitalize">{order.event_type}</span>
                      <span className="text-sm text-gray-400">·</span>
                      <span className="text-sm text-gray-500">
                        {new Date(order.event_date).toLocaleDateString()}
                      </span>
                      <span className="text-sm text-gray-400">·</span>
                      <span className="text-sm text-gray-500">{order.guest_count} {text.guests}</span>
                    </div>

                    <div className="space-y-3">
                      {order.order_items.map(item => (
                        <div key={item.id} className="flex items-center gap-3">
                          {item.plates?.image_url ? (
                            <img src={item.plates.image_url} alt="" className="w-10 h-10 rounded-lg object-cover" />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-sm">🍽️</div>
                          )}
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              {item.plates ? getName(item.plates, language) : '—'}
                            </p>
                            <p className="text-xs text-gray-500">× {item.quantity}</p>
                          </div>
                          <p className="text-sm text-gray-700">
                            {(item.quantity * Number(item.price_at_order)).toFixed(2)} {text.currency}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                      <span className="text-xs text-gray-400">
                        {text.orderDate} {new Date(order.created_at).toLocaleDateString()}
                      </span>
                      <span className="font-bold text-[#064e3b]">{text.total}: {orderTotal.toFixed(2)} {text.currency}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
