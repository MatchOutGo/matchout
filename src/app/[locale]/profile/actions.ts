'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return redirect('/login')

  const firstName = formData.get('firstName') as string
  const phone = formData.get('phone') as string
  const interests = formData.getAll('interests') as string[] // Массив выбранных видов спорта

  // 1. Обновляем профиль
  const { error: profileError } = await supabase
    .from('profiles')
    .update({ first_name: firstName, phone: phone })
    .eq('id', user.id)

  if (profileError) return redirect('/profile?message=' + encodeURIComponent(profileError.message))

  // 2. Обновляем интересы (сначала удаляем старые, потом вставляем новые)
  await supabase.from('user_interests').delete().eq('user_id', user.id)
  
  if (interests.length > 0) {
    const { error: interestError } = await supabase
      .from('user_interests')
      .insert(interests.map(activity => ({ user_id: user.id, activity })))
    
    if (interestError) console.error("Interest error:", interestError)
  }

  revalidatePath('/profile')
  revalidatePath('/', 'layout')
  redirect('/profile?message=' + encodeURIComponent('Profil zaktualizowany!'))
}

export async function uploadAvatar(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return redirect('/login')

  const file = formData.get('avatar') as File
  
  if (file && file.size > 0) {
    // Загружаем в папку с ID пользователя
    const filePath = `${user.id}/${Date.now()}-${file.name}`
    
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file)

    if (uploadError) return redirect('/profile?message=' + encodeURIComponent(uploadError.message))

    // Получаем публичный URL и сохраняем в профиль
    const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath)

    await supabase
      .from('profiles')
      .update({ avatar_url: publicUrl })
      .eq('id', user.id)
  }

  revalidatePath('/profile')
  redirect('/profile')
}