'use client'

import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { Eye, EyeOff } from 'lucide-react'

const FONT_SERIF = "'Instrument Serif', serif"
const FONT_SANS = "'DM Sans', sans-serif"

function JLogo({ size = 40 }: { size?: number }) {
  return (
    <div
      className="rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
      style={{
        width: size,
        height: size,
        background: '#0E9F6E',
        fontFamily: FONT_SERIF,
        fontSize: size * 0.5,
      }}
    >
      J
    </div>
  )
}

const STATS = [
  { value: '4.8', label: 'Avg band gain' },
  { value: '2,000+', label: 'Active learners' },
  { value: '92%', label: 'Reach target band' },
]

function LeftPanel() {
  return (
    <div
      className="hidden md:flex md:w-[45%] flex-col justify-between p-12 flex-shrink-0"
      style={{ background: 'linear-gradient(160deg, #0D1B2A 0%, #1B4F72 100%)' }}
    >
      <div>
        {/* Brand */}
        <div className="flex items-center gap-3 mb-10">
          <JLogo size={44} />
          <span className="text-white text-[32px] leading-none" style={{ fontFamily: FONT_SERIF }}>
            Jaxtina
          </span>
        </div>

        {/* Tagline */}
        <p
          className="text-white/70 text-lg leading-relaxed mb-14 max-w-xs"
          style={{ fontFamily: FONT_SANS, fontWeight: 300 }}
        >
          Your personalised path to IELTS success
        </p>

        {/* Stat cards */}
        <div className="space-y-4">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl p-5 border-l-4"
              style={{
                borderLeftColor: '#0E9F6E',
                background: 'rgba(255,255,255,0.06)',
              }}
            >
              <div
                className="text-2xl font-semibold text-white mb-0.5"
                style={{ fontFamily: FONT_SANS }}
              >
                {stat.value}
              </div>
              <div
                className="text-sm text-white/60"
                style={{ fontFamily: FONT_SANS }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-white/40 text-xs" style={{ fontFamily: FONT_SANS }}>
        Powered by AI · Built for Vietnam
      </p>
    </div>
  )
}

const inputClass =
  'w-full h-12 px-4 border-[1.5px] border-[#E2DDD6] rounded-[10px] text-[15px] bg-white text-[#1A1A2E] outline-none transition-all duration-150 focus:border-[#0E9F6E] focus:shadow-[0_0_0_3px_rgba(14,159,110,0.12)]'

const labelClass =
  'block mb-1.5 text-[12px] font-medium tracking-[0.08em] uppercase text-[#8892A4]'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError || !data.user) {
      setError('Invalid email or password. Please try again.')
      setLoading(false)
      return
    }

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', data.user.id)
      .single()

    const role = profile?.role
    if (role === 'super_admin' || role === 'centre_admin' || role === 'academic_admin') {
      window.location.href = '/admin/dashboard'
    } else if (role === 'teacher') {
      window.location.href = '/teacher/dashboard'
    } else {
      window.location.href = '/dashboard'
    }
  }

  return (
    <div className="min-h-screen flex">
      <LeftPanel />

      {/* Right panel */}
      <div
        className="flex-1 flex items-center justify-center p-6 md:p-12"
        style={{ background: '#FAFAF8' }}
      >
        <div className="w-full max-w-[420px]">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 md:hidden">
            <JLogo size={34} />
            <span
              className="text-[#0D1B2A] text-[22px] leading-none"
              style={{ fontFamily: FONT_SERIF }}
            >
              Jaxtina
            </span>
          </div>

          <h1
            className="text-[36px] leading-tight text-[#0D1B2A] mb-2"
            style={{ fontFamily: FONT_SERIF }}
          >
            Welcome back
          </h1>
          <p
            className="text-[15px] text-[#8892A4] mb-7"
            style={{ fontFamily: FONT_SANS, fontWeight: 300 }}
          >
            Sign in to continue your learning journey
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className={labelClass}
                style={{ fontFamily: FONT_SANS }}
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                aria-describedby={error ? 'login-error' : undefined}
                className={inputClass}
                style={{ fontFamily: FONT_SANS }}
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="text-[12px] font-medium tracking-[0.08em] uppercase text-[#8892A4]"
                  style={{ fontFamily: FONT_SANS }}
                >
                  Password
                </label>
                <a
                  href="#"
                  className="text-[12px] text-[#8892A4] hover:text-[#0D1B2A] transition-colors duration-150"
                  style={{ fontFamily: FONT_SANS }}
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  aria-describedby={error ? 'login-error' : undefined}
                  className={`${inputClass} pr-12`}
                  style={{ fontFamily: FONT_SANS }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8892A4] hover:text-[#0D1B2A] transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0E9F6E] rounded"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <p
                id="login-error"
                role="alert"
                className="flex items-center gap-1.5 text-[13px] text-red-500"
                style={{ fontFamily: FONT_SANS, animation: 'fadeIn 0.15s ease' }}
              >
                <span aria-hidden="true">⚠</span>
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              aria-disabled={loading}
              className="w-full h-12 rounded-[10px] text-white text-[15px] font-semibold transition-all duration-150 hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(14,159,110,0.35)] disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-none"
              style={{
                fontFamily: FONT_SANS,
                background: 'linear-gradient(135deg, #0E9F6E, #0B8A5E)',
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign in'
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-[#E2DDD6]" />
              <span
                className="text-[12px] text-[#8892A4]"
                style={{ fontFamily: FONT_SANS }}
              >
                or
              </span>
              <div className="flex-1 h-px bg-[#E2DDD6]" />
            </div>

            {/* Register link */}
            <p
              className="text-center text-[14px] text-[#8892A4]"
              style={{ fontFamily: FONT_SANS }}
            >
              New to Jaxtina?{' '}
              <a
                href="/register"
                className="text-[#0E9F6E] font-semibold hover:underline"
              >
                Create account
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
