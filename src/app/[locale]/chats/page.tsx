import { Suspense } from "react";
import { connection } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { MessageCircle, ArrowLeft } from "lucide-react";

async function ChatList() {
  await connection();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: participations, error: pError } = await supabase
    .from('listing_participants')
    .select(`
      listing_id,
      last_read_at,
      listings (id, title, cover_image, activity)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (pError) console.error("Ошибка загрузки:", pError);

  if (!participations || participations.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl shadow-sm mt-8">
        <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 text-lg mb-2">Brak czatów.</p>
        <p className="text-sm text-gray-400">Dołącz do wyjazdu, aby zacząć rozmowę.</p>
      </div>
    );
  }

  const listingIds = participations.map(p => p.listing_id);
  const { data: allMessages } = await supabase
    .from('messages')
    .select('*')
    .in('listing_id', listingIds)
    .order('created_at', { ascending: false });

  const chats = participations.map((p) => {
    const listing = Array.isArray(p.listings) ? p.listings[0] : p.listings;
    const listingMessages = allMessages?.filter(m => m.listing_id === p.listing_id) || [];
    
    if (!listing || listingMessages.length === 0) return null;

    const latestMsg = listingMessages[0];
    const msgDate = new Date(latestMsg.created_at || 0).getTime();
    const readDate = new Date(p.last_read_at || 0).getTime();
    const isUnread = latestMsg.sender_id !== user.id && msgDate > readDate;

    return {
      listingId: p.listing_id,
      listing,
      latestMsg,
      isUnread
    };
  }).filter(Boolean);

  if (chats.length === 0) return <div className="text-center py-10">Нет сообщений</div>;

  return (
    <div className="space-y-4 mt-8">
      {chats.map((chat) => {
        if (!chat) return null;
        const { listingId, listing, latestMsg, isUnread } = chat;

        return (
          <Link 
            key={listingId} 
            href={`/listings/${listingId}/chat`}
            className={`flex items-center gap-4 p-4 rounded-2xl shadow-sm transition-shadow group border ${
              isUnread ? 'bg-blue-50/50 border-blue-100' : 'bg-white border-gray-100 hover:shadow-md'
            }`}
          >
            <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 shrink-0 relative">
              <img src={listing.cover_image || `/images/activities/${listing.activity}1.jpg`} alt="Cover" className="w-full h-full object-cover" />
              {isUnread && (
                <span className="absolute top-0 right-0 w-3 h-3 bg-[#0071e3] border-2 border-white rounded-full -translate-y-1 translate-x-1"></span>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline mb-0.5">
                <h3 className={`font-semibold truncate ${isUnread ? 'text-gray-900' : 'text-gray-700'}`}>
                  {listing.title}
                </h3>
                <span className="text-xs text-gray-400 shrink-0 ml-2">
                  {latestMsg.created_at ? new Date(latestMsg.created_at).toLocaleDateString('pl-PL', { day: 'numeric', month: 'short' }) : ''}
                </span>
              </div>
              <p className={`text-sm truncate ${isUnread ? 'text-gray-800 font-medium' : 'text-gray-500'}`}>
                {latestMsg.sender_id === user.id ? 'Ty: ' : ''}{latestMsg.content}
              </p>
            </div>
          </Link>
        )
      })}
    </div>
  )
}

export default function ChatsPage() {
  return (
    <div className="max-w-3xl mx-auto py-8">
      <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-6 transition-colors group">
        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
        Wróć na stronę główną
      </Link>
      
      <h1 className="text-3xl font-semibold tracking-tight text-gray-900 mb-2">Twoje czaty</h1>
      <p className="text-gray-500">Wszystkie Twoje rozmowy w jednym miejscu.</p>

      <Suspense fallback={<div className="text-center py-20 text-gray-500">Ładowanie...</div>}>
        <ChatList />
      </Suspense>
    </div>
  );
}