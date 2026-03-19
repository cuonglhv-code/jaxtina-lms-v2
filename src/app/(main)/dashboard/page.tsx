import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Profile } from "@/types/database";
export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return redirect("/sign-in");
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profileError || !profile) {
    console.error("Profile lookup failed:", profileError);
    return redirect("/learner/dashboard");
  }
  const userRole = (profile as Profile).role;
  switch (userRole) {
    case "admin": return redirect("/admin/dashboard");
    case "teacher": return redirect("/teacher/dashboard");
    case "student":
    default: return redirect("/learner/dashboard");
  }
}
