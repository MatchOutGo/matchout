'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addDictionaryItem(formData: FormData) {
  const supabase = await createClient()
  
  const category = formData.get('category') as string
  const value = formData.get('value') as string
  const label_pl = formData.get('label_pl') as string
  const label_en = formData.get('label_en') as string || label_pl

  // Проверяем, нет ли уже такого значения
  const { data: existing } = await supabase
    .from('dictionaries')
    .select('id')
    .eq('category', category)
    .eq('value', value.toLowerCase())
    .single()

  if (existing) {
    return // Уже существует, молча выходим
  }

  await supabase.from('dictionaries').insert({
    category,
    value: value.toLowerCase().replace(/\s+/g, '_'), // Делаем slug (например "ski_touring")
    label_pl,
    label_en,
    is_active: true
  })

  revalidatePath('/admin/dictionaries')
}

export async function toggleDictionaryStatus(id: string, currentStatus: boolean) {
  const supabase = await createClient()
  
  await supabase
    .from('dictionaries')
    .update({ is_active: !currentStatus })
    .eq('id', id)

  revalidatePath('/admin/dictionaries')
}