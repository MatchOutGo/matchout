/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addDictionaryItem(formData: FormData) {
  const supabase = await createClient()
  
  const category = formData.get('category') as string
  const value = formData.get('value') as string
  const label_pl = formData.get('label_pl') as string
  const label_en = formData.get('label_en') as string || label_pl
  
  // Читаем новые поля
  const parent_value = formData.get('parent_value') as string || null
  const is_resort = formData.get('is_resort') === 'true'

  // Делаем slug (например "Zakopane" -> "zakopane", "Alpe d'Huez" -> "alpe-dhuez")
  const slug = value.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

  // Проверяем, нет ли уже такого значения
  const { data: existing } = await supabase
    .from('dictionaries')
    .select('id')
    .eq('category', category)
    .eq('value', slug)
    .maybeSingle()

  if (existing) {
    return // Уже существует, молча выходим
  }

  // Приводим объект к any, чтобы TypeScript не ругался на новые колонки
  const payload = {
    category,
    value: slug,
    label_pl,
    label_en,
    parent_value,
    is_resort,
    is_active: true
  } as any

  await supabase.from('dictionaries').insert(payload)

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