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
  const { data: activities } = await supabase.from('dictionaries').select('*').eq('category', 'activity').eq('is_active', true).order('sort_order')
  const { data: userInterests } = await supabase.from('user_interests').select('activity').eq('user_id', user.id)
  
  const selectedInterests = userInterests?.map(i => i.activity) || []
  const { message } = await searchParams

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold">Twój Profil</h1>
          <p className="text-gray-500">Zarządzaj swoimi danymi i zainteresowaniami.</p>
        </div>
      </div>

      {message && (
        <div className="p-4 bg-blue-50 text-blue-700 rounded-lg border border-blue-100">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Левая колонка: Аватар */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col items-center h-fit">
          <div className="w-32 h-32 rounded-full bg-gray-100 mb-4 overflow-hidden border-2 border-white shadow-md">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl font-bold">
                {profile?.first_name?.charAt(0) || user.email?.charAt(0)}
              </div>
            )}
          </div>
          
          <form action={uploadAvatar} className="w-full space-y-3">
            <input type="file" name="avatar" accept="image/*" required className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
            <button type="submit" className="w-full py-2 bg-gray-900 text-white rounded-md text-sm font-medium hover:bg-gray-800 transition-colors">
              Zapisz zdjęcie
            </button>
          </form>
        </div>

        {/* Правая колонка: Данные и Интересы */}
        <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <form action={updateProfile} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Imię</label>
                <input name="firstName" type="text" defaultValue={profile?.first_name || ''} className="w-full rounded-md border border-gray-300 p-2 outline-none focus:border-[#0071e3]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                <input name="phone" type="tel" defaultValue={profile?.phone || ''} required className="w-full rounded-md border border-gray-300 p-2 outline-none focus:border-[#0071e3]" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Moje zainteresowania (Otrzymuj powiadomienia)</label>
              <div className="grid grid-cols-2 gap-3">
                {activities?.map((act) => (
                  <label key={act.id} className="flex items-center gap-2 p-2 border rounded-md hover:bg-gray-50 cursor-pointer transition-colors">
                    <input 
                      type="checkbox" 
                      name="interests" 
                      value={act.value}
                      defaultChecked={selectedInterests.includes(act.value)}
                      className="w-4 h-4 text-[#0071e3] rounded focus:ring-[#0071e3]"
                    />
                    <span className="text-sm text-gray-700">{act.label_pl}</span>
                  </label>
                ))}
              </div>
            </div>

            <button type="submit" className="w-full py-3 bg-[#0071e3] text-white rounded-md font-medium hover:bg-[#0077ed] transition-colors shadow-sm">
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