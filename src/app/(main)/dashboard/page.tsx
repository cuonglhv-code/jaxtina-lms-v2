import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Profile } from "@/types/database";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  // If not logged in, go to sign-in
  if (authError || !user) {
    return redirect("/sign-in");
  }

  // Get the user's profile to check their role
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  // If no profile found, we might need a default or error handling
  // For now, let's treat everyone as a student if profile lookup fails
  if (profileError || !profile) {
    console.error("Profile lookup failed:", profileError);
    return redirect("/(learner)/dashboard");
  }

  // Redirect to the correct role-based dashboard
  const userRole = (profile as Profile).role;

  switch (userRole) {
    case "admin":
      return redirect("/(admin)/dashboard");
    case "teacher":
      return redirect("/(teacher)/dashboard");
    case "student":
    default:
      return redirect("/(learner)/dashboard");
  }
}
