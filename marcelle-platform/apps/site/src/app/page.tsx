import { Navbar } from '@/components/Navbar'
import { HeroSection } from '@/components/HeroSection'
import { ServicesSection } from '@/components/ServicesSection'
import { MethodologySection } from '@/components/MethodologySection'
import { TestimonialsSection } from '@/components/TestimonialsSection'
import { FAQSection } from '@/components/FAQSection'
import { ContactSection } from '@/components/ContactSection'
import { Footer } from '@/components/Footer'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <ServicesSection />
        <MethodologySection />
        <TestimonialsSection />
        <FAQSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  )
}
