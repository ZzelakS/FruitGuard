'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { subscribeProducts, Product } from '@/lib/products'
import ProductCard from './ProductCard'

const CATEGORIES = [
  { key:'all',     label:'All'      },
  { key:'citrus',  label:'Citrus'   },
  { key:'tropical',label:'Tropical' },
  { key:'berry',   label:'Berry'    },
  { key:'green',   label:'Green'    },
  { key:'blend',   label:'Blends'   },
]

function useFadeUp(ref: React.RefObject<HTMLElement>, delay = 0) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.style.transitionDelay = `${delay}ms`; el.classList.add('visible') } },
      { threshold: 0.12 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [ref, delay])
}

function FadeUp({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  useFadeUp(ref as React.RefObject<HTMLElement>, delay)
  return <div ref={ref} className={`fade-up ${className}`}>{children}</div>
}

export default function HomeClient() {
  const { addToCart, openCart } = useCart()
  const [products, setProducts]   = useState<Product[]>([])
  const [filter, setFilter]       = useState('all')
  const [subEmail, setSubEmail]   = useState('')
  const [subDone, setSubDone]     = useState(false)

  useEffect(() => {
    const unsub = subscribeProducts(setProducts)
    return () => unsub()
  }, [])

  const filtered = filter === 'all' ? products : products.filter(p => p.category === filter)
  const featured = filtered.slice(0, 8)

  return (
    <>
      {/* ── HERO ── */}
      <section className="bg-brand-pale px-6 md:px-10 pt-20 pb-16 relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-[480px] h-[480px] rounded-full opacity-25 pointer-events-none bg-brand-mid animate-[pulse_6s_ease-in-out_infinite]" />
        <div className="max-w-2xl relative z-10 page-enter">
          <span className="inline-block text-[11px] font-semibold tracking-[0.12em] uppercase text-brand border-b border-brand pb-1 mb-5">
            100% Organic · Cold-Pressed · No Additives
          </span>
          <h1 className="font-display text-5xl md:text-6xl text-[#111110] leading-tight mb-5">
            Nature&apos;s Finest,<br />
            <em className="text-brand">Pressed Daily</em>
          </h1>
          <p className="text-[#6B6860] text-base leading-relaxed max-w-md mb-8">
            Premium cold-pressed juices crafted from hand-selected organic fruits.
            No preservatives, no shortcuts — just pure, vibrant goodness.
          </p>
          <div className="flex gap-4 flex-wrap">
            <Link href="/products" className="bg-brand hover:bg-brand-dark text-white px-8 py-3 text-[13px] font-semibold tracking-wider uppercase rounded-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-brand/20">
              Shop Juices
            </Link>
            <Link href="/about" className="border border-[#D6D3CE] hover:border-[#111110] px-8 py-3 text-[13px] font-medium tracking-wider uppercase rounded-sm transition-colors">
              Our Process
            </Link>
          </div>
          <div className="flex gap-10 mt-12 pt-7 border-t border-[#D6D3CE]">
            {[['12+','Juice Varieties'],['3,400+','Happy Customers'],['100%','Organic Certified']].map(([n, l]) => (
              <div key={l}>
                <span className="block font-display text-3xl text-brand font-semibold">{n}</span>
                <span className="text-[11px] tracking-wider uppercase text-[#6B6860]">{l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features bar */}
      <div className="bg-[#111110] px-6 py-3 flex gap-8 flex-wrap justify-center overflow-hidden">
        {[['Free delivery','on orders over ₦5,000'],['Certified organic','from farm to bottle'],['Cold-pressed','for maximum nutrition'],['Same-day delivery','orders before 2pm']].map(([bold, rest]) => (
          <span key={bold} className="text-[11px] tracking-wider uppercase text-white/50 whitespace-nowrap">
            <strong className="text-brand-light">{bold}</strong> {rest}
          </span>
        ))}
      </div>

      {/* ── FEATURED PRODUCTS ── */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-20">
        <FadeUp className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <div>
            <span className="block text-[11px] font-semibold tracking-[0.12em] uppercase text-brand mb-2">Featured</span>
            <h2 className="font-display text-4xl text-[#111110]">Cold-Pressed Juices</h2>
            <p className="text-[#6B6860] text-sm mt-1">Pressed within hours of harvest. Bottled the same morning.</p>
          </div>
          <Link href="/products" className="text-[11px] tracking-wider uppercase font-semibold text-brand hover:text-brand-dark border-b border-brand pb-0.5 transition-colors">
            View All →
          </Link>
        </FadeUp>

        <FadeUp delay={100}>
          <div className="flex gap-2 flex-wrap mb-8">
            {CATEGORIES.map(cat => (
              <button key={cat.key} onClick={() => setFilter(cat.key)}
                className={`border rounded-sm px-4 py-1.5 text-[11px] font-semibold tracking-wider uppercase transition-all duration-200 ${
                  filter === cat.key
                    ? 'bg-brand border-brand text-white scale-105'
                    : 'border-[#D6D3CE] text-[#111110] hover:border-brand hover:text-brand'
                }`}>{cat.label}
              </button>
            ))}
          </div>
        </FadeUp>

        <FadeUp delay={160}>
          {products.length === 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px bg-[#D6D3CE] border border-[#D6D3CE]">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white p-7 animate-pulse">
                  <div className="w-full h-36 bg-[#F4F3F0] rounded-sm mb-5" />
                  <div className="h-3 bg-[#F4F3F0] rounded w-1/3 mb-3" />
                  <div className="h-5 bg-[#F4F3F0] rounded w-2/3 mb-2" />
                  <div className="h-3 bg-[#F4F3F0] rounded w-full mb-1" />
                  <div className="h-3 bg-[#F4F3F0] rounded w-4/5" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px bg-[#D6D3CE] border border-[#D6D3CE]">
              {featured.map(p => (
                <ProductCard key={p.id} product={p} onAdd={() => { addToCart(p as any); openCart() }} />
              ))}
            </div>
          )}
        </FadeUp>

        {filtered.length > 8 && (
          <FadeUp delay={200} className="text-center mt-8">
            <Link href="/products" className="inline-block border border-brand text-brand hover:bg-brand hover:text-white px-8 py-3 text-[12px] font-semibold tracking-wider uppercase rounded-sm transition-colors">
              View All {filtered.length} Products
            </Link>
          </FadeUp>
        )}
      </section>

      {/* ── WHY ── */}
      <section className="bg-[#F4F3F0] py-20 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <FadeUp>
            <span className="block text-[11px] font-semibold tracking-[0.12em] uppercase text-brand mb-2">Why FruitGuard</span>
            <h2 className="font-display text-4xl text-[#111110] mb-10">A Commitment to Purity</h2>
          </FadeUp>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#D6D3CE] border border-[#D6D3CE]">
            {[
              ['Organic Sourced','Every fruit is hand-selected from certified organic farms across Nigeria and West Africa.'],
              ['Cold-Pressed','Our hydraulic press retains up to 5× more nutrients than conventional juicing methods.'],
              ['Zero Additives','No sugar. No preservatives. No artificial colors. Just fruit — nothing else, ever.'],
              ['Same-Day Fresh','Pressed in the morning, at your door by afternoon. Freshness you can genuinely taste.'],
              ['Nutrient-Dense','Each blend is formulated by nutritionists to maximize your daily vitamin and mineral intake.'],
              ['Eco Packaging','Biodegradable bottles and plant-based inks. Good for you and good for the planet.'],
            ].map(([title, body], i) => (
              <FadeUp key={title} delay={i * 60}>
                <div className="bg-[#F4F3F0] hover:bg-white transition-colors p-8 h-full">
                  <div className="w-8 h-8 bg-brand rounded-sm mb-5 transition-transform duration-300 hover:scale-110" />
                  <h3 className="font-semibold text-[15px] mb-2">{title}</h3>
                  <p className="text-[13px] text-[#6B6860] leading-relaxed">{body}</p>
                </div>
              </FadeUp>
            ))}
          </div>
          <FadeUp delay={100} className="mt-8 text-center">
            <Link href="/about" className="inline-block text-[11px] tracking-wider uppercase font-semibold text-brand hover:text-brand-dark border-b border-brand pb-0.5 transition-colors">
              Learn More About Us →
            </Link>
          </FadeUp>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-20">
        <FadeUp>
          <span className="block text-[11px] font-semibold tracking-[0.12em] uppercase text-brand mb-2">Reviews</span>
          <h2 className="font-display text-4xl mb-10">Trusted by Thousands</h2>
        </FadeUp>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            ['FruitGuard transformed my morning routine. The Mango Sunrise is exceptional — you taste the freshness the moment it hits your palate.','Adaeze O.','Lagos',5],
            ['I have tried every juice brand in Abuja. Nothing comes close. The Green Detox delivered real energy during my cleanse week.','Emeka N.','Abuja',5],
            ['Delivery was prompt and packaging immaculate. My family is hooked on Berry Blast. We place a standing weekly order.','Funmi A.','Port Harcourt',4],
          ].map(([quote, name, city, stars], i) => (
            <FadeUp key={String(name)} delay={i * 80}>
              <div className="border border-[#D6D3CE] rounded-sm p-7 hover:border-brand-mid hover:shadow-sm transition-all duration-300">
                <div className="text-brand text-sm tracking-wider mb-4">{'★'.repeat(Number(stars))}{'☆'.repeat(5-Number(stars))}</div>
                <p className="font-display text-[17px] text-[#1E1D1B] leading-relaxed italic mb-4">&ldquo;{quote}&rdquo;</p>
                <p className="text-[11px] font-semibold tracking-wider uppercase text-[#6B6860]">{String(name)} — {String(city)}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ── SUBSCRIBE ── */}
      <section className="bg-brand py-20 px-6 text-center">
        <FadeUp>
          <h2 className="font-display text-4xl text-white mb-2">Get 10% Off Your First Order</h2>
          <p className="text-white/75 mb-8 text-sm">Join our newsletter for exclusive deals, new flavors and weekly health insights.</p>
          {subDone ? (
            <p className="text-white font-semibold text-lg animate-[pageEnter_0.4s_ease_forwards]">Thank you! Check your inbox for your discount code.</p>
          ) : (
            <div className="flex max-w-md mx-auto">
              <input type="email" value={subEmail} onChange={e => setSubEmail(e.target.value)}
                placeholder="Your email address"
                className="flex-1 border-none px-4 py-3 text-sm text-[#111110] rounded-l-sm focus:outline-none" />
              <button onClick={() => { if (subEmail.includes('@')) setSubDone(true) }}
                className="bg-[#111110] hover:bg-[#1E1D1B] text-white px-5 py-3 text-[12px] font-semibold tracking-wider uppercase rounded-r-sm transition-colors">
                Subscribe
              </button>
            </div>
          )}
        </FadeUp>
      </section>
    </>
  )
}
