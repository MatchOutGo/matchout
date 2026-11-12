'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function sendMessage(listingId: string, content: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  // ПРОВЕРКА БАНА
  const { data: profile } = await supabase.from('profiles').select('is_banned').eq('id', user.id).single()
  if (profile?.is_banned) {
    return { error: 'Twoje konto jest zablokowane. Nie możesz wysyłać wiadomości.' }
  }

  // 1. Проверяем, есть ли пользователь в участниках
  const { data: participant } = await supabase
    .from('listing_participants')
    .select('id')
    .eq('listing_id', listingId)
    .eq('user_id', user.id)
    .maybeSingle()

  if (!participant) {
    const { error: insertError } = await supabase.from('listing_participants').insert({
      listing_id: listingId,
      user_id: user.id,
      status: 'approved' 
    })
    if (insertError) return { error: "Join error: " + insertError.message }
  }

  // 2. Отправляем сообщение и ВОЗВРАЩАЕМ его данные
  const { data: newMessage, error } = await supabase.from('messages').insert({
    listing_id: listingId,
    sender_id: user.id,
    content: content
  }).select('*, profiles(first_name, avatar_url)').single()

  if (error) {
    console.error("Ошибка отправки:", error)
    return { error: error.message }
  }

  revalidatePath(`/listings/${listingId}/chat`)
  revalidatePath(`/chats`)
  revalidatePath('/', 'layout')
  
  return { success: true, message: newMessage }
}

export async function markChatAsRead(listingId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase
    .from('listing_participants')
    .update({ last_read_at: new Date().toISOString() })
    .eq('listing_id', listingId)
    .eq('user_id', user.id)

  revalidatePath('/', 'layout')
  revalidatePath('/chats')
}

// ВОЗВРАЩАЕМ ФУНКЦИЮ ЖАЛОБЫ
export async function reportChat(listingId: string, targetUserId: string, reason: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase.from('complaints').insert({
    reporter_id: user.id,
    target_user_id: targetUserId,
    listing_id: listingId,
    reason: reason,
    status: 'pending'
  })

  if (error) {
    console.error("Report error:", error)
    return { error: error.message }
  }

  return { success: true }
}