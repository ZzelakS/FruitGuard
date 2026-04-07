import { ORDERS, CUSTOMERS, MONTHLY_REVENUE } from '@/lib/data'
import DashboardCharts from '@/components/admin/DashboardCharts'
import Link from 'next/link'

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string,string> = {
    pending:    'bg-amber-50 text-amber-700 border-amber-200',
    processing: 'bg-blue-50 text-blue-700 border-blue-200',
    delivered:  'bg-green-50 text-green-700 border-green-200',
    cancelled:  'bg-red-50 text-red-600 border-red-200',
  }
  return (
    <span className={`inline-block text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-sm border ${styles[status] || ''}`}>
      {status}
    </span>
  )
}

export default function DashboardPage() {
  const totalRevenue  = ORDERS.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0)
  const pendingOrders = ORDERS.filter(o => o.status === 'pending').length
  const recentOrders  = [...ORDERS].sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0,5)

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl text-[#111110]">Dashboard</h1>
        <p className="text-[13px] text-[#6B6860] mt-1">Welcome back. Here&apos;s what&apos;s happening with FruitGuard today.</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {[
          { label:'Total Revenue',   value:`₦${totalRevenue.toLocaleString()}`, sub:'All time (excl. cancelled)',   color:'text-brand' },
          { label:'Total Orders',    value:ORDERS.length,                        sub:`${pendingOrders} pending`,     color:'text-[#111110]' },
          { label:'Customers',       value:CUSTOMERS.length,                     sub:'Registered accounts',          color:'text-[#111110]' },
          { label:'Products',        value:'Live',                               sub:'Managed via Firestore',        color:'text-brand' },
        ].map(({ label, value, sub, color }) => (
          <div key={label} className="bg-white border border-[#D6D3CE] rounded-sm p-5">
            <p className="text-[11px] font-semibold tracking-wider uppercase text-[#6B6860] mb-2">{label}</p>
            <p className={`font-display text-3xl font-semibold ${color}`}>{value}</p>
            <p className="text-[11px] text-[#6B6860] mt-1">{sub}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="bg-white border border-[#D6D3CE] rounded-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-[11px] font-semibold tracking-wider uppercase text-[#6B6860]">Revenue Overview</p>
            <h2 className="font-display text-2xl">Monthly Performance</h2>
          </div>
          <span className="text-[11px] tracking-wider uppercase text-[#6B6860] border border-[#D6D3CE] px-3 py-1.5 rounded-sm">Last 7 Months</span>
        </div>
        <DashboardCharts data={MONTHLY_REVENUE} />
      </div>

      {/* Bottom grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white border border-[#D6D3CE] rounded-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-xl">Recent Orders</h2>
            <Link href="/admin/orders" className="text-[11px] tracking-wider uppercase text-brand hover:text-brand-dark transition-colors">View All</Link>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#F4F3F0]">
                {['Order','Customer','Total','Status'].map(h => (
                  <th key={h} className="text-left text-[10px] font-semibold tracking-wider uppercase text-[#6B6860] pb-3 pr-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(o => (
                <tr key={o.id} className="border-b border-[#F4F3F0] last:border-0">
                  <td className="py-3 pr-4 text-[13px] font-semibold text-brand">{o.id}</td>
                  <td className="py-3 pr-4 text-[13px] truncate max-w-[100px]">{o.customer.split(' ')[0]}</td>
                  <td className="py-3 pr-4 text-[13px] font-medium">₦{o.total.toLocaleString()}</td>
                  <td className="py-3"><StatusBadge status={o.status}/></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Quick links */}
        <div className="bg-white border border-[#D6D3CE] rounded-sm p-6">
          <h2 className="font-display text-xl mb-5">Quick Actions</h2>
          <div className="space-y-3">
            {[
              { href:'/admin/products', label:'Manage Products',  sub:'Add, edit or remove products in Firestore' },
              { href:'/admin/orders',   label:'View Orders',      sub:'Review and update order statuses' },
              { href:'/admin/customers',label:'View Customers',   sub:'Browse customer accounts and spending' },
              { href:'/',               label:'Open Storefront',  sub:'Preview the live customer-facing site', external:true },
            ].map(({ href, label, sub, external }) => (
              <Link key={href} href={href} target={external ? '_blank' : undefined}
                className="flex items-center justify-between p-4 border border-[#D6D3CE] rounded-sm hover:border-brand hover:bg-brand-pale transition-all duration-150 group">
                <div>
                  <p className="text-[13px] font-semibold group-hover:text-brand transition-colors">{label}</p>
                  <p className="text-[11px] text-[#6B6860]">{sub}</p>
                </div>
                <span className="text-[#D6D3CE] group-hover:text-brand transition-colors text-lg">›</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
