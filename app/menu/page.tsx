'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/context/language-context'
import { useCart } from '@/context/cart-context'
import { useAuth } from '@/context/auth-context'

interface Category {
  id: string
  name_en: string
  name_fr: string
  name_ar: string
  sort_order: number
}

interface Plate {
  id: string
  category_id: string
  name_en: string
  name_fr: string
  name_ar: string
  description_en: string
  description_fr: string
  description_ar: string
  price: number
  image_url: string | null
  available: boolean
}

const t = {
  en: {
    menu: 'Our Menu',
    subtitle: 'Browse our selection of authentic Tunisian dishes',
    addToOrder: 'Add to Order',
    added: 'Added!',
    viewOrder: 'View Order',
    items: 'items',
    total: 'Total',
    noPlates: 'No dishes available in this category yet.',
    signIn: 'Sign In',
    myOrders: 'My Orders',
    unavailable: 'Unavailable',
    currency: 'TND',
  },
  fr: {
    menu: 'Notre Menu',
    subtitle: 'Parcourez notre sélection de plats tunisiens authentiques',
    addToOrder: 'Ajouter à la commande',
    added: 'Ajouté !',
    viewOrder: 'Voir la commande',
    items: 'articles',
    total: 'Total',
    noPlates: 'Aucun plat disponible dans cette catégorie.',
    signIn: 'Connexion',
    myOrders: 'Mes commandes',
    unavailable: 'Indisponible',
    currency: 'TND',
  },
  ar: {
    menu: 'قائمتنا',
    subtitle: 'تصفح مجموعتنا من الأطباق التونسية الأصيلة',
    addToOrder: 'أضف للطلب',
    added: 'تمت الإضافة!',
    viewOrder: 'عرض الطلب',
    items: 'عناصر',
    total: 'المجموع',
    noPlates: 'لا توجد أطباق متوفرة في هذه الفئة حتى الآن.',
    signIn: 'تسجيل الدخول',
    myOrders: 'طلباتي',
    unavailable: 'غير متوفر',
    currency: 'دينار',
  },
}

function getName(item: { name_en: string; name_fr: string; name_ar: string }, lang: string) {
  return lang === 'ar' ? item.name_ar : lang === 'fr' ? item.name_fr : item.name_en
}

function getDesc(item: { description_en: string; description_fr: string; description_ar: string }, lang: string) {
  return lang === 'ar' ? item.description_ar : lang === 'fr' ? item.description_fr : item.description_en
}

export default function MenuPage() {
  const { language } = useLanguage()
  const { addItem, itemCount, total } = useCart()
  const { user } = useAuth()
  const text = t[language] || t.en
  const isArabic = language === 'ar'

  const [categories, setCategories] = useState<Category[]>([])
  const [plates, setPlates] = useState<Plate[]>([])
  const [activeCategory, setActiveCategory] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [addedPlateId, setAddedPlateId] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    async function load() {
      const [catRes, plateRes] = await Promise.all([
        supabase.from('categories').select('*').order('sort_order'),
        supabase.from('plates').select('*').eq('available', true).order('created_at', { ascending: false }),
      ])
      const cats = catRes.data || []
      setCategories(cats)
      setPlates(plateRes.data || [])
      if (cats.length > 0) setActiveCategory(cats[0].id)
      setLoading(false)
    }
    load()
  }, [])

  function handleAdd(plate: Plate) {
    addItem({
      plate_id: plate.id,
      name_en: plate.name_en,
      name_fr: plate.name_fr,
      name_ar: plate.name_ar,
      price: plate.price,
      image_url: plate.image_url,
    })
    setAddedPlateId(plate.id)
    setTimeout(() => setAddedPlateId(null), 1500)
  }

  const filteredPlates = plates.filter(p => p.category_id === activeCategory)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f3f0ed]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#064e3b]" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f3f0ed]" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Top nav */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="font-playfair text-xl font-bold text-[#064e3b]">
            L&apos;Or de Tunis
          </Link>
          <div className="flex items-center gap-3">
            {user ? (
              <Link
                href="/menu/orders"
                className="text-sm text-[#064e3b] hover:underline font-medium"
              >
                {text.myOrders}
              </Link>
            ) : (
              <Link
                href="/auth?redirect=/menu"
                className="text-sm text-[#064e3b] hover:underline font-medium"
              >
                {text.signIn}
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Hero section */}
      <div className="bg-[#064e3b] text-white py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-playfair text-4xl font-bold mb-3">{text.menu}</h1>
          <p className="text-emerald-200 text-lg">{text.subtitle}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Category tabs */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition ${
                activeCategory === cat.id
                  ? 'bg-[#064e3b] text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {getName(cat, language)}
            </button>
          ))}
        </div>

        {/* Plates grid */}
        {filteredPlates.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">🍽️</p>
            <p>{text.noPlates}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlates.map(plate => (
              <div
                key={plate.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition group"
              >
                {/* Image */}
                <div className="aspect-[4/3] relative overflow-hidden bg-gray-100">
                  {plate.image_url ? (
                    <img
                      src={plate.image_url}
                      alt={getName(plate, language)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-6xl">
                      🍽️
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-playfair text-lg font-bold text-gray-900 mb-1">
                    {getName(plate, language)}
                  </h3>
                  {getDesc(plate, language) && (
                    <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                      {getDesc(plate, language)}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-[#064e3b]">
                      {Number(plate.price).toFixed(2)} {text.currency}
                    </span>
                    <button
                      onClick={() => handleAdd(plate)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                        addedPlateId === plate.id
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-[#064e3b] text-white hover:bg-[#065f46]'
                      }`}
                    >
                      {addedPlateId === plate.id ? text.added : text.addToOrder}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating cart bar */}
      {itemCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-30">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div>
              <span className="text-sm text-gray-500">{itemCount} {text.items}</span>
              <span className="mx-2 text-gray-300">|</span>
              <span className="font-bold text-gray-900">{total.toFixed(2)} {text.currency}</span>
            </div>
            <Link
              href="/menu/order"
              className="px-6 py-3 bg-[#064e3b] text-white rounded-lg font-medium hover:bg-[#065f46] transition"
            >
              {text.viewOrder} →
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
