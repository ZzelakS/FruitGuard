'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import {
  subscribeProducts, addProduct, updateProduct,
  deleteProduct, SEED_PRODUCTS, Product
} from '@/lib/products'
import { uploadProductImage, deleteProductImage } from '@/lib/storage'

const CAT_LABELS: Record<string, string> = {
  citrus: 'Citrus', tropical: 'Tropical', berry: 'Berry', green: 'Green', blend: 'Blend',
}

const EMPTY: Omit<Product, 'id' | 'createdAt'> = {
  name: '', desc: '', price: 0, category: 'citrus',
  badge: '', rating: 5, reviews: 0, stock: 0, imageUrl: '',
}

function StockBar({ stock }: { stock: number }) {
  const pct   = Math.min((stock / 70) * 100, 100)
  const color = stock === 0 ? 'bg-red-400' : stock < 20 ? 'bg-amber-400' : 'bg-brand'
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-[#F4F3F0] rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className={`text-[12px] font-semibold w-7 text-right ${
        stock === 0 ? 'text-red-500' : stock < 20 ? 'text-amber-600' : 'text-[#111110]'
      }`}>{stock}</span>
    </div>
  )
}

export default function ProductsTable({ initialProducts }: { initialProducts: Product[] }) {
  const [products,   setProducts]   = useState<Product[]>(initialProducts)
  const [search,     setSearch]     = useState('')
  const [catFilter,  setCatFilter]  = useState('all')
  const [showModal,  setShowModal]  = useState(false)
  const [editing,    setEditing]    = useState<Product | null>(null)
  const [form,       setForm]       = useState<Omit<Product, 'id' | 'createdAt'>>(EMPTY)
  const [saving,     setSaving]     = useState(false)
  const [deleting,   setDeleting]   = useState<string | null>(null)
  const [seeding,    setSeeding]    = useState(false)
  const [toast,      setToast]      = useState('')
  const [toastType,  setToastType]  = useState<'ok' | 'err'>('ok')

  // Image upload state
  const [localFile,      setLocalFile]      = useState<File | null>(null)
  const [localPreview,   setLocalPreview]   = useState<string>('')
  const [uploadProgress, setUploadProgress] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const unsub = subscribeProducts(setProducts)
    return () => unsub()
  }, [])

  // Clean up object URLs to avoid memory leaks
  useEffect(() => {
    return () => { if (localPreview.startsWith('blob:')) URL.revokeObjectURL(localPreview) }
  }, [localPreview])

  function toast_(msg: string, type: 'ok' | 'err' = 'ok') {
    setToast(msg); setToastType(type)
    setTimeout(() => setToast(''), 3500)
  }

  function openAdd() {
    setEditing(null)
    setForm(EMPTY)
    setLocalFile(null)
    setLocalPreview('')
    setUploadProgress(null)
    setShowModal(true)
  }

  function openEdit(p: Product) {
    setEditing(p)
    setForm({
      name: p.name, desc: p.desc, price: p.price, category: p.category,
      badge: p.badge || '', rating: p.rating, reviews: p.reviews,
      stock: p.stock, imageUrl: p.imageUrl || '',
    })
    setLocalFile(null)
    setLocalPreview(p.imageUrl || '')
    setUploadProgress(null)
    setShowModal(true)
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) { toast_('Please select an image file.', 'err'); return }
    if (file.size > 5 * 1024 * 1024) { toast_('Image must be under 5 MB.', 'err'); return }
    if (localPreview.startsWith('blob:')) URL.revokeObjectURL(localPreview)
    setLocalFile(file)
    setLocalPreview(URL.createObjectURL(file))
  }

  function clearImage() {
    if (localPreview.startsWith('blob:')) URL.revokeObjectURL(localPreview)
    setLocalFile(null)
    setLocalPreview('')
    setForm(f => ({ ...f, imageUrl: '' }))
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  async function handleSave() {
    if (!form.name.trim() || !form.desc.trim() || form.price <= 0) {
      toast_('Please fill in name, description and price.', 'err')
      return
    }
    setSaving(true)
    try {
      let imageUrl = form.imageUrl || ''

      // Upload new file if one was selected
      if (localFile) {
        setUploadProgress(0)
        // If replacing an existing image, delete the old one
        if (editing?.imageUrl) {
          await deleteProductImage(editing.imageUrl).catch(() => {})
        }
        imageUrl = await uploadProductImage(localFile, pct => setUploadProgress(pct))
        setUploadProgress(null)
      }

      const payload = { ...form, imageUrl }

      if (editing?.id) {
        await updateProduct(editing.id, payload)
        toast_('Product updated.')
      } else {
        await addProduct(payload)
        toast_('Product added.')
      }
      setShowModal(false)
    } catch (err) {
      console.error(err)
      toast_('Error saving. Check Firebase config.', 'err')
      setUploadProgress(null)
    }
    setSaving(false)
  }

  async function handleDelete(id: string, name: string, imageUrl?: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return
    setDeleting(id)
    try {
      if (imageUrl) await deleteProductImage(imageUrl).catch(() => {})
      await deleteProduct(id)
      toast_(`"${name}" deleted.`)
    } catch { toast_('Error deleting product.', 'err') }
    setDeleting(null)
  }

  async function handleSeed() {
    if (!confirm(`Add ${SEED_PRODUCTS.length} sample products to Firestore?`)) return
    setSeeding(true)
    try {
      for (const p of SEED_PRODUCTS) await addProduct(p)
      toast_(`${SEED_PRODUCTS.length} products seeded.`)
    } catch { toast_('Error seeding.', 'err') }
    setSeeding(false)
  }

  const filtered = products.filter(p => {
    const matchCat = catFilter === 'all' || p.category === catFilter
    const matchS   = !search || p.name.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchS
  })

  const currentPreview = localPreview || form.imageUrl || ''

  return (
    <>
      {/* Toast */}
      <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-2 px-5 py-3 rounded-sm text-sm font-medium shadow-lg transition-all duration-300 whitespace-nowrap border-l-4 ${
        toastType === 'err'
          ? 'bg-white text-red-700 border-red-500'
          : 'bg-[#111110] text-white border-brand'
      } ${toast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
        {toastType === 'err' ? '⚠ ' : '✓ '}{toast}
      </div>

      <div className="bg-white border border-[#D6D3CE] rounded-sm">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 border-b border-[#F4F3F0]">
          <div className="flex gap-1 flex-wrap">
            {['all', 'citrus', 'tropical', 'berry', 'green', 'blend'].map(cat => (
              <button key={cat} onClick={() => setCatFilter(cat)}
                className={`px-3 py-1.5 text-[11px] font-semibold tracking-wider uppercase rounded-sm transition-colors ${
                  catFilter === cat ? 'bg-brand text-white' : 'text-[#6B6860] hover:text-[#111110]'
                }`}>
                {cat === 'all' ? 'All' : CAT_LABELS[cat]}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text" placeholder="Search products…" value={search}
              onChange={e => setSearch(e.target.value)}
              className="border border-[#D6D3CE] focus:border-brand rounded-sm px-3 py-2 text-sm outline-none transition-colors w-48"
            />
            {products.length === 0 && (
              <button onClick={handleSeed} disabled={seeding}
                className="border border-[#D6D3CE] text-[11px] font-semibold tracking-wider uppercase px-3 py-2 rounded-sm text-[#6B6860] hover:border-brand hover:text-brand transition-colors disabled:opacity-50">
                {seeding ? 'Seeding…' : 'Seed Data'}
              </button>
            )}
            <button onClick={openAdd}
              className="bg-brand hover:bg-brand-dark text-white text-[11px] font-semibold tracking-wider uppercase px-4 py-2 rounded-sm transition-colors">
              + Add Product
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F4F3F0]">
              <tr>
                {['Image', 'Product', 'Category', 'Price', 'Stock', 'Badge', 'Actions'].map(h => (
                  <th key={h} className="text-left text-[10px] font-semibold tracking-wider uppercase text-[#6B6860] px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4F3F0]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-14 text-[13px] text-[#6B6860]">
                    {products.length === 0
                      ? 'No products yet — click "+ Add Product" or "Seed Data" to get started.'
                      : 'No products match your search.'}
                  </td>
                </tr>
              ) : filtered.map(p => (
                <tr key={p.id} className="hover:bg-[#FDFCFA] transition-colors">
                  {/* Thumb */}
                  <td className="px-4 py-3">
                    <div className="w-12 h-12 rounded-sm overflow-hidden bg-[#F4F3F0] relative flex-shrink-0">
                      {p.imageUrl ? (
                        <Image src={p.imageUrl} alt={p.name} fill className="object-cover" sizes="48px" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg className="w-5 h-5 text-[#D6D3CE]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                            <rect x="3" y="3" width="18" height="18" rx="2"/>
                            <circle cx="8.5" cy="8.5" r="1.5"/>
                            <polyline points="21 15 16 10 5 21"/>
                          </svg>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-[13px] font-semibold">{p.name}</p>
                    <p className="text-[11px] text-[#6B6860] line-clamp-1 max-w-[200px]">{p.desc}</p>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-[10px] font-semibold tracking-wider uppercase text-brand bg-brand-pale px-2 py-0.5 rounded-sm">
                      {CAT_LABELS[p.category]}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-[13px] font-semibold">₦{p.price.toLocaleString()}</td>
                  <td className="px-4 py-4 w-36"><StockBar stock={p.stock} /></td>
                  <td className="px-4 py-4">
                    {p.badge ? (
                      <span className={`text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-sm border ${
                        p.badge === 'hot' ? 'bg-[#111110] text-brand-light border-[#111110]' :
                        p.badge === 'new' ? 'bg-brand text-white border-brand' :
                                            'bg-brand-pale text-brand-dark border-brand'
                      }`}>
                        {p.badge === 'hot' ? 'Popular' : p.badge === 'new' ? 'New' : 'Sale'}
                      </span>
                    ) : <span className="text-[#D6D3CE] text-[12px]">—</span>}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(p)}
                        className="text-[11px] font-semibold tracking-wider uppercase text-white bg-brand hover:bg-brand-dark px-3 py-1.5 rounded-sm transition-colors">
                        Edit
                      </button>
                      <button
                        onClick={() => p.id && handleDelete(p.id, p.name, p.imageUrl)}
                        disabled={deleting === p.id}
                        className="text-[11px] font-semibold tracking-wider uppercase text-white bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-sm transition-colors disabled:opacity-40">
                        {deleting === p.id ? '…' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-3 border-t border-[#F4F3F0] text-[12px] text-[#6B6860]">
          {filtered.length} of {products.length} products · live from Firestore
        </div>
      </div>

      {/* ── ADD / EDIT MODAL ── */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-sm border border-[#D6D3CE] w-full max-w-xl shadow-2xl my-4"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#D6D3CE]">
              <div>
                <h2 className="font-display text-2xl">{editing ? 'Edit Product' : 'Add New Product'}</h2>
                <p className="text-[12px] text-[#6B6860] mt-0.5">
                  {editing ? 'Update product details and image.' : 'Fill in the details below. Image upload is optional.'}
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 border border-[#D6D3CE] rounded-sm flex items-center justify-center text-sm text-[#6B6860] hover:border-[#111110] hover:text-[#111110] transition-colors">
                ✕
              </button>
            </div>

            {/* Modal body */}
            <div className="px-6 py-5 space-y-5 max-h-[70vh] overflow-y-auto">

              {/* ── IMAGE UPLOAD ── */}
              <div>
                <label className="block text-[10px] font-semibold tracking-wider uppercase text-[#6B6860] mb-2">
                  Product Image
                  <span className="ml-1 font-normal normal-case tracking-normal text-[#6B6860]">(optional · max 5 MB)</span>
                </label>

                {/* Drop zone / preview */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative w-full rounded-sm border-2 border-dashed cursor-pointer transition-colors ${
                    currentPreview
                      ? 'border-brand-mid h-44'
                      : 'border-[#D6D3CE] hover:border-brand h-36 flex flex-col items-center justify-center gap-2'
                  }`}
                >
                  {currentPreview ? (
                    <>
                      <Image
                        src={currentPreview}
                        alt="Preview"
                        fill
                        className="object-cover rounded-sm"
                        sizes="480px"
                        unoptimized={currentPreview.startsWith('blob:')}
                      />
                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center rounded-sm opacity-0 hover:opacity-100 transition-opacity">
                        <span className="text-white text-[12px] font-semibold tracking-wider uppercase bg-black/50 px-3 py-1.5 rounded-sm">
                          Change Image
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <svg className="w-8 h-8 text-[#D6D3CE]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                        <polyline points="17 8 12 3 7 8"/>
                        <line x1="12" y1="3" x2="12" y2="15"/>
                      </svg>
                      <p className="text-[13px] font-medium text-[#6B6860]">Click to upload image</p>
                      <p className="text-[11px] text-[#D6D3CE]">JPG, PNG, WebP — max 5 MB</p>
                    </>
                  )}
                </div>

                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {/* Upload progress bar */}
                {uploadProgress !== null && (
                  <div className="mt-2">
                    <div className="flex justify-between text-[11px] text-[#6B6860] mb-1">
                      <span>Uploading…</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#F4F3F0] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-brand rounded-full transition-all duration-200"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* File info + clear button */}
                {localFile && (
                  <div className="mt-2 flex items-center justify-between bg-brand-pale border border-brand-mid rounded-sm px-3 py-2">
                    <div className="min-w-0">
                      <p className="text-[12px] font-medium text-brand-dark truncate">{localFile.name}</p>
                      <p className="text-[11px] text-[#6B6860]">{(localFile.size / 1024).toFixed(0)} KB · will upload on save</p>
                    </div>
                    <button
                      type="button"
                      onClick={e => { e.stopPropagation(); clearImage() }}
                      className="ml-3 text-[11px] text-[#6B6860] hover:text-red-500 transition-colors font-medium flex-shrink-0">
                      Remove
                    </button>
                  </div>
                )}

                {/* Existing image with remove option */}
                {!localFile && form.imageUrl && (
                  <div className="mt-2 flex items-center justify-between bg-[#F4F3F0] rounded-sm px-3 py-2">
                    <p className="text-[12px] text-[#6B6860] truncate">Current image saved</p>
                    <button
                      type="button"
                      onClick={e => { e.stopPropagation(); clearImage() }}
                      className="ml-3 text-[11px] text-[#6B6860] hover:text-red-500 transition-colors font-medium flex-shrink-0">
                      Remove
                    </button>
                  </div>
                )}
              </div>

              {/* ── NAME ── */}
              <div>
                <label className="block text-[10px] font-semibold tracking-wider uppercase text-[#6B6860] mb-1.5">
                  Product Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Mango Sunrise"
                  className="w-full border border-[#D6D3CE] focus:border-brand rounded-sm px-3 py-2.5 text-sm outline-none transition-colors"
                />
              </div>

              {/* ── DESCRIPTION ── */}
              <div>
                <label className="block text-[10px] font-semibold tracking-wider uppercase text-[#6B6860] mb-1.5">
                  Description <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={form.desc}
                  onChange={e => setForm(f => ({ ...f, desc: e.target.value }))}
                  placeholder="Brief description of the juice"
                  rows={2}
                  className="w-full border border-[#D6D3CE] focus:border-brand rounded-sm px-3 py-2.5 text-sm outline-none transition-colors resize-none"
                />
              </div>

              {/* ── PRICE + STOCK ── */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-semibold tracking-wider uppercase text-[#6B6860] mb-1.5">
                    Price (₦) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number" min={0}
                    value={form.price}
                    onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))}
                    className="w-full border border-[#D6D3CE] focus:border-brand rounded-sm px-3 py-2.5 text-sm outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold tracking-wider uppercase text-[#6B6860] mb-1.5">Stock Units</label>
                  <input
                    type="number" min={0}
                    value={form.stock}
                    onChange={e => setForm(f => ({ ...f, stock: Number(e.target.value) }))}
                    className="w-full border border-[#D6D3CE] focus:border-brand rounded-sm px-3 py-2.5 text-sm outline-none transition-colors"
                  />
                </div>
              </div>

              {/* ── CATEGORY + BADGE ── */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-semibold tracking-wider uppercase text-[#6B6860] mb-1.5">Category</label>
                  <select
                    value={form.category}
                    onChange={e => setForm(f => ({ ...f, category: e.target.value as Product['category'] }))}
                    className="w-full border border-[#D6D3CE] focus:border-brand rounded-sm px-3 py-2.5 text-sm outline-none bg-white"
                  >
                    {['citrus', 'tropical', 'berry', 'green', 'blend'].map(c => (
                      <option key={c} value={c}>{CAT_LABELS[c]}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold tracking-wider uppercase text-[#6B6860] mb-1.5">Badge</label>
                  <select
                    value={form.badge}
                    onChange={e => setForm(f => ({ ...f, badge: e.target.value as Product['badge'] }))}
                    className="w-full border border-[#D6D3CE] focus:border-brand rounded-sm px-3 py-2.5 text-sm outline-none bg-white"
                  >
                    <option value="">None</option>
                    <option value="new">New</option>
                    <option value="hot">Popular</option>
                    <option value="sale">Sale</option>
                  </select>
                </div>
              </div>

              {/* ── RATING + REVIEWS ── */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-semibold tracking-wider uppercase text-[#6B6860] mb-1.5">Rating (1–5)</label>
                  <input
                    type="number" min={1} max={5}
                    value={form.rating}
                    onChange={e => setForm(f => ({ ...f, rating: Number(e.target.value) }))}
                    className="w-full border border-[#D6D3CE] focus:border-brand rounded-sm px-3 py-2.5 text-sm outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold tracking-wider uppercase text-[#6B6860] mb-1.5">Review Count</label>
                  <input
                    type="number" min={0}
                    value={form.reviews}
                    onChange={e => setForm(f => ({ ...f, reviews: Number(e.target.value) }))}
                    className="w-full border border-[#D6D3CE] focus:border-brand rounded-sm px-3 py-2.5 text-sm outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Modal footer */}
            <div className="px-6 py-4 border-t border-[#D6D3CE] flex items-center justify-between">
              <p className="text-[11px] text-[#6B6860]">
                <span className="text-red-400">*</span> required fields
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="border border-[#D6D3CE] hover:border-[#111110] px-4 py-2 text-[11px] font-semibold tracking-wider uppercase rounded-sm transition-colors text-[#6B6860]">
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-brand hover:bg-brand-dark disabled:opacity-60 disabled:cursor-not-allowed text-white px-6 py-2 text-[11px] font-semibold tracking-wider uppercase rounded-sm transition-colors flex items-center gap-2">
                  {saving ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {uploadProgress !== null ? `Uploading ${uploadProgress}%` : 'Saving…'}
                    </>
                  ) : editing ? 'Save Changes' : 'Add Product'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
