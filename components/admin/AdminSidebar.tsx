'use client'

import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, ShoppingBag, Package, Users, LogOut, ExternalLink } from 'lucide-react'

const NAV = [
  { label:'Dashboard', href:'/admin/dashboard', icon:LayoutDashboard },
  { label:'Orders',    href:'/admin/orders',    icon:ShoppingBag },
  { label:'Products',  href:'/admin/products',  icon:Package },
  { label:'Customers', href:'/admin/customers', icon:Users },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router   = useRouter()

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  return (
    <aside className="w-56 min-h-screen bg-[#111110] flex flex-col flex-shrink-0 sticky top-0 h-screen">
      <div className="px-6 py-6 border-b border-white/10">
        <span className="font-display text-xl text-white font-semibold">
          Fruit<span className="text-brand">Guard</span>
        </span>
        <p className="text-[10px] tracking-[0.1em] uppercase text-white/30 mt-0.5">Admin</p>
      </div>

      <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto scrollbar-thin">
        {NAV.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || (href !== '/admin' && pathname.startsWith(href))
          return (
            <a key={href} href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-sm text-[13px] font-medium transition-all ${
                active ? 'bg-brand text-white' : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}>
              <Icon size={15} strokeWidth={active ? 2.5 : 1.8} />
              {label}
            </a>
          )
        })}
      </nav>

      <div className="px-3 py-4 border-t border-white/10 space-y-0.5">
        <a href="/" target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 rounded-sm text-[13px] font-medium text-white/40 hover:text-white hover:bg-white/5 transition-all">
          <ExternalLink size={14} /> View Store
        </a>
        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-[13px] font-medium text-white/40 hover:text-red-400 hover:bg-white/5 transition-all">
          <LogOut size={14} /> Sign Out
        </button>
      </div>
    </aside>
  )
}
