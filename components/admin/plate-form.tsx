'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Category {
  id: string
  name_en: string
  name_fr: string
  name_ar: string
}

interface PlateFormProps {
  plate?: {
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
}

export default function PlateForm({ plate }: PlateFormProps) {
  const router = useRouter()
  const isEdit = !!plate

  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(plate?.image_url ?? null)

  const [form, setForm] = useState({
    category_id: plate?.category_id ?? '',
    name_en: plate?.name_en ?? '',
    name_fr: plate?.name_fr ?? '',
    name_ar: plate?.name_ar ?? '',
    description_en: plate?.description_en ?? '',
    description_fr: plate?.description_fr ?? '',
    description_ar: plate?.description_ar ?? '',
    price: plate?.price?.toString() ?? '',
    image_url: plate?.image_url ?? '',
    available: plate?.available ?? true,
  })

  useEffect(() => {
    fetch('/api/admin/categories')
      .then(r => r.json())
      .then(setCategories)
  }, [])

  function updateField(field: string, value: string | boolean) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    const res = await fetch('/api/admin/upload', { method: 'POST', body: formData })
    const data = await res.json()

    if (data.url) {
      updateField('image_url', data.url)
      setImagePreview(data.url)
    }
    setUploading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const payload = {
      ...form,
      price: parseFloat(form.price),
      image_url: form.image_url || null,
    }

    const url = isEdit ? `/api/admin/plates/${plate.id}` : '/api/admin/plates'
    const method = isEdit ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (res.ok) {
      router.push('/admin/plates')
      router.refresh()
    } else {
      const err = await res.json()
      alert(err.error || 'Failed to save plate')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-8">
      {/* Category & Price */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Info</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={form.category_id}
              onChange={e => updateField('category_id', e.target.value)}
              required
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#064e3b]"
            >
              <option value="">Select category...</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name_en} / {c.name_fr}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price (TND)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={form.price}
              onChange={e => updateField('price', e.target.value)}
              required
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#064e3b]"
            />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <label className="text-sm font-medium text-gray-700">Available</label>
          <button
            type="button"
            onClick={() => updateField('available', !form.available)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              form.available ? 'bg-emerald-500' : 'bg-gray-300'
            }`}
          >
            <span className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
              form.available ? 'translate-x-6' : 'translate-x-1'
            }`} />
          </button>
        </div>
      </div>

      {/* Names */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Plate Name</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">English</label>
            <input
              type="text"
              value={form.name_en}
              onChange={e => updateField('name_en', e.target.value)}
              required
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#064e3b]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">French</label>
            <input
              type="text"
              value={form.name_fr}
              onChange={e => updateField('name_fr', e.target.value)}
              required
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#064e3b]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Arabic</label>
            <input
              type="text"
              value={form.name_ar}
              onChange={e => updateField('name_ar', e.target.value)}
              required
              dir="rtl"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#064e3b]"
            />
          </div>
        </div>
      </div>

      {/* Descriptions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Description</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">English</label>
            <textarea
              value={form.description_en}
              onChange={e => updateField('description_en', e.target.value)}
              rows={2}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#064e3b] resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">French</label>
            <textarea
              value={form.description_fr}
              onChange={e => updateField('description_fr', e.target.value)}
              rows={2}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#064e3b] resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Arabic</label>
            <textarea
              value={form.description_ar}
              onChange={e => updateField('description_ar', e.target.value)}
              rows={2}
              dir="rtl"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#064e3b] resize-none"
            />
          </div>
        </div>
      </div>

      {/* Image Upload */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Image</h2>
        <div className="flex items-start gap-6">
          {imagePreview ? (
            <img src={imagePreview} alt="Preview" className="w-32 h-32 rounded-xl object-cover" />
          ) : (
            <div className="w-32 h-32 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 text-3xl">
              🍽️
            </div>
          )}
          <div className="flex-1">
            <label className="block">
              <span className="inline-flex px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium cursor-pointer hover:bg-gray-200 transition">
                {uploading ? 'Uploading...' : 'Choose Image'}
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
            <p className="text-xs text-gray-500 mt-2">JPG, PNG or WebP. Max 5MB.</p>
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-[#064e3b] text-white rounded-lg font-medium hover:bg-[#065f46] transition disabled:opacity-50"
        >
          {loading ? 'Saving...' : isEdit ? 'Update Plate' : 'Create Plate'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 text-gray-600 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
