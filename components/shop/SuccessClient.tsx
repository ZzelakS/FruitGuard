'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function SuccessInner() {
  const params   = useSearchParams()
  const orderRef = params.get('ref') || 'FG-000000'

  return (
    <div className="text-center py-28 px-6 max-w-lg mx-auto page-enter">
      <div className="w-16 h-16 bg-brand rounded-full mx-auto mb-8 flex items-center justify-center">
        <svg className="w-7 h-7 stroke-white" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </div>
      <h2 className="font-display text-4xl mb-3">Order Confirmed</h2>
      <p className="text-[#6B6860] text-sm leading-relaxed mb-6">
        Your order has been received and we are pressing your juices right now.
        Expect delivery by this afternoon for orders placed before 2pm.
      </p>
      <div className="inline-block bg-brand-pale border border-brand rounded-sm px-6 py-3 font-semibold text-brand-dark tracking-wider mb-8 font-display text-xl">
        {orderRef}
      </div>
      <p className="text-[12px] text-[#6B6860] mb-10">
        A confirmation email has been sent to your inbox. Track your delivery via the link in that email.
      </p>
      <Link href="/products"
        className="bg-brand hover:bg-brand-dark text-white px-8 py-3 text-[12px] font-semibold tracking-widest uppercase rounded-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-brand/20">
        Continue Shopping
      </Link>
    </div>
  )
}

export default function SuccessClient() {
  return (
    <Suspense fallback={<div className="py-28 text-center text-[#6B6860]">Loading...</div>}>
      <SuccessInner />
    </Suspense>
  )
}
