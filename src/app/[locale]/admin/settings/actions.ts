'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateSettings(formData: FormData) {
  const supabase = await createClient()
  const text_pl = formData.get('landing_text_pl') as string
  const text_en = formData.get('landing_text_en') as string
  const extra_lines = formData.get('landing_extra_lines') as string
  const banner_url = formData.get('landing_banner_url') as string

  await supabase.from('site_settings').update({ value: text_pl }).eq('key', 'landing_text_pl')
  await supabase.from('site_settings').update({ value: text_en }).eq('key', 'landing_text_en')
  await supabase.from('site_settings').update({ value: extra_lines }).eq('key', 'landing_extra_lines')
  await supabase.from('site_settings').update({ value: banner_url }).eq('key', 'landing_banner_url')
  
  revalidatePath('/', 'layout')
  revalidatePath('/[locale]', 'layout')
}