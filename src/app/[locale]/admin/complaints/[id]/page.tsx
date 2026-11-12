import { Suspense } from 'react';
import { createClient } from '@/utils/supabase/server';
import { connection } from 'next/server';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ShieldAlert, Check } from 'lucide-react';
import { dismissComplaint } from './actions';
import BanForm from './BanForm';

type AdminMessage = {
  id: string;
  content: string;
  sender_id: string;
  profiles: { first_name: string | null } | { first_name: string | null }[] | null;
};

async function ComplaintDetail({ params }: { params: Promise<{ id: string }> }) {
  await connection();
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) redirect('/login');
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') redirect('/');

  const { data: complaint, error } = await supabase
    .from('complaints')
    .select(`
      *,
      reporter:profiles!reporter_id (*),
      target:profiles!target_user_id (*),
      listings (*)
    `)
    .eq('id', id)
    .single();

  if (error || !complaint) notFound();

  const reporter = Array.isArray(complaint.reporter) ? complaint.reporter[0] : complaint.reporter;
  const target = Array.isArray(complaint.target) ? complaint.target[0] : complaint.target;
  const listing = Array.isArray(complaint.listings) ? complaint.listings[0] : complaint.listings;

  let messages: AdminMessage[] = [];
  if (listing) {
    const { data: msgs } = await supabase
      .from('messages')
      .select(`id, content, sender_id, profiles(first_name)`)
      .eq('listing_id', listing.id)
      .order('created_at', { ascending: true });
    messages = (msgs || []) as AdminMessage[];
  }

  const { data: activeBan } = await supabase
    .from('blacklist')
    .select('*')
    .eq('user_id', target?.id)
    .gt('expires_at', new Date().toISOString())
    .maybeSingle();

  const { data: templates } = await supabase.from('admin_templates').select('*');

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Link href="/admin/complaints" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Wróć do listy zgłoszeń
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h1 className="text-2xl font-semibold text-gray-900 mb-4">Szczegóły zgłoszenia</h1>
            
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase">Zgłaszający</p>
                <p className="font-medium">{reporter?.first_name} ({reporter?.email})</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase">Oskarżony</p>
                <p className="font-medium text-red-600">{target?.first_name} ({target?.email})</p>
                <p className="text-sm text-gray-500">Tel: {target?.phone}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase">Powód</p>
                <p className="bg-red-50 text-red-800 p-3 rounded-xl mt-1 text-sm">{complaint.reason}</p>
              </div>
              {listing && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Dotyczy wyjazdu</p>
                  <Link href={`/listings/${listing.id}`} className="text-[#0071e3] hover:underline font-medium">
                    {listing.title}
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Decyzja administratora</h2>
            
            {activeBan ? (
              <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 text-sm">
                <ShieldAlert className="w-5 h-5 mb-2" />
                Ten użytkownik jest już zbanowany do: {activeBan.expires_at ? new Date(activeBan.expires_at).toLocaleDateString() : 'brak daty'}.
              </div>
            ) : (
              <BanForm 
                complaintId={complaint.id} 
                targetUserId={target?.id} 
                templates={templates || []} 
              />
            )}

            <form action={dismissComplaint}>
              <input type="hidden" name="complaintId" value={complaint.id} />
              <button type="submit" className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                <Check className="w-4 h-4" /> Odrzuć zgłoszenie (brak podstaw)
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-[600px]">
          <div className="p-4 border-b border-gray-100 bg-gray-50">
            <h2 className="font-semibold text-gray-900">Historia czatu (dostęp tylko do wglądu)</h2>
            <p className="text-xs text-gray-500">Administrator nie może wysyłać wiadomości w tym widoku.</p>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#f9f9f9]">
            {messages.length === 0 ? (
              <p className="text-center text-gray-400 mt-10">Brak wiadomości w tym czacie.</p>
            ) : (
              messages.map((msg) => {
                const author = Array.isArray(msg.profiles) ? msg.profiles[0] : msg.profiles;
                const isTarget = msg.sender_id === target?.id;
                const isReporter = msg.sender_id === reporter?.id;

                return (
                  <div key={msg.id} className={`flex flex-col ${isTarget ? 'items-start' : 'items-end'}`}>
                    <span className="text-[11px] text-gray-500 mb-1 mx-1">
                      {author?.first_name} {isTarget ? '(Oskarżony)' : isReporter ? '(Zgłaszający)' : ''}
                    </span>
                    <div className={`px-4 py-2 rounded-2xl max-w-[80%] ${
                      isTarget ? 'bg-white border border-gray-100 rounded-bl-sm text-gray-900' : 
                      isReporter ? 'bg-blue-50 text-blue-900 rounded-br-sm' : 'bg-gray-200 text-gray-700'
                    }`}>
                      <p className="text-[14px]">{msg.content}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Строгий тип для Next.js
export default function AdminComplaintPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<div className="text-center py-20 text-gray-500">Ładowanie szczegółów...</div>}>
      <ComplaintDetail params={params} />
    </Suspense>
  );
}