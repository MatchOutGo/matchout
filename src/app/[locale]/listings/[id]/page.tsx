import { Suspense } from 'react';
import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import { connection } from 'next/server';
import Link from 'next/link';
import { MapPin, Calendar, ArrowLeft, Phone, MessageCircle, Edit, Trash2 } from 'lucide-react';
import { joinTrip, deleteListing } from './actions';
import ShareButtons from '@/components/ShareButtons'; // <-- ИМПОРТ

type Cost = { id: string; title: string; amount: number; is_shared: boolean };

async function ListingDetails({ params, searchParams }: { params: Promise<{ id: string }>, searchParams: Promise<{ error?: string }> }) {
  await connection();
  
  const { id } = await params;
  const { error } = await searchParams;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  const { data: listing, error: dbError } = await supabase
    .from('listings')
    .select(`
      *,
      profiles!user_id (id, first_name, avatar_url, phone),
      listing_costs (*)
    `)
    .eq('id', id)
    .single();

  if (dbError || !listing) notFound();

  const author = Array.isArray(listing.profiles) ? listing.profiles[0] : listing.profiles;
  const authorName = author?.first_name || 'Użytkownik';
  const authorId = listing.user_id; 

  const currentParticipants = listing.current_participants || 0;
  const maxParticipants = listing.max_participants || 2;

  let isParticipant = false;
  if (user) {
    const { data: participant } = await supabase
      .from('listing_participants')
      .select('status')
      .eq('listing_id', id)
      .eq('user_id', user.id)
      .single();
      
    if (participant?.status === 'approved') {
      isParticipant = true;
    }
  }

  const isOrganizer = user?.id === authorId;
  const canSeePhone = isParticipant || isOrganizer;

  const costs = (listing.listing_costs || []) as Cost[];
  const totalShared = costs.filter((c) => c.is_shared).reduce((sum, c) => sum + Number(c.amount), 0);
  const totalIndividual = costs.filter((c) => !c.is_shared).reduce((sum, c) => sum + Number(c.amount), 0);
  const totalCost = totalShared + totalIndividual;
  const perPersonCost = (totalShared / maxParticipants) + totalIndividual;

  const handleJoin = async () => {
    'use server'
    await joinTrip(id);
  }

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
        </div>

        <div className="p-8 md:p-12">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
            <div>
              {/* ЗАГОЛОВОК И КНОПКИ ПОДЕЛИТЬСЯ */}
              <div className="flex items-center gap-4 mb-3">
                <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-gray-900">{listing.title}</h1>
                <ShareButtons title={listing.title} />
              </div>
              
              <div className="flex flex-wrap items-center gap-6 text-gray-500 text-[15px]">
                {listing.city && (
                  <span className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-gray-400" /> {listing.city}
                  </span>
                )}
                <span className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-gray-400" /> {listing.date_start} — {listing.date_end}
                </span>
              </div>
            </div>
            
            <div className="bg-[#f5f5f7] p-6 rounded-2xl text-center min-w-[200px] shrink-0">
              <p className="text-sm text-gray-500 mb-1">
                {listing.type === 'seek' ? 'Maksymalny budżet' : 'Cena za osobę'}
              </p>
              <p className="text-3xl font-semibold text-[#0071e3]">
                {listing.type === 'seek' ? `${listing.budget_max || '?'} zł` : `${Math.round(perPersonCost)} zł`}
              </p>
              {listing.type === 'offer' && (
                <p className="text-xs text-gray-400 mt-1">Całkowity koszt: {totalCost} zł</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="md:col-span-2 space-y-8">
              <section>
                <h2 className="text-xl font-semibold mb-4">Opis wyjazdu</h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {listing.description || 'Brak opisu.'}
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">Szczegóły</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Kto jedzie?</p>
                    <p className="font-medium">{listing.gender_pref === 'men' ? 'Tylko mężczyźni' : listing.gender_pref === 'women' ? 'Tylko kobiety' : 'Mieszane'}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Dzieci</p>
                    <p className="font-medium">{listing.children_allowed === 'no' ? 'Tylko dorośli' : listing.children_allowed === 'family' ? 'Wyjazd rodzinny' : 'Można z dziećmi'}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Język</p>
                    <p className="font-medium uppercase">{listing.language_pref}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Miejsca</p>
                    <p className="font-medium">{currentParticipants} / {maxParticipants}</p>
                  </div>
                  
                  {listing.prepayment_required && (
                    <div className="bg-gray-50 p-4 rounded-xl col-span-2 flex justify-between items-center">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">
                        {listing.type === 'offer' ? 'Wymagana zaliczka' : 'Gotowość do zaliczki'}
                      </p>
                      <p className="font-bold text-lg text-gray-900">{listing.prepayment_amount} zł</p>
                    </div>
                  )}
                </div>
              </section>
            </div>

            <div className="space-y-6">
              <div className="border border-gray-100 p-6 rounded-2xl shadow-sm bg-white">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-4">Organizator</p>
                
                <Link href={`/users/${authorId}`} className="flex items-center gap-3 mb-6 group">
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600 overflow-hidden group-hover:ring-2 ring-[#0071e3] transition-all shrink-0">
                    {author?.avatar_url ? (
                      <img src={author.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      authorName.charAt(0)
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 group-hover:text-[#0071e3] transition-colors truncate">{authorName}</p>
                    <p className="text-xs text-gray-500">Zobacz profil</p>
                  </div>
                </Link>

                <div className="space-y-3">
                  {canSeePhone && (
                    <a href={`tel:${author?.phone}`} className="w-full py-3 px-4 bg-green-50 text-green-700 border border-green-200 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-green-100 transition-colors">
                      <Phone className="w-4 h-4" /> 
                      <span>Zadzwoń</span>
                    </a>
                  )}
                  
                  <Link href={`/listings/${id}/chat`} className="w-full py-3 bg-[#0071e3] text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-[#0077ed] transition-colors shadow-sm">
                    <MessageCircle className="w-4 h-4" /> {canSeePhone ? 'Czat z ekipą' : 'Napisz wiadomość'}
                  </Link>

                  {!canSeePhone && user && (
                    <form action={handleJoin}>
                      <button type="submit" disabled={currentParticipants >= maxParticipants} className="w-full py-3 bg-white text-[#0071e3] border-2 border-[#0071e3] rounded-xl font-medium hover:bg-blue-50 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
                        {currentParticipants >= maxParticipants ? 'Brak miejsc' : 'Dołącz do wyjazdu'}
                      </button>
                    </form>
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
              </div>

              {listing.type === 'offer' && (
                <div className="bg-gray-50 p-6 rounded-2xl">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-4">Koszty</p>
                  {costs.length > 0 ? (
                    <ul className="space-y-3">
                      {costs.map((cost) => (
                        <li key={cost.id} className="flex justify-between text-sm">
                          <span className="text-gray-600">{cost.title} {cost.is_shared ? '(dzielone)' : ''}</span>
                          <span className="font-medium">{cost.amount} zł</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">Organizator nie dodał jeszcze kosztów.</p>
                  )}
                </div>
              )}
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