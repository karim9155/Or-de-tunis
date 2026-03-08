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
    admin: {
      sidebar: {
        dashboard: 'Dashboard',
        plates: 'Plates',
        orders: 'Orders',
        viewSite: 'View Site',
        logout: 'Logout',
        title: 'Admin Dashboard',
      },
      login: {
        title: 'Admin Dashboard',
        email: 'Email',
        password: 'Password',
        signIn: 'Sign In',
        signingIn: 'Signing in...',
        connectionError: 'Connection error. Please try again.',
      },
      dashboard: {
        title: 'Dashboard',
        totalPlates: 'Total Plates',
        totalOrders: 'Total Orders',
        pendingOrders: 'Pending Orders',
        recentOrders: 'Recent Orders',
        noOrders: 'No orders yet',
        customer: 'Customer',
        eventDate: 'Event Date',
        guests: 'Guests',
        status: 'Status',
      },
      plates: {
        title: 'Plates',
        addPlate: '+ Add Plate',
        noPlates: 'No plates yet. Add your first plate!',
        image: 'Image',
        name: 'Name',
        category: 'Category',
        price: 'Price',
        available: 'Available',
        actions: 'Actions',
        edit: 'Edit',
        delete: 'Delete',
        deleteConfirm: 'Are you sure you want to delete this plate?',
        addNew: 'Add New Plate',
        editPlate: 'Edit Plate',
      },
      plateForm: {
        basicInfo: 'Basic Info',
        category: 'Category',
        selectCategory: 'Select category...',
        price: 'Price (TND)',
        available: 'Available',
        plateName: 'Plate Name',
        english: 'English',
        french: 'French',
        arabic: 'Arabic',
        description: 'Description',
        image: 'Image',
        chooseImage: 'Choose Image',
        uploading: 'Uploading...',
        imageHint: 'JPG, PNG or WebP. Max 5MB.',
        saving: 'Saving...',
        updatePlate: 'Update Plate',
        createPlate: 'Create Plate',
        cancel: 'Cancel',
      },
      orders: {
        title: 'Orders',
        all: 'All',
        noOrders: 'No orders',
        orderItems: 'Order Items',
        qty: 'Qty',
        total: 'Total',
        phone: 'Phone',
        email: 'Email',
        ordered: 'Ordered',
        notes: 'Notes',
        unknownPlate: 'Unknown plate',
        accept: 'Accept',
        reject: 'Reject',
        mark: 'Mark',
        guests: 'guests',
        pending: 'pending',
        accepted: 'accepted',
        preparing: 'preparing',
        ready: 'ready',
        delivered: 'delivered',
        rejected: 'rejected',
      },
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
    admin: {
      sidebar: {
        dashboard: 'Tableau de bord',
        plates: 'Plats',
        orders: 'Commandes',
        viewSite: 'Voir le site',
        logout: 'Déconnexion',
        title: 'Tableau de bord Admin',
      },
      login: {
        title: 'Tableau de bord Admin',
        email: 'E-mail',
        password: 'Mot de passe',
        signIn: 'Se connecter',
        signingIn: 'Connexion en cours...',
        connectionError: 'Erreur de connexion. Veuillez réessayer.',
      },
      dashboard: {
        title: 'Tableau de bord',
        totalPlates: 'Total des plats',
        totalOrders: 'Total des commandes',
        pendingOrders: 'Commandes en attente',
        recentOrders: 'Commandes récentes',
        noOrders: 'Aucune commande pour le moment',
        customer: 'Client',
        eventDate: 'Date de l\'événement',
        guests: 'Invités',
        status: 'Statut',
      },
      plates: {
        title: 'Plats',
        addPlate: '+ Ajouter un plat',
        noPlates: 'Aucun plat pour le moment. Ajoutez votre premier plat !',
        image: 'Image',
        name: 'Nom',
        category: 'Catégorie',
        price: 'Prix',
        available: 'Disponible',
        actions: 'Actions',
        edit: 'Modifier',
        delete: 'Supprimer',
        deleteConfirm: 'Êtes-vous sûr de vouloir supprimer ce plat ?',
        addNew: 'Ajouter un nouveau plat',
        editPlate: 'Modifier le plat',
      },
      plateForm: {
        basicInfo: 'Informations de base',
        category: 'Catégorie',
        selectCategory: 'Sélectionner une catégorie...',
        price: 'Prix (TND)',
        available: 'Disponible',
        plateName: 'Nom du plat',
        english: 'Anglais',
        french: 'Français',
        arabic: 'Arabe',
        description: 'Description',
        image: 'Image',
        chooseImage: 'Choisir une image',
        uploading: 'Téléchargement...',
        imageHint: 'JPG, PNG ou WebP. Max 5 Mo.',
        saving: 'Enregistrement...',
        updatePlate: 'Mettre à jour le plat',
        createPlate: 'Créer le plat',
        cancel: 'Annuler',
      },
      orders: {
        title: 'Commandes',
        all: 'Toutes',
        noOrders: 'Aucune commande',
        orderItems: 'Articles de la commande',
        qty: 'Qté',
        total: 'Total',
        phone: 'Téléphone',
        email: 'E-mail',
        ordered: 'Commandé',
        notes: 'Notes',
        unknownPlate: 'Plat inconnu',
        accept: 'Accepter',
        reject: 'Rejeter',
        mark: 'Marquer',
        guests: 'invités',
        pending: 'en attente',
        accepted: 'acceptée',
        preparing: 'en préparation',
        ready: 'prête',
        delivered: 'livrée',
        rejected: 'rejetée',
      },
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
    admin: {
      sidebar: {
        dashboard: 'لوحة التحكم',
        plates: 'الأطباق',
        orders: 'الطلبات',
        viewSite: 'عرض الموقع',
        logout: 'تسجيل الخروج',
        title: 'لوحة تحكم المشرف',
      },
      login: {
        title: 'لوحة تحكم المشرف',
        email: 'البريد الإلكتروني',
        password: 'كلمة المرور',
        signIn: 'تسجيل الدخول',
        signingIn: 'جاري تسجيل الدخول...',
        connectionError: 'خطأ في الاتصال. يرجى المحاولة مرة أخرى.',
      },
      dashboard: {
        title: 'لوحة التحكم',
        totalPlates: 'إجمالي الأطباق',
        totalOrders: 'إجمالي الطلبات',
        pendingOrders: 'الطلبات المعلقة',
        recentOrders: 'الطلبات الأخيرة',
        noOrders: 'لا توجد طلبات بعد',
        customer: 'العميل',
        eventDate: 'تاريخ الحدث',
        guests: 'الضيوف',
        status: 'الحالة',
      },
      plates: {
        title: 'الأطباق',
        addPlate: '+ إضافة طبق',
        noPlates: 'لا توجد أطباق بعد. أضف طبقك الأول!',
        image: 'الصورة',
        name: 'الاسم',
        category: 'الفئة',
        price: 'السعر',
        available: 'متاح',
        actions: 'الإجراءات',
        edit: 'تعديل',
        delete: 'حذف',
        deleteConfirm: 'هل أنت متأكد أنك تريد حذف هذا الطبق؟',
        addNew: 'إضافة طبق جديد',
        editPlate: 'تعديل الطبق',
      },
      plateForm: {
        basicInfo: 'المعلومات الأساسية',
        category: 'الفئة',
        selectCategory: 'اختر فئة...',
        price: 'السعر (دينار تونسي)',
        available: 'متاح',
        plateName: 'اسم الطبق',
        english: 'الإنجليزية',
        french: 'الفرنسية',
        arabic: 'العربية',
        description: 'الوصف',
        image: 'الصورة',
        chooseImage: 'اختر صورة',
        uploading: 'جاري الرفع...',
        imageHint: 'JPG أو PNG أو WebP. الحد الأقصى 5 ميجابايت.',
        saving: 'جاري الحفظ...',
        updatePlate: 'تحديث الطبق',
        createPlate: 'إنشاء الطبق',
        cancel: 'إلغاء',
      },
      orders: {
        title: 'الطلبات',
        all: 'الكل',
        noOrders: 'لا توجد طلبات',
        orderItems: 'عناصر الطلب',
        qty: 'الكمية',
        total: 'المجموع',
        phone: 'الهاتف',
        email: 'البريد الإلكتروني',
        ordered: 'تاريخ الطلب',
        notes: 'ملاحظات',
        unknownPlate: 'طبق غير معروف',
        accept: 'قبول',
        reject: 'رفض',
        mark: 'تحويل إلى',
        guests: 'ضيوف',
        pending: 'معلق',
        accepted: 'مقبول',
        preparing: 'قيد التحضير',
        ready: 'جاهز',
        delivered: 'تم التوصيل',
        rejected: 'مرفوض',
      },
    },
  },
}
