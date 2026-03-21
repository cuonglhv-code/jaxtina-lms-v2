import { redirect } from 'next/navigation';

export default async function CoursesRedirectPage() {
  redirect('/learner/courses');
}
