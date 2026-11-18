import { Suspense } from 'react'
import { signup } from './actions'
import { Link } from '@/i18n/routing'

async function RegisterForm({
  searchParams,
}: {
  searchParams: Promise<{ message: string }>
}) {
  const { message } = await searchParams

  return (
    <div className="w-full max-w-md space-y-8 rounded-[2rem] bg-white p-8 md:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-gray-100">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Utwórz konto</h2>
        <p className="mt-2 text-sm text-gray-500 font-medium">Dołącz do Snow&Go</p>
      </div>
      
      {message && (
        <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-100 font-medium">
          {message}
        </div>
      )}

      <form className="mt-8 space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Imię</label>
          <input 
            name="firstName" 
            type="text" 
            required 
            className="w-full bg-[#f5f5f7] border-none rounded-xl p-3.5 text-[15px] text-gray-900 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-[#0066cc]/50 transition-all outline-none" 
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Telefon (Wymagane)</label>
          <input 
            name="phone" 
            type="tel" 
            required 
            placeholder="+48..." 
            className="w-full bg-[#f5f5f7] border-none rounded-xl p-3.5 text-[15px] text-gray-900 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-[#0066cc]/50 transition-all outline-none" 
          />
          <p className="text-xs text-gray-500 mt-1.5">Będzie widoczny tylko dla członków Twojej grupy.</p>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
          <input 
            name="email" 
            type="email" 
            required 
            className="w-full bg-[#f5f5f7] border-none rounded-xl p-3.5 text-[15px] text-gray-900 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-[#0066cc]/50 transition-all outline-none" 
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Hasło (min. 6 znaków)</label>
          <input 
            name="password" 
            type="password" 
            required 
            minLength={6} 
            className="w-full bg-[#f5f5f7] border-none rounded-xl p-3.5 text-[15px] text-gray-900 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-[#0066cc]/50 transition-all outline-none" 
          />
        </div>

        {/* БЛОК СОГЛАСИЯ С РЕГЛАМИНОМ И ПОЛИТИКОЙ */}
        <div className="flex items-start gap-3 pt-2">
          <input 
            type="checkbox" 
            id="terms" 
            name="terms"
            required 
            className="mt-1 w-4 h-4 text-[#0066cc] rounded focus:ring-[#0066cc] border-gray-300 cursor-pointer shrink-0" 
          />
          <label htmlFor="terms" className="text-[13px] text-gray-600 leading-snug cursor-pointer select-none">
            Oświadczam, że akceptuję{' '}
            <Link href="/terms" target="_blank" className="text-[#0066cc] font-medium hover:underline">
              Regulamin
            </Link>{' '}
            oraz{' '}
            <Link href="/privacy" target="_blank" className="text-[#0066cc] font-medium hover:underline">
              Politykę Prywatności
            </Link>{' '}
            serwisu Snow&Go.
          </label>
        </div>

        <button 
          formAction={signup} 
          className="w-full rounded-xl bg-[#0066cc] px-4 py-4 text-white font-semibold hover:bg-[#004c99] transition-colors shadow-md mt-2 flex justify-center"
        >
          Zarejestruj się
        </button>
      </form>

      <div className="text-center text-sm text-gray-600 mt-6 pt-6 border-t border-gray-100">
        Masz już konto?{' '}
        <Link href="/login" className="text-[#0066cc] font-semibold hover:underline">
          Zaloguj się
        </Link>
      </div>
    </div>
  )
}

export default function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ message: string }>
}) {
  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <Suspense fallback={<div className="text-gray-500 font-medium">Ładowanie...</div>}>
        <RegisterForm searchParams={searchParams} />
      </Suspense>
    </div>
  )
}