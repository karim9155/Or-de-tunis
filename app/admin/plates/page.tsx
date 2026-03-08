'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useLanguage, translations } from '@/context/language-context'

interface Plate {
  id: string
  name_en: string
  name_fr: string
  name_ar: string
  price: number
  available: boolean
  image_url: string | null
  categories: { name_en: string; name_fr: string; name_ar: string } | null
}

export default function AdminPlatesPage() {
  const [plates, setPlates] = useState<Plate[]>([])
  const [loading, setLoading] = useState(true)
  const { language } = useLanguage()
  const t = translations[language].admin.plates

  useEffect(() => {
    fetchPlates()
  }, [])

  async function fetchPlates() {
    const res = await fetch('/api/admin/plates')
    const data = await res.json()
    setPlates(data)
    setLoading(false)
  }

  async function toggleAvailability(plate: Plate) {
    await fetch(`/api/admin/plates/${plate.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...plate, category_id: undefined, categories: undefined, available: !plate.available }),
    })
    setPlates(plates.map(p => p.id === plate.id ? { ...p, available: !p.available } : p))
  }

  async function deletePlate(id: string) {
    if (!confirm(t.deleteConfirm)) return
    await fetch(`/api/admin/plates/${id}`, { method: 'DELETE' })
    setPlates(plates.filter(p => p.id !== id))
  }

  function getPlateName(plate: Plate) {
    return language === 'ar' ? plate.name_ar : language === 'fr' ? plate.name_fr : plate.name_en
  }

  function getPlateSubName(plate: Plate) {
    return language === 'ar' ? plate.name_fr : language === 'fr' ? plate.name_en : plate.name_fr
  }

  function getCategoryName(cat: Plate['categories']) {
    if (!cat) return '—'
    return language === 'ar' ? cat.name_ar : language === 'fr' ? cat.name_fr : cat.name_en
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#064e3b]" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t.title}</h1>
        <Link
          href="/admin/plates/new"
          className="px-4 py-2 bg-[#064e3b] text-white rounded-lg hover:bg-[#065f46] transition text-sm font-medium"
        >
          {t.addPlate}
        </Link>
      </div>

      {plates.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <p className="text-4xl mb-3">🍽️</p>
          <p className="text-gray-500 mb-4">{t.noPlates}</p>
          <Link
            href="/admin/plates/new"
            className="inline-flex px-4 py-2 bg-[#064e3b] text-white rounded-lg hover:bg-[#065f46] transition text-sm"
          >
            {t.addPlate}
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">{t.image}</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">{t.name}</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">{t.category}</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">{t.price}</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">{t.available}</th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">{t.actions}</th>
                </tr>
              </thead>
              <tbody>
                {plates.map((plate) => (
                  <tr key={plate.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-6 py-4">
                      {plate.image_url ? (
                        <img
                          src={plate.image_url}
                          alt={getPlateName(plate)}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                          🍽️
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">{getPlateName(plate)}</p>
                      <p className="text-xs text-gray-500">{getPlateSubName(plate)}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {getCategoryName(plate.categories)}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {Number(plate.price).toFixed(2)} TND
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleAvailability(plate)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          plate.available ? 'bg-emerald-500' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
                            plate.available ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/plates/${plate.id}/edit`}
                          className="px-3 py-1.5 text-xs font-medium text-[#064e3b] border border-[#064e3b] rounded-md hover:bg-[#064e3b] hover:text-white transition"
                        >
                          {t.edit}
                        </Link>
                        <button
                          onClick={() => deletePlate(plate.id)}
                          className="px-3 py-1.5 text-xs font-medium text-red-600 border border-red-300 rounded-md hover:bg-red-600 hover:text-white transition"
                        >
                          {t.delete}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
