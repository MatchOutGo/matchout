'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function signup(formData: FormData) {
  const supabase = await createClient()
  
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const firstName = formData.get('firstName') as string
  const phone = formData.get('phone') as string

  // Передаем метаданные, триггер в БД сам разложит их по полям
  const { error } = await supabase.auth.signUp({ 
    email, 
    password,
    options: {
      data: { 
        first_name: firstName, 
        phone: phone 
      }
    }
  })
  
  if (error) {
    return redirect('/register?message=' + encodeURIComponent(error.message))
  }

  revalidatePath('/', 'layout')
  // Отправляем на логин с сообщением о проверке почты
  redirect('/login?message=' + encodeURIComponent('Sprawdź swoją skrzynkę e-mail, aby potwierdzić konto.'))
}