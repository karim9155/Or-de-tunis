'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/context/language-context'
import { useCart } from '@/context/cart-context'
import { useAuth } from '@/context/auth-context'

const t = {
  en: {
    title: 'Confirm Your Order',
    orderSummary: 'Order Summary',
    eventDetails: 'Event Details',
    eventDate: 'Event Date',
    eventType: 'Event Type',
    guestCount: 'Number of Guests',
    notes: 'Special Notes (optional)',
    yourInfo: 'Your Information',
    fullName: 'Full Name',
    phone: 'Phone Number',
    email: 'Email',
    submit: 'Submit Order',
    submitting: 'Submitting...',
    total: 'Total',
    qty: 'Qty',
    remove: 'Remove',
    emptyCart: 'Your cart is empty',
    backToMenu: '← Back to Menu',
    success: 'Order Submitted!',
    successMsg: 'Your order has been received. We will contact you soon to confirm.',
    viewOrders: 'View My Orders',
    eventTypes: {
      wedding: 'Wedding',
      corporate: 'Corporate Event',
      birthday: 'Birthday',
      anniversary: 'Anniversary',
      private: 'Private Dinner',
      other: 'Other',
    },
    currency: 'TND',
  },
  fr: {
    title: 'Confirmez votre commande',
    orderSummary: 'Résumé de la commande',
    eventDetails: "Détails de l'événement",
    eventDate: "Date de l'événement",
    eventType: "Type d'événement",
    guestCount: "Nombre d'invités",
    notes: 'Notes spéciales (optionnel)',
    yourInfo: 'Vos informations',
    fullName: 'Nom complet',
    phone: 'Téléphone',
    email: 'Email',
    submit: 'Soumettre la commande',
    submitting: 'Envoi en cours...',
    total: 'Total',
    qty: 'Qté',
    remove: 'Retirer',
    emptyCart: 'Votre panier est vide',
    backToMenu: '← Retour au menu',
    success: 'Commande envoyée !',
    successMsg: 'Votre commande a été reçue. Nous vous contacterons bientôt pour confirmer.',
    viewOrders: 'Voir mes commandes',
    eventTypes: {
      wedding: 'Mariage',
      corporate: 'Événement corporate',
      birthday: 'Anniversaire',
      anniversary: 'Anniversaire de mariage',
      private: 'Dîner privé',
      other: 'Autre',
    },
    currency: 'TND',
  },
  ar: {
    title: 'تأكيد طلبك',
    orderSummary: 'ملخص الطلب',
    eventDetails: 'تفاصيل الحدث',
    eventDate: 'تاريخ الحدث',
    eventType: 'نوع الحدث',
    guestCount: 'عدد الضيوف',
    notes: 'ملاحظات خاصة (اختياري)',
    yourInfo: 'معلوماتك',
    fullName: 'الاسم الكامل',
    phone: 'رقم الهاتف',
    email: 'البريد الإلكتروني',
    submit: 'إرسال الطلب',
    submitting: 'جاري الإرسال...',
    total: 'المجموع',
    qty: 'الكمية',
    remove: 'إزالة',
    emptyCart: 'سلة التسوق فارغة',
    backToMenu: '← العودة للقائمة',
    success: 'تم إرسال الطلب!',
    successMsg: 'تم استلام طلبك. سنتواصل معك قريباً للتأكيد.',
    viewOrders: 'عرض طلباتي',
    eventTypes: {
      wedding: 'زفاف',
      corporate: 'حدث مؤسسي',
      birthday: 'عيد ميلاد',
      anniversary: 'ذكرى زواج',
      private: 'عشاء خاص',
      other: 'أخرى',
    },
    currency: 'دينار',
  },
}

function getName(item: { name_en: string; name_fr: string; name_ar: string }, lang: string) {
  return lang === 'ar' ? item.name_ar : lang === 'fr' ? item.name_fr : item.name_en
}

export default function OrderPage() {
  const { language } = useLanguage()
  const { items, removeItem, updateQuantity, total, clearCart } = useCart()
  const { user } = useAuth()
  const router = useRouter()
  const text = t[language] || t.en
  const isArabic = language === 'ar'

  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    customer_name: user?.user_metadata?.full_name || '',
    customer_phone: user?.user_metadata?.phone || '',
    customer_email: user?.email?.includes('@phone.') ? '' : (user?.email || ''),
    event_date: '',
    event_type: 'private',
    guest_count: '10',
    notes: '',
  })

  function updateField(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (items.length === 0) return
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { data: { user: currentUser } } = await supabase.auth.getUser()
    if (!currentUser) {
      router.push('/auth?redirect=/menu/order')
      return
    }

    // Create the order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: currentUser.id,
        customer_name: form.customer_name,
        customer_phone: form.customer_phone,
        customer_email: form.customer_email,
        event_date: form.event_date,
        event_type: form.event_type,
        guest_count: parseInt(form.guest_count),
        notes: form.notes || null,
      })
      .select()
      .single()

    if (orderError) {
      setError(orderError.message)
      setLoading(false)
      return
    }

    // Create order items
    const orderItems = items.map(item => ({
      order_id: order.id,
      plate_id: item.plate_id,
      quantity: item.quantity,
      price_at_order: item.price,
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) {
      setError(itemsError.message)
      setLoading(false)
      return
    }

    clearCart()
    setSubmitted(true)
    setLoading(false)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#f3f0ed] flex items-center justify-center px-4" dir={isArabic ? 'rtl' : 'ltr'}>
        <div className="max-w-md w-full bg-white rounded-2xl p-8 text-center shadow-lg">
          <div className="text-5xl mb-4">✅</div>
          <h1 className="font-playfair text-2xl font-bold text-[#064e3b] mb-3">{text.success}</h1>
          <p className="text-gray-500 mb-6">{text.successMsg}</p>
          <div className="flex flex-col gap-3">
            <Link
              href="/menu/orders"
              className="px-6 py-3 bg-[#064e3b] text-white rounded-lg font-medium hover:bg-[#065f46] transition"
            >
              {text.viewOrders}
            </Link>
            <Link
              href="/menu"
              className="px-6 py-3 text-[#064e3b] border border-[#064e3b] rounded-lg font-medium hover:bg-[#064e3b]/5 transition"
            >
              {text.backToMenu}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#f3f0ed] flex items-center justify-center px-4" dir={isArabic ? 'rtl' : 'ltr'}>
        <div className="text-center">
          <p className="text-4xl mb-4">🛒</p>
          <p className="text-gray-500 mb-4">{text.emptyCart}</p>
          <Link
            href="/menu"
            className="px-6 py-3 bg-[#064e3b] text-white rounded-lg font-medium hover:bg-[#065f46] transition"
          >
            {text.backToMenu}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f3f0ed]" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Top bar */}
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

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left - Form */}
          <div className="lg:col-span-3 space-y-6">
            {/* Customer Info */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="font-semibold text-gray-900 mb-4">{text.yourInfo}</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{text.fullName}</label>
                  <input
                    type="text"
                    value={form.customer_name}
                    onChange={e => updateField('customer_name', e.target.value)}
                    required
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#064e3b]"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{text.phone}</label>
                    <input
                      type="tel"
                      value={form.customer_phone}
                      onChange={e => updateField('customer_phone', e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#064e3b]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{text.email}</label>
                    <input
                      type="email"
                      value={form.customer_email}
                      onChange={e => updateField('customer_email', e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#064e3b]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Event Details */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="font-semibold text-gray-900 mb-4">{text.eventDetails}</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{text.eventDate}</label>
                    <input
                      type="date"
                      value={form.event_date}
                      onChange={e => updateField('event_date', e.target.value)}
                      required
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#064e3b]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{text.eventType}</label>
                    <select
                      value={form.event_type}
                      onChange={e => updateField('event_type', e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#064e3b]"
                    >
                      {Object.entries(text.eventTypes).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{text.guestCount}</label>
                  <input
                    type="number"
                    min="1"
                    value={form.guest_count}
                    onChange={e => updateField('guest_count', e.target.value)}
                    required
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#064e3b]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{text.notes}</label>
                  <textarea
                    value={form.notes}
                    onChange={e => updateField('notes', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#064e3b] resize-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right - Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-20">
              <h2 className="font-semibold text-gray-900 mb-4">{text.orderSummary}</h2>

              <div className="space-y-4 mb-6">
                {items.map(item => (
                  <div key={item.plate_id} className="flex items-start gap-3">
                    {item.image_url ? (
                      <img src={item.image_url} alt="" className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />
                    ) : (
                      <div className="w-14 h-14 rounded-lg bg-gray-100 flex items-center justify-center text-xl flex-shrink-0">🍽️</div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{getName(item, language)}</p>
                      <p className="text-xs text-gray-500">{Number(item.price).toFixed(2)} {text.currency}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.plate_id, item.quantity - 1)}
                          className="w-6 h-6 rounded border border-gray-300 text-gray-600 text-xs flex items-center justify-center hover:bg-gray-100"
                        >
                          −
                        </button>
                        <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.plate_id, item.quantity + 1)}
                          className="w-6 h-6 rounded border border-gray-300 text-gray-600 text-xs flex items-center justify-center hover:bg-gray-100"
                        >
                          +
                        </button>
                        <button
                          type="button"
                          onClick={() => removeItem(item.plate_id)}
                          className="text-xs text-red-500 hover:underline ms-2"
                        >
                          {text.remove}
                        </button>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      {(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4 mb-6">
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-900">{text.total}</span>
                  <span className="font-bold text-lg text-[#064e3b]">{total.toFixed(2)} {text.currency}</span>
                </div>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#064e3b] text-white rounded-lg font-medium hover:bg-[#065f46] transition disabled:opacity-50"
              >
                {loading ? text.submitting : text.submit}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
