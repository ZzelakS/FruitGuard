'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Product } from '@/lib/products'

const CAT_LABELS: Record<string, string> = {
  citrus: 'Citrus', tropical: 'Tropical', berry: 'Berry', green: 'Green', blend: 'Blend',
}

interface Props {
  product: Product
  onAdd: () => void
  showFull?: boolean
}

export default function ProductCard({ product: p, onAdd, showFull = false }: Props) {
  const [wished,  setWished]  = useState(false)
  const [adding,  setAdding]  = useState(false)
  const [imgErr,  setImgErr]  = useState(false)

  function handleAdd() {
    setAdding(true)
    onAdd()
    setTimeout(() => setAdding(false), 700)
  }

  const hasImage = p.imageUrl && p.imageUrl.trim() !== '' && !imgErr

  return (
    <div className="bg-white p-0 flex flex-col group border-r border-b border-[#F4F3F0]">
      {/* Image */}
      <div className="w-full h-52 bg-[#F4F3F0] relative overflow-hidden flex-shrink-0">
        {hasImage ? (
          <Image
            src={p.imageUrl!}
            alt={p.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgErr(true)}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-brand-pale">
            <svg className="w-10 h-10 text-brand-mid" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
            <span className="text-[10px] tracking-wider uppercase text-brand-light">No image</span>
          </div>
        )}

        {/* Badge — always visible */}
        {p.badge && (
          <span className={`absolute top-3 left-3 text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-sm ${
            p.badge === 'hot' ? 'bg-[#111110] text-brand-light' :
            p.badge === 'new' ? 'bg-brand text-white' :
                                'bg-white text-brand-dark border border-brand'
          }`}>
            {p.badge === 'hot' ? 'Popular' : p.badge === 'new' ? 'New' : 'Sale'}
          </span>
        )}

        {/* Wishlist — always visible, top right */}
        <button
          onClick={e => { e.stopPropagation(); setWished(w => !w) }}
          className={`absolute top-3 right-3 w-8 h-8 rounded-sm flex items-center justify-center text-sm border transition-all duration-200 ${
            wished
              ? 'bg-brand border-brand text-white shadow-sm'
              : 'bg-white/90 border-[#D6D3CE] text-[#6B6860] hover:border-brand hover:text-brand'
          }`}
          aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          {wished ? '♥' : '♡'}
        </button>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <span className="text-[10px] font-semibold tracking-[0.1em] uppercase text-brand mb-1">
          {CAT_LABELS[p.category] || p.category}
        </span>
        <h3 className="font-display text-[1.15rem] font-semibold mb-1 leading-snug">{p.name}</h3>
        <p className="text-[12px] text-[#6B6860] leading-relaxed mb-3 flex-1">{p.desc}</p>

        {showFull && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {['Cold-Pressed', 'Organic', 'No Sugar', 'No Additives'].map(tag => (
              <span key={tag} className="text-[10px] tracking-wider uppercase border border-[#E8E8E5] text-[#6B6860] px-2 py-0.5 rounded-sm">
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="text-brand text-[12px] tracking-wide mb-4">
          {'★'.repeat(p.rating)}{'☆'.repeat(5 - p.rating)}
          <span className="text-[#6B6860] text-[11px] ml-1">({p.reviews})</span>
        </div>

        {/* Price + Add to Cart — always visible */}
        <div className="flex items-center justify-between border-t border-[#F4F3F0] pt-4 mt-auto">
          <div className="font-display text-xl font-semibold leading-none">
            ₦{p.price.toLocaleString()}
            {p.badge === 'sale' && (
              <span className="font-sans text-sm text-[#C8C8C8] line-through ml-2 font-normal">
                ₦{Math.round(p.price * 1.2).toLocaleString()}
              </span>
            )}
          </div>
          <button
            onClick={handleAdd}
            className={`text-white text-[11px] font-semibold tracking-wider uppercase px-4 py-2.5 rounded-sm transition-all duration-200 min-w-[90px] text-center ${
              adding
                ? 'bg-brand-dark scale-95'
                : 'bg-brand hover:bg-brand-dark'
            }`}
          >
            {adding ? '✓ Added' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  )
}
