import { signup } from "../actions";
import Link from "next/link";
import { UserPlus, ArrowRight, ShieldCheck, Mail, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default async function SignUpPage(props: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const searchParams = await props.searchParams;

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side: Branding / Benefits */}
      <div className="hidden lg:flex flex-col justify-between bg-zinc-900 p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl -ml-48 -mb-48" />
        
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="bg-white p-2 rounded-xl transition-transform group-hover:scale-105">
              <ShieldCheck className="w-6 h-6 text-zinc-900" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-white italic uppercase">Jaxtina LMS</span>
          </Link>
        </div>

        <div className="relative z-10 max-w-lg">
          <h2 className="text-5xl font-black text-white italic tracking-tighter leading-[1.1] mb-6 uppercase">
            Unlock Your <span className="text-zinc-500">Global Potential.</span>
          </h2>
          <div className="space-y-6 border-l-4 border-zinc-800 pl-6">
            <div className="space-y-1">
              <p className="text-white font-bold italic uppercase tracking-tight">Personalized Roadmap</p>
              <p className="text-zinc-400 text-sm leading-relaxed">Adaptive learning paths tailored to your specific band goals.</p>
            </div>
            <div className="space-y-1">
              <p className="text-white font-bold italic uppercase tracking-tight">AI-Powered Insights</p>
              <p className="text-zinc-400 text-sm leading-relaxed">Instant feedback on your writing and speaking practice.</p>
            </div>
            <div className="space-y-1">
              <p className="text-white font-bold italic uppercase tracking-tight">Expert Support</p>
              <p className="text-zinc-400 text-sm leading-relaxed">Direct access to certified English instructors 24/7.</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex gap-4 items-center">
            <div className="flex -space-x-2">
                {[1,2,3,4].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-zinc-900 bg-zinc-800 flex items-center justify-center">
                        <User className="w-4 h-4 text-zinc-500" />
                    </div>
                ))}
            </div>
            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest italic">Join 10,000+ students today</p>
        </div>
      </div>

      {/* Right Side: Sign Up Form */}
      <div className="flex items-center justify-center p-8 bg-zinc-50 dark:bg-zinc-950">
        <div className="w-full max-w-[400px] space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="space-y-2 text-center lg:text-left">
            <h1 className="text-4xl font-black tracking-tighter italic uppercase text-zinc-900 dark:text-white">Create Account</h1>
            <p className="text-zinc-500 font-medium">Initialize your profile to begin learning.</p>
          </div>

          <Card className="border-none shadow-2xl shadow-zinc-200/50 dark:shadow-none bg-white dark:bg-zinc-900 rounded-[2.5rem] overflow-hidden">
            <CardHeader className="p-8 pb-0">
               {searchParams.error && (
                <div className="bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 p-4 rounded-2xl text-xs font-bold uppercase italic border border-red-100 dark:border-red-900/20 flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-red-600 animate-pulse" />
                  {searchParams.error}
                </div>
              )}
              {searchParams.message && (
                <div className="bg-emerald-50 dark:bg-emerald-900/10 text-emerald-600 dark:text-emerald-400 p-4 rounded-2xl text-xs font-bold uppercase italic border border-emerald-100 dark:border-emerald-900/20 flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
                  {searchParams.message}
                </div>
              )}
            </CardHeader>
            <CardContent className="p-8">
              <form action={signup} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="full_name" className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">Full Identity Name</Label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 transition-colors group-focus-within:text-zinc-900" />
                    <Input
                      id="full_name"
                      name="full_name"
                      placeholder="John Doe"
                      required
                      className="h-14 pl-12 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border-zinc-100 dark:border-zinc-700/50 focus:border-zinc-900 transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">Email System Address</Label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 transition-colors group-focus-within:text-zinc-900" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                      className="h-14 pl-12 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border-zinc-100 dark:border-zinc-700/50 focus:border-zinc-900 transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" university-title="Label" className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">Security Key (8+ Characters)</Label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 transition-colors group-focus-within:text-zinc-900" />
                    <Input 
                      id="password" 
                      name="password" 
                      type="password" 
                      required 
                      className="h-14 pl-12 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border-zinc-100 dark:border-zinc-700/50 focus:border-zinc-900 transition-all font-medium"
                    />
                  </div>
                </div>

                <Button className="w-full h-14 rounded-2xl bg-zinc-900 dark:bg-white dark:text-zinc-900 hover:scale-[1.02] transition-all font-black uppercase italic tracking-widest shadow-xl shadow-zinc-900/10">
                  Initialize Profile <UserPlus className="w-4 h-4 ml-2" />
                </Button>
              </form>
            </CardContent>
            <CardFooter className="p-8 pt-0 flex justify-center">
              <p className="text-zinc-400 font-bold text-xs uppercase tracking-tight">
                Already registered?{" "}
                <Link href="/sign-in" className="text-zinc-900 dark:text-white underline underline-offset-4 decoration-zinc-900/20 hover:decoration-zinc-900 transition-all">
                  Authenticate Instead
                </Link>
              </p>
            </CardFooter>
          </Card>
          
          <p className="text-center text-[10px] text-zinc-400 font-mono tracking-widest uppercase italic">
             [ COMPLIANCE READY :: JAXTINA LMS V2.0 ]
          </p>
        </div>
      </div>
    </div>
  );
}
