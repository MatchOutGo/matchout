import { Suspense } from 'react';
import { createClient } from '@/utils/supabase/server';
import { notFound, redirect } from 'next/navigation';
import { connection } from 'next/server';
import ChatComponent from './ChatComponent';

async function ChatWrapper({ params }: { params: Promise<{ id: string }> }) {
  await connection();
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: listing } = await supabase.from('listings').select('*').eq('id', id).single();
  if (!listing) notFound();

  const { data: initialMessages } = await supabase
    .from('messages')
    .select(`*, profiles (first_name, avatar_url)`)
    .eq('listing_id', id)
    .order('created_at', { ascending: true });

  const { data: myProfile } = await supabase.from('profiles').select('*').eq('id', user.id).single();

  return (
    <ChatComponent 
      listingId={id} 
      listingTitle={listing.title}
      initialMessages={initialMessages || []} 
      currentUser={{
        id: user.id,
        first_name: myProfile?.first_name || null,
        avatar_url: myProfile?.avatar_url || null
      }}
    />
  );
}

export default function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<div className="text-center py-20 text-gray-500">Ładowanie czatu...</div>}>
      <ChatWrapper params={params} />
    </Suspense>
  );
}