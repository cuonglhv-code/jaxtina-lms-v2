'use client'

import { useState, useEffect } from 'react'
import { t, type Lang } from '@/lib/i18n/translations'

export function useLang() {
  const [lang, setLangState] = useState<Lang>('vi')

  useEffect(() => {
    const stored = localStorage.getItem('lang')
    if (stored === 'en' || stored === 'vi') setLangState(stored)

    function handleLangChange(e: Event) {
      const detail = (e as CustomEvent<Lang>).detail
      if (detail === 'en' || detail === 'vi') setLangState(detail)
    }

    window.addEventListener('langChange', handleLangChange)
    return () => window.removeEventListener('langChange', handleLangChange)
  }, [])

  function setLang(next: Lang) {
    setLangState(next)
    localStorage.setItem('lang', next)
    window.dispatchEvent(new CustomEvent<Lang>('langChange', { detail: next }))
  }

  return { lang, tr: t[lang], translations: t[lang], setLang }
}
