import { Suspense } from 'react';
import { createClient } from '@/utils/supabase/server';
import { connection } from 'next/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { AlertTriangle, Clock, CheckCircle2, ChevronRight } from 'lucide-react';

async function ComplaintsList() {
  await connection();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) redirect('/login');
  
  // Проверяем, что это админ
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') redirect('/');

  // Получаем жалобы с данными о пользователях и поездках
  const { data: complaints } = await supabase
    .from('complaints')
    .select(`
      *,
      reporter:profiles!reporter_id (first_name),
      target:profiles!target_user_id (first_name),
      listings (title)
    `)
    .order('created_at', { ascending: false });

  if (!complaints || complaints.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl shadow-sm">
        <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">Brak nowych zgłoszeń. Wszystko w porządku!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {complaints.map((complaint) => {
        const reporter = Array.isArray(complaint.reporter) ? complaint.reporter[0] : complaint.reporter;
        const target = Array.isArray(complaint.target) ? complaint.target[0] : complaint.target;
        const listing = Array.isArray(complaint.listings) ? complaint.listings[0] : complaint.listings;

        return (
          <Link 
            key={complaint.id} 
            href={`/admin/complaints/${complaint.id}`}
            className="bg-white p-6 rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-gray-100 hover:shadow-md transition-shadow flex items-center justify-between group"
          >
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-xl shrink-0 ${complaint.status === 'pending' ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-400'}`}>
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-lg mb-1">
                  Zgłoszenie od: {reporter?.first_name || 'Użytkownik'}
                </h3>
                <p className="text-sm text-gray-500 mb-1">
                  Na: <span className="font-medium text-gray-900">{target?.first_name || 'Użytkownik'}</span> 
                  {listing && <span> • Wyjazd: {listing.title}</span>}
                </p>
                <p className="text-sm text-gray-600 line-clamp-1 italic">&quot;{complaint.reason}&quot;</p>
              </div>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                complaint.status === 'pending' ? 'bg-red-100 text-red-700' : 
                complaint.status === 'resolved' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
              }`}>
                {complaint.status === 'pending' ? 'Oczekuje' : complaint.status === 'resolved' ? 'Rozwiązane' : 'Odrzucone'}
              </span>
              <div className="text-gray-400 group-hover:text-[#0071e3] transition-colors">
                <ChevronRight className="w-6 h-6" />
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export default function AdminComplaintsPage() {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900">Zgłoszenia i Moderacja</h1>
        <p className="text-gray-500 mt-1">Przeglądaj zgłoszenia od użytkowników i podejmuj decyzje.</p>
      </div>
      <Suspense fallback={<div className="text-center py-10 text-gray-500">Ładowanie zgłoszeń...</div>}>
        <ComplaintsList />
      </Suspense>
    </div>
  );
}