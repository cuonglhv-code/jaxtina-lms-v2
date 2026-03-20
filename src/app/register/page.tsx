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
        <div className="flex items-center gap-3 mb-10">
          <JLogo size={44} />
          <span className="text-white text-[32px] leading-none" style={{ fontFamily: FONT_SERIF }}>
            Jaxtina
          </span>
        </div>
        <p
          className="text-white/70 text-lg leading-relaxed mb-14 max-w-xs"
          style={{ fontFamily: FONT_SANS, fontWeight: 300 }}
        >
          Your personalised path to IELTS success
        </p>
        <div className="space-y-4">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl p-5 border-l-4"
              style={{ borderLeftColor: '#0E9F6E', background: 'rgba(255,255,255,0.06)' }}
            >
              <div className="text-2xl font-semibold text-white mb-0.5" style={{ fontFamily: FONT_SANS }}>
                {stat.value}
              </div>
              <div className="text-sm text-white/60" style={{ fontFamily: FONT_SANS }}>
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

const selectClass =
  'w-full h-12 px-4 border-[1.5px] border-[#E2DDD6] rounded-[10px] text-[15px] bg-white text-[#1A1A2E] outline-none transition-all duration-150 focus:border-[#0E9F6E] focus:shadow-[0_0_0_3px_rgba(14,159,110,0.12)] appearance-none cursor-pointer'

const labelClass =
  'block mb-1.5 text-[12px] font-medium tracking-[0.08em] uppercase text-[#8892A4]'

const CURRENT_BAND_OPTIONS = [
  { value: '', label: 'No experience' },
  ...['3.0', '3.5', '4.0', '4.5', '5.0', '5.5', '6.0', '6.5', '7.0', '7.5', '8.0', '8.5', '9.0'].map(
    (v) => ({ value: v, label: v })
  ),
]

const TARGET_BAND_OPTIONS = [
  { value: '', label: 'Select target' },
  ...['4.0', '4.5', '5.0', '5.5', '6.0', '6.5', '7.0', '7.5', '8.0', '8.5', '9.0'].map(
    (v) => ({ value: v, label: v })
  ),
]

function getPasswordStrength(pw: string): 0 | 1 | 2 | 3 | 4 {
  if (!pw) return 0
  let score = 0
  if (pw.length >= 8) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  return score as 0 | 1 | 2 | 3 | 4
}

const STRENGTH_LABELS = ['', 'Weak', 'Fair', 'Good', 'Strong']
const STRENGTH_COLORS = ['', '#ef4444', '#f59e0b', '#3b82f6', '#0E9F6E']

function PasswordStrength({ password }: { password: string }) {
  const strength = getPasswordStrength(password)
  if (!password) return null
  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[1, 2, 3, 4].map((seg) => (
          <div
            key={seg}
            className="h-1 flex-1 rounded-full transition-all duration-300"
            style={{
              background: strength >= seg ? STRENGTH_COLORS[strength] : '#E2DDD6',
            }}
          />
        ))}
      </div>
      <p
        className="text-[11px]"
        style={{ fontFamily: FONT_SANS, color: STRENGTH_COLORS[strength] }}
      >
        {STRENGTH_LABELS[strength]}
      </p>
    </div>
  )
}

interface FieldError {
  fullName?: string
  age?: string
  email?: string
  phone?: string
  address?: string
  password?: string
  confirmPassword?: string
}

function FieldErrorMsg({ message, id }: { message?: string; id: string }) {
  if (!message) return null
  return (
    <p
      id={id}
      role="alert"
      className="mt-1 text-[12px] text-red-500 flex items-center gap-1"
      style={{ fontFamily: FONT_SANS }}
    >
      <span aria-hidden="true">⚠</span> {message}
    </p>
  )
}

