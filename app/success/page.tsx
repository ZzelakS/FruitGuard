import { Metadata } from 'next'
import Navbar from '@/components/shop/Navbar'
import Footer from '@/components/shop/Footer'
import SuccessClient from '@/components/shop/SuccessClient'

export const metadata: Metadata = { title: 'Order Confirmed' }

export default function SuccessPage() {
  return (
    <>
      <Navbar />
      <main><SuccessClient /></main>
      <Footer />
    </>
  )
}
