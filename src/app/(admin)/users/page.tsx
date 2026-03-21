import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronLeft, User, Mail, ShieldCheck, MoreHorizontal, UserCog, UserMinus } from "lucide-react";
import Link from 'next/link';
import { Profile } from "@/types/database";

export default async function UserManagementPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  // Fetch all profiles
  const { data: users, error } = await supabase
    .from('user_profiles')
    .select('*')
    .order('created_at', { ascending: false });

  const ADMIN_ROLES = ['super_admin', 'centre_admin', 'academic_admin'];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 p-6 md:p-12 lg:p-20">
      <div className="max-w-7xl mx-auto space-y-12">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
           <div className="space-y-4">
              <Link href="/admin/dashboard" className="flex items-center gap-2 text-zinc-500 hover:text-emerald-500 transition-colors text-sm font-bold uppercase tracking-widest italic group">
                 <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                 Back to Control Centre
              </Link>
              <div className="flex items-center gap-3">
                 <Badge className="bg-emerald-600 text-white border-none font-black italic rounded-lg tracking-widest px-3 py-1 scale-110">User Directory</Badge>
              </div>
              <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-tight italic uppercase">Staff & Students</h1>
           </div>
           
           <div className="pb-2">
              <Button className="font-black italic uppercase italic tracking-widest bg-white text-zinc-900 rounded-2xl h-12 shadow-2xl shadow-white/5 hover:scale-105 transition-all">INVITE USER <User className="w-4 h-4 ml-2" /></Button>
           </div>
        </header>

        <section className="space-y-6">
           <Card className="bg-zinc-900 border-zinc-900 rounded-[3rem] overflow-hidden shadow-2xl">
              <Table>
                <TableHeader className="border-zinc-800 bg-zinc-900/50">
                  <TableRow className="border-zinc-800 hover:bg-transparent">
                    <TableHead className="text-[10px] font-black uppercase text-zinc-500 p-6">Identity</TableHead>
                    <TableHead className="text-[10px] font-black uppercase text-zinc-500 p-6">Access Level</TableHead>
                    <TableHead className="text-[10px] font-black uppercase text-zinc-500 p-6">Contact</TableHead>
                    <TableHead className="text-[10px] font-black uppercase text-zinc-500 p-6 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users?.map((profile) => (
                    <TableRow key={profile.id} className="border-zinc-800 hover:bg-white/5 transition-colors group">
                      <TableCell className="p-6">
                         <div className="flex items-center gap-4">
                            <div className="bg-zinc-800 p-3 rounded-2xl border border-zinc-700 transition-all group-hover:border-emerald-500/30">
                               <User className="w-5 h-5 text-zinc-500 group-hover:text-emerald-500 transition-colors" />
                            </div>
                            <div>
                               <p className="text-lg font-black italic uppercase tracking-tighter text-zinc-200 group-hover:text-white transition-colors">{(profile as Profile).full_name}</p>
                               <p className="text-[10px] font-mono text-zinc-600 uppercase italic">ID: {(profile as Profile).id.substring(0, 8)}</p>
                            </div>
                         </div>
                      </TableCell>
                      <TableCell className="p-6">
                         <Badge variant={ADMIN_ROLES.includes((profile as Profile).role) ? 'default' : 'outline'} className={`rounded-lg uppercase font-black italic tracking-widest text-[10px] ${ADMIN_ROLES.includes((profile as Profile).role) ? 'bg-emerald-600/10 text-emerald-500 border-emerald-500/20' : ((profile as Profile).role === 'teacher' ? 'text-indigo-400 border-indigo-400/20' : 'text-zinc-500 border-zinc-800')}`}>
                            {(profile as Profile).role.replace('_', ' ')}
                         </Badge>
                      </TableCell>
                      <TableCell className="p-6">
                         <div className="flex items-center gap-2 text-zinc-500 font-bold italic tracking-tight text-sm">
                            <Mail className="w-3 h-3 text-zinc-700" />
                            [ PROTECTED ]
                         </div>
                      </TableCell>
                      <TableCell className="p-6 text-right">
                         <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="sm" className="bg-zinc-800 hover:bg-emerald-600 hover:text-white rounded-xl h-10 w-10 p-0 shadow-lg">
                               <UserCog className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="bg-zinc-800 hover:bg-red-600 hover:text-white rounded-xl h-10 w-10 p-0 shadow-lg">
                               <UserMinus className="w-4 h-4" />
                            </Button>
                         </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {!users || users.length === 0 && (
                <div className="p-20 text-center italic text-zinc-600 font-mono tracking-widest uppercase text-xs">
                   [ NO USERS REGISTERED IN SYSTEM ]
                </div>
              )}
           </Card>
        </section>
      </div>
    </div>
  );
}
