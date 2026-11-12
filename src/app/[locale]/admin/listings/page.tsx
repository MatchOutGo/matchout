import { Suspense } from 'react';
import { createClient } from '@/utils/supabase/server';
import { connection } from 'next/server';
import { deleteListing } from '@/app/[locale]/admin/actions';
import Link from 'next/link';
import { Trash2, ExternalLink } from 'lucide-react';

// 1. Внутренний компонент с логикой
async function ListingsContent() {
  await connection();
  const supabase = await createClient();

  const { data: listings } = await supabase
    .from('listings')
    .select(`
      *,
      profiles!user_id (first_name)
    `)
    .order('created_at', { ascending: false });

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-50 border-b border-gray-100 text-gray-500">
          <tr>
            <th className="px-6 py-4 font-medium">Ogłoszenie</th>
            <th className="px-6 py-4 font-medium">Autor</th>
            <th className="px-6 py-4 font-medium">Data</th>
            <th className="px-6 py-4 font-medium text-right">Akcje</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {listings?.map((l) => {
            const author = Array.isArray(l.profiles) ? l.profiles[0] : l.profiles;
            return (
              <tr key={l.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4">
                  <p className="font-semibold text-gray-900">{l.title}</p>
                  <p className="text-gray-500 text-xs">{l.activity} • {l.city || 'Brak miasta'}</p>
                </td>
                <td className="px-6 py-4">
                  {author?.first_name || 'Użytkownik'}
                </td>
                <td className="px-6 py-4 text-gray-500">
                  {l.created_at ? new Date(l.created_at).toLocaleDateString() : 'Brak daty'}
                </td>
                <td className="px-6 py-4 text-right flex items-center justify-end gap-4">
                  <Link href={`/listings/${l.id}`} target="_blank" className="text-gray-400 hover:text-[#0071e3]" title="Zobacz">
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                  <form action={deleteListing}>
                    <input type="hidden" name="listingId" value={l.id} />
                    <button className="text-red-500 hover:text-red-700" title="Usuń">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </form>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  );
}

// 2. Синхронная обертка
export default function AdminListingsPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900">Ogłoszenia</h1>
        <p className="text-gray-500 mt-1">Moderuj wszystkie wyjazdy w serwisie.</p>
      </div>
      <Suspense fallback={<div className="text-center py-20 text-gray-500">Ładowanie ogłoszeń...</div>}>
        <ListingsContent />
      </Suspense>
    </div>
  );
}