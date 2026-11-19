import { Suspense } from 'react';
import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import { connection } from 'next/server';
import Link from 'next/link';
import { MapPin, Calendar, ArrowLeft, MessageCircle, Edit, Trash2, Bus, MountainSnow, Wallet } from 'lucide-react';
import { deleteListing } from './actions';
import ReportButton from '@/components/ReportButton';

async function ListingDetails({ params, searchParams }: { params: Promise<{ id: string }>, searchParams: Promise<{ error?: string }> }) {
  await connection();
  
  const { id } = await params;
  const { error } = await searchParams;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  const { data: listing, error: dbError } = await supabase
    .from('listings')
    .select(`*, profiles!user_id (id, first_name, avatar_url, phone)`)
    .eq('id', id)
    .single();

  if (dbError || !listing) notFound();

  const author = Array.isArray(listing.profiles) ? listing.profiles[0] : listing.profiles;
  const authorName = author?.first_name || 'Użytkownik';
  const authorId = listing.user_id; 

  const isOrganizer = user?.id === authorId;

  // Логика цен
  const priceTypes = listing.price_type ? listing.price_type.split(',') : [];
  const hasShared = priceTypes.includes('shared');
  const hasFixedNoMeals = priceTypes.includes('fixed_no_meals');
  const hasFixedWithMeals = priceTypes.includes('fixed_with_meals');

  // Словарь для транспорта
  const tripTypeLabels: Record<string, string> = {
    'bus': 'Bus',
    'osobowy': 'Samochód osobowy',
    'bez_znaczenia': 'Bez znaczenia'
  };

  return (
    <div className="max-w-5xl mx-auto pb-24">
      <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-6 transition-colors group">
        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
        Wróć do ogłoszeń
      </Link>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-2xl border border-red-100 text-sm font-medium">
          Błąd: {error}
        </div>
      )}

      <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.06)] overflow-hidden">
        
        <div className="relative h-72 md:h-96 w-full bg-gray-100">
          <img src={listing.cover_image || `/images/activities/${listing.activity}1.jpg`} alt={listing.title} className="w-full h-full object-cover" />
          <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-semibold text-gray-900 shadow-sm uppercase tracking-wide">
            {listing.activity}
          </div>
          {listing.trip_type?.includes('bus') && (
            <div className="absolute top-6 right-6 bg-purple-600 text-white px-4 py-1.5 rounded-full text-sm font-semibold shadow-sm flex items-center gap-2">
              <Bus className="w-4 h-4" /> Transport Busem
            </div>
          )}
        </div>

        <div className="p-8 md:p-12">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-gray-900 mb-4">{listing.title}</h1>
              
              <div className="flex flex-wrap items-center gap-6 text-gray-500 text-[15px]">
                {listing.countries && listing.countries.length > 0 && (
                  <span className="font-medium text-gray-900 uppercase">{listing.countries.join(', ')}</span>
                )}
                {listing.cities && listing.cities.length > 0 && (
                  <span className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-gray-400" /> {listing.cities.join(', ')}
                  </span>
                )}
                <span className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-gray-400" /> {listing.date_start} — {listing.date_end}
                </span>
                
                {listing.ski_days && (
                  <span className="flex items-center gap-2">
                    <MountainSnow className="w-5 h-5 text-gray-400" /> 
                    {listing.ski_days} {listing.ski_days === 1 ? 'dzień' : 'dni'} na nartach
                  </span>
                )}
              </div>
            </div>
            
            {/* БЛОК С ЦЕНОЙ */}
            <div className="bg-[#f5f5f7] p-6 rounded-2xl text-center min-w-[240px] shrink-0 space-y-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Rodzaj kosztów</p>
              
              {hasFixedNoMeals && (
                <p className="text-sm font-semibold text-gray-900">
                  Koszty ustalone bez wyżywienia: {listing.fixed_price_no_meals} zł
                </p>
              )}
              
              {hasFixedWithMeals && (
                <p className="text-sm font-semibold text-gray-900">
                  Koszty ustalone z wyżywieniem: {listing.fixed_price_with_meals} zł
                </p>
              )}

              {hasShared && (
                <p className="text-sm font-semibold text-gray-900">
                  Koszty dzielone
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            
            {/* ЛЕВАЯ КОЛОНКА (Инфо-блок + Описание) */}
            <div className="md:col-span-2 space-y-8">
              
              {/* БЛОК С ДЕТАЛЯМИ */}
              <section>
                <h2 className="text-xl font-semibold mb-4 text-gray-900">Szczegóły wyjazdu</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                  
                  <div className="bg-gray-50 p-4 rounded-xl flex flex-col justify-center border border-gray-100">
                    <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-1 flex items-center gap-1"><Bus className="w-3 h-3"/> Transport</p>
                    <p className="font-semibold text-sm text-gray-900">{tripTypeLabels[listing.trip_type] || listing.trip_type}</p>
                  </div>

                  {listing.prepayment_required && (
                    <div className="bg-orange-50 p-4 rounded-xl flex flex-col justify-center border border-orange-100">
                      <p className="text-[10px] text-orange-600 uppercase tracking-wide mb-1 flex items-center gap-1"><Wallet className="w-3 h-3"/> Zaliczka</p>
                      <p className="font-semibold text-sm text-orange-900">{listing.prepayment_amount} zł</p>
                    </div>
                  )}
                </div>

                {listing.pickup_cities && listing.pickup_cities.length > 0 && (
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <p className="text-[10px] text-blue-600 uppercase tracking-wide mb-2 font-bold flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" /> Możliwość dosiadki
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {listing.pickup_cities.map((city: string) => (
                        <span key={city} className="px-3 py-1 bg-white text-[#0071e3] text-sm font-medium rounded-lg shadow-sm border border-blue-100">
                          {city}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </section>

              <section className="pt-4 border-t border-gray-100">
                <h2 className="text-xl font-semibold mb-4 text-gray-900">Opis wyjazdu</h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">{listing.description || 'Brak opisu.'}</p>
              </section>
            </div>

            {/* ПРАВАЯ КОЛОНКА */}
            <div className="space-y-6">
              <div className="border border-gray-100 p-6 rounded-2xl shadow-sm bg-white">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-4">
                  {isOrganizer ? 'Twoje ogłoszenie' : 'Organizator'}
                </p>
                
                <Link href={`/users/${authorId}`} className="flex items-center gap-3 mb-6 group">
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600 overflow-hidden group-hover:ring-2 ring-[#0071e3] transition-all shrink-0">
                    {author?.avatar_url ? <img src={author.avatar_url} alt="Avatar" className="w-full h-full object-cover" /> : authorName.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 group-hover:text-[#0071e3] transition-colors truncate">{authorName}</p>
                    <p className="text-xs text-gray-500">Zobacz profil</p>
                  </div>
                </Link>

                <div className="space-y-3">
                  {/* СКРЫВАЕМ КНОПКУ ДЛЯ САМОГО ОРГАНИЗАТОРА */}
                  {!isOrganizer && (
                    <Link href={`/listings/${id}/chat`} className="w-full py-3 bg-[#0071e3] text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-[#0077ed] transition-colors shadow-sm">
                      <MessageCircle className="w-4 h-4" /> Napisz do organizatora
                    </Link>
                  )}
                </div>

                {isOrganizer && (
                  <div className="pt-4 mt-4 border-t border-gray-100 flex gap-2">
                    <Link href={`/listings/${id}/edit`} className="flex-1 py-2 text-center bg-gray-50 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-100 transition-colors flex items-center justify-center gap-1.5">
                      <Edit className="w-3.5 h-3.5" /> Edytuj
                    </Link>
                    <form action={deleteListing} className="flex-1">
                      <input type="hidden" name="listingId" value={id} />
                      <button type="submit" className="w-full py-2 bg-red-50 text-red-600 rounded-xl text-sm font-medium hover:bg-red-100 transition-colors flex items-center justify-center gap-1.5">
                        <Trash2 className="w-3.5 h-3.5" /> Usuń
                      </button>
                    </form>
                  </div>
                )}

                {!isOrganizer && (
                  <div className="pt-4 mt-4 border-t border-gray-100 flex justify-center">
                    <ReportButton listingId={id} />
                  </div>
                )}
              </div>

              <div className="bg-gray-50 p-6 rounded-2xl text-center border border-gray-100">
                <Link 
                  href={`/listings?author=${authorId}`} 
                  className="text-sm font-semibold text-[#0071e3] hover:text-[#004c99] transition-colors underline decoration-2 underline-offset-4"
                >
                  {/* УМНЫЙ ТЕКСТ ССЫЛКИ */}
                  {isOrganizer ? 'Zobacz wszystkie swoje oferty' : 'Zobacz wszystkie oferty tego organizatora'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ListingPage({ params, searchParams }: { params: Promise<{ id: string }>, searchParams: Promise<{ error?: string }> }) {
  return (
    <Suspense fallback={<div className="text-center py-20 text-gray-500">Ładowanie szczegółów...</div>}>
      <ListingDetails params={params} searchParams={searchParams} />
    </Suspense>
  );
}