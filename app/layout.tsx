import type { Metadata } from 'next'
import { Playfair_Display, Inter, Almarai, Noto_Kufi_Arabic } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { LanguageProvider } from '@/context/language-context'
import { AuthProvider } from '@/context/auth-context'
import { CartProvider } from '@/context/cart-context'
import './globals.css'

const playfairDisplay = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
})

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const almarai = Almarai({ 
  weight: ['400', '700'],
  subsets: ['arabic'],
  variable: '--font-almarai',
})

const notoKufiArabic = Noto_Kufi_Arabic({ 
  weight: ['400', '700'],
  subsets: ['arabic'],
  variable: '--font-noto-kufi',
})

export const metadata: Metadata = {
  title: "L'Or de Tunis | Premium Tunisian Culinary Boutique",
  description: 'Discover authentic Tunisian culinary treasures and premium catering services',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${playfairDisplay.variable} ${inter.variable} ${almarai.variable} ${notoKufiArabic.variable} font-sans antialiased`}>
        <LanguageProvider>
          <AuthProvider>
            <CartProvider>
              {children}
            </CartProvider>
          </AuthProvider>
        </LanguageProvider>
        <Analytics />
      </body>
    </html>
  )
}
