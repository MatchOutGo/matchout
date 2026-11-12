import { Suspense } from "react";
import { connection } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Settings, AlertTriangle, ArrowLeft, Users, Map, FileText } from "lucide-react";

async function AdminSidebar() {
  await connection();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') redirect('/');

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-[calc(100vh-4rem)] p-6 flex flex-col gap-2 sticky top-16 shrink-0">
      <Link href="/" className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 mb-6">
        <ArrowLeft className="w-4 h-4" /> Wróć do serwisu
      </Link>
      
      <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Zarządzanie</h2>
      
      <Link href="/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 text-gray-700 font-medium transition-colors">
        <LayoutDashboard className="w-5 h-5" /> Dashboard
      </Link>
      <Link href="/admin/users" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 text-gray-700 font-medium transition-colors">
        <Users className="w-5 h-5" /> Użytkownicy
      </Link>
      <Link href="/admin/listings" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 text-gray-700 font-medium transition-colors">
        <Map className="w-5 h-5" /> Ogłoszenia
      </Link>
      <Link href="/admin/complaints" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 text-gray-700 font-medium transition-colors">
        <AlertTriangle className="w-5 h-5" /> Zgłoszenia
      </Link>
      <Link href="/admin/templates" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 text-gray-700 font-medium transition-colors">
        <FileText className="w-5 h-5" /> Szablony
      </Link>
      <Link href="/admin/dictionaries" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 text-gray-700 font-medium transition-colors">
        <Settings className="w-5 h-5" /> Słowniki
      </Link>
    </aside>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#f5f5f7]">
      <Suspense fallback={<div className="w-64 bg-white border-r border-gray-200 h-screen shrink-0" />}>
        <AdminSidebar />
      </Suspense>
      <div className="flex-1 p-8 overflow-x-auto">
        {children}
      </div>
    </div>
  );
}