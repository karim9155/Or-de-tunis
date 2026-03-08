'use client'

import { useLanguage, translations } from '@/context/language-context'
import { motion } from 'framer-motion'
import { useState } from 'react'

export function CateringForm() {
  const { language, isRTL } = useLanguage()
  const t = translations[language]
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    eventType: '',
    guests: '',
    date: '',
    menu: '',
  })

  const menuOptions = {
    en: ['Gourmet Mezze Collection', 'Classic Tunisian Dinner', 'Modern Fusion Menu', 'Premium Celebration'],
    fr: ['Collection Mezze Gourmet', 'Dîner Tunisien Classique', 'Menu de Fusion Moderne', 'Célébration Premium'],
    ar: ['مجموعة الميزة الفاخرة', 'العشاء التونسي الكلاسيكي', 'قائمة الاندماج الحديثة', 'احتفالية البريميوم'],
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Catering request submitted:', formData)
    setStep(3)
  }

  const isStepValid = () => {
    if (step === 1) return formData.eventType && formData.guests
    if (step === 2) return formData.date && formData.menu
    return true
  }

  return (
    <section id="catering" className="py-20 px-4 md:px-8 bg-muted">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-primary mb-4">
            {t.catering.title}
          </h2>
          <p className="font-inter text-foreground/60">
            {t.catering.subtitle}
          </p>
        </motion.div>

        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex justify-between mb-4">
            {[1, 2, 3].map((stepNum) => (
              <motion.div
                key={stepNum}
                className={`flex-1 h-2 rounded-full mx-1 transition-all ${
                  step >= stepNum ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
          <div className={`flex justify-between text-sm font-inter ${isRTL ? 'flex-row-reverse' : ''}`}>
            <span className={step === 1 ? 'text-primary font-semibold' : 'text-foreground/60'}>
              {t.catering.step1}
            </span>
            <span className={step === 2 ? 'text-primary font-semibold' : 'text-foreground/60'}>
              {t.catering.step2}
            </span>
            <span className={step === 3 ? 'text-primary font-semibold' : 'text-foreground/60'}>
              {t.catering.step3}
            </span>
          </div>
        </div>

        {/* Form */}
        {step < 3 ? (
          <motion.form
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            onSubmit={handleSubmit}
            className="glass-card p-8 md:p-12"
          >
            {step === 1 ? (
              <div className={`space-y-6 ${isRTL ? 'text-right' : ''}`}>
                <div>
                  <label className="font-inter font-semibold text-foreground block mb-2">
                    {t.catering.form.eventType}
                  </label>
                  <select
                    name="eventType"
                    value={formData.eventType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-muted rounded-lg font-inter focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">
                      {language === 'en' ? 'Select event type...' : language === 'fr' ? 'Sélectionner le type...' : 'اختر النوع...'}
                    </option>
                    {(language === 'en'
                      ? ['Wedding', 'Corporate Event', 'Birthday', 'Anniversary']
                      : language === 'fr'
                      ? ['Mariage', 'Événement Corporatif', 'Anniversaire', 'Anniversaire de Mariage']
                      : ['زفاف', 'حدث الشركة', 'عيد ميلاد', 'ذكرى السنة']
                    ).map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-inter font-semibold text-foreground block mb-2">
                    {t.catering.form.guests}
                  </label>
                  <input
                    type="number"
                    name="guests"
                    value={formData.guests}
                    onChange={handleInputChange}
                    placeholder="50"
                    className="w-full px-4 py-3 border border-muted rounded-lg font-inter focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            ) : (
              <div className={`space-y-6 ${isRTL ? 'text-right' : ''}`}>
                <div>
                  <label className="font-inter font-semibold text-foreground block mb-2">
                    {t.catering.form.date}
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-muted rounded-lg font-inter focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="font-inter font-semibold text-foreground block mb-2">
                    {t.catering.form.menu}
                  </label>
                  <select
                    name="menu"
                    value={formData.menu}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-muted rounded-lg font-inter focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">
                      {language === 'en' ? 'Select menu...' : language === 'fr' ? 'Sélectionner le menu...' : 'اختر القائمة...'}
                    </option>
                    {menuOptions[language].map((menu) => (
                      <option key={menu} value={menu}>
                        {menu}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className={`flex gap-4 mt-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
              {step > 1 && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="px-6 py-3 border-2 border-primary text-primary font-inter font-semibold rounded-lg hover:bg-primary/5"
                >
                  {language === 'en' ? 'Back' : language === 'fr' ? 'Retour' : 'رجوع'}
                </motion.button>
              )}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type={step === 2 ? 'submit' : 'button'}
                onClick={() => step === 1 && isStepValid() && setStep(2)}
                disabled={!isStepValid()}
                className={`flex-1 px-6 py-3 font-inter font-semibold rounded-lg transition-all ${
                  isStepValid()
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                    : 'bg-muted text-foreground/50 cursor-not-allowed'
                }`}
              >
                {step === 2 ? t.catering.form.submit : language === 'en' ? 'Next' : language === 'fr' ? 'Suivant' : 'التالي'}
              </motion.button>
            </div>
          </motion.form>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-12 text-center"
          >
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl">✓</span>
            </div>
            <h3 className="font-playfair text-3xl font-bold text-primary mb-4">
              {language === 'en' ? 'Request Received!' : language === 'fr' ? 'Demande Reçue!' : 'تم استقبال الطلب!'}
            </h3>
            <p className="font-inter text-foreground/60 mb-8">
              {language === 'en'
                ? 'Our team will contact you within 24 hours to confirm your catering details.'
                : language === 'fr'
                ? 'Notre équipe vous contactera dans les 24 heures pour confirmer vos détails.'
                : 'سيتصل بك فريقنا خلال 24 ساعة لتأكيد التفاصيل.'}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setStep(1)
                setFormData({ eventType: '', guests: '', date: '', menu: '' })
              }}
              className="px-8 py-3 bg-primary text-primary-foreground font-inter font-semibold rounded-lg hover:bg-primary/90"
            >
              {language === 'en' ? 'New Request' : language === 'fr' ? 'Nouvelle Demande' : 'طلب جديد'}
            </motion.button>
          </motion.div>
        )}
      </div>
    </section>
  )
}
