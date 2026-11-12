'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function banUser(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) redirect('/login')
  
  const complaintId = formData.get('complaintId') as string
  const targetUserId = formData.get('targetUserId') as string
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

  // 5. Закрываем жалобу
  await supabase.from('complaints').update({ status: 'resolved' }).eq('id', complaintId)

  revalidatePath('/admin/complaints')
  redirect('/admin/complaints')
}

export async function dismissComplaint(formData: FormData) {
  const supabase = await createClient()
  const complaintId = formData.get('complaintId') as string
  
  await supabase.from('complaints').update({ status: 'dismissed' }).eq('id', complaintId)
  
  revalidatePath('/admin/complaints')
  redirect('/admin/complaints')
}