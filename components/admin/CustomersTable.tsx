'use client'

import { useState } from 'react'
import { Customer } from '@/lib/data'

export default function CustomersTable({ customers }: { customers: Customer[] }) {
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<'totalSpent' | 'orders' | 'joinedAt'>('totalSpent')

  const filtered = customers
    .filter(c =>
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.state.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sort === 'totalSpent') return b.totalSpent - a.totalSpent
      if (sort === 'orders') return b.orders - a.orders
      return new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime()
    })

  function initials(name: string) {
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
  }

  const tierColor = (spent: number) =>
    spent >= 100000 ? 'text-amber-600 bg-amber-50 border-amber-200' :
    spent >= 50000  ? 'text-brand bg-brand-pale border-brand-mid' :
                     'text-[#6B6860] bg-[#F4F3F0] border-[#D6D3CE]'

  const tierLabel = (spent: number) =>
    spent >= 100000 ? 'Gold' : spent >= 50000 ? 'Silver' : 'Standard'

  return (
    <div className="bg-white border border-[#D6D3CE] rounded-sm">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 border-b border-[#F4F3F0]">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold tracking-wider uppercase text-[#6B6860]">Sort by:</span>
          {[['totalSpent','Highest Spend'],['orders','Most Orders'],['joinedAt','Newest']].map(([val, label]) => (
            <button
              key={val}
              onClick={() => setSort(val as typeof sort)}
              className={`px-3 py-1.5 text-[11px] font-semibold tracking-wider uppercase rounded-sm transition-colors ${
                sort === val ? 'bg-brand text-white' : 'text-[#6B6860] hover:text-[#111110]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Search customers..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border border-[#D6D3CE] focus:border-brand rounded-sm px-3 py-2 text-sm outline-none transition-colors w-52"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#F4F3F0]">
            <tr>
              {['Customer','Contact','State','Orders','Total Spent','Tier','Joined',''].map(h => (
                <th key={h} className="text-left text-[10px] font-semibold tracking-wider uppercase text-[#6B6860] px-5 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F4F3F0]">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-12 text-[13px] text-[#6B6860]">No customers found.</td>
              </tr>
            ) : filtered.map(c => (
              <tr key={c.id} className="hover:bg-[#FDFCFA] transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-brand-pale border border-brand-mid flex items-center justify-center text-[12px] font-bold text-brand-dark flex-shrink-0">
                      {initials(c.name)}
                    </div>
                    <span className="text-[13px] font-semibold">{c.name}</span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <p className="text-[12px] text-[#6B6860]">{c.email}</p>
                  <p className="text-[12px] text-[#6B6860]">{c.phone}</p>
                </td>
                <td className="px-5 py-4 text-[13px] text-[#6B6860]">{c.state}</td>
                <td className="px-5 py-4 text-[13px] font-semibold text-center">{c.orders}</td>
                <td className="px-5 py-4 text-[13px] font-semibold text-brand">₦{c.totalSpent.toLocaleString()}</td>
                <td className="px-5 py-4">
                  <span className={`text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-sm border ${tierColor(c.totalSpent)}`}>
                    {tierLabel(c.totalSpent)}
                  </span>
                </td>
                <td className="px-5 py-4 text-[12px] text-[#6B6860]">
                  {new Date(c.joinedAt).toLocaleDateString('en-NG', { day:'numeric', month:'short', year:'numeric' })}
                </td>
                <td className="px-5 py-4">
                  <button className="text-[11px] tracking-wider uppercase text-brand font-semibold border border-brand px-3 py-1.5 rounded-sm hover:bg-brand hover:text-white transition-colors">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-5 py-3 border-t border-[#F4F3F0] text-[12px] text-[#6B6860]">
        Showing {filtered.length} of {customers.length} customers
      </div>
    </div>
  )
}
