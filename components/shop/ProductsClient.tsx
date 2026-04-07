'use client'

import { useState, useEffect, useMemo } from 'react'
import { subscribeProducts, Product } from '@/lib/products'
import { useCart } from '@/context/CartContext'
import ProductCard from './ProductCard'

const CATEGORIES = [
  { key:'all',      label:'All Juices' },
  { key:'citrus',   label:'Citrus'     },
  { key:'tropical', label:'Tropical'   },
  { key:'berry',    label:'Berry'      },
  { key:'green',    label:'Green'      },
  { key:'blend',    label:'Blends'     },
]

const SORT_OPTIONS = [
  { key:'popular',   label:'Most Popular'       },
  { key:'price-asc', label:'Price: Low to High' },
  { key:'price-desc',label:'Price: High to Low' },
  { key:'rating',    label:'Highest Rated'      },
  { key:'name',      label:'Name A–Z'           },
]

export default function ProductsClient() {
  const { addToCart, openCart } = useCart()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading]   = useState(true)
  const [category, setCategory] = useState('all')
  const [sort, setSort]         = useState('popular')
  const [search, setSearch]     = useState('')
  const [view, setView]         = useState<'grid'|'list'>('grid')
  const [maxPrice, setMaxPrice] = useState(4000)
  const [badges, setBadges]     = useState<string[]>([])

  useEffect(() => {
    const unsub = subscribeProducts(data => { setProducts(data); setLoading(false) })
    return () => unsub()
  }, [])

  const filtered = useMemo(() => {
    let list = [...products]
    if (category !== 'all') list = list.filter(p => p.category === category)
    if (search) list = list.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.desc.toLowerCase().includes(search.toLowerCase()))
    list = list.filter(p => p.price <= maxPrice)
    if (badges.length) list = list.filter(p => badges.includes(p.badge || ''))
    switch (sort) {
      case 'price-asc':  list.sort((a,b) => a.price - b.price); break
      case 'price-desc': list.sort((a,b) => b.price - a.price); break
      case 'rating':     list.sort((a,b) => b.rating - a.rating || b.reviews - a.reviews); break
      case 'name':       list.sort((a,b) => a.name.localeCompare(b.name)); break
      default:           list.sort((a,b) => b.reviews - a.reviews)
    }
    return list
  }, [products, category, sort, search, maxPrice, badges])

  function toggleBadge(b: string) {
    setBadges(prev => prev.includes(b) ? prev.filter(x => x !== b) : [...prev, b])
  }

  function handleAdd(p: Product) { addToCart(p as any); openCart() }

  const SkeletonCard = () => (
    <div className="bg-white p-7 animate-pulse">
      <div className="w-full h-36 bg-[#F4F3F0] rounded-sm mb-5" />
      <div className="h-2.5 bg-[#F4F3F0] rounded w-1/4 mb-3"/>
      <div className="h-5 bg-[#F4F3F0] rounded w-2/3 mb-2"/>
      <div className="h-2.5 bg-[#F4F3F0] rounded w-full mb-1"/>
      <div className="h-2.5 bg-[#F4F3F0] rounded w-4/5 mb-6"/>
      <div className="flex justify-between"><div className="h-6 bg-[#F4F3F0] rounded w-1/4"/><div className="h-8 bg-[#F4F3F0] rounded w-1/4"/></div>
    </div>
  )

  return (
    <>
      {/* Header */}
      <div className="bg-[#F4F3F0] border-b border-[#D6D3CE] px-6 md:px-10 py-12 page-enter">
        <div className="max-w-7xl mx-auto">
          <span className="block text-[11px] font-semibold tracking-[0.12em] uppercase text-brand mb-2">Our Collection</span>
          <h1 className="font-display text-5xl text-[#111110] mb-3">All Juices</h1>
          <p className="text-[#6B6860] text-sm max-w-lg leading-relaxed">
            Every bottle cold-pressed within hours of harvest, sealed the same morning, delivered the same day. No compromises.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-10 py-10">
        <div className="flex gap-10 items-start">

          {/* ── Sidebar ── */}
          <aside className="hidden lg:block w-52 flex-shrink-0 sticky top-24">
            <div className="mb-7">
              <label className="block text-[10px] font-semibold tracking-wider uppercase text-[#6B6860] mb-2">Search</label>
              <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Find a juice..."
                className="w-full border border-[#D6D3CE] focus:border-brand rounded-sm px-3 py-2 text-sm outline-none transition-colors"/>
            </div>

            <div className="mb-7">
              <label className="block text-[10px] font-semibold tracking-wider uppercase text-[#6B6860] mb-3">Category</label>
              {CATEGORIES.map(cat => (
                <button key={cat.key} onClick={() => setCategory(cat.key)}
                  className={`w-full text-left px-3 py-2 rounded-sm text-[13px] font-medium transition-all duration-150 flex justify-between items-center ${
                    category === cat.key ? 'bg-brand-pale text-brand font-semibold' : 'text-[#6B6860] hover:text-[#111110] hover:bg-[#F4F3F0]'
                  }`}>
                  {cat.label}
                  <span className="text-[11px] text-[#D6D3CE]">
                    {cat.key === 'all' ? products.length : products.filter(p => p.category === cat.key).length}
                  </span>
                </button>
              ))}
            </div>

            <div className="mb-7">
              <label className="block text-[10px] font-semibold tracking-wider uppercase text-[#6B6860] mb-3">
                Max Price: <span className="text-brand">₦{maxPrice.toLocaleString()}</span>
              </label>
              <input type="range" min={1500} max={4000} step={100} value={maxPrice} onChange={e => setMaxPrice(Number(e.target.value))}
                className="w-full accent-orange-DEFAULT" />
              <div className="flex justify-between text-[10px] text-[#D6D3CE] mt-1"><span>₦1,500</span><span>₦4,000</span></div>
            </div>

            <div className="mb-7">
              <label className="block text-[10px] font-semibold tracking-wider uppercase text-[#6B6860] mb-3">Tags</label>
              {[['hot','Popular'],['new','New Arrivals'],['sale','On Sale']].map(([val, label]) => (
                <label key={val} className="flex items-center gap-2.5 mb-2 cursor-pointer group">
                  <span onClick={() => toggleBadge(val)} className={`w-4 h-4 border rounded-sm flex-shrink-0 flex items-center justify-center transition-all cursor-pointer ${badges.includes(val) ? 'bg-brand border-brand' : 'border-[#D6D3CE] group-hover:border-brand-light'}`}>
                    {badges.includes(val) && <span className="text-white text-[10px] font-bold">✓</span>}
                  </span>
                  <span className="text-[13px] text-[#6B6860] group-hover:text-[#111110] transition-colors">{label}</span>
                </label>
              ))}
            </div>

            {(category !== 'all' || search || maxPrice < 4000 || badges.length > 0) && (
              <button onClick={() => { setCategory('all'); setSearch(''); setMaxPrice(4000); setBadges([]) }}
                className="text-[11px] tracking-wider uppercase text-brand hover:text-brand-dark font-semibold border-b border-brand pb-0.5 transition-colors">
                Clear Filters
              </button>
            )}
          </aside>

          {/* ── Product area ── */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
              <p className="text-[13px] text-[#6B6860]">
                <span className="font-semibold text-[#111110]">{filtered.length}</span> products
              </p>
              <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..."
                className="lg:hidden border border-[#D6D3CE] focus:border-brand rounded-sm px-3 py-2 text-sm outline-none w-40"/>
              <div className="flex items-center gap-3">
                <select value={sort} onChange={e => setSort(e.target.value)}
                  className="border border-[#D6D3CE] focus:border-brand rounded-sm px-3 py-2 text-[12px] outline-none bg-white appearance-none cursor-pointer pr-6">
                  {SORT_OPTIONS.map(o => <option key={o.key} value={o.key}>{o.label}</option>)}
                </select>
                <div className="hidden md:flex border border-[#D6D3CE] rounded-sm overflow-hidden">
                  {(['grid','list'] as const).map(v => (
                    <button key={v} onClick={() => setView(v)}
                      className={`w-9 h-9 flex items-center justify-center transition-colors ${view === v ? 'bg-brand text-white' : 'text-[#6B6860] hover:bg-[#F4F3F0]'}`}>
                      {v === 'grid'
                        ? <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 16 16"><rect x="0" y="0" width="6" height="6" rx="1"/><rect x="10" y="0" width="6" height="6" rx="1"/><rect x="0" y="10" width="6" height="6" rx="1"/><rect x="10" y="10" width="6" height="6" rx="1"/></svg>
                        : <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 16 16"><line x1="0" y1="4" x2="16" y2="4"/><line x1="0" y1="9" x2="16" y2="9"/><line x1="0" y1="14" x2="16" y2="14"/></svg>}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile category pills */}
            <div className="flex gap-2 flex-wrap mb-6 lg:hidden">
              {CATEGORIES.map(cat => (
                <button key={cat.key} onClick={() => setCategory(cat.key)}
                  className={`border rounded-sm px-3 py-1.5 text-[11px] font-semibold tracking-wider uppercase transition-all ${
                    category === cat.key ? 'bg-brand border-brand text-white scale-105' : 'border-[#D6D3CE] text-[#111110] hover:border-brand hover:text-brand'
                  }`}>{cat.label}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-px bg-[#D6D3CE] border border-[#D6D3CE]">
                {Array.from({ length: 9 }).map((_,i) => <SkeletonCard key={i}/>)}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20 text-[#6B6860]">
                <p className="font-display text-3xl mb-3 text-[#D6D3CE]">No results</p>
                <p className="text-sm">Try adjusting your filters or search term.</p>
                <button onClick={() => { setCategory('all'); setSearch(''); setMaxPrice(4000); setBadges([]) }}
                  className="mt-4 text-[11px] tracking-wider uppercase text-brand font-semibold border-b border-brand pb-0.5">
                  Clear Filters
                </button>
              </div>
            ) : view === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-px bg-[#D6D3CE] border border-[#D6D3CE]">
                {filtered.map(p => <ProductCard key={p.id} product={p} onAdd={() => handleAdd(p)} showFull />)}
              </div>
            ) : (
              <div className="border border-[#D6D3CE] divide-y divide-[#D6D3CE]">
                {filtered.map(p => (
                  <div key={p.id} className="bg-white hover:bg-brand-pale transition-colors p-6 flex gap-6 items-start">
                    <div className="w-20 h-20 bg-[#F4F3F0] rounded-sm flex-shrink-0 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full border-4 border-[#d4efbb] bg-brand-pale"/>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <span className="text-[10px] font-semibold tracking-wider uppercase text-brand">{p.category}</span>
                          <h3 className="font-display text-xl font-semibold mt-0.5 mb-1">{p.name}</h3>
                          <p className="text-[12px] text-[#6B6860] leading-relaxed mb-2">{p.desc}</p>
                          <div className="text-brand text-[12px]">{'★'.repeat(p.rating)}{'☆'.repeat(5-p.rating)}<span className="text-[#6B6860] text-[11px] ml-1">({p.reviews})</span></div>
                        </div>
                        <div className="flex-shrink-0 text-right">
                          <p className="font-display text-2xl font-semibold mb-3">₦{p.price.toLocaleString()}</p>
                          <button onClick={() => handleAdd(p)}
                            className="bg-brand hover:bg-brand-dark text-white text-[11px] font-semibold tracking-wider uppercase px-4 py-2 rounded-sm transition-colors">
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
