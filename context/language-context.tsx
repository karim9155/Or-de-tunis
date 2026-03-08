'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

export type Language = 'en' | 'fr' | 'ar'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  isRTL: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('language') as Language | null
    if (saved && ['en', 'fr', 'ar'].includes(saved)) {
      setLanguageState(saved)
      document.documentElement.lang = saved
      document.documentElement.dir = saved === 'ar' ? 'rtl' : 'ltr'
    }
    setMounted(true)
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('language', lang)
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
  }

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        isRTL: language === 'ar',
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}

export const translations = {
  en: {
    nav: {
      home: 'Home',
      products: 'Products',
      catering: 'Catering',
      about: 'About',
      contact: 'Contact',
      menu: 'Menu',
    },
    hero: {
      title: "L'Or de Tunis",
      subtitle: 'Premium Tunisian Culinary Treasures',
      cta: 'Explore Collection',
    },
    products: {
      title: 'Our Collections',
      olive: {
        name: 'Premium Olive Oils',
        desc: 'Single-origin extra virgin olive oils from our heritage estates',
      },
      dates: {
        name: 'Exceptional Dates',
        desc: 'Handpicked premium varieties from Tunisia\'s finest date palms',
      },
      harissa: {
        name: 'Artisanal Harissa',
        desc: 'Traditional North African spice paste, crafted with heritage recipes',
      },
      pastry: {
        name: 'Pastry Collection',
        desc: 'Delicate baklava and traditional pastries with premium ingredients',
      },
    },
    catering: {
      title: 'Premium Catering Services',
      subtitle: 'Bring Tunisian excellence to your events',
      step1: 'Event Details',
      step2: 'Menu Selection',
      step3: 'Confirmation',
      form: {
        eventType: 'Event Type',
        guests: 'Number of Guests',
        date: 'Event Date',
        menu: 'Select Menu',
        submit: 'Request Catering',
      },
    },
    about: {
      title: 'Our Heritage',
      desc: 'For generations, L\'Or de Tunis has been the guardian of Tunisian culinary traditions, sourcing only the finest ingredients from our homeland.',
    },
    footer: {
      newsletter: 'Subscribe to our newsletter',
      rights: 'All rights reserved',
    },
  },
  fr: {
    nav: {
      home: 'Accueil',
      products: 'Produits',
      catering: 'Restauration',
      about: 'À propos',
      contact: 'Contact',
      menu: 'Menu',
    },
    hero: {
      title: "L'Or de Tunis",
      subtitle: 'Trésors Culinaires Tunisiens Premium',
      cta: 'Explorer la Collection',
    },
    products: {
      title: 'Nos Collections',
      olive: {
        name: 'Huiles d\'Olive Premium',
        desc: 'Huiles d\'olive extra vierges monovariétales de nos domaines patrimoniaux',
      },
      dates: {
        name: 'Dattes Exceptionnelles',
        desc: 'Variétés premium sélectionnées des meilleurs palmiers tunisiens',
      },
      harissa: {
        name: 'Harissa Artisanale',
        desc: 'Pâte d\'épices nord-africaine traditionnelle, préparée selon les recettes du patrimoine',
      },
      pastry: {
        name: 'Collection de Pâtisseries',
        desc: 'Pâtisseries délicates et baklava traditionnels avec des ingrédients premium',
      },
    },
    catering: {
      title: 'Services de Restauration Premium',
      subtitle: 'Apportez l\'excellence tunisienne à vos événements',
      step1: 'Détails de l\'événement',
      step2: 'Sélection du Menu',
      step3: 'Confirmation',
      form: {
        eventType: 'Type d\'événement',
        guests: 'Nombre d\'invités',
        date: 'Date de l\'événement',
        menu: 'Sélectionner le Menu',
        submit: 'Demander la Restauration',
      },
    },
    about: {
      title: 'Notre Héritage',
      desc: 'Depuis des générations, L\'Or de Tunis est le gardien des traditions culinaires tunisiennes, en sélectionnant uniquement les meilleurs ingrédients de notre terre natale.',
    },
    footer: {
      newsletter: 'Abonnez-vous à notre infolettre',
      rights: 'Tous les droits réservés',
    },
  },
  ar: {
    nav: {
      home: 'الرئيسية',
      products: 'المنتجات',
      catering: 'الطعام',
      about: 'معلومات',
      contact: 'اتصل',
      menu: 'القائمة',
    },
    hero: {
      title: 'ذهب تونس',
      subtitle: 'الكنوز الطهوية التونسية الفاخرة',
      cta: 'استكشف المجموعة',
    },
    products: {
      title: 'مجموعاتنا',
      olive: {
        name: 'زيوت الزيتون الممتازة',
        desc: 'زيوت زيتون بكر ممتازة أحادية المصدر من عقاراتنا التراثية',
      },
      dates: {
        name: 'التمور الاستثنائية',
        desc: 'أصناف ممتازة مختارة بعناية من أفضل نخيل التمر التونسي',
      },
      harissa: {
        name: 'الحريسة الحرفية',
        desc: 'معجون التوابل شمال أفريقي تقليدي، مصنوع وفقاً للوصفات التراثية',
      },
      pastry: {
        name: 'مجموعة الحلويات',
        desc: 'حلويات رقيقة وبقلاوة تقليدية بمكونات ممتازة',
      },
    },
    catering: {
      title: 'خدمات الطعام الفاخرة',
      subtitle: 'اجعل التفوق التونسي في فعالياتك',
      step1: 'تفاصيل الفعالية',
      step2: 'اختيار القائمة',
      step3: 'التأكيد',
      form: {
        eventType: 'نوع الفعالية',
        guests: 'عدد الضيوف',
        date: 'تاريخ الفعالية',
        menu: 'اختر القائمة',
        submit: 'طلب الطعام',
      },
    },
    about: {
      title: 'تراثنا',
      desc: 'لأجيال، كانت ذهب تونس حامية التقاليد الطهوية التونسية، باختيار أفضل المكونات من وطننا الحبيب فقط.',
    },
    footer: {
      newsletter: 'اشترك في رسالتنا الإخبارية',
      rights: 'جميع الحقوق محفوظة',
    },
  },
}