export default function RegisterPage() {
  const [fullName, setFullName] = useState('')
  const [age, setAge] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [currentBand, setCurrentBand] = useState('')
  const [targetBand, setTargetBand] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<FieldError>({})
  const [globalError, setGlobalError] = useState('')
  const [loading, setLoading] = useState(false)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  function validate(): boolean {
    const errs: FieldError = {}
    if (!fullName.trim()) errs.fullName = 'Full name is required'
    const ageNum = parseInt(age)
    if (!age) errs.age = 'Age is required'
    else if (isNaN(ageNum) || ageNum < 10 || ageNum > 80) errs.age = 'Age must be between 10 and 80'
    if (!email.trim()) errs.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Enter a valid email address'
    if (!phone.trim()) errs.phone = 'Mobile phone is required'
    if (!address.trim()) errs.address = 'Address is required'
    if (!password) errs.password = 'Password is required'
    else if (password.length < 8) errs.password = 'Password must be at least 8 characters'
    if (!confirmPassword) errs.confirmPassword = 'Please confirm your password'
    else if (password !== confirmPassword) errs.confirmPassword = 'Passwords do not match'
    setFieldErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    setGlobalError('')

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone,
          age: parseInt(age),
          address,
          current_band: currentBand || null,
          target_band: targetBand || null,
        },
      },
    })

    if (signUpError || !data.user) {
      setGlobalError(signUpError?.message ?? 'Registration failed. Please try again.')
      setLoading(false)
      return
    }

    const { error: profileError } = await supabase.from('user_profiles').insert({
      id: data.user.id,
      role: 'learner',
      full_name: fullName,
      email,
      phone,
      preferred_lang: 'vi',
    })

    if (profileError) {
      setGlobalError('Database error saving new user: ' + profileError.message)
      setLoading(false)
      return
    }

    window.location.href = '/learner/dashboard'
  }

  return (
    <div className="min-h-screen flex">
      <LeftPanel />

      {/* Right panel — scrollable */}
      <div
        className="flex-1 overflow-y-auto"
        style={{ background: '#FAFAF8' }}
      >
        <div className="min-h-full flex items-start justify-center p-6 md:p-12">
          <div className="w-full max-w-[480px] py-8">
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
              className="text-[32px] leading-tight text-[#0D1B2A] mb-2"
              style={{ fontFamily: FONT_SERIF }}
            >
              Create your account
            </h1>
            <p
              className="text-[15px] text-[#8892A4] mb-8"
              style={{ fontFamily: FONT_SANS, fontWeight: 300 }}
            >
              Join 2,000+ learners on their IELTS journey
            </p>

            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              {/* Row 1: Full name + Age */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="fullName" className={labelClass} style={{ fontFamily: FONT_SANS }}>
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    placeholder="Nguyen Van A"
                    aria-describedby={fieldErrors.fullName ? 'err-fullName' : undefined}
                    className={inputClass}
                    style={{ fontFamily: FONT_SANS }}
                  />
                  <FieldErrorMsg message={fieldErrors.fullName} id="err-fullName" />
                </div>
                <div>
                  <label htmlFor="age" className={labelClass} style={{ fontFamily: FONT_SANS }}>
                    Age
                  </label>
                  <input
                    id="age"
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    required
                    min={10}
                    max={80}
                    placeholder="18"
                    aria-describedby={fieldErrors.age ? 'err-age' : undefined}
                    className={inputClass}
                    style={{ fontFamily: FONT_SANS }}
                  />
                  <FieldErrorMsg message={fieldErrors.age} id="err-age" />
                </div>
              </div>

              {/* Row 2: Email */}
              <div>
                <label htmlFor="reg-email" className={labelClass} style={{ fontFamily: FONT_SANS }}>
                  Email Address
                </label>
                <input
                  id="reg-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  aria-describedby={fieldErrors.email ? 'err-email' : undefined}
                  className={inputClass}
                  style={{ fontFamily: FONT_SANS }}
                />
                <FieldErrorMsg message={fieldErrors.email} id="err-email" />
              </div>

              {/* Row 3: Phone */}
              <div>
                <label htmlFor="phone" className={labelClass} style={{ fontFamily: FONT_SANS }}>
                  Mobile Phone
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  placeholder="+84 xxx xxx xxx"
                  aria-describedby={fieldErrors.phone ? 'err-phone' : undefined}
                  className={inputClass}
                  style={{ fontFamily: FONT_SANS }}
                />
                <FieldErrorMsg message={fieldErrors.phone} id="err-phone" />
              </div>

              {/* Row 4: Address */}
              <div>
                <label htmlFor="address" className={labelClass} style={{ fontFamily: FONT_SANS }}>
                  Address
                </label>
                <input
                  id="address"
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  placeholder="City / District, Vietnam"
                  aria-describedby={fieldErrors.address ? 'err-address' : undefined}
                  className={inputClass}
                  style={{ fontFamily: FONT_SANS }}
                />
                <FieldErrorMsg message={fieldErrors.address} id="err-address" />
              </div>

              {/* Row 5: Band selects */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="currentBand" className={labelClass} style={{ fontFamily: FONT_SANS }}>
                    Current IELTS Band
                  </label>
                  <div className="relative">
                    <select
                      id="currentBand"
                      value={currentBand}
                      onChange={(e) => setCurrentBand(e.target.value)}
                      className={selectClass}
                      style={{ fontFamily: FONT_SANS }}
                    >
                      {CURRENT_BAND_OPTIONS.map((opt) => (
                        <option key={opt.label} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#8892A4]">
                      <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                        <path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div>
                  <label htmlFor="targetBand" className={labelClass} style={{ fontFamily: FONT_SANS }}>
                    Target IELTS Band
                  </label>
                  <div className="relative">
                    <select
                      id="targetBand"
                      value={targetBand}
                      onChange={(e) => setTargetBand(e.target.value)}
                      className={selectClass}
                      style={{ fontFamily: FONT_SANS }}
                    >
                      {TARGET_BAND_OPTIONS.map((opt) => (
                        <option key={opt.label} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#8892A4]">
                      <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                        <path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 6: Password */}
              <div>
                <label htmlFor="reg-password" className={labelClass} style={{ fontFamily: FONT_SANS }}>
                  Password
                </label>
                <div className="relative">
                  <input
                    id="reg-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    aria-describedby={fieldErrors.password ? 'err-password' : undefined}
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
                <PasswordStrength password={password} />
                <FieldErrorMsg message={fieldErrors.password} id="err-password" />
              </div>

              {/* Row 7: Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className={labelClass} style={{ fontFamily: FONT_SANS }}>
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    aria-describedby={fieldErrors.confirmPassword ? 'err-confirm' : undefined}
                    className={`${inputClass} pr-12`}
                    style={{ fontFamily: FONT_SANS }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    aria-label={showConfirm ? 'Hide password' : 'Show password'}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8892A4] hover:text-[#0D1B2A] transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0E9F6E] rounded"
                  >
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <FieldErrorMsg message={fieldErrors.confirmPassword} id="err-confirm" />
              </div>

              {/* Global error */}
              {globalError && (
                <p
                  role="alert"
                  className="flex items-center gap-1.5 text-[13px] text-red-500"
                  style={{ fontFamily: FONT_SANS }}
                >
                  <span aria-hidden="true">⚠</span>
                  {globalError}
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
                    Creating account...
                  </span>
                ) : (
                  'Create Account'
                )}
              </button>

              {/* Sign in link */}
              <p
                className="text-center text-[14px] text-[#8892A4]"
                style={{ fontFamily: FONT_SANS }}
              >
                Already have an account?{' '}
                <a href="/login" className="text-[#0E9F6E] font-semibold hover:underline">
                  Sign in
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
