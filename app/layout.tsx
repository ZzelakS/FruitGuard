import type { Metadata } from 'next'
import { Cormorant_Garamond, Jost } from 'next/font/google'
import { CartProvider } from '@/context/CartContext'
import './globals.css'

const jost = Jost({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-jost',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
})

export const metadata: Metadata = {
  title: {
    default: 'FruitGuard — Cold-Pressed Organic Juices',
    template: '%s | FruitGuard',
  },
  description: 'Premium cold-pressed organic juices. No preservatives, no additives — just pure, vibrant goodness delivered fresh to your door.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${jost.variable} ${cormorant.variable} font-sans bg-[#FDFCFA] text-[#111110]`}>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  )
}
