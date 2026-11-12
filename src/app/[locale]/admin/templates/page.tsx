import { Suspense } from 'react';
import { createClient } from '@/utils/supabase/server';
import { connection } from 'next/server';
import { addTemplate, deleteTemplate } from './actions';
import { Plus, Trash2, FileText } from 'lucide-react';

async function TemplatesContent() {
  await connection();
  const supabase = await createClient();

  const { data: templates } = await supabase
    .from('admin_templates')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* Форма добавления */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 h-fit">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5" /> Nowy szablon
        </h2>
        <form action={addTemplate} className="space-y-4">
          <div className="p-3 bg-gray-50 rounded-xl space-y-3">
            <p className="text-xs font-bold text-gray-500 uppercase">Wersja Polska (PL)</p>
            <div>
              <label className="text-xs font-semibold text-gray-500">Krótki tytuł</label>
              <input name="title_pl" required placeholder="np. Spam w wiadomościach" className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm mt-1 outline-none focus:border-[#0071e3]" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500">Treść wiadomości</label>
              <textarea name="content_pl" required rows={3} placeholder="np. Zostałeś zablokowany za wysyłanie spamu..." className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm mt-1 outline-none focus:border-[#0071e3]" />
            </div>
          </div>

          <div className="p-3 bg-gray-50 rounded-xl space-y-3">
            <p className="text-xs font-bold text-gray-500 uppercase">English Version (EN)</p>
            <div>
              <label className="text-xs font-semibold text-gray-500">Short title</label>
              <input name="title_en" required placeholder="e.g. Spam in messages" className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm mt-1 outline-none focus:border-[#0071e3]" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500">Message content</label>
              <textarea name="content_en" required rows={3} placeholder="e.g. You have been blocked for spamming..." className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm mt-1 outline-none focus:border-[#0071e3]" />
            </div>
          </div>

          <button type="submit" className="w-full py-3 bg-[#0071e3] text-white rounded-xl font-medium hover:bg-[#0077ed] transition-colors">
            Dodaj szablon
          </button>
        </form>
      </div>

      {/* Список шаблонов */}
      <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden h-fit">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <FileText className="w-5 h-5" /> Zapisane szablony
          </h2>
        </div>
        <ul className="divide-y divide-gray-100">
          {templates?.map((t) => (
            <li key={t.id} className="p-6 flex items-start justify-between gap-4 hover:bg-gray-50 transition-colors">
              <div className="w-full">
                <div className="mb-3">
                  <p className="font-semibold text-gray-900 mb-1">{t.title_pl} <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded ml-1">PL</span></p>
                  <p className="text-sm text-gray-600 bg-white p-3 rounded-xl border border-gray-100">{t.content_pl}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-1">{t.title_en} <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded ml-1">EN</span></p>
                  <p className="text-sm text-gray-600 bg-white p-3 rounded-xl border border-gray-100">{t.content_en}</p>
                </div>
              </div>
              <form action={deleteTemplate}>
                <input type="hidden" name="id" value={t.id} />
                <button type="submit" className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0" title="Usuń">
                  <Trash2 className="w-5 h-5" />
                </button>
              </form>
            </li>
          ))}
          {(!templates || templates.length === 0) && (
            <li className="p-6 text-center text-gray-500 text-sm">Brak zapisanych szablonów.</li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default function AdminTemplatesPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900">Szablony wiadomości</h1>
        <p className="text-gray-500 mt-1">Twórz gotowe powody banów i ostrzeżeń dla użytkowników.</p>
      </div>
      <Suspense fallback={<div className="text-center py-20 text-gray-500">Ładowanie...</div>}>
        <TemplatesContent />
      </Suspense>
    </div>
  );
}