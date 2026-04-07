'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw]     = useState(false)
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [mounted, setMounted]   = useState(false)

  useEffect(() => { setMounted(true) }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Invalid email or password.')
        setLoading(false)
        return
      }

      // Success — navigate directly. Don't call router.refresh() as it
      // can race with the cookie being set and cause a redirect loop.
      router.push('/admin/dashboard')
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F4F3F0] flex items-center justify-center px-4">

      {/* Background blobs */}
      <div className="fixed top-[-200px] right-[-200px] w-[600px] h-[600px] rounded-full bg-brand-mid opacity-20 pointer-events-none animate-[pulse_8s_ease-in-out_infinite]" />
      <div className="fixed bottom-[-200px] left-[-200px] w-[500px] h-[500px] rounded-full bg-brand-pale opacity-30 pointer-events-none animate-[pulse_10s_ease-in-out_infinite]" />

      <div className={`w-full max-w-md transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="font-display text-3xl font-semibold">
            Fruit<span className="text-brand">Guard</span>
          </Link>
          <div className="flex items-center justify-center gap-2 mt-2">
            <div className="h-px w-8 bg-[#D6D3CE]" />
            <p className="text-[11px] tracking-[0.14em] uppercase text-[#6B6860]">Admin Portal</p>
            <div className="h-px w-8 bg-[#D6D3CE]" />
          </div>
        </div>

        {/* Card */}
        <div className="bg-white border border-[#D6D3CE] rounded-sm p-8 shadow-sm">
          <h1 className="font-display text-2xl mb-1">Sign in</h1>
          <p className="text-[13px] text-[#6B6860] mb-7">Enter your credentials to access the dashboard.</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-[13px] px-4 py-3 rounded-sm mb-5 animate-[pageEnter_0.3s_ease_forwards]">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[11px] font-semibold tracking-wider uppercase text-[#6B6860] mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@fruitguard.com"
                required
                autoComplete="email"
                className="w-full border border-[#D6D3CE] focus:border-brand rounded-sm px-3 py-2.5 text-sm outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold tracking-wider uppercase text-[#6B6860] mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  autoComplete="current-password"
                  className="w-full border border-[#D6D3CE] focus:border-brand rounded-sm px-3 py-2.5 text-sm outline-none transition-colors pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-semibold tracking-wider uppercase text-[#6B6860] hover:text-[#111110] transition-colors"
                >
                  {showPw ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand hover:bg-brand-dark disabled:opacity-60 disabled:cursor-not-allowed text-white py-3 text-[12px] font-semibold tracking-widest uppercase rounded-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-brand/20 mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-[#F4F3F0]">
            <p className="text-[11px] text-[#6B6860] text-center">
              Demo:{' '}
              <span className="font-semibold text-[#111110]">admin@fruitguard.com</span>
              {' '}/{' '}
              <span className="font-semibold text-[#111110]">FruitGuard@2025</span>
            </p>
          </div>
        </div>

        <p className="text-center text-[11px] text-[#6B6860] mt-6">
          <Link href="/" className="hover:text-brand transition-colors">
            ← Back to storefront
          </Link>
        </p>
      </div>
    </div>
  )
}
