import { Suspense } from 'react';
import { createClient } from '@/utils/supabase/server';
import { connection } from 'next/server';
import { banUser, unbanUser } from '@/app/[locale]/admin/actions';
import { ShieldAlert, ShieldCheck } from 'lucide-react';

// 1. Внутренний компонент с логикой
async function UsersContent() {
  await connection();
  const supabase = await createClient();

  const { data: users } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-50 border-b border-gray-100 text-gray-500">
          <tr>
            <th className="px-6 py-4 font-medium">Użytkownik</th>
            <th className="px-6 py-4 font-medium">Kontakt</th>
            <th className="px-6 py-4 font-medium">Status</th>
            <th className="px-6 py-4 font-medium text-right">Akcje</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {users?.map((u) => (
            <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden shrink-0">
                    {u.avatar_url ? (
                      <img src={u.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-gray-500">{u.first_name?.charAt(0) || '?'}</div>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{u.first_name || 'Brak imienia'}</p>
                    <p className="text-gray-500 text-xs uppercase">{u.role}</p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <p>{u.email}</p>
                <p className="text-gray-500">{u.phone || 'Brak telefonu'}</p>
              </td>
              <td className="px-6 py-4">
                {u.is_banned ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-red-50 text-red-700 text-xs font-semibold">
                    <ShieldAlert className="w-3 h-3" /> Zbanowany
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-green-50 text-green-700 text-xs font-semibold">
                    <ShieldCheck className="w-3 h-3" /> Aktywny
                  </span>
                )}
              </td>
              <td className="px-6 py-4 text-right">
                {u.role !== 'admin' && (
                  u.is_banned ? (
                    <form action={unbanUser}>
                      <input type="hidden" name="userId" value={u.id} />
                      <button className="text-[#0071e3] hover:underline font-medium text-sm">Odbanuj</button>
                    </form>
                  ) : (
                    <form action={banUser} className="flex items-center justify-end gap-2">
                      <input type="hidden" name="userId" value={u.id} />
                      <input type="hidden" name="days" value="7" />
                      <input type="hidden" name="reason" value="Naruszenie regulaminu" />
                      <button className="text-red-600 hover:underline font-medium text-sm">Zbanuj (7 dni)</button>
                    </form>
                  )
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// 2. Синхронная обертка
export default function AdminUsersPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900">Użytkownicy</h1>
        <p className="text-gray-500 mt-1">Zarządzaj kontami i blokadami.</p>
      </div>
      <Suspense fallback={<div className="text-center py-20 text-gray-500">Ładowanie użytkowników...</div>}>
        <UsersContent />
      </Suspense>
    </div>
  );
}