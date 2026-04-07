import { ORDERS } from '@/lib/data'
import OrdersTable from '@/components/admin/OrdersTable'

export default function OrdersPage() {
  const counts = {
    all:        ORDERS.length,
    pending:    ORDERS.filter(o => o.status === 'pending').length,
    processing: ORDERS.filter(o => o.status === 'processing').length,
    delivered:  ORDERS.filter(o => o.status === 'delivered').length,
    cancelled:  ORDERS.filter(o => o.status === 'cancelled').length,
  }

  return (
    <div className="p-8">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl text-[#111110]">Orders</h1>
          <p className="text-[13px] text-[#6B6860] mt-1">{ORDERS.length} total orders</p>
        </div>
        <button className="bg-brand hover:bg-brand-dark text-white text-[11px] font-semibold tracking-wider uppercase px-4 py-2.5 rounded-sm transition-colors">
          Export CSV
        </button>
      </div>

      {/* Status summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        {(Object.entries(counts) as [string, number][]).map(([status, count]) => (
          <div key={status} className="bg-white border border-[#D6D3CE] rounded-sm px-4 py-3">
            <p className="text-[10px] font-semibold tracking-wider uppercase text-[#6B6860] mb-1 capitalize">{status}</p>
            <p className="font-display text-2xl font-semibold">{count}</p>
          </div>
        ))}
      </div>

      <OrdersTable orders={ORDERS} />
    </div>
  )
}
