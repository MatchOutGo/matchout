import { Suspense } from 'react';
import { createClient } from '@/utils/supabase/server';
import { connection } from 'next/server';
import { Users, Map, AlertCircle, ShieldBan } from 'lucide-react';

// 1. Выносим всю логику и запросы в отдельный компонент
async function DashboardContent() {
  await connection();
  const supabase = await createClient();

  // Получаем счетчики
  const { count: usersCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
  const { count: listingsCount } = await supabase.from('listings').select('*', { count: 'exact', head: true });
  const { count: complaintsCount } = await supabase.from('complaints').select('*', { count: 'exact', head: true }).eq('status', 'pending');
  const { count: bannedCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('is_banned', true);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Przegląd aktywności w serwisie MatchOut.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-4 bg-blue-50 text-[#0071e3] rounded-2xl">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Użytkownicy</p>
            <p className="text-3xl font-semibold text-gray-900">{usersCount || 0}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-4 bg-green-50 text-green-600 rounded-2xl">
            <Map className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Ogłoszenia</p>
            <p className="text-3xl font-semibold text-gray-900">{listingsCount || 0}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-4 bg-orange-50 text-orange-600 rounded-2xl">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Nowe zgłoszenia</p>
            <p className="text-3xl font-semibold text-gray-900">{complaintsCount || 0}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-4 bg-red-50 text-red-600 rounded-2xl">
            <ShieldBan className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Zbanowani</p>
            <p className="text-3xl font-semibold text-gray-900">{bannedCount || 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// 2. Синхронная обертка с Suspense
export default function AdminDashboard() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-gray-500 text-lg">Ładowanie statystyk...</div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}