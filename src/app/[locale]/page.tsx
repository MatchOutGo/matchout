/* eslint-disable @typescript-eslint/no-explicit-any */

import { Suspense } from 'react';
import { createClient } from '@/utils/supabase/server';
import { connection } from 'next/server';
import { getLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { Search, PlusCircle, ArrowRight, MapPin, Calendar, User } from 'lucide-react';

type ExtraLine = { id: string, text: string, isActive: boolean, animation: string };
type DictItem = { value: string; label_pl: string };

async function LandingContent() {
  await connection();
  const supabase = await createClient();
  const locale = await getLocale();
  
  // 1. Получаем настройки лендинга
  const { data: settings } = await supabase.from('site_settings').select('*');
  
  const textKey = locale === 'pl' ? 'landing_text_pl' : 'landing_text_en';
  const landingText = settings?.find(s => s.key === textKey)?.value || 'Wyszukiwarka wolnych miejsc...';
  
  const customBannerUrl = settings?.find(s => s.key === 'landing_banner_url')?.value;
  
  let extraLines: ExtraLine[] = [];
  try {
    const rawExtra = settings?.find(s => s.key === 'landing_extra_lines')?.value;
    if (rawExtra) extraLines = JSON.parse(rawExtra);
  } catch (e) {
    console.error("Ошибка парсинга JSON строк", e);
  }

  const activeLines = extraLines.filter(l => l.isActive);

  // 2. Получаем активности для правильных названий на карточках
  const { data: activitiesData } = await supabase.from('dictionaries').select('*').eq('category', 'activity').eq('is_active', true);
  const activities = (activitiesData as DictItem[]) || [];

  // 3. Получаем 3 последних объявления
  const { data: recentListings } = await supabase
    .from('listings')
    .select(`*, profiles!user_id (first_name)`)
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(3);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4 overflow-hidden py-12">
      
      {/* БЛОК БАННЕРА */}
      <div className="w-full max-w-5xl mb-10 overflow-hidden rounded-[2rem] shadow-2xl anim-fade-in bg-gray-100">
        {customBannerUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img 
            src={customBannerUrl} 
            alt="Snow&Go Banner" 
            className="w-full h-[200px] md:h-[300px] object-cover object-center" 
          />
        ) : (
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

      <div className="flex flex-col sm:flex-row gap-6 w-full max-w-2xl justify-center mb-12 anim-fade-in" style={{ animationDelay: '0.4s' }}>
        
        {/* КНОПКА SZUKAM */}
        <Link 
          href="/search" 
          className="flex-1 flex flex-col items-center justify-center gap-3 bg-[#eef4fc] border-2 border-[#0066cc] hover:bg-[#e2eefb] p-8 rounded-3xl shadow-[0_8px_20px_rgba(0,102,204,0.1)] hover:shadow-[0_8px_30px_rgba(0,102,204,0.2)] transition-all duration-300 group"
        >
          <div className="w-16 h-16 rounded-full bg-[#0066cc] flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-sm">
            <Search className="w-8 h-8" />
          </div>
          <span className="text-2xl font-bold text-[#0066cc]">Szukam</span>
          <span className="text-sm text-[#0066cc]/80 font-medium">Wolnych miejsc na wyjazd</span>
        </Link>

        {/* КНОПКА OFERUJĘ */}
        <Link 
          href="/listings/create" 
          className="flex-1 flex flex-col items-center justify-center gap-3 bg-[#0066cc] border-2 border-[#0066cc] hover:bg-[#004c99] p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 group"
        >
          <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
            <PlusCircle className="w-8 h-8" />
          </div>
          <span className="text-2xl font-bold text-white">Oferuję</span>
          <span className="text-sm text-blue-100 font-medium">Mam wolne miejsca na wyjazd</span>
        </Link>
      </div>

      {activeLines.length > 0 && (
        <div className="flex flex-col gap-4 max-w-2xl w-full mb-12">
          {activeLines.map((line, index) => {
            let animClass = 'anim-fade-in';
            if (line.animation === 'slide-left') animClass = 'anim-slide-left';
            if (line.animation === 'slide-right') animClass = 'anim-slide-right';

            return (
              <div 
                key={line.id}
                className={`text-xl md:text-2xl text-gray-800 font-bold ${animClass}`}
                style={{ animationDelay: `${0.6 + index * 0.2}s` }} 
              >
                {line.text}
              </div>
            );
          })}
        </div>
      )}

      {/* БЛОК С 3 ОФФЕРАМИ */}
      {recentListings && recentListings.length > 0 && (
        <div className="w-full max-w-5xl anim-fade-in" style={{ animationDelay: '0.8s' }}>
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 border-b border-gray-200 pb-4 gap-4">
            <h2 className="text-2xl font-bold text-gray-900">Ostatnie oferty</h2>
            <Link href="/listings" className="text-[#0066cc] font-semibold hover:text-[#004c99] transition-colors flex items-center gap-2 bg-indigo-50 px-5 py-2.5 rounded-full">
              Zobacz więcej <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {recentListings.map((listing: any) => {
              const activityLabel = activities.find(a => a.value === listing.activity)?.label_pl || listing.activity;
              const author = Array.isArray(listing.profiles) ? listing.profiles[0] : listing.profiles;
              const dateStartFormatted = listing.date_start ? new Date(listing.date_start).toLocaleDateString(locale === 'pl' ? 'pl-PL' : 'en-GB', { day: 'numeric', month: 'short' }) : '';
              const dateEndFormatted = listing.date_end ? new Date(listing.date_end).toLocaleDateString(locale === 'pl' ? 'pl-PL' : 'en-GB', { day: 'numeric', month: 'short' }) : '';

              return (
                <Link 
                  href={`/listings/${listing.id}`} 
                  key={listing.id} 
                  className="bg-white rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] transition-all duration-300 cursor-pointer flex flex-col overflow-hidden group border border-gray-100"
                >
                  <div className="relative h-40 w-full bg-gray-100 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={listing.cover_image || `/images/activities/${listing.activity}1.jpg`} 
                      alt={listing.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold text-gray-900 shadow-sm uppercase tracking-wide">
                      {activityLabel}
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 tracking-tight group-hover:text-[#0066cc] transition-colors">
                      {listing.title}
                    </h3>
                    
                    <div className="space-y-2 text-[13px] text-gray-500 flex-1">
                      {listing.cities && listing.cities.length > 0 && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span className="truncate">{listing.cities.join(', ')}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span>{dateStartFormatted} — {dateEndFormatted}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span>{author?.first_name || 'Użytkownik'}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
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