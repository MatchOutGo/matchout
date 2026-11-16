import { Suspense } from 'react';
import { createClient } from '@/utils/supabase/server';
import { connection } from 'next/server';
import { updateSettings } from './actions';

async function SettingsContent() {
  await connection();
  const supabase = await createClient();
  const { data: settings } = await supabase.from('site_settings').select('*');
  
  const textPl = settings?.find(s => s.key === 'landing_text_pl')?.value || '';
  const textEn = settings?.find(s => s.key === 'landing_text_en')?.value || '';
  const extraLines = settings?.find(s => s.key === 'landing_extra_lines')?.value || '[]';
  const bannerUrl = settings?.find(s => s.key === 'landing_banner_url')?.value || '';

  return (
    <form action={updateSettings} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-8">
      
      {/* Главный заголовок */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold border-b pb-2">Tekst główny (H1)</h2>
        <div>
          <label className="block text-sm font-medium mb-1">Wersja Polska</label>
          <textarea name="landing_text_pl" defaultValue={textPl} rows={2} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:border-[#0066cc]" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">English Version</label>
          <textarea name="landing_text_en" defaultValue={textEn} rows={2} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:border-[#0066cc]" />
        </div>
      </div>

      {/* Дополнительные строки */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold border-b pb-2">Dodatkowe linie tekstu</h2>
        <p className="text-sm text-gray-500">Dodaj linie w formacie JSON. Dostępne animacje: <code>slide-left</code>, <code>slide-right</code>, <code>fade-in</code>.</p>
        <textarea 
          name="landing_extra_lines" 
          defaultValue={extraLines} 
          rows={10} 
          className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 font-mono text-sm outline-none focus:border-[#0066cc]" 
        />
      </div>

      {/* Баннер (на будущее) */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold border-b pb-2">Baner reklamowy (opcjonalnie)</h2>
        <p className="text-sm text-gray-500">Zostaw puste, aby wyświetlić domyślne wideo. Wpisz URL, aby wyświetlić obrazek reklamowy.</p>
        <div>
          <label className="block text-sm font-medium mb-1">URL obrazka (Baner)</label>
          <input name="landing_banner_url" defaultValue={bannerUrl} placeholder="https://..." className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:border-[#0066cc]" />
        </div>
      </div>

      <button type="submit" className="bg-[#0066cc] text-white px-8 py-3 rounded-xl font-medium hover:bg-[#004c99] transition-colors">
        Zapisz zmiany
      </button>
    </form>
  );
}

export default function AdminSettingsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-semibold">Ustawienia strony</h1>
      <Suspense fallback={<div>Ładowanie...</div>}>
        <SettingsContent />
      </Suspense>
    </div>
  );
}