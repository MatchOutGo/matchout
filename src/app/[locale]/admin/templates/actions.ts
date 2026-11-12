'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addTemplate(formData: FormData) {
  const supabase = await createClient()
  const title_pl = formData.get('title_pl') as string
  const content_pl = formData.get('content_pl') as string
  const title_en = formData.get('title_en') as string
  const content_en = formData.get('content_en') as string

  await supabase.from('admin_templates').insert({ 
    title_pl, 
    content_pl, 
    title_en, 
    content_en 
  })
  revalidatePath('/admin/templates')
}

export async function deleteTemplate(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get('id') as string

  await supabase.from('admin_templates').delete().eq('id', id)
  revalidatePath('/admin/templates')
}