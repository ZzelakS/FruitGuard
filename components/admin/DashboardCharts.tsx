'use client'

import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer
} from 'recharts'

interface MonthData {
  month: string
  revenue: number
  orders: number
}

export default function DashboardCharts({ data }: { data: MonthData[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Revenue Area Chart */}
      <div>
        <p className="text-[11px] font-semibold tracking-wider uppercase text-[#6B6860] mb-4">Revenue (₦)</p>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#78bf49" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#78bf49" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F4F3F0" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: '#6B6860', fontFamily: 'var(--font-jost)' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#6B6860', fontFamily: 'var(--font-jost)' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={v => `₦${(v / 1000).toFixed(0)}k`}
              width={48}
            />
            <Tooltip
              contentStyle={{ fontFamily: 'var(--font-jost)', fontSize: 12, border: '1px solid #D6D3CE', borderRadius: 2, boxShadow: 'none' }}
              formatter={(v: number) => [`₦${v.toLocaleString()}`, 'Revenue']}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#78bf49"
              strokeWidth={2}
              fill="url(#revGradient)"
              dot={false}
              activeDot={{ r: 4, fill: '#78bf49', strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Orders Bar Chart */}
      <div>
        <p className="text-[11px] font-semibold tracking-wider uppercase text-[#6B6860] mb-4">Orders</p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }} barSize={24}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F4F3F0" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: '#6B6860', fontFamily: 'var(--font-jost)' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#6B6860', fontFamily: 'var(--font-jost)' }}
              axisLine={false}
              tickLine={false}
              width={32}
            />
            <Tooltip
              contentStyle={{ fontFamily: 'var(--font-jost)', fontSize: 12, border: '1px solid #D6D3CE', borderRadius: 2, boxShadow: 'none' }}
              formatter={(v: number) => [v, 'Orders']}
              cursor={{ fill: '#F4F3F0' }}
            />
            <Bar dataKey="orders" fill="#78bf49" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
