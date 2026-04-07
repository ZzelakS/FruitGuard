'use client'

import { useState } from 'react'
import { Order } from '@/lib/data'

const STATUS_STYLES: Record<string, string> = {
  pending:    'bg-amber-50 text-amber-700 border-amber-200',
  processing: 'bg-blue-50 text-blue-700 border-blue-200',
  delivered:  'bg-green-50 text-green-700 border-green-200',
  cancelled:  'bg-red-50 text-red-600 border-red-200',
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-block text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-sm border ${STATUS_STYLES[status] || ''}`}>
      {status}
    </span>
  )
}

export default function OrdersTable({ orders }: { orders: Order[] }) {
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Order | null>(null)

  const filtered = orders.filter(o => {
    const matchStatus = filter === 'all' || o.status === filter
    const matchSearch = !search ||
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase()) ||
      o.email.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  return (
    <>
      {/* Filters */}
      <div className="bg-white border border-[#D6D3CE] rounded-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 border-b border-[#F4F3F0]">
          <div className="flex gap-1 flex-wrap">
            {['all','pending','processing','delivered','cancelled'].map(s => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-3 py-1.5 text-[11px] font-semibold tracking-wider uppercase rounded-sm transition-colors capitalize ${
                  filter === s
                    ? 'bg-brand text-white'
                    : 'text-[#6B6860] hover:text-[#111110]'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="Search orders..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border border-[#D6D3CE] focus:border-brand rounded-sm px-3 py-2 text-sm outline-none transition-colors w-60"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F4F3F0]">
              <tr>
                {['Order ID','Customer','Date','Items','Total','Payment','Status',''].map(h => (
                  <th key={h} className="text-left text-[10px] font-semibold tracking-wider uppercase text-[#6B6860] px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4F3F0]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-[13px] text-[#6B6860]">No orders found.</td>
                </tr>
              ) : filtered.map(o => (
                <tr key={o.id} className="hover:bg-[#FDFCFA] transition-colors">
                  <td className="px-5 py-4 text-[13px] font-semibold text-brand">{o.id}</td>
                  <td className="px-5 py-4">
                    <p className="text-[13px] font-medium">{o.customer}</p>
                    <p className="text-[11px] text-[#6B6860]">{o.email}</p>
                  </td>
                  <td className="px-5 py-4 text-[12px] text-[#6B6860] whitespace-nowrap">
                    {new Date(o.createdAt).toLocaleDateString('en-NG', { day:'numeric', month:'short', year:'numeric' })}
                  </td>
                  <td className="px-5 py-4 text-[13px]">{o.items.reduce((s, i) => s + i.qty, 0)}</td>
                  <td className="px-5 py-4 text-[13px] font-semibold">₦{o.total.toLocaleString()}</td>
                  <td className="px-5 py-4 text-[12px] text-[#6B6860]">{o.paymentMethod}</td>
                  <td className="px-5 py-4"><StatusBadge status={o.status} /></td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => setSelected(o)}
                      className="text-[11px] tracking-wider uppercase text-brand font-semibold border border-brand px-3 py-1.5 rounded-sm hover:bg-brand hover:text-white transition-colors"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-3 border-t border-[#F4F3F0] text-[12px] text-[#6B6860]">
          Showing {filtered.length} of {orders.length} orders
        </div>
      </div>

      {/* Order Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-sm border border-[#D6D3CE] w-full max-w-lg shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#D6D3CE]">
              <div>
                <h2 className="font-display text-2xl">{selected.id}</h2>
                <p className="text-[11px] text-[#6B6860] mt-0.5">
                  {new Date(selected.createdAt).toLocaleString('en-NG', { dateStyle: 'medium', timeStyle: 'short' })}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={selected.status} />
                <button onClick={() => setSelected(null)} className="border border-[#D6D3CE] rounded-sm w-8 h-8 flex items-center justify-center text-sm hover:border-[#111110] transition-colors">✕</button>
              </div>
            </div>

            <div className="px-6 py-5 space-y-5">
              <div>
                <p className="text-[10px] font-semibold tracking-wider uppercase text-[#6B6860] mb-2">Customer</p>
                <p className="text-[14px] font-semibold">{selected.customer}</p>
                <p className="text-[13px] text-[#6B6860]">{selected.email}</p>
                <p className="text-[13px] text-[#6B6860]">{selected.phone}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold tracking-wider uppercase text-[#6B6860] mb-2">Delivery Address</p>
                <p className="text-[13px]">{selected.address}, {selected.state}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold tracking-wider uppercase text-[#6B6860] mb-2">Items</p>
                {selected.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-[13px] py-1.5 border-b border-[#F4F3F0] last:border-0">
                    <span>{item.name} <span className="text-[#6B6860]">×{item.qty}</span></span>
                    <span className="font-medium">₦{(item.price * item.qty).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="bg-[#F4F3F0] rounded-sm px-4 py-3 space-y-1.5">
                <div className="flex justify-between text-[12px] text-[#6B6860]">
                  <span>Subtotal</span><span>₦{selected.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[12px] text-[#6B6860]">
                  <span>Delivery</span><span>{selected.delivery === 0 ? 'Free' : `₦${selected.delivery.toLocaleString()}`}</span>
                </div>
                <div className="flex justify-between text-[14px] font-semibold pt-1 border-t border-[#D6D3CE]">
                  <span>Total</span><span className="text-brand">₦{selected.total.toLocaleString()}</span>
                </div>
              </div>
              <div className="flex justify-between text-[12px] text-[#6B6860]">
                <span>Payment Method</span><span className="font-medium text-[#111110]">{selected.paymentMethod}</span>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-[#D6D3CE] flex gap-2 justify-end">
              <button onClick={() => setSelected(null)} className="border border-[#D6D3CE] hover:border-[#111110] px-4 py-2 text-[11px] font-semibold tracking-wider uppercase rounded-sm transition-colors">Close</button>
              <button className="bg-brand hover:bg-brand-dark text-white px-4 py-2 text-[11px] font-semibold tracking-wider uppercase rounded-sm transition-colors">Update Status</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
