import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 p-6 dark:bg-zinc-950">
      <Card className="w-full max-w-md shadow-lg transition-all hover:shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Jaxtina LMS
          </CardTitle>
          <CardDescription className="text-zinc-500 dark:text-zinc-400">
            Welcome to your English Learning Management System
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="rounded-lg bg-zinc-100 p-4 dark:bg-zinc-900">
            <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              Tailwind CSS and shadcn/ui have been successfully integrated. This card and the button below are living proof!
            </p>
          </div>
          <Link href="/sign-in" className="w-full">
            <Button className="w-full font-semibold" size="lg">
              Get Started
            </Button>
          </Link>
          <div className="text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="text-primary hover:underline font-medium">
              Sign Up
            </Link>
          </div>
          <p className="text-center text-xs text-zinc-400 mt-4">
            Next.js + Supabase + Vercel
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
