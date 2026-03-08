import { Navbar } from '@/components/navbar'
import { Hero } from '@/components/hero'
import { ProductShowcase } from '@/components/product-showcase'
import { CateringForm } from '@/components/catering-form'
import { About } from '@/components/about'
import { Footer } from '@/components/footer'

export default function Home() {
  return (
    <main className="bg-white">
      <Navbar />
      <Hero />
      <ProductShowcase />
      <CateringForm />
      <About />
      <Footer />
    </main>
  )
}
