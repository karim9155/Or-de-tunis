'use client'

import PlateForm from '@/components/admin/plate-form'
import { useLanguage, translations } from '@/context/language-context'

interface EditPlateClientProps {
  plate: {
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

export default function EditPlateClient({ plate }: EditPlateClientProps) {
  const { language } = useLanguage()
  const t = translations[language].admin.plates

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{t.editPlate}</h1>
      <PlateForm plate={plate} />
    </div>
  )
}
