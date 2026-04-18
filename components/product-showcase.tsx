'use client'

import Link from 'next/link'
import { useLanguage, translations } from '@/context/language-context'
import { motion } from 'framer-motion'

const highlights = [
  { icon: '🍖', en: 'Grilled Meats', fr: 'Viandes Grillées', ar: 'لحوم مشوية' },
  { icon: '🥘', en: 'Traditional Stews', fr: 'Ragoûts Traditionnels', ar: 'طواجن تقليدية' },
  { icon: '🥙', en: 'Fresh Sandwiches', fr: 'Sandwichs Frais', ar: 'سندويشات طازجة' },
  { icon: '🧁', en: 'Tunisian Pastries', fr: 'Pâtisseries Tunisiennes', ar: 'حلويات تونسية' },
  { icon: '🥗', en: 'Salads & Mezze', fr: 'Salades & Mezze', ar: 'سلطات ومقبلات' },
  { icon: '🍹', en: 'Fresh Drinks', fr: 'Boissons Fraîches', ar: 'مشروبات طازجة' },
]

export function ProductShowcase() {
  const { language, isRTL } = useLanguage()
  const t = translations[language]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <section id="menu" className="py-20 px-4 md:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-primary mb-4">
            {t.menu.title}
          </h2>
          <p className="font-inter text-foreground/60 max-w-2xl mx-auto">
            {t.menu.subtitle}
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-12"
        >
          {highlights.map((item, i) => (
            <motion.div
              key={i}
              variants={cardVariants}
              whileHover={{ y: -5 }}
              className="glass-card p-6 text-center group cursor-pointer"
            >
              <div className="text-5xl mb-4">{item.icon}</div>
              <p className="font-inter font-semibold text-foreground">
                {language === 'en' ? item.en : language === 'fr' ? item.fr : item.ar}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <Link href="/menu">
            <motion.span
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block px-10 py-4 bg-primary text-primary-foreground font-inter font-semibold rounded-lg hover:bg-primary/90 transition-colors text-lg"
            >
              {language === 'en' ? 'View Full Menu' : language === 'fr' ? 'Voir le Menu Complet' : 'شاهد القائمة الكاملة'}
            </motion.span>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
