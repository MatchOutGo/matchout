import { Suspense } from 'react';
import { createClient } from '@/utils/supabase/server';
import { connection } from 'next/server';
import { getLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { Search, PlusCircle } from 'lucide-react';

type ExtraLine = { id: string, text: string, isActive: boolean, animation: string };

async function LandingContent() {
  await connection();
  const supabase = await createClient();
  const locale = await getLocale();
  
  const { data: settings } = await supabase.from('site_settings').select('*');
  
  const textKey = locale === 'pl' ? 'landing_text_pl' : 'landing_text_en';
  const landingText = settings?.find(s => s.key === textKey)?.value || 'Wyszukiwarka wolnych miejsc...';
  
  // Пока оставляем видео по умолчанию, но если заказчик впишет URL в админке - покажем картинку
  const customBannerUrl = settings?.find(s => s.key === 'landing_banner_url')?.value;
  
  let extraLines: ExtraLine[] = [];
  try {
    const rawExtra = settings?.find(s => s.key === 'landing_extra_lines')?.value;
    if (rawExtra) extraLines = JSON.parse(rawExtra);
  } catch (e) {
    console.error("Ошибка парсинга JSON строк", e);
  }

  const activeLines = extraLines.filter(l => l.isActive);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4 overflow-hidden">
      
      {/* БЛОК БАННЕРА */}
      <div className="w-full max-w-5xl mb-10 overflow-hidden rounded-[2rem] shadow-2xl anim-fade-in bg-gray-100">
        {customBannerUrl ? (
          // Если заказчик вписал URL рекламы, показываем картинку
          <img 
            src={customBannerUrl} 
            alt="Snow&Go Banner" 
            className="w-full h-[200px] md:h-[300px] object-cover object-center" 
          />
        ) : (
          // По умолчанию показываем видео
          <video 
            src="/banner.mp4" 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="w-full h-[200px] md:h-[300px] object-cover object-center"
          />
        )}
      </div>

      <h1 className="text-4xl md:text-6xl font-black text-[#0066cc] tracking-tighter leading-tight max-w-4xl mb-12 anim-fade-in" style={{ animationDelay: '0.2s' }}>
        {landingText}
      </h1>

      <div className="flex flex-col sm:flex-row gap-6 w-full max-w-2xl justify-center mb-16 anim-fade-in" style={{ animationDelay: '0.4s' }}>
        <Link 
          href="/search" 
          className="flex-1 flex flex-col items-center justify-center gap-3 bg-white border-2 border-[#0066cc]/10 hover:border-[#0066cc] p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 group"
        >
          <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center text-[#0066cc] group-hover:scale-110 transition-transform">
            <Search className="w-8 h-8" />
          </div>
          <span className="text-2xl font-bold text-[#0066cc]">Szukam</span>
          <span className="text-sm text-gray-500">Chcę dołączyć do wyjazdu</span>
        </Link>

        <Link 
          href="/listings/create" 
          className="flex-1 flex flex-col items-center justify-center gap-3 bg-[#0066cc] border-2 border-[#0066cc] hover:bg-[#004c99] p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 group"
        >
          <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
            <PlusCircle className="w-8 h-8" />
          </div>
          <span className="text-2xl font-bold text-white">Oferuję</span>
          <span className="text-sm text-indigo-200">Mam miejsce, szukam ekipy</span>
        </Link>
      </div>

      {activeLines.length > 0 && (
        <div className="flex flex-col gap-4 max-w-2xl w-full">
          {activeLines.map((line, index) => {
            let animClass = 'anim-fade-in';
            if (line.animation === 'slide-left') animClass = 'anim-slide-left';
            if (line.animation === 'slide-right') animClass = 'anim-slide-right';

            return (
              <div 
                key={line.id}
                className={`text-xl md:text-2xl text-gray-600 font-medium ${animClass}`}
                style={{ animationDelay: `${0.6 + index * 0.2}s` }} 
              >
                {line.text}
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="min-h-[80vh] flex items-center justify-center text-gray-500">Ładowanie...</div>}>
      <LandingContent />
    </Suspense>
  );
}