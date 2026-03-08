'use client'

import Link from 'next/link'
import { useLanguage, translations, Language } from '@/context/language-context'
import { motion } from 'framer-motion'

const menuLabel = { en: 'Menu', fr: 'Menu', ar: 'القائمة' }

export function Navbar() {
  const { language, setLanguage, isRTL } = useLanguage()
  const t = translations[language]

  const navItems = [
    { key: 'home', label: t.nav.home },
    { key: 'products', label: t.nav.products },
    { key: 'catering', label: t.nav.catering },
    { key: 'about', label: t.nav.about },
  ]

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-muted"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="font-playfair text-2xl font-bold text-primary cursor-pointer"
        >
          L'Or
        </motion.div>

        {/* Navigation Links */}
        <div className={`hidden md:flex gap-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
          {navItems.map((item) => (
            <motion.a
              key={item.key}
              href={`#${item.key}`}
              whileHover={{ color: '#d4af37' }}
              className="text-foreground font-inter transition-colors"
            >
              {item.label}
            </motion.a>
          ))}
        </div>

        {/* Menu Link + Language Switcher */}
        <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Link
            href="/menu"
            className="px-4 py-2 bg-accent text-white font-inter text-sm font-semibold rounded-lg hover:bg-accent/90 transition-colors"
          >
            {menuLabel[language] || 'Menu'}
          </Link>
        <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          {(['en', 'fr', 'ar'] as Language[]).map((lang) => (
            <motion.button
              key={lang}
              onClick={() => setLanguage(lang)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-3 py-2 rounded-lg text-sm font-inter transition-all ${
                language === lang
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-foreground hover:bg-muted/80'
              }`}
            >
              {lang.toUpperCase()}
            </motion.button>
          ))}
        </div>
        </div>
      </div>
    </motion.nav>
  )
}
