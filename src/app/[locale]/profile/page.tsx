import { Suspense } from "react";
import { connection } from "next/server";
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { updateProfile, uploadAvatar } from './actions'

async function ProfileContent({
  searchParams,
}: {
  searchParams: Promise<{ message: string }>
}) {
  // Говорим Next.js ждать реального запроса от пользователя
  await connection();

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  
  const { message } = await searchParams

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold">Twój Profil</h1> 
        </div>
      </div>

      {message && (
        <div className="p-4 bg-blue-50 text-blue-700 rounded-lg border border-blue-100">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Левая колонка: Аватар */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center h-fit">
          <div className="w-32 h-32 rounded-full bg-gray-100 mb-6 overflow-hidden border-4 border-white shadow-lg">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl font-bold bg-[#f5f5f7]">
                {profile?.first_name?.charAt(0) || user.email?.charAt(0)}
              </div>
            )}
          </div>
          
          <form action={uploadAvatar} className="w-full space-y-3">
            {/* Скрываем стандартный инпут */}
            <input 
              type="file" 
              id="avatar-upload" 
              name="avatar" 
              accept="image/*" 
              required 
              className="hidden" 
            />
            
            {/* Красивая кнопка выбора файла */}
            <label 
              htmlFor="avatar-upload" 
              className="cursor-pointer w-full bg-[#f5f5f7] text-gray-700 py-3 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors text-center block"
            >
              Wybierz zdjęcie
            </label>

            <button 
              type="submit" 
              className="w-full py-3 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors shadow-sm"
            >
              Zapisz zdjęcie
            </button>
          </form>
        </div>

        {/* Правая колонка: Данные */}
        <div className="md:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <form action={updateProfile} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Imię</label>
                <input 
                  name="firstName" 
                  type="text" 
                  defaultValue={profile?.first_name || ''} 
                  className="w-full rounded-xl border border-gray-200 bg-[#f5f5f7] p-3 outline-none focus:border-[#0066cc] focus:ring-2 focus:ring-[#0066cc]/50 transition-all" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                <input 
                  name="phone" 
                  type="tel" 
                  defaultValue={profile?.phone || ''} 
                  required 
                  className="w-full rounded-xl border border-gray-200 bg-[#f5f5f7] p-3 outline-none focus:border-[#0066cc] focus:ring-2 focus:ring-[#0066cc]/50 transition-all" 
                />
              </div>
            </div>

            {/* СКРЫТЫЙ ИНПУТ: Всегда отправляем Narty в базу */}
            <input type="hidden" name="interests" value="narty" />

            <button type="submit" className="w-full py-3.5 bg-[#0066cc] text-white rounded-xl font-medium hover:bg-[#004c99] transition-colors shadow-md mt-4">
              Zapisz zmiany
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ message: string }>
}) {
  return (
    <Suspense fallback={
      <div className="max-w-3xl mx-auto py-20 text-center text-gray-500">
        Ładowanie profilu...
      </div>
    }>
      <ProfileContent searchParams={searchParams} />
    </Suspense>
  )
}