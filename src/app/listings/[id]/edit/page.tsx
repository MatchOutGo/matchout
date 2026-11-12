import { Suspense } from "react";
import { createClient } from '@/utils/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { connection } from "next/server";
import CreateListingForm from '../../create/CreateListingForm'

async function EditListingContent({ params }: { params: Promise<{ id: string }> }) {
  await connection();
  const { id } = await params;
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: listing, error } = await supabase.from('listings').select('*').eq('id', id).single()
  
  if (!listing || error) notFound()
  if (listing.user_id !== user.id) redirect('/')

  const { data: activities } = await supabase.from('dictionaries').select('*').eq('category', 'activity').eq('is_active', true).order('sort_order')
  const { data: cities } = await supabase.from('dictionaries').select('*').eq('category', 'city').eq('is_active', true).order('label_pl')
  const { data: initialCosts } = await supabase.from('listing_costs').select('*').eq('listing_id', id)

  return (
    <div className="max-w-4xl mx-auto pt-8 pb-24">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900 mb-2">Edytuj wyjazd</h1>
        <p className="text-gray-500">Zaktualizuj szczegóły swojej przygody.</p>
      </div>
      
      {/* ДОБАВЛЕН KEY={ID} */}
      <CreateListingForm 
        key={id}
        activities={activities || []} 
        cities={cities || []} 
        initialData={listing}
        initialCosts={initialCosts || []}
        listingId={id}
      />
    </div>
  )
}

export default function EditListingPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<div className="text-center py-20 text-gray-500">Ładowanie formularza...</div>}>
      <EditListingContent params={params} />
    </Suspense>
  );
}