import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
export default async function LearnerDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect("/sign-in");
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-2">Learner Dashboard</h1>
      <p className="text-muted-foreground">Welcome! Track your progress, access courses and practice here.</p>
    </div>
  );
}
