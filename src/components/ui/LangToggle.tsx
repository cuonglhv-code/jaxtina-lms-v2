'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import type { Lang } from '@/lib/i18n/translations'

export function LangToggle() {
  const [lang, setLang] = useState<Lang>('vi')
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const stored = localStorage.getItem('lang') as Lang | null
    if (stored === 'en' || stored === 'vi') setLang(stored)
  }, [])

  function toggle() {
    const next: Lang = lang === 'vi' ? 'en' : 'vi'
    setLang(next)
    localStorage.setItem('lang', next)
    window.dispatchEvent(new CustomEvent<Lang>('langChange', { detail: next }))
    const url = new URL(window.location.href)
    url.searchParams.set('lang', next)
    router.replace(pathname + '?' + url.searchParams.toString())
  }

  const segments: Lang[] = ['en', 'vi']

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle language / Chuyển ngôn ngữ"
      style={{
        display: 'inline-flex',
        height: '32px',
        borderRadius: '999px',
        border: '1px solid var(--border)',
        overflow: 'hidden',
        cursor: 'pointer',
        padding: 0,
        background: 'transparent',
        flexShrink: 0,
      }}
    >
      {segments.map((l) => (
        <span
          key={l}
          style={{
            padding: '0 10px',
            display: 'flex',
            alignItems: 'center',
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '12px',
            fontWeight: 500,
            backgroundColor: lang === l ? 'var(--midnight)' : 'transparent',
            color: lang === l ? '#ffffff' : 'var(--mist)',
            transition: 'background-color 0.15s, color 0.15s',
          }}
        >
          {l.toUpperCase()}
        </span>
      ))}
    </button>
  )
}
