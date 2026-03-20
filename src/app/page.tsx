import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function RootPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle()

  const role = profile?.role
  if (role === 'super_admin' || role === 'centre_admin' || role === 'academic_admin') {
    redirect('/admin/dashboard')
  }
  if (role === 'teacher') redirect('/teacher/dashboard')
  redirect('/learner/dashboard')
}
