'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { Product } from '@/lib/products'

export type CartItem = Product & { qty: number }

interface CartContextValue {
  cart: CartItem[]
  cartOpen: boolean
  cartCount: number
  addToCart: (product: Product) => void
  changeQty: (id: number | string, delta: number) => void
  removeItem: (id: number | string) => void
  openCart: () => void
  closeCart: () => void
  clearCart: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)

  const cartCount = cart.reduce((s, c) => s + c.qty, 0)

  function addToCart(product: Product) {
    setCart(prev => {
      const key = product.id
      const ex = prev.find(c => c.id === key)
      if (ex) return prev.map(c => c.id === key ? { ...c, qty: c.qty + 1 } : c)
      return [...prev, { ...product, qty: 1 }]
    })
  }

  function changeQty(id: number | string, delta: number) {
    setCart(prev =>
      prev.map(c => c.id === id ? { ...c, qty: c.qty + delta } : c).filter(c => c.qty > 0)
    )
  }

  function removeItem(id: number | string) {
    setCart(prev => prev.filter(c => c.id !== id))
  }

  function clearCart() { setCart([]) }

  return (
    <CartContext.Provider value={{
      cart, cartOpen, cartCount,
      addToCart, changeQty, removeItem,
      openCart:  () => setCartOpen(true),
      closeCart: () => setCartOpen(false),
      clearCart,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
