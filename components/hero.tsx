'use client'

import Link from 'next/link'
import { useLanguage, translations } from '@/context/language-context'
import { motion } from 'framer-motion'

export function Hero() {
  const { language, isRTL } = useLanguage()
  const t = translations[language]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  }

  return (
    <section
      id="home"
      className="relative h-screen bg-gradient-to-br from-muted via-white to-white overflow-hidden pt-20"
    >
      {/* Decorative elements */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-accent opacity-5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-primary opacity-5 rounded-full blur-3xl" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative max-w-7xl mx-auto px-4 md:px-8 h-full flex flex-col items-center justify-center text-center"
      >
        <motion.p
          variants={itemVariants}
          className="font-inter text-accent text-lg font-semibold mb-4 tracking-widest uppercase"
        >
          {isRTL ? 'الحلال الفاخر التونسي' : 'Tunisian Heritage'}
        </motion.p>

        <motion.h1
          variants={itemVariants}
          className="font-playfair text-5xl md:text-7xl font-bold text-primary mb-4 max-w-4xl"
        >
          {t.hero.title}
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="font-inter text-xl md:text-2xl text-foreground/70 max-w-2xl mb-8"
        >
          {t.hero.subtitle}
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="flex gap-4 flex-col sm:flex-row"
        >
          <motion.a
            href="#products"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-primary text-primary-foreground font-inter font-semibold rounded-lg hover:bg-primary/90 transition-colors"
          >
            {t.hero.cta}
          </motion.a>
          <Link href="/menu">
            <motion.span
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block px-8 py-4 border-2 border-primary text-primary font-inter font-semibold rounded-lg hover:bg-primary/5 transition-colors"
            >
              {language === 'en' ? 'Order Now' : language === 'fr' ? 'Commander' : 'اطلب الآن'}
            </motion.span>
          </Link>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-primary rounded-full flex justify-center">
          <div className="w-1 h-2 bg-primary rounded-full mt-2" />
        </div>
      </motion.div>
    </section>
  )
}
