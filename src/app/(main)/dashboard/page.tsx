import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Profile } from "@/types/database";
export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return redirect("/sign-in");
  const { data: profile, error: profileError } = await supabase
    .from("user_profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profileError || !profile) {
    console.error("Profile lookup failed:", profileError);
    return redirect("/login");
  }
  const userRole = (profile as Profile).role;
  switch (userRole) {
    case "super_admin":
    case "centre_admin":
    case "academic_admin": 
      return redirect("/admin/dashboard");
    case "teacher": 
      return redirect("/teacher/dashboard");
    case "learner":
    default: 
      return redirect("/learner/dashboard");
  }
}
