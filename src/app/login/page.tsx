'use client'

import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { data, error: authError } = await supabase.auth
      .signInWithPassword({ email, password })

    if (authError || !data.user) {
      setError(authError?.message || 'Invalid email or password.')
      setLoading(false)
      return
    }

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', data.user.id)
      .single()

    const role = profile?.role
    if (
      role === 'super_admin' ||
      role === 'centre_admin' ||
      role === 'academic_admin'
    ) {
      window.location.href = '/admin/dashboard'
    } else if (role === 'teacher') {
      window.location.href = '/teacher/dashboard'
    } else {
      window.location.href = '/learner/dashboard'
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex' }}>

      {/* Left panel */}
      <div style={{
        width: '45%', background: 'linear-gradient(160deg, #0D1B2A, #1B4F72)',
        padding: '48px', display: 'flex', flexDirection: 'column',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: 40, height: 40, borderRadius: '50%',
            background: '#0E9F6E', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: 700, fontSize: 18
          }}>J</div>
          <span style={{
            color: 'white', fontSize: 22,
            fontFamily: 'Instrument Serif, serif'
          }}>Jaxtina</span>
        </div>
        <div>
          <p style={{
            color: 'rgba(255,255,255,0.7)', fontSize: 15,
            fontFamily: 'DM Sans, sans-serif', marginBottom: 32
          }}>
            Your personalised path to IELTS success
          </p>
          {[
            { value: '4.8', label: 'Avg band gain' },
            { value: '2,000+', label: 'Active learners' },
            { value: '92%', label: 'Reach target band' },
          ].map(stat => (
            <div key={stat.label} style={{
              borderLeft: '3px solid #0E9F6E',
              paddingLeft: 16, marginBottom: 24
            }}>
              <div style={{
                color: 'white', fontSize: 28,
                fontFamily: 'Instrument Serif, serif'
              }}>
                {stat.value}
              </div>
              <div style={{
                color: 'rgba(255,255,255,0.5)',
                fontSize: 13, fontFamily: 'DM Sans, sans-serif'
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
        <p style={{
          color: 'rgba(255,255,255,0.3)', fontSize: 12,
          fontFamily: 'DM Sans, sans-serif'
        }}>
          Powered by AI · Built for Vietnam
        </p>
      </div>

      {/* Right panel */}
      <div style={{
        flex: 1, background: '#FAFAF8', display: 'flex',
        alignItems: 'center', justifyContent: 'center', padding: 48
      }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          <h1 style={{
            fontFamily: 'Instrument Serif, serif',
            fontSize: 36, color: '#0D1B2A', marginBottom: 8
          }}>Welcome back</h1>
          <p style={{
            fontFamily: 'DM Sans, sans-serif',
            color: '#8892A4', fontSize: 15, marginBottom: 32
          }}>Sign in to continue your learning journey</p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 20 }}>
              <label htmlFor="login-email" style={{
                display: 'block', fontFamily: 'DM Sans, sans-serif',
                fontSize: 11, fontWeight: 500, letterSpacing: '0.08em',
                textTransform: 'uppercase', color: '#8892A4', marginBottom: 8
              }}>Email Address</label>
              <input
                id="login-email"
                type="email"
                value={email}
                required
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={{
                  width: '100%', height: 48, border: '1.5px solid #E2DDD6',
                  borderRadius: 10, padding: '0 16px', fontSize: 15,
                  fontFamily: 'DM Sans, sans-serif', background: 'white',
                  boxSizing: 'border-box', outline: 'none'
                }}
              />
            </div>

            <div style={{ marginBottom: 8 }}>
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', marginBottom: 8
              }}>
                <label htmlFor="login-password" style={{
                  fontFamily: 'DM Sans, sans-serif', fontSize: 11,
                  fontWeight: 500, letterSpacing: '0.08em',
                  textTransform: 'uppercase', color: '#8892A4'
                }}>Password</label>
                <a href="/forgot-password" style={{
                  fontSize: 12, color: '#8892A4',
                  fontFamily: 'DM Sans, sans-serif', textDecoration: 'none'
                }}>Forgot password?</a>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  required
                  onChange={e => setPassword(e.target.value)}
                  style={{
                    width: '100%', height: 48, border: '1.5px solid #E2DDD6',
                    borderRadius: 10, padding: '0 44px 0 16px', fontSize: 15,
                    fontFamily: 'DM Sans, sans-serif', background: 'white',
                    boxSizing: 'border-box', outline: 'none'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  style={{
                    position: 'absolute', right: 14, top: '50%',
                    transform: 'translateY(-50%)', background: 'none',
                    border: 'none', cursor: 'pointer', color: '#8892A4',
                    fontSize: 16, lineHeight: 1
                  }}>
                  {showPassword ? '🙈' : '👁'}
                </button>
              </div>
            </div>

            {error && (
              <p style={{
                color: '#ef4444', fontSize: 13,
                fontFamily: 'DM Sans, sans-serif', marginBottom: 12,
                marginTop: 8
              }}>⚠ {error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', height: 48, marginTop: 16,
                background: loading
                  ? '#6b7280'
                  : 'linear-gradient(135deg, #0E9F6E, #0B8A5E)',
                border: 'none', borderRadius: 10, color: 'white',
                fontSize: 15, fontWeight: 600,
                fontFamily: 'DM Sans, sans-serif',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p style={{
            textAlign: 'center', marginTop: 24, fontSize: 14,
            fontFamily: 'DM Sans, sans-serif', color: '#8892A4'
          }}>
            New to Jaxtina?{' '}
            <a href="/register" style={{ color: '#0E9F6E', fontWeight: 600, textDecoration: 'none' }}>
              Create account
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
