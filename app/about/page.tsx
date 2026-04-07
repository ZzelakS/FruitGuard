import { Metadata } from 'next'
import Navbar from '@/components/shop/Navbar'
import Footer from '@/components/shop/Footer'
import AboutContent from '@/components/shop/AboutContent'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'The story behind FruitGuard — organic sourcing, cold-press process, and our commitment to zero additives.',
}

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main><AboutContent /></main>
      <Footer />
    </>
  )
}
