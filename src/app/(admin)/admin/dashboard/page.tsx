import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect("/sign-in");
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
      <p className="text-muted-foreground">Welcome, Admin. Manage all students, teachers and centre activities here.</p>
    </div>
  );
}
