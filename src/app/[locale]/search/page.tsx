import { Suspense } from 'react';
import { createClient } from '@/utils/supabase/server';
import { connection } from 'next/server';
import { Link } from '@/i18n/routing';
import { ArrowLeft } from 'lucide-react';
import SearchFilters from './SearchFilters';

async function SearchPageContent() {
  await connection();
  const supabase = await createClient();
  
  // Берем активности, страны И города для фильтров
  const { data: activities } = await supabase.from('dictionaries').select('*').eq('category', 'activity').eq('is_active', true).order('sort_order');
  const { data: countries } = await supabase.from('dictionaries').select('*').eq('category', 'country').eq('is_active', true).order('sort_order');
  const { data: cities } = await supabase.from('dictionaries').select('*').eq('category', 'city').eq('is_active', true).order('sort_order');

  return (
    <div className="max-w-3xl mx-auto py-12">
      <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Wróć
      </Link>
      
      <div className="text-center mb-10">
        <h1 className="text-4xl font-black text-[#0066cc] mb-4">Znajdź swój wyjazd</h1>
        <p className="text-gray-500">Wybierz kryteria, a my pokażemy Ci najlepsze opcje.</p>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
        {/* Передаем все три массива */}
        <SearchFilters 
          activities={activities || []} 
          countries={countries || []} 
          cities={cities || []} 
        />
      </div>
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