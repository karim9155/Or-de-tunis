'use client'

import PlateForm from '@/components/admin/plate-form'
import { useLanguage, translations } from '@/context/language-context'

export default function NewPlatePage() {
  const { language } = useLanguage()
  const t = translations[language].admin.plates

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{t.addNew}</h1>
      <PlateForm />
    </div>
  )
}
