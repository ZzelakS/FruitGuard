import { Metadata } from 'next'
import Navbar from '@/components/shop/Navbar'
import Footer from '@/components/shop/Footer'
import ProductsClient from '@/components/shop/ProductsClient'

export const metadata: Metadata = {
  title: 'Products',
  description: 'Browse our full range of cold-pressed organic juices.',
}

export default function ProductsPage() {
  return (
    <>
      <Navbar />
      <main><ProductsClient /></main>
      <Footer />
    </>
  )
}
