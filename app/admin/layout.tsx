import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import AdminSidebar from '@/components/admin/AdminSidebar'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // getSession reads the cookie — but this layout also wraps /admin/login.
  // We only redirect if there's no session AND we're not already on the login path.
  // The middleware handles the redirect for all non-login admin routes,
  // so here we just render children if there's no session (login page handles itself).
  const session = await getSession()

  // If no session, render children without the sidebar — the login page
  // will render itself. Middleware already blocks any other admin route.
  if (!session) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-[#F4F3F0] flex">
      <AdminSidebar />
      <main className="flex-1 min-w-0 overflow-auto">
        {children}
      </main>
    </div>
  )
}
