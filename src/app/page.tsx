import { login } from "./(auth)/actions";
import Link from "next/link";
import { LogIn, ArrowRight, ShieldCheck, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default async function SignInPage(props: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const searchParams = await props.searchParams;

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side: Illustration / Branding */}
      <div className="hidden lg:flex flex-col justify-between bg-zinc-900 p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl -mr-48 -mt-48" />
        
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
            Master English with <span className="text-zinc-500">Confidence.</span>
          </h2>
          <p className="text-zinc-400 text-lg font-medium leading-relaxed italic border-l-4 border-zinc-800 pl-6">
            Join thousands of students reaching their IELTS and TOEIC goals with our advanced learning ecosystem.
          </p>
        </div>

        <div className="relative z-10 flex gap-8">
          <div className="space-y-1">
            <p className="text-white font-black text-2xl tracking-tighter">10k+</p>
            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest italic">Active Learners</p>
          </div>
          <div className="space-y-1">
            <p className="text-white font-black text-2xl tracking-tighter">98%</p>
            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest italic">Target Success</p>
          </div>
        </div>
      </div>

      {/* Right Side: Auth Form */}
      <div className="flex items-center justify-center p-8 bg-zinc-50 dark:bg-zinc-950">
        <div className="w-full max-w-[400px] space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="space-y-2 text-center lg:text-left">
            <h1 className="text-4xl font-black tracking-tighter italic uppercase text-zinc-900 dark:text-white">Sign In</h1>
            <p className="text-zinc-500 font-medium">Continue your journey to English excellence.</p>
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
              <form action={login} className="space-y-6">
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
                  <div className="flex justify-between items-center px-1">
                    <Label htmlFor="password" university-title="Label" className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Security Key</Label>
                    <Link href="#" className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-900">Forgot?</Link>
                  </div>
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
                  Authenticate <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </form>
            </CardContent>
            <CardFooter className="p-8 pt-0 flex justify-center">
              <p className="text-zinc-400 font-bold text-xs uppercase tracking-tight">
                New to the system?{" "}
                <Link href="/sign-up" className="text-zinc-900 dark:text-white underline underline-offset-4 decoration-zinc-900/20 hover:decoration-zinc-900 transition-all">
                  Initialize Account
                </Link>
              </p>
            </CardFooter>
          </Card>
          
          <p className="text-center text-[10px] text-zinc-400 font-mono tracking-widest uppercase italic">
            [ SECURE ACCESS TERMINAL :: JAXTINA LMS V2.0 ]
          </p>
        </div>
      </div>
    </div>
  );
}
