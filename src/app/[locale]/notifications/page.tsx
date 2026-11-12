import { Suspense } from 'react';
import { createClient } from '@/utils/supabase/server';
import { connection } from 'next/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Bell, ArrowLeft, CheckCheck } from 'lucide-react';
import { markAllAsRead } from './actions';

async function NotificationsList() {
  await connection();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: notifications } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (!notifications || notifications.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
        <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">Brak powiadomień.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <h2 className="font-semibold text-gray-900">Twoje powiadomienia</h2>
        <form action={markAllAsRead}>
          <button type="submit" className="text-sm text-[#0071e3] font-medium hover:underline flex items-center gap-1">
            <CheckCheck className="w-4 h-4" /> Oznacz jako przeczytane
          </button>
        </form>
      </div>
      <ul className="divide-y divide-gray-100">
        {notifications.map((n) => {
          const payload = n.payload as { title: string, body: string, link: string };
          return (
            <li key={n.id} className={`p-4 hover:bg-gray-50 transition-colors ${!n.is_read ? 'bg-blue-50/30' : ''}`}>
              <Link href={payload.link || '#'} className="block">
                <div className="flex items-start gap-3">
                  {!n.is_read && <span className="w-2 h-2 mt-1.5 rounded-full bg-[#0071e3] shrink-0"></span>}
                  <div>
                    <p className={`text-sm ${!n.is_read ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>{payload.title}</p>
                    <p className="text-sm text-gray-500 mt-0.5">{payload.body}</p>
                    <p className="text-xs text-gray-400 mt-1">
<p className="text-xs text-gray-400 mt-1">
  {n.created_at ? new Date(n.created_at).toLocaleDateString('pl-PL', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : ''}
</p>                    </p>
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function NotificationsPage() {
  return (
    <div className="max-w-3xl mx-auto py-8">
      <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-6 transition-colors group">
        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
        Wróć na stronę główną
      </Link>
      
      <Suspense fallback={<div className="text-center py-20 text-gray-500">Ładowanie...</div>}>
        <NotificationsList />
      </Suspense>
    </div>
  );
}