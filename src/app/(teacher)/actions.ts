'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createCourse(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const exam_type = formData.get('exam_type') as string

  const { data: course, error } = await supabase
    .from('courses')
    .insert({
      title,
      description,
      exam_type,
    })
    .select()
    .single()

  if (error) throw new Error(error.message)

  revalidatePath('/courses')
  revalidatePath('/teacher/dashboard')
  redirect(`/teacher/courses/${course.id}/edit`)
}

export async function createModule(formData: FormData) {
  const supabase = await createClient()

  const course_id = formData.get('course_id') as string
  const title = formData.get('title') as string
  const order_index = Number(formData.get('order_index') || 0)

  const { error } = await supabase
    .from('modules')
    .insert({ course_id, title, order_index })

  if (error) throw new Error(error.message)

  revalidatePath(`/teacher/courses/${course_id}/edit`)
}

export async function createLesson(formData: FormData) {
  const supabase = await createClient()

  const module_id = formData.get('module_id') as string
  const course_id = formData.get('course_id') as string
  const title = formData.get('title') as string
  const content = formData.get('content') as string
  const order_index = Number(formData.get('order_index') || 0)

  const { error } = await supabase
    .from('lessons')
    .insert({ module_id, title, content, order_index })

  if (error) throw new Error(error.message)

  revalidatePath(`/teacher/courses/${course_id}/edit`)
}

export async function submitMarking(formData: FormData) {
  const supabase = await createClient()

  const submission_id = formData.get('submission_id') as string
  const score = Number(formData.get('score'))
  const feedback = formData.get('feedback') as string
  const { data: { user } } = await supabase.auth.getUser()

  const { error } = await supabase
    .from('submissions')
    .update({
      score,
      feedback,
      status: 'graded',
      graded_at: new Date().toISOString(),
      teacher_id: user?.id
    })
    .eq('id', submission_id)

  if (error) throw new Error(error.message)

  revalidatePath('/teacher/dashboard')
  revalidatePath('/teacher/marking')
  redirect('/teacher/dashboard')
}
