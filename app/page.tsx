import Navbar from '@/components/shop/Navbar'
import Footer from '@/components/shop/Footer'
import HomeClient from '@/components/shop/HomeClient'

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HomeClient />
      </main>
      <Footer />
    </>
  )
}
