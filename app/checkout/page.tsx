import { Metadata } from 'next'
import Navbar from '@/components/shop/Navbar'
import Footer from '@/components/shop/Footer'
import CheckoutClient from '@/components/shop/CheckoutClient'

export const metadata: Metadata = {
  title: 'Checkout',
}

export default function CheckoutPage() {
  return (
    <>
      <Navbar />
      <main>
        <CheckoutClient />
      </main>
      <Footer />
    </>
  )
}
