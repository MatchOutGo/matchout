/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

type ParsedCost = {
  title: string
  amount: number
  isShared: boolean
}

export async function createListing(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('is_banned').eq('id', user.id).single()
  if (profile?.is_banned) {
    return redirect('/?message=' + encodeURIComponent('Twoje konto jest zablokowane. Nie możesz tworzyć ogłoszeń.'))
  }

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const trip_type = formData.get('trip_type') as string
  const price_type = formData.get('price_type') as string
  
  // ВЫТАСКИВАЕМ ФИКСИРОВАННУЮ ЦЕНУ И LAST MINUTE
  const fixed_price = price_type === 'fixed' ? Number(formData.get('fixed_price')) || 0 : null
  const is_special = formData.get('is_special') === 'true'

  // Массивы стран и городов (передаются как JSON-строки)
  const countriesJson = formData.get('countries') as string
  const countries = countriesJson ? JSON.parse(countriesJson) : []
  const citiesJson = formData.get('cities') as string
  const cities = citiesJson ? JSON.parse(citiesJson) : []

  const date_start = formData.get('date_start') as string || null
  const date_end = formData.get('date_end') as string || null
  const ski_days = Number(formData.get('ski_days')) || 1
  const origin_city = formData.get('origin_city') as string || null
  
  const max_participants = Number(formData.get('max_participants')) || 2
  const gender_pref = formData.get('gender_pref') as string
  const children_allowed = formData.get('children_allowed') as string
  const language_pref = formData.get('language_pref') as string
  
  const prepayment_required = formData.get('prepayment_required') === 'true'
  const prepayment_amount = prepayment_required ? (Number(formData.get('prepayment_amount')) || 0) : null

  const pickupCitiesJson = formData.get('pickup_cities') as string
  const pickupCities = pickupCitiesJson ? JSON.parse(pickupCitiesJson) : []

  // Ставим дефолтную активность "Narty" 
const activity = 'narty';
  const randomNum = Math.floor(Math.random() * 2) + 1;
  // МЕНЯЕМ ПУТЬ НА ТВОИ КАРТИНКИ
  const coverImagePath = `/images/activities/snowboarding${randomNum}.jpg`;
  // Добавил as any в конце объекта, чтобы убрать красные подчеркивания в VS Code
  const { data: listing, error: listingError } = await supabase
    .from('listings')
    .insert({
      user_id: user.id,
      type: 'offer',
      activity,
      title,
      description,
      trip_type,
      price_type,
      fixed_price, // <-- ДОБАВЛЕНО
      is_special,  // <-- ДОБАВЛЕНО
      countries,
      cities,
      date_start,
      date_end,
      ski_days,
      origin_city,
      pickup_cities: pickupCities,
      max_participants,
      current_participants: 1,
      gender_pref,
      children_allowed,
      language_pref,
      prepayment_required,
      prepayment_amount,
      cover_image: coverImagePath 
    } as any)
    .select()
    .single()

  if (listingError) {
    console.error("Listing error:", listingError)
    return redirect('/listings/create?message=' + encodeURIComponent(listingError.message))
  }

  // Сохраняем затраты (только если выбран тип цены "Кошты делимые")
  if (price_type === 'shared') {
    const costsJson = formData.get('costs') as string
    if (costsJson) {
      const costs = JSON.parse(costsJson) as ParsedCost[]
      if (costs.length > 0) {
        const { error: costsError } = await supabase.from('listing_costs').insert(
          costs.map((c) => ({
            listing_id: listing.id,
            title: c.title,
            amount: Number(c.amount),
            is_shared: c.isShared
          }))
        )
        if (costsError) return redirect('/listings/create?message=' + encodeURIComponent("DB Error: " + costsError.message))
      }
    }
  }

  await supabase.from('listing_participants').insert({
    listing_id: listing.id,
    user_id: user.id,
    status: 'approved'
  })

  revalidatePath('/')
  redirect('/')
}

export async function updateListing(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('is_banned').eq('id', user.id).single()
  if (profile?.is_banned) {
    return redirect('/?message=' + encodeURIComponent('Twoje konto jest zablokowane.'))
  }

  const listingId = formData.get('listingId') as string;
  if (!listingId) {
    return redirect('/?message=' + encodeURIComponent('Brak ID ogłoszenia.'));
  }

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const trip_type = formData.get('trip_type') as string
  const price_type = formData.get('price_type') as string
  
  // ВЫТАСКИВАЕМ ФИКСИРОВАННУЮ ЦЕНУ И LAST MINUTE
  const fixed_price = price_type === 'fixed' ? Number(formData.get('fixed_price')) || 0 : null
  const is_special = formData.get('is_special') === 'true'

  const countriesJson = formData.get('countries') as string
  const countries = countriesJson ? JSON.parse(countriesJson) : []
  const citiesJson = formData.get('cities') as string
  const cities = citiesJson ? JSON.parse(citiesJson) : []

  const date_start = formData.get('date_start') as string || null
  const date_end = formData.get('date_end') as string || null
  const ski_days = Number(formData.get('ski_days')) || 1
  const origin_city = formData.get('origin_city') as string || null
  
  const max_participants = Number(formData.get('max_participants')) || 2
  const gender_pref = formData.get('gender_pref') as string
  const children_allowed = formData.get('children_allowed') as string
  const language_pref = formData.get('language_pref') as string
  
  const prepayment_required = formData.get('prepayment_required') === 'true'
  const prepayment_amount = prepayment_required ? (Number(formData.get('prepayment_amount')) || 0) : null

  const pickupCitiesJson = formData.get('pickup_cities') as string
  const pickupCities = pickupCitiesJson ? JSON.parse(pickupCitiesJson) : []

  // Добавил as any в конце объекта, чтобы убрать красные подчеркивания
  const { error: updateError } = await supabase
    .from('listings')
    .update({
      type: 'offer',
      title, 
      description, 
      trip_type, 
      price_type, 
      fixed_price, // <-- ДОБАВЛЕНО
      is_special,  // <-- ДОБАВЛЕНО
      countries, 
      cities, 
      date_start, 
      date_end, 
      ski_days, 
      origin_city, 
      pickup_cities: pickupCities, 
      max_participants, 
      gender_pref, 
      children_allowed, 
      language_pref, 
      prepayment_required, 
      prepayment_amount
    } as any)
    .eq('id', listingId)
    .eq('user_id', user.id)

  if (updateError) {
    return redirect(`/listings/${listingId}/edit?message=` + encodeURIComponent(updateError.message))
  }

  await supabase.from('listing_costs').delete().eq('listing_id', listingId)
  
  if (price_type === 'shared') {
    const costsJson = formData.get('costs') as string
    if (costsJson) {
      const costs = JSON.parse(costsJson) as ParsedCost[]
      if (costs.length > 0) {
        const { error: costsError } = await supabase.from('listing_costs').insert(
          costs.map((c) => ({ listing_id: listingId, title: c.title, amount: Number(c.amount), is_shared: c.isShared }))
        )
        if (costsError) return redirect(`/listings/${listingId}/edit?message=` + encodeURIComponent("DB Error: " + costsError.message))
      }
    }
  }

  revalidatePath('/listings/' + listingId)
  revalidatePath('/')
  redirect('/listings/' + listingId)
}