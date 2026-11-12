'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function joinTrip(listingId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return redirect('/login')

  const { data: existing } = await supabase
    .from('listing_participants')
    .select('*')
    .eq('listing_id', listingId)
    .eq('user_id', user.id)
    .single()

  if (existing) {
    return redirect('/listings/' + listingId + '?error=' + encodeURIComponent('Już jesteś zapisany!'))
  }

  const { error } = await supabase
    .from('listing_participants')
    .insert({ listing_id: listingId, user_id: user.id, status: 'approved' })

  if (error) return redirect('/listings/' + listingId + '?error=' + encodeURIComponent('Wystąpił błąd.'))

  revalidatePath('/listings/' + listingId)
  revalidatePath('/')
  redirect('/listings/' + listingId)
}

export async function deleteListing(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return redirect('/login')

  const listingId = formData.get('listingId') as string;

  const { error } = await supabase
    .from('listings')
    .delete()
    .eq('id', listingId)
    .eq('user_id', user.id)

  if (error) {
    console.error("Delete error:", error)
    // Показываем ошибку пользователю, если удаление не прошло
    return redirect('/listings/' + listingId + '?error=' + encodeURIComponent(error.message))
  }

  revalidatePath('/')
  redirect('/')
}