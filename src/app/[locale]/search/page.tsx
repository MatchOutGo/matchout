import { Suspense } from 'react';
import { createClient } from '@/utils/supabase/server';
import { connection } from 'next/server';
import { unstable_noStore as noStore } from 'next/cache';
import { Link } from '@/i18n/routing';
import { ArrowLeft } from 'lucide-react';
import SearchFilters from './SearchFilters';

async function SearchPageContent() {
  noStore();
  await connection();
  const supabase = await createClient();
  
  const { data: countries } = await supabase
    .from('dictionaries')
    .select('*')
    .eq('category', 'country')
    .eq('is_active', true)
    .order('sort_order');

  // ИЩЕМ ТОЛЬКО ГОРОДА ПОЛЬШИ (parent_value = 'polska') И БЕРЕМ ИХ ВСЕ
  const { data: cities } = await supabase
    .from('dictionaries')
    .select('*')
    .eq('category', 'city')
    .eq('parent_value', 'polska') // <--- ВОТ ГЛАВНЫЙ ФИКС
    .eq('is_active', true)
    .range(0, 2000) 
    .order('label_pl');

  console.log(`🔥 Пришло городов Польши из базы: ${cities?.length}`);

  return (
    <div className="max-w-3xl mx-auto py-12">
      <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Wróć
      </Link>
      
      <div className="text-center mb-10">
        <h1 className="text-4xl font-black text-[#0066cc] mb-4">Znajdź swój wyjazd</h1>
        <p className="text-gray-500">Wybierz kryteria, a my pokażemy Ci najlepsze opcje.</p>
      </div>

      <SearchFilters 
        countries={countries || []} 
        cities={cities || []} 
      />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-500">Ładowanie...</div>}>
      <SearchPageContent />
    </Suspense>
  );
}