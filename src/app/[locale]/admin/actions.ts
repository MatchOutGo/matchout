'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function banUser(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) redirect('/login')
  
  const targetUserId = formData.get('userId') as string
  const days = Number(formData.get('days')) || 7
  const reason = formData.get('reason') as string

  // 1. Ставим флаг бана
  await supabase.from('profiles').update({ is_banned: true }).eq('id', targetUserId)
  
  // 2. Вычисляем дату
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + days)

  // 3. Добавляем в блэклист
  await supabase.from('blacklist').insert({
    user_id: targetUserId,
    admin_id: user.id,
    reason: reason,
    expires_at: expiresAt.toISOString()
  })

  // 4. Отправляем уведомление
  await supabase.from('notifications').insert({
    user_id: targetUserId,
    type: 'ban',
    payload: { 
      title: 'Konto zablokowane',
      body: `Zostałeś zablokowany na ${days} dni. Powód: ${reason}`,
      link: '/profile'
    }
  })

  revalidatePath('/admin/users')
}

export async function unbanUser(formData: FormData) {
  const supabase = await createClient()
  const targetUserId = formData.get('userId') as string

  await supabase.from('profiles').update({ is_banned: false }).eq('id', targetUserId)
  await supabase.from('blacklist').delete().eq('user_id', targetUserId)

  revalidatePath('/admin/users')
}

export async function deleteListing(formData: FormData) {
  const supabase = await createClient()
  const listingId = formData.get('listingId') as string

  await supabase.from('listings').delete().eq('id', listingId)
  
  revalidatePath('/admin/listings')
}