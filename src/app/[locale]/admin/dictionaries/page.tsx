import { Suspense } from 'react';
import { createClient } from '@/utils/supabase/server';
import { connection } from 'next/server';
import { addDictionaryItem, toggleDictionaryStatus } from './actions';
import { Plus, Eye, EyeOff } from 'lucide-react';

async function DictionariesContent() {
  await connection();
  const supabase = await createClient();

  // Получаем все активности и города
  const { data: dictionaries } = await supabase
    .from('dictionaries')
    .select('*')
    .order('sort_order', { ascending: true });

  const activities = dictionaries?.filter(d => d.category === 'activity') || [];
  const cities = dictionaries?.filter(d => d.category === 'city') || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      
      {/* БЛОК АКТИВНОСТЕЙ */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Rodzaje aktywności</h2>
          <form action={addDictionaryItem} className="flex gap-2">
            <input type="hidden" name="category" value="activity" />
            <input name="value" required placeholder="Nazwa systemowa (np. ski_touring)" className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#0071e3]" />
            <input name="label_pl" required placeholder="Nazwa PL (np. Skitury)" className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#0071e3]" />
            <button type="submit" className="bg-gray-900 text-white px-4 py-2 rounded-xl hover:bg-gray-800 transition-colors">
              <Plus className="w-5 h-5" />
            </button>
          </form>
        </div>
        <ul className="divide-y divide-gray-100">
          {activities.map((item) => (
            <li key={item.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div>
                <p className="font-medium text-gray-900">{item.label_pl}</p>
                <p className="text-xs text-gray-400 font-mono">{item.value}</p>
              </div>
              {/* ИСПРАВЛЕНО: добавлено !! */}
              <form action={toggleDictionaryStatus.bind(null, item.id, !!item.is_active)}>
                <button type="submit" className={`p-2 rounded-lg transition-colors ${item.is_active ? 'text-green-600 bg-green-50 hover:bg-green-100' : 'text-gray-400 bg-gray-100 hover:bg-gray-200'}`} title={item.is_active ? 'Aktywne' : 'Ukryte'}>
                  {item.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </form>
            </li>
          ))}
        </ul>
      </div>

      {/* БЛОК ГОРОДОВ */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Miasta i kurorty</h2>
          <form action={addDictionaryItem} className="flex gap-2">
            <input type="hidden" name="category" value="city" />
            <input name="value" required placeholder="Nazwa systemowa (np. zakopane)" className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#0071e3]" />
            <input name="label_pl" required placeholder="Nazwa PL (np. Zakopane)" className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#0071e3]" />
            <button type="submit" className="bg-gray-900 text-white px-4 py-2 rounded-xl hover:bg-gray-800 transition-colors">
              <Plus className="w-5 h-5" />
            </button>
          </form>
        </div>
        <ul className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
          {cities.map((item) => (
            <li key={item.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div>
                <p className="font-medium text-gray-900">{item.label_pl}</p>
                <p className="text-xs text-gray-400 font-mono">{item.value}</p>
              </div>
              {/* ИСПРАВЛЕНО: добавлено !! */}
              <form action={toggleDictionaryStatus.bind(null, item.id, !!item.is_active)}>
                <button type="submit" className={`p-2 rounded-lg transition-colors ${item.is_active ? 'text-green-600 bg-green-50 hover:bg-green-100' : 'text-gray-400 bg-gray-100 hover:bg-gray-200'}`} title={item.is_active ? 'Aktywne' : 'Ukryte'}>
                  {item.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </form>
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
}

export default function AdminDictionariesPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900">Słowniki</h1>
        <p className="text-gray-500 mt-1">Zarządzaj dostępnymi aktywnościami i miastami w serwisie.</p>
      </div>
      <Suspense fallback={<div className="text-center py-20 text-gray-500">Ładowanie...</div>}>
        <DictionariesContent />
      </Suspense>
    </div>
  );
}