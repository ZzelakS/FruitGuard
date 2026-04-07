import { CUSTOMERS } from '@/lib/data'
import CustomersTable from '@/components/admin/CustomersTable'

export default function CustomersPage() {
  const totalRevenue = CUSTOMERS.reduce((s, c) => s + c.totalSpent, 0)
  const avgOrders = Math.round(CUSTOMERS.reduce((s, c) => s + c.orders, 0) / CUSTOMERS.length)
  const topCustomer = [...CUSTOMERS].sort((a, b) => b.totalSpent - a.totalSpent)[0]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl text-[#111110]">Customers</h1>
        <p className="text-[13px] text-[#6B6860] mt-1">{CUSTOMERS.length} registered customers</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total Customers', value: CUSTOMERS.length },
          { label: 'Total Revenue',   value: `₦${totalRevenue.toLocaleString()}` },
          { label: 'Avg. Orders',     value: avgOrders, note: 'Per customer' },
          { label: 'Top Customer',    value: topCustomer.name.split(' ')[0], note: `₦${topCustomer.totalSpent.toLocaleString()} spent` },
        ].map(({ label, value, note }) => (
          <div key={label} className="bg-white border border-[#D6D3CE] rounded-sm px-4 py-3">
            <p className="text-[10px] font-semibold tracking-wider uppercase text-[#6B6860] mb-1">{label}</p>
            <p className="font-display text-2xl font-semibold truncate">{value}</p>
            {note && <p className="text-[11px] text-[#6B6860] mt-0.5">{note}</p>}
          </div>
        ))}
      </div>

      <CustomersTable customers={CUSTOMERS} />
    </div>
  )
}
