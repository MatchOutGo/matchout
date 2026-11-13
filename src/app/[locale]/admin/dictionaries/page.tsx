import { Suspense } from 'react';
import { createClient } from '@/utils/supabase/server';
import { connection } from 'next/server';
import { addDictionaryItem, toggleDictionaryStatus } from './actions';
import { Plus, Eye, EyeOff, Settings2 } from 'lucide-react';

async function DictionariesContent() {
  await connection();
  const supabase = await createClient();

  const { data: dictionaries } = await supabase
    .from('dictionaries')
    .select('*')
    .order('sort_order', { ascending: true });

  const featureFlags = dictionaries?.filter(d => d.category === 'feature_flag') || [];
  const activities = dictionaries?.filter(d => d.category === 'activity') || [];
  const cities = dictionaries?.filter(d => d.category === 'city') || [];

  return (
    <div className="space-y-8">
      
      {/* БЛОК: ФУНКЦИИ САЙТА (Feature Flags) */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Settings2 className="w-5 h-5" /> Funkcje serwisu (Włącz / Wyłącz)
          </h2>
          <p className="text-sm text-gray-500 mt-1">Zarządzaj widocznością pól w formularzach i filtrach.</p>
        </div>
        <ul className="divide-y divide-gray-100">
          {featureFlags.map((item) => (
            <li key={item.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div>
                <p className="font-medium text-gray-900">{item.label_pl}</p>
                <p className="text-xs text-gray-400 font-mono">{item.value}</p>
              </div>
              <form action={toggleDictionaryStatus.bind(null, item.id, !!item.is_active)}>
                <button type="submit" className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors font-medium text-sm ${
                  item.is_active ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-50 text-red-600 hover:bg-red-100'
                }`}>
                  {item.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  {item.is_active ? 'Włączone' : 'Wyłączone'}
                </button>
              </form>
            </li>
          ))}
        </ul>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* БЛОК АКТИВНОСТЕЙ */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Rodzaje aktywności</h2>
            <form action={addDictionaryItem} className="flex gap-2">
              <input type="hidden" name="category" value="activity" />
              <input name="value" required placeholder="Nazwa systemowa (np. ski_touring)" className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#0071e3]" />
              <input name="label_pl" required placeholder="Nazwa PL" className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#0071e3]" />
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
                <form action={toggleDictionaryStatus.bind(null, item.id, !!item.is_active)}>
                  <button type="submit" className={`p-2 rounded-lg transition-colors ${item.is_active ? 'text-green-600 bg-green-50 hover:bg-green-100' : 'text-gray-400 bg-gray-100 hover:bg-gray-200'}`}>
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
              <input name="value" required placeholder="Nazwa systemowa" className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#0071e3]" />
              <input name="label_pl" required placeholder="Nazwa PL" className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#0071e3]" />
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
                <form action={toggleDictionaryStatus.bind(null, item.id, !!item.is_active)}>
                  <button type="submit" className={`p-2 rounded-lg transition-colors ${item.is_active ? 'text-green-600 bg-green-50 hover:bg-green-100' : 'text-gray-400 bg-gray-100 hover:bg-gray-200'}`}>
                    {item.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </form>
              </li>
            ))}
          </ul>
        </div>
      </div>

    </div>
  );
}

export default function AdminDictionariesPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900">Słowniki</h1>
        <p className="text-gray-500 mt-1">Zarządzaj aktywnościami, miastami i funkcjami serwisu.</p>
      </div>
      <Suspense fallback={<div className="text-center py-20 text-gray-500">Ładowanie...</div>}>
        <DictionariesContent />
      </Suspense>
    </div>
  );
}