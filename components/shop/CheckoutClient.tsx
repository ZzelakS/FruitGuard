'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'

const STATES = ['Lagos','Abuja (FCT)','Rivers','Oyo','Kano','Delta','Anambra','Enugu','Ogun','Kaduna']

export default function CheckoutClient() {
  const router = useRouter()
  const { cart, clearCart } = useCart()
  const [payMethod, setPayMethod] = useState('card')
  const [form, setForm] = useState({ firstname:'', lastname:'', email:'', phone:'', address:'', city:'', state:'Lagos', note:'' })
  const [error, setError] = useState('')
  const [placing, setPlacing] = useState(false)

  const subtotal = cart.reduce((s, c) => s + c.price * c.qty, 0)
  const delivery = subtotal >= 5000 ? 0 : 500
  const total    = subtotal + delivery

  if (cart.length === 0) {
    return (
      <div className="text-center py-24 px-6">
        <h2 className="font-display text-3xl mb-4">Your cart is empty</h2>
        <p className="text-[#6B6860] text-sm mb-8">Add some products before checking out.</p>
        <Link href="/products" className="bg-brand hover:bg-brand-dark text-white px-8 py-3 text-[12px] font-semibold tracking-widest uppercase rounded-sm transition-colors">
          Browse Products
        </Link>
      </div>
    )
  }

  function handleSubmit() {
    setError('')
    if (!form.firstname || !form.lastname || !form.email || !form.phone || !form.address) {
      setError('Please fill in all required fields.')
      return
    }
    if (!form.email.includes('@')) { setError('Please enter a valid email address.'); return }
    setPlacing(true)
    const ref = 'FG-' + Math.floor(Math.random() * 900000 + 100000)
    setTimeout(() => {
      clearCart()
      router.push(`/success?ref=${ref}`)
    }, 800)
  }

  return (
    <div className="max-w-5xl mx-auto px-6 md:px-10 py-12 page-enter">
      <Link href="/products" className="text-[11px] tracking-wider uppercase text-[#6B6860] hover:text-[#111110] mb-8 inline-flex items-center gap-2 transition-colors">
        ← Continue Shopping
      </Link>
      <h1 className="font-display text-4xl mb-10 pb-6 border-b border-[#D6D3CE]">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12 items-start">
        {/* Form */}
        <div>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-[13px] px-4 py-3 rounded-sm mb-6">{error}</div>
          )}

          <p className="text-[11px] font-bold tracking-[0.12em] uppercase text-brand border-b border-[#D6D3CE] pb-3 mb-5">Delivery Information</p>

          <div className="grid grid-cols-2 gap-4 mb-4">
            {[['First Name','firstname','text','Chidi'],['Last Name','lastname','text','Okonkwo']].map(([label,key,type,ph]) => (
              <div key={key}>
                <label className="block text-[11px] font-semibold tracking-wider uppercase text-[#6B6860] mb-1.5">{label} <span className="text-brand">*</span></label>
                <input type={type} placeholder={ph} value={form[key as keyof typeof form]}
                  onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  className="w-full border border-[#D6D3CE] focus:border-brand rounded-sm px-3 py-2.5 text-sm outline-none transition-colors"/>
              </div>
            ))}
          </div>

          {[['Email Address','email','email','you@email.com'],['Phone Number','phone','tel','+234 801 234 5678'],['Delivery Address','address','text','15 Mango Close, Victoria Island']].map(([label,key,type,ph]) => (
            <div key={key} className="mb-4">
              <label className="block text-[11px] font-semibold tracking-wider uppercase text-[#6B6860] mb-1.5">{label} <span className="text-brand">*</span></label>
              <input type={type} placeholder={ph} value={form[key as keyof typeof form]}
                onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                className="w-full border border-[#D6D3CE] focus:border-brand rounded-sm px-3 py-2.5 text-sm outline-none transition-colors"/>
            </div>
          ))}

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-[11px] font-semibold tracking-wider uppercase text-[#6B6860] mb-1.5">City</label>
              <input type="text" placeholder="Lagos" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                className="w-full border border-[#D6D3CE] focus:border-brand rounded-sm px-3 py-2.5 text-sm outline-none transition-colors"/>
            </div>
            <div>
              <label className="block text-[11px] font-semibold tracking-wider uppercase text-[#6B6860] mb-1.5">State</label>
              <select value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value }))}
                className="w-full border border-[#D6D3CE] focus:border-brand rounded-sm px-3 py-2.5 text-sm outline-none bg-white appearance-none">
                {STATES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-[11px] font-semibold tracking-wider uppercase text-[#6B6860] mb-1.5">Delivery Note (optional)</label>
            <textarea placeholder="E.g. Leave at gate / call on arrival" value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
              className="w-full border border-[#D6D3CE] focus:border-brand rounded-sm px-3 py-2.5 text-sm outline-none transition-colors resize-none h-20"/>
          </div>

          <p className="text-[11px] font-bold tracking-[0.12em] uppercase text-brand border-b border-[#D6D3CE] pb-3 mb-5">Payment Method</p>

          <div className="flex gap-2 flex-wrap mb-5">
            {[['card','Debit Card'],['transfer','Bank Transfer'],['ussd','USSD'],['cod','Pay on Delivery']].map(([val,label]) => (
              <button key={val} onClick={() => setPayMethod(val)}
                className={`border rounded-sm px-4 py-2 text-[11px] font-semibold tracking-wider uppercase transition-all ${payMethod === val ? 'border-brand text-brand bg-brand-pale' : 'border-[#D6D3CE] text-[#111110] hover:border-brand hover:text-brand'}`}>
                {label}
              </button>
            ))}
          </div>

          {payMethod === 'card' && (
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold tracking-wider uppercase text-[#6B6860] mb-1.5">Card Number</label>
                <input type="text" placeholder="0000 0000 0000 0000" maxLength={19}
                  className="w-full border border-[#D6D3CE] focus:border-brand rounded-sm px-3 py-2.5 text-sm outline-none transition-colors"/>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold tracking-wider uppercase text-[#6B6860] mb-1.5">Expiry</label>
                  <input type="text" placeholder="MM / YY" maxLength={7}
                    className="w-full border border-[#D6D3CE] focus:border-brand rounded-sm px-3 py-2.5 text-sm outline-none transition-colors"/>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold tracking-wider uppercase text-[#6B6860] mb-1.5">CVV</label>
                  <input type="text" placeholder="123" maxLength={3}
                    className="w-full border border-[#D6D3CE] focus:border-brand rounded-sm px-3 py-2.5 text-sm outline-none transition-colors"/>
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold tracking-wider uppercase text-[#6B6860] mb-1.5">Name on Card</label>
                <input type="text" placeholder="As printed on card"
                  className="w-full border border-[#D6D3CE] focus:border-brand rounded-sm px-3 py-2.5 text-sm outline-none transition-colors"/>
              </div>
            </div>
          )}

          {payMethod === 'transfer' && (
            <div className="bg-[#F4F3F0] rounded-sm p-5 text-sm text-[#6B6860] leading-relaxed">
              <p className="font-semibold text-[#111110] mb-2">Bank Transfer Details</p>
              <p>Bank: <strong>First Bank Nigeria</strong></p>
              <p>Account: <strong>3012345678</strong></p>
              <p>Name: <strong>FruitGuard Nigeria Ltd</strong></p>
              <p className="mt-3 text-[12px]">Send receipt to <strong>orders@fruitguard.com</strong> to confirm.</p>
            </div>
          )}

          {payMethod === 'ussd' && (
            <div className="bg-[#F4F3F0] rounded-sm p-5">
              <p className="font-semibold text-[#111110] mb-2 text-sm">Dial USSD to Pay</p>
              <p className="font-display text-2xl text-brand">*737*000*{total}#</p>
              <p className="text-[12px] text-[#6B6860] mt-2">Follow the prompts on your phone to complete payment.</p>
            </div>
          )}

          {payMethod === 'cod' && (
            <div className="bg-[#F4F3F0] rounded-sm p-5 text-sm text-[#6B6860]">
              Pay cash to our delivery rider on receipt. Please have the exact amount ready: <strong className="text-[#111110]">₦{total.toLocaleString()}</strong>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="border border-[#D6D3CE] rounded-sm p-7 sticky top-24">
          <h3 className="font-display text-xl mb-5 pb-4 border-b border-[#D6D3CE]">Order Summary</h3>
          {cart.map(c => (
            <div key={c.id} className="flex justify-between text-sm text-[#6B6860] mb-2">
              <span>{c.name} ×{c.qty}</span>
              <span>₦{(c.price * c.qty).toLocaleString()}</span>
            </div>
          ))}
          <div className="flex justify-between text-sm text-[#6B6860] mt-3 mb-1">
            <span>Subtotal</span><span>₦{subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm text-[#6B6860] mb-4">
            <span>Delivery</span>
            <span>{delivery === 0 ? <span className="text-brand font-medium">Free</span> : `₦${delivery.toLocaleString()}`}</span>
          </div>
          <div className="flex justify-between font-semibold border-t border-[#D6D3CE] pt-4 mb-6">
            <span>Total</span>
            <span className="text-brand font-display text-xl">₦{total.toLocaleString()}</span>
          </div>
          <button onClick={handleSubmit} disabled={placing}
            className="w-full bg-brand hover:bg-brand-dark disabled:opacity-60 text-white py-3.5 text-[12px] font-semibold tracking-widest uppercase rounded-sm transition-all duration-200 hover:-translate-y-0.5">
            {placing ? 'Placing Order...' : 'Place Order'}
          </button>
          <p className="text-center text-[10px] tracking-wider uppercase text-[#D6D3CE] mt-3">Secured · 256-bit SSL</p>
        </div>
      </div>
    </div>
  )
}
