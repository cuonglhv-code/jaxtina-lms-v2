import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function RootPage() {
  try {
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      redirect('/login')
    }
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    const role = profile?.role
    if (role === 'super_admin' || role === 'centre_admin' ||
        role === 'academic_admin') {
      redirect('/admin/dashboard')
    }
    if (role === 'teacher') redirect('/teacher/dashboard')
    redirect('/dashboard')
  } catch (error) {
    throw error
  }
}
