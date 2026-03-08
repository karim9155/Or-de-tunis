'use client'

import { useLanguage, translations } from '@/context/language-context'
import { motion } from 'framer-motion'

export function About() {
  const { language, isRTL } = useLanguage()
  const t = translations[language]

  const stats = [
    { label: language === 'en' ? 'Years Heritage' : language === 'fr' ? 'Années Héritage' : 'سنوات التراث', value: '75+' },
    { label: language === 'en' ? 'Products' : language === 'fr' ? 'Produits' : 'منتجات', value: '50+' },
    { label: language === 'en' ? 'Global Customers' : language === 'fr' ? 'Clients Mondiaux' : 'عملاء عالميين', value: '10K+' },
  ]

  return (
    <section id="about" className="py-20 px-4 md:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="font-inter text-accent text-sm font-semibold tracking-widest uppercase">
              {language === 'en' ? 'About Us' : language === 'fr' ? 'À Propos de Nous' : 'عننا'}
            </span>
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-primary my-4">
              {t.about.title}
            </h2>
            <p className="font-inter text-lg text-foreground/70 leading-relaxed mb-8">
              {t.about.desc}
            </p>

            {/* Stats */}
            <div className={`grid grid-cols-3 gap-6 ${isRTL ? 'text-right' : ''}`}>
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <p className="font-playfair text-3xl font-bold text-primary">
                    {stat.value}
                  </p>
                  <p className="font-inter text-sm text-foreground/60 mt-1">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, x: isRTL ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent opacity-10 rounded-2xl blur-2xl" />
            <div className="relative bg-gradient-to-br from-muted to-white rounded-2xl p-8 border border-muted">
              <div className="aspect-square bg-gradient-to-br from-accent via-secondary to-primary rounded-xl opacity-80" />
              <div className="absolute bottom-6 right-6 left-6 bg-white/90 backdrop-blur-md p-4 rounded-lg shadow-lg border border-white/20">
                <p className="font-playfair font-bold text-primary mb-2">
                  {language === 'en' ? 'Premium Quality' : language === 'fr' ? 'Qualité Premium' : 'جودة ممتازة'}
                </p>
                <p className="font-inter text-sm text-foreground/60">
                  {language === 'en'
                    ? 'Each product is carefully selected and tested'
                    : language === 'fr'
                    ? 'Chaque produit est soigneusement sélectionné'
                    : 'يتم اختيار كل منتج بعناية وفحصه'}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
