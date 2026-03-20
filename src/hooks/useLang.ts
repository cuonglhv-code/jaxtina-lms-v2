'use client'

import { useState, useEffect } from 'react'
import { t, type Lang } from '@/lib/i18n/translations'

export function useLang() {
  const [lang, setLang] = useState<Lang>('vi')

  useEffect(() => {
    const stored = localStorage.getItem('lang')
    if (stored === 'en' || stored === 'vi') setLang(stored)

    function handleLangChange(e: Event) {
      const detail = (e as CustomEvent<Lang>).detail
      if (detail === 'en' || detail === 'vi') setLang(detail)
    }

    window.addEventListener('langChange', handleLangChange)
    return () => window.removeEventListener('langChange', handleLangChange)
  }, [])

  return { lang, translations: t[lang] }
}
