'use client'

import { useLanguage, translations } from '@/context/language-context'
import { motion } from 'framer-motion'
import { useState } from 'react'

const productCategories = ['olive', 'dates', 'harissa', 'pastry'] as const

export function ProductShowcase() {
  const { language, isRTL } = useLanguage()
  const t = translations[language]
  const [activeTab, setActiveTab] = useState<typeof productCategories[number]>('olive')

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
    <section id="products" className="py-20 px-4 md:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-primary mb-4">
            {t.products.title}
          </h2>
          <p className="font-inter text-foreground/60 max-w-2xl mx-auto">
            {language === 'en'
              ? 'Explore our carefully curated selection of premium Tunisian delicacies'
              : language === 'fr'
              ? 'Explorez notre sélection soigneusement choisie de délices tunisiens premium'
              : 'استكشف مجموعتنا المختارة بعناية من الأطعمة التونسية الممتازة'}
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <div className={`flex justify-center gap-4 mb-12 flex-wrap ${isRTL ? 'flex-row-reverse' : ''}`}>
          {productCategories.map((category) => (
            <motion.button
              key={category}
              onClick={() => setActiveTab(category)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-3 rounded-lg font-inter font-semibold transition-all ${
                activeTab === category
                  ? 'bg-primary text-primary-foreground shadow-lg'
                  : 'bg-muted text-foreground hover:bg-muted/70'
              }`}
            >
              {t.products[category].name}
            </motion.button>
          ))}
        </div>

        {/* Product Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {/* Main Product Card */}
          <motion.div
            key={activeTab}
            variants={cardVariants}
            className="glass-card p-8 md:p-12 flex flex-col justify-between min-h-96 group"
          >
            <div>
              <div className="w-32 h-32 bg-gradient-to-br from-accent to-secondary rounded-lg mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="font-playfair text-3xl font-bold text-primary mb-3">
                {t.products[activeTab].name}
              </h3>
              <p className="font-inter text-foreground/70 text-lg">
                {t.products[activeTab].desc}
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="self-start mt-8 px-6 py-3 bg-primary text-primary-foreground font-inter font-semibold rounded-lg hover:bg-primary/90"
            >
              {language === 'en' ? 'Learn More' : language === 'fr' ? 'En Savoir Plus' : 'اعرف أكثر'}
            </motion.button>
          </motion.div>

          {/* Featured Grid */}
          <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                variants={cardVariants}
                whileHover={{ y: -5 }}
                className="glass-card p-6 text-center group cursor-pointer"
              >
                <div className="w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-lg mb-4 mx-auto group-hover:scale-110 transition-transform" />
                <p className="font-inter text-sm text-foreground/60">
                  {language === 'en' ? 'Premium Product' : language === 'fr' ? 'Produit Premium' : 'منتج ممتاز'} {i + 1}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
