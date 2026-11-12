import { Suspense } from 'react';
import { createClient } from '@/utils/supabase/server';
import { Link } from '@/i18n/routing'; 
import { connection } from 'next/server';
import { MapPin, Calendar, User } from 'lucide-react';
import FilterSidebar from '@/components/FilterSidebar';
import { getTranslations, getLocale } from 'next-intl/server';

type SearchParams = {
  type?: string;
  city?: string;
  activity?: string;
  maxPrice?: string;
  dateStart?: string;
  dateEnd?: string;
  gender?: string;
  children?: string;
  prepayment?: string;
}

async function ListingsList({ searchParams, locale }: { searchParams: Promise<SearchParams>, locale: string }) {
  const params = await searchParams;
  const { type, city, activity, maxPrice, dateStart, dateEnd, gender, children, prepayment } = params;
  const supabase = await createClient();

  let query = supabase
    .from('listings')
    .select(`
      *,
      profiles!user_id (first_name, avatar_url)
    `)
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  if (type && (type === 'offer' || type === 'seek')) query = query.eq('type', type);
  if (activity) query = query.eq('activity', activity);
  if (city) query = query.ilike('city', `%${city}%`);
  if (maxPrice) query = query.lte('budget_max', Number(maxPrice));
  if (dateStart) query = query.gte('date_end', dateStart);
  if (dateEnd) query = query.lte('date_start', dateEnd);
  if (gender) query = query.eq('gender_pref', gender);
  if (children) query = query.eq('children_allowed', children);
  if (prepayment === 'true') query = query.eq('prepayment_required', true);

  const { data: listings } = await query;

  if (!listings || listings.length === 0) {
    return (
      <div className="text-center py-24 bg-white rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] h-full flex flex-col justify-center items-center mt-6">
        <p className="text-gray-500 text-lg mb-6">Brak ogłoszeń dla wybranych filtrów.</p>
        <Link href="/" locale={locale} className="text-[#0071e3] font-medium hover:underline bg-blue-50 px-4 py-2 rounded-xl">
          Wyczyść wszystkie filtry
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {listings.map((listing) => {
        const author = Array.isArray(listing.profiles) ? listing.profiles[0] : listing.profiles;
        const authorName = author?.first_name || 'Użytkownik';
        
        const dateStartFormatted = listing.date_start ? new Date(listing.date_start).toLocaleDateString(locale === 'pl' ? 'pl-PL' : 'en-GB', { day: 'numeric', month: 'short' }) : '';
        const dateEndFormatted = listing.date_end ? new Date(listing.date_end).toLocaleDateString(locale === 'pl' ? 'pl-PL' : 'en-GB', { day: 'numeric', month: 'short' }) : '';

        return (
          <Link 
            href={`/listings/${listing.id}`} 
            locale={locale} 
            key={listing.id} 
            className="bg-white rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] transition-all duration-300 cursor-pointer flex flex-col overflow-hidden group"
          >
            <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
              <img src={listing.cover_image || `/images/activities/${listing.activity}1.jpg`} alt={listing.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold text-gray-900 shadow-sm uppercase tracking-wide">
                {listing.activity}
              </div>
              {listing.type === 'seek' && (
                <div className="absolute top-3 right-3 bg-gray-900/90 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-[11px] font-bold shadow-sm">
                  Szuka ekipy
                </div>
              )}
            </div>

            <div className="p-5 flex-1 flex flex-col">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 tracking-tight group-hover:text-[#0071e3] transition-colors">{listing.title}</h3>
              
              <div className="space-y-2 text-[13px] text-gray-500 mb-4 flex-1">
                {listing.city && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span className="text-gray-900 font-medium">Gdzie:</span> <span className="truncate">{listing.city}</span>
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
                <span className="text-[12px] font-medium text-[#0071e3] bg-blue-50 px-2.5 py-1 rounded-md">
                  {listing.type === 'seek' 
                    ? `Budżet: ${listing.budget_max || '?'} zł` 
                    : `${listing.current_participants} / ${listing.max_participants} osób`}
                </span>
                {listing.prepayment_required && (
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

  const { data: activities } = await supabase
    .from('dictionaries')
    .select('*')
    .eq('category', 'activity')
    .eq('is_active', true)
    .order('sort_order');

  const hasActiveFilters = params.type || params.city || params.activity || params.maxPrice || params.dateStart || params.dateEnd || params.gender || params.children || params.prepayment;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pt-2">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-gray-900">
            {tHome('title')}
          </h1>
          <p className="text-md text-gray-500 max-w-xl">
            {tHome('subtitle')}
          </p>
        </div>
        
        <Link href="/listings/create" locale={locale} className="bg-[#0071e3] text-white px-6 py-2.5 rounded-full font-medium hover:bg-[#0077ed] transition-colors shadow-sm shrink-0">
          {tHome('createBtn')}
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        <FilterSidebar 
          params={params} 
          activities={activities || []} 
          hasActiveFilters={!!hasActiveFilters} 
        />

        <main className="flex-1 w-full min-w-0">
          <Suspense fallback={<div className="text-center py-20 text-gray-500">Ładowanie ogłoszeń...</div>}>
            <ListingsList searchParams={searchParams} locale={locale} />
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