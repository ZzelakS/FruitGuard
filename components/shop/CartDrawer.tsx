'use client'

import { CartItem } from '@/context/CartContext'

interface CartDrawerProps {
  open: boolean
  cart: CartItem[]
  onClose: () => void
  onChangeQty: (id: number | string, delta: number) => void
  onRemove: (id: number | string) => void
  onCheckout: () => void
}

export default function CartDrawer({ open, cart, onClose, onChangeQty, onRemove, onCheckout }: CartDrawerProps) {
  const subtotal = cart.reduce((s, c) => s + c.price * c.qty, 0)
  const delivery = subtotal >= 5000 ? 0 : 500
  const total    = subtotal + delivery

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div className={`fixed right-0 top-0 bottom-0 w-full max-w-[440px] bg-white z-50 flex flex-col shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${open ? 'translate-x-0' : 'translate-x-full'}`}>

        {/* Head */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-[#D6D3CE]">
          <h2 className="font-display text-2xl">Your Cart</h2>
          <button onClick={onClose} className="border border-[#D6D3CE] hover:border-[#111110] w-8 h-8 flex items-center justify-center text-sm rounded-sm transition-colors">✕</button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-8 py-4">
          {cart.length === 0 ? (
            <div className="text-center py-16 text-[#6B6860]">
              <div className="w-12 h-12 border-2 border-[#D6D3CE] rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-5 h-5 stroke-[#D6D3CE]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                  <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
                </svg>
              </div>
              <p className="text-sm">Your cart is empty</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex gap-4 items-start py-5 border-b border-[#F4F3F0] last:border-0">
                <div className="w-14 h-14 bg-brand-pale rounded-sm flex-shrink-0 flex items-center justify-center">
                  <div className="w-7 h-7 rounded-full border-2 border-[#FDDFC8] bg-[#FDDFC8]"/>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate mb-1">{item.name}</p>
                  <p className="text-brand text-sm font-semibold mb-2">₦{(item.price * item.qty).toLocaleString()}</p>
                  <div className="flex items-center gap-2">
                    <button onClick={() => onChangeQty(item.id!, -1)} className="w-6 h-6 bg-[#F4F3F0] hover:bg-brand hover:text-white rounded-sm text-sm flex items-center justify-center transition-colors">−</button>
                    <span className="text-sm font-semibold w-5 text-center">{item.qty}</span>
                    <button onClick={() => onChangeQty(item.id!, 1)} className="w-6 h-6 bg-[#F4F3F0] hover:bg-brand hover:text-white rounded-sm text-sm flex items-center justify-center transition-colors">+</button>
                  </div>
                </div>
                <button onClick={() => onRemove(item.id!)} className="text-[11px] tracking-wider uppercase text-[#6B6860] hover:text-red-500 font-medium transition-colors mt-1 border-b border-[#D6D3CE] hover:border-red-300 pb-px">Remove</button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="px-8 py-6 border-t border-[#D6D3CE]">
            <div className="flex justify-between text-sm text-[#6B6860] mb-2">
              <span>Subtotal</span><span>₦{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm text-[#6B6860] mb-4">
              <span>Delivery</span>
              <span>{delivery === 0 ? <span className="text-brand font-medium">Free</span> : `₦${delivery.toLocaleString()}`}</span>
            </div>
            <div className="flex justify-between font-semibold text-base border-t border-[#D6D3CE] pt-4 mb-5">
              <span>Total</span><span className="text-brand">₦{total.toLocaleString()}</span>
            </div>
            <button onClick={onCheckout} className="w-full bg-brand hover:bg-brand-dark text-white py-3.5 text-[12px] font-semibold tracking-widest uppercase rounded-sm transition-colors">
              Proceed to Checkout
            </button>
            <p className="text-center text-[10px] tracking-wider uppercase text-[#D6D3CE] mt-3">Secured · 256-bit SSL</p>
          </div>
        )}
      </div>
    </>
  )
}
