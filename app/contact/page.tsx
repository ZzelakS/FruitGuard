import { Metadata } from 'next'
import Navbar from '@/components/shop/Navbar'
import Footer from '@/components/shop/Footer'
import ContactContent from '@/components/shop/ContactContent'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with FruitGuard. Based in Lagos, we respond within 24 hours.',
}

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main><ContactContent /></main>
      <Footer />
    </>
  )
}
