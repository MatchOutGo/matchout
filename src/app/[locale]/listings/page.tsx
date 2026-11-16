/* eslint-disable @typescript-eslint/no-explicit-any */

import { Suspense } from 'react';
import { createClient } from '@/utils/supabase/server';
import { Link } from '@/i18n/routing'; 
import { connection } from 'next/server';
import { MapPin, Calendar, User, Bus } from 'lucide-react';
import FilterSidebar from '@/components/FilterSidebar';
import { getTranslations, getLocale } from 'next-intl/server';

type SearchParams = {
  activity?: string;
  countries?: string;
  cities?: string;
  dateStart?: string;
  dateEnd?: string;
  transport?: string;
  priceType?: string;
  origin?: string; // Добавили Skąd
  sort?: string;
}

async function ListingsList({ searchParams, locale, activities }: { searchParams: Promise<SearchParams>, locale: string, activities: any[] }) {
  const params = await searchParams;
  const { activity, countries, cities, dateStart, dateEnd, transport, priceType, origin } = params;
  const supabase = await createClient();

  let query = (supabase
    .from('listings') as any)
    .select(`*, profiles!user_id (first_name, avatar_url)`)
    .eq('type', 'offer')
    .eq('status', 'published')
    .order('price_type', { ascending: false })
    .order('created_at', { ascending: false });

  if (activity) query = query.eq('activity', activity);
  
  if (countries) {
    const countryArr = countries.split(',');
    if (countryArr.length > 0) query = query.overlaps('countries', countryArr);
  }
  
  if (cities) {
    const cityArr = cities.split(',');
    if (cityArr.length > 0) query = query.overlaps('cities', cityArr);
  }
  
  if (dateStart) query = query.gte('date_end', dateStart);
  if (dateEnd) query = query.lte('date_start', dateEnd);
  
  if (transport === 'osobowy') query = query.ilike('trip_type', '%car%');
  if (transport === 'bus') query = query.ilike('trip_type', '%bus%');
  
  if (priceType === 'shared') query = query.eq('price_type', 'shared');

  // Фильтр по "Skąd"
  if (origin) {
    query = query.or(`origin_city.ilike.%${origin}%,pickup_cities.cs.["${origin}"]`);
  }

  const { data: listings } = await query;

  if (!listings || listings.length === 0) {
    return (
      <div className="text-center py-24 bg-white rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] h-full flex flex-col justify-center items-center mt-6">
        <p className="text-gray-500 text-lg mb-6">Brak ogłoszeń dla wybranych filtrów.</p>
        <Link href="/listings" locale={locale} className="text-[#0066cc] font-medium hover:underline bg-indigo-50 px-4 py-2 rounded-xl">
          Pokaż wszystkie
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {listings.map((listing: any) => {
        const activityLabel = activities.find(a => a.value === listing.activity)?.label_pl || listing.activity;
        
        const author = Array.isArray(listing.profiles) ? listing.profiles[0] : listing.profiles;
        const authorName = author?.first_name || 'Użytkownik';
        const dateStartFormatted = listing.date_start ? new Date(listing.date_start).toLocaleDateString(locale === 'pl' ? 'pl-PL' : 'en-GB', { day: 'numeric', month: 'short' }) : '';
        const dateEndFormatted = listing.date_end ? new Date(listing.date_end).toLocaleDateString(locale === 'pl' ? 'pl-PL' : 'en-GB', { day: 'numeric', month: 'short' }) : '';

        return (
          <Link 
            href={`/listings/${listing.id}`} locale={locale} key={listing.id} 
            className="bg-white rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] transition-all duration-300 cursor-pointer flex flex-col overflow-hidden group"
          >
            <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={listing.cover_image || `/images/activities/${listing.activity}1.jpg`} alt={listing.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold text-gray-900 shadow-sm uppercase tracking-wide">
                {activityLabel}
              </div>
              {listing.trip_type?.includes('bus') && (
                <div className="absolute top-3 right-3 bg-purple-600 text-white px-2.5 py-1 rounded-full text-[11px] font-bold shadow-sm flex items-center gap-1">
                  <Bus className="w-3 h-3" /> BUS
                </div>
              )}
            </div>

            <div className="p-5 flex-1 flex flex-col">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 tracking-tight group-hover:text-[#0066cc] transition-colors">{listing.title}</h3>
              
              <div className="space-y-2 text-[13px] text-gray-500 mb-4 flex-1">
                {listing.cities && listing.cities.length > 0 && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span className="text-gray-900 font-medium">Dokąd:</span> <span className="truncate">{listing.cities.join(', ')}</span>
                  </div>
                )}
                {listing.origin_city && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#0066cc] shrink-0" />
                    <span className="text-gray-900 font-medium">Skąd:</span> <span className="truncate">{listing.origin_city}</span>
                    {listing.pickup_cities && listing.pickup_cities.length > 0 && (
                      <span className="text-xs text-gray-400 truncate">(+ {listing.pickup_cities.join(', ')})</span>
                    )}
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  <span className="text-gray-900 font-medium">Kiedy:</span> {dateStartFormatted} — {dateEndFormatted}
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  <span className="text-gray-900 font-medium">Autor:</span> {authorName}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[12px] font-medium text-[#0066cc] bg-indigo-50 px-2.5 py-1 rounded-md">
                  {listing.current_participants} / {listing.max_participants} osób
                </span>
                {listing.price_type !== 'shared' && listing.prepayment_required && (
                  <span className="text-[11px] font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-md">
                    Zaliczka: {listing.prepayment_amount} zł
                  </span>
                )}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

async function HomePageContent({ searchParams }: { searchParams: Promise<SearchParams> }) {
  await connection();
  const params = await searchParams;
  const supabase = await createClient();
  
  const locale = await getLocale();
  const tHome = await getTranslations('Home');

  const { data: activities } = await supabase.from('dictionaries').select('*').eq('category', 'activity').eq('is_active', true).order('sort_order');
  const { data: countries } = await supabase.from('dictionaries').select('*').eq('category', 'country').eq('is_active', true).order('sort_order');
  const { data: cities } = await supabase.from('dictionaries').select('*').eq('category', 'city').eq('is_active', true).order('sort_order');

  const hasActiveFilters = params.activity || params.countries || params.cities || params.dateStart || params.dateEnd || params.transport || params.priceType || params.origin;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pt-2">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-gray-900">{tHome('title')}</h1>
          <p className="text-md text-gray-500 max-w-xl">{tHome('subtitle')}</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-4 bg-white p-3 rounded-2xl shadow-sm border border-gray-100 shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://snowandgo.pl" 
              alt="QR Code" 
              className="w-14 h-14 rounded-lg"
            />
            <div>
              <p className="text-sm font-semibold text-gray-900">Pobierz aplikację</p>
              <p className="text-xs text-gray-500">Zeskanuj kod aparatem</p>
            </div>
          </div>

          <Link href="/listings/create" locale={locale} className="bg-[#0066cc] text-white px-6 py-2.5 rounded-full font-medium hover:bg-[#004c99] transition-colors shadow-sm shrink-0">
            {tHome('createBtn')}
          </Link>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <FilterSidebar 
          params={params} 
          countries={countries || []}
          cities={cities || []}
          hasActiveFilters={!!hasActiveFilters} 
        />
        <main className="flex-1 w-full min-w-0">
          <Suspense fallback={<div className="text-center py-20 text-gray-500">Ładowanie ogłoszeń...</div>}>
            <ListingsList searchParams={searchParams} locale={locale} activities={activities || []} />
          </Suspense>
        </main>
      </div>
    </div>
  );
}

export default function HomePage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[50vh]"><div className="text-gray-500 text-lg">Ładowanie...</div></div>}>
      <HomePageContent searchParams={searchParams} />
    </Suspense>
  );
}