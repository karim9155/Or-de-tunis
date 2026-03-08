'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/context/language-context'

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#f3f0ed]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#064e3b]" />
      </div>
    }>
      <AuthForm />
    </Suspense>
  )
}

function AuthForm() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/menu'
  const supabase = createClient()
  const { language } = useLanguage()

  const isArabic = language === 'ar'

  const t = {
    en: {
      signIn: 'Sign In',
      signUp: 'Sign Up',
      emailOrPhone: 'Email or Phone',
      password: 'Password',
      fullName: 'Full Name',
      noAccount: "Don't have an account?",
      haveAccount: 'Already have an account?',
      signingIn: 'Signing in...',
      signingUp: 'Creating account...',
      welcome: 'Welcome',
      joinUs: 'Join L\'Or de Tunis',
    },
    fr: {
      signIn: 'Connexion',
      signUp: 'Inscription',
      emailOrPhone: 'Email ou Téléphone',
      password: 'Mot de passe',
      fullName: 'Nom complet',
      noAccount: "Vous n'avez pas de compte ?",
      haveAccount: 'Vous avez déjà un compte ?',
      signingIn: 'Connexion...',
      signingUp: 'Création du compte...',
      welcome: 'Bienvenue',
      joinUs: 'Rejoignez L\'Or de Tunis',
    },
    ar: {
      signIn: 'تسجيل الدخول',
      signUp: 'إنشاء حساب',
      emailOrPhone: 'البريد الإلكتروني أو الهاتف',
      password: 'كلمة المرور',
      fullName: 'الاسم الكامل',
      noAccount: 'ليس لديك حساب؟',
      haveAccount: 'لديك حساب بالفعل؟',
      signingIn: 'جاري تسجيل الدخول...',
      signingUp: 'جاري إنشاء الحساب...',
      welcome: 'مرحباً',
      joinUs: 'انضم إلى ذهب تونس',
    },
  }

  const text = t[language] || t.en

  function isEmail(value: string) {
    return value.includes('@')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const email = isEmail(identifier) ? identifier : `${identifier.replace(/[^0-9+]/g, '')}@phone.lordetunis.com`

    if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName, phone: isEmail(identifier) ? '' : identifier },
          emailRedirectTo: undefined,
        },
      })
      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }
    }

    router.push(redirect)
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f3f0ed] px-4" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg">
        <div className="text-center mb-8">
          <h1 className="font-playfair text-3xl font-bold text-[#064e3b]">L&apos;Or de Tunis</h1>
          <p className="text-gray-500 mt-2">
            {mode === 'signin' ? text.welcome : text.joinUs}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {mode === 'signup' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{text.fullName}</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#064e3b] focus:border-transparent transition"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{text.emailOrPhone}</label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="name@example.com / +216 XX XXX XXX"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#064e3b] focus:border-transparent transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{text.password}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#064e3b] focus:border-transparent transition"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#064e3b] text-white rounded-lg font-medium hover:bg-[#065f46] transition disabled:opacity-50"
          >
            {loading
              ? (mode === 'signin' ? text.signingIn : text.signingUp)
              : (mode === 'signin' ? text.signIn : text.signUp)
            }
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          {mode === 'signin' ? text.noAccount : text.haveAccount}{' '}
          <button
            onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError('') }}
            className="text-[#064e3b] font-medium hover:underline"
          >
            {mode === 'signin' ? text.signUp : text.signIn}
          </button>
        </p>
      </div>
    </div>
  )
}
