import { Suspense } from "react";
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import CreateListingForm from './CreateListingForm'
import { connection } from "next/server";

async function CreateListingContent({
  searchParams,
}: {
  searchParams: Promise<{ message: string }>
}) {
  await connection(); 

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('is_banned').eq('id', user.id).single()
  if (profile?.is_banned) {
    redirect('/?message=' + encodeURIComponent('Twoje konto jest zablokowane. Nie możesz tworzyć ogłoszeń.'))
  }

  const { data: activities } = await supabase.from('dictionaries').select('*').eq('category', 'activity').eq('is_active', true).order('sort_order')
  const { data: cities } = await supabase.from('dictionaries').select('*').eq('category', 'city').eq('is_active', true).order('label_pl')
  const { data: countries } = await supabase.from('dictionaries').select('*').eq('category', 'country').eq('is_active', true).order('sort_order')
  
  // Загружаем фича-флаги
  const { data: featureFlagsData } = await supabase.from('dictionaries').select('*').eq('category', 'feature_flag')
  const showGender = featureFlagsData?.find(f => f.value === 'gender_pref')?.is_active ?? true
  const showChildren = featureFlagsData?.find(f => f.value === 'children_allowed')?.is_active ?? true

  const { message } = await searchParams

  return (
    <div className="max-w-4xl mx-auto pt-8 pb-24">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900 mb-2">Utwórz nowy wyjazd</h1>
        <p className="text-gray-500">Wypełnij szczegóły, aby znaleźć swoją ekipę.</p>
      </div>
      
      {message && (
        <div className="mb-8 p-4 bg-red-50 text-red-700 rounded-2xl border border-red-100 text-sm">
          {message}
        </div>
      )}
      
      <CreateListingForm 
        key="create" 
        activities={activities || []} 
        cities={cities || []} 
        countries={countries || []}
        showGender={showGender}
        showChildren={showChildren}
      />
    </div>
  )
}

export default function CreateListingPage({
  searchParams,
}: {
  searchParams: Promise<{ message: string }>
}) {
  return (
    <Suspense fallback={<div className="text-center py-20 text-gray-500">Ładowanie formularza...</div>}>
      <CreateListingContent searchParams={searchParams} />
    </Suspense>
  )
}