'use client'

import { useLanguage, translations } from '@/context/language-context'
import { motion } from 'framer-motion'
import { useState } from 'react'

export function Footer() {
  const { language, isRTL } = useLanguage()
  const t = translations[language]
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    setSubscribed(true)
    setEmail('')
    setTimeout(() => setSubscribed(false), 3000)
  }

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        {/* Newsletter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16 pb-16 border-b border-primary-foreground/20"
        >
          <div className={`max-w-md ${isRTL ? 'ml-auto' : ''}`}>
            <h3 className="font-playfair text-2xl font-bold mb-4">
              {t.footer.newsletter}
            </h3>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={language === 'en' ? 'Enter your email' : language === 'fr' ? 'Entrez votre email' : 'أدخل بريدك الإلكتروني'}
                required
                className="flex-1 px-4 py-3 rounded-lg font-inter text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="px-6 py-3 bg-accent text-accent-foreground font-inter font-semibold rounded-lg hover:bg-accent/90"
              >
                {language === 'en' ? 'Subscribe' : language === 'fr' ? 'S\'abonner' : 'اشترك'}
              </motion.button>
            </form>
            {subscribed && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-accent mt-3 font-inter text-sm"
              >
                ✓ {language === 'en' ? 'Subscribed!' : language === 'fr' ? 'Abonné!' : 'تم الاشتراك!'}
              </motion.p>
            )}
          </div>
        </motion.div>

        {/* Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0, duration: 0.5 }}
          >
            <p className="font-playfair text-2xl font-bold mb-4">L'Or</p>
            <p className="font-inter text-sm text-primary-foreground/70">
              {language === 'en'
                ? 'Premium Tunisian culinary excellence since 1949'
                : language === 'fr'
                ? 'Excellence culinaire tunisienne premium depuis 1949'
                : 'التفوق الطهوي التونسي الممتاز منذ 1949'}
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <h4 className="font-inter font-semibold mb-4">
              {language === 'en' ? 'Quick Links' : language === 'fr' ? 'Liens Rapides' : 'روابط سريعة'}
            </h4>
            <ul className="space-y-2 font-inter text-sm text-primary-foreground/70">
              <li><a href="#products" className="hover:text-accent transition">
                {language === 'en' ? 'Products' : language === 'fr' ? 'Produits' : 'منتجات'}
              </a></li>
              <li><a href="#catering" className="hover:text-accent transition">
                {language === 'en' ? 'Catering' : language === 'fr' ? 'Restauration' : 'الطعام'}
              </a></li>
              <li><a href="#about" className="hover:text-accent transition">
                {language === 'en' ? 'About' : language === 'fr' ? 'À propos' : 'معلومات'}
              </a></li>
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h4 className="font-inter font-semibold mb-4">
              {language === 'en' ? 'Contact' : language === 'fr' ? 'Contact' : 'اتصل'}
            </h4>
            <ul className="space-y-2 font-inter text-sm text-primary-foreground/70">
              <li>+216 71 123 456</li>
              <li>info@lordetunis.com</li>
              <li>Tunis, Tunisia</li>
            </ul>
          </motion.div>

          {/* Social */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h4 className="font-inter font-semibold mb-4">
              {language === 'en' ? 'Follow' : language === 'fr' ? 'Suivre' : 'تابعنا'}
            </h4>
            <div className="flex gap-4">
              {['Instagram', 'Facebook', 'Twitter'].map((platform) => (
                <motion.a
                  key={platform}
                  href="#"
                  whileHover={{ scale: 1.1 }}
                  className="w-10 h-10 bg-primary-foreground/20 rounded-full flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition"
                  title={platform}
                >
                  {platform[0]}
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className={`pt-8 border-t border-primary-foreground/20 text-center md:text-left font-inter text-sm text-primary-foreground/60 ${
            isRTL ? 'text-right' : ''
          }`}
        >
          <p>
            © {new Date().getFullYear()} L'Or de Tunis. {t.footer.rights}.
          </p>
        </motion.div>
      </div>
    </footer>
  )
}
