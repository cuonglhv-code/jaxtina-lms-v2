'use client'

import { useTransition } from 'react'
import { LogOut } from 'lucide-react'
import { signOutAction } from '@/app/actions/auth'

export function LogoutButton() {
  const [isPending, startTransition] = useTransition()

  return (
    <button
      type="button"
      onClick={() => startTransition(() => signOutAction())}
      disabled={isPending}
      className="text-gray-400 hover:text-white transition-colors p-1 disabled:opacity-50"
      aria-label="Logout"
    >
      <LogOut size={16} />
    </button>
  )
}
