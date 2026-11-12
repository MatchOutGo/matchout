import { Suspense } from 'react';
import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import { connection } from 'next/server';
import Link from 'next/link';
import { MapPin, Calendar, ArrowLeft, MountainSnow, Users } from 'lucide-react'; // Иконки

type Listing = {
  id: string;
  title: string;
  city: string;
  date_start: string;
  activity: string;
  cover_image: string | null;
};

function MiniListingCard({ listing }: { listing: Listing }) {
  return (
    <Link href={`/listings/${listing.id}`} className="flex gap-4 bg-white p-3 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow group">
      <div className="w-24 h-24 shrink-0 rounded-xl overflow-hidden bg-gray-100">
        <img src={listing.cover_image || 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256'} alt={listing.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
      </div>
      <div className="py-1 flex flex-col justify-between">
        <div>
          <p className="text-xs font-semibold text-[#0071e3] uppercase tracking-wide mb-1">{listing.activity}</p>
          <h4 className="font-semibold text-gray-900 leading-tight line-clamp-2">{listing.title}</h4>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-500 mt-2">
          <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {listing.city}</span>
          <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {listing.date_start}</span>
        </div>
      </div>
    </Link>
  );
}

async function UserProfile({ params }: { params: Promise<{ id: string }> }) {
  await connection();
  const { id } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', id).single();

  if (!profile) notFound();

  const { data: organized } = await supabase
    .from('listings')
    .select('*')
    .eq('user_id', id)
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  const { data: joinedData } = await supabase
    .from('listing_participants')
    .select(`listings!inner (*)`)
    .eq('user_id', id)
    .eq('status', 'approved')
    .eq('listings.status', 'published');

  const joinedListings = (joinedData as unknown as { listings: Listing }[])?.map((item) => item.listings) || [];
  const displayName = profile.first_name || 'Użytkownik';
  const joinYear = profile.created_at ? profile.created_at.split('-')[0] : '2024';

  return (
    <div className="max-w-4xl mx-auto py-8">
      <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-6 transition-colors group">
        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
        Wróć na stronę główną
      </Link>

      <div className="bg-white p-8 rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] mb-8 flex items-center gap-6">
        <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-4xl font-bold text-gray-500 overflow-hidden shadow-inner">
          {profile.avatar_url ? (
            <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            displayName.charAt(0)
          )}
        </div>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900 mb-1">{displayName}</h1>
          <p className="text-gray-500">W MatchOut od {joinYear}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Секция: Организованные */}
        <section>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-900">
            <div className="bg-blue-50 p-2 rounded-xl text-[#0071e3]">
              <MountainSnow className="w-5 h-5" />
            </div>
            Organizowane wyjazdy ({organized?.length || 0})
          </h2>
          <div className="space-y-4">
            {organized && organized.length > 0 ? (
              organized.map(listing => <MiniListingCard key={listing.id} listing={listing as Listing} />)
            ) : (
              <p className="text-sm text-gray-500 bg-white p-4 rounded-xl border border-dashed border-gray-200">Brak zorganizowanych wyjazdów.</p>
            )}
          </div>
        </section>

        {/* Секция: Участие */}
        <section>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-900">
            <div className="bg-green-50 p-2 rounded-xl text-green-600">
              <Users className="w-5 h-5" />
            </div>
            Uczestniczy w ({joinedListings.length})
          </h2>
          <div className="space-y-4">
            {joinedListings.length > 0 ? (
              joinedListings.map((listing) => <MiniListingCard key={listing.id} listing={listing} />)
            ) : (
              <p className="text-sm text-gray-500 bg-white p-4 rounded-xl border border-dashed border-gray-200">Brak wyjazdów jako uczestnik.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default function UserPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<div className="text-center py-20 text-gray-500">Ładowanie profilu...</div>}>
      <UserProfile params={params} />
    </Suspense>
  );
}