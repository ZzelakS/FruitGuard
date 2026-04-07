'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useCart } from '@/context/CartContext'
import CartDrawer from './CartDrawer'

const NAV_LINKS = [
  { label: 'Products', href: '/products' },
  { label: 'About',    href: '/about'    },
  { label: 'Contact',  href: '/contact'  },
  { label: 'Admin',    href: '/admin/login', accent: true },
]

export default function Navbar() {
  const pathname = usePathname()
  const { cartCount, openCart, cart, cartOpen, closeCart, changeQty, removeItem } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  useEffect(() => { setMenuOpen(false) }, [pathname])

  return (
    <>
      <nav className={`sticky top-0 z-50 bg-[#FDFCFA] border-b border-[#D6D3CE] h-16 flex items-center px-5 md:px-10 justify-between transition-shadow duration-300 ${scrolled ? 'shadow-[0_2px_16px_rgba(0,0,0,0.07)]' : ''}`}>

        {/* Logo */}
        <Link href="/" className="z-10 flex items-center" onClick={() => setMenuOpen(false)}>
          <Image 
            src="/logo.png" // <-- change if your filename differs
            alt="FruitGuard Logo"
            width={200}
            height={80}
            priority
            className="object-contain"
          />
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex gap-7 items-center">
          {NAV_LINKS.map(({ label, href, accent }) => {
            const active = pathname === href || pathname.startsWith(href + '/')
            return (
              <Link key={href} href={href}
                className={`relative text-[11px] font-semibold tracking-[0.09em] uppercase transition-colors group ${
                  accent ? 'text-brand hover:text-brand-dark'
                    : active ? 'text-[#111110]'
                    : 'text-[#6B6860] hover:text-[#111110]'
                }`}>
                {label}
                <span className={`absolute -bottom-0.5 left-0 h-px bg-brand transition-all duration-300 ${active ? 'w-full' : 'w-0 group-hover:w-full'}`} />
              </Link>
            )
          })}
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          <button onClick={openCart} aria-label="Open cart"
            className="bg-brand hover:bg-brand-dark text-white text-[12px] font-semibold tracking-wider uppercase px-4 py-2 rounded-sm flex items-center gap-2 transition-colors">
            Cart
            <span className={`bg-white text-brand-dark rounded-full w-5 h-5 flex items-center justify-center text-[11px] font-bold transition-transform duration-200 ${cartCount > 0 ? 'scale-110' : ''}`}>
              {cartCount}
            </span>
          </button>

          {/* Hamburger */}
          <button onClick={() => setMenuOpen(o => !o)} aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-sm border border-[#D6D3CE] hover:border-[#111110] transition-colors z-10">
            <span className={`block h-px w-5 bg-[#111110] transition-all duration-300 origin-center ${menuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
            <span className={`block h-px w-5 bg-[#111110] transition-all duration-300 ${menuOpen ? 'opacity-0 scale-x-0' : ''}`} />
            <span className={`block h-px w-5 bg-[#111110] transition-all duration-300 origin-center ${menuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
          </button>
        </div>
      </nav>

      {/* Offcanvas overlay */}
      <div className={`fixed inset-0 bg-black/40 z-40 md:hidden transition-opacity duration-300 ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setMenuOpen(false)} aria-hidden="true" />

      {/* Offcanvas panel */}
      <div className={`fixed top-0 right-0 bottom-0 w-[280px] bg-[#FDFCFA] z-50 flex flex-col shadow-2xl md:hidden transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        <div className="h-16 flex items-center justify-between px-5 border-b border-[#D6D3CE]">
          <Image 
            src="/logo.png"
            alt="FruitGuard Logo"
            width={110}
            height={36}
            className="object-contain"
          />
          <button onClick={() => setMenuOpen(false)}
            className="w-8 h-8 border border-[#D6D3CE] rounded-sm flex items-center justify-center text-sm text-[#6B6860] hover:border-[#111110] hover:text-[#111110] transition-colors">
            ✕
          </button>
        </div>

        <nav className="flex-1 px-5 py-6 flex flex-col gap-1">
          <Link href="/"
            className={`flex items-center justify-between px-3 py-3.5 rounded-sm text-[13px] font-semibold tracking-wide uppercase transition-colors ${pathname === '/' ? 'bg-brand-pale text-brand' : 'text-[#6B6860] hover:bg-[#F4F3F0] hover:text-[#111110]'}`}>
            Home <span className="text-[#D6D3CE] text-lg">›</span>
          </Link>

          {NAV_LINKS.map(({ label, href, accent }, i) => {
            const active = pathname === href || pathname.startsWith(href + '/')
            return (
              <Link key={href} href={href}
                className={`flex items-center justify-between px-3 py-3.5 rounded-sm text-[13px] font-semibold tracking-wide uppercase transition-colors ${
                  accent ? 'text-brand hover:bg-brand-pale'
                    : active ? 'bg-brand-pale text-brand'
                    : 'text-[#6B6860] hover:bg-[#F4F3F0] hover:text-[#111110]'
                }`}>
                {label}
                <span className={`text-lg ${accent ? 'text-brand' : 'text-[#D6D3CE]'}`}>›</span>
              </Link>
            )
          })}
        </nav>

        <div className="px-5 py-6 border-t border-[#D6D3CE]">
          <button onClick={() => { setMenuOpen(false); openCart() }}
            className="w-full bg-brand hover:bg-brand-dark text-white py-3 text-[12px] font-semibold tracking-widest uppercase rounded-sm transition-colors flex items-center justify-center gap-2">
            View Cart
            <span className="bg-white text-brand-dark rounded-full w-5 h-5 flex items-center justify-center text-[11px] font-bold">{cartCount}</span>
          </button>
        </div>
      </div>

      <CartDrawer open={cartOpen} cart={cart} onClose={closeCart} onChangeQty={changeQty} onRemove={removeItem}
        onCheckout={() => { closeCart(); window.location.href = '/checkout' }} />
    </>
  )
}