import { Suspense } from 'react'
import { signup } from './actions'
import Link from 'next/link'

async function RegisterForm({
  searchParams,
}: {
  searchParams: Promise<{ message: string }>
}) {
  const { message } = await searchParams

  return (
    <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-lg">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">Utwórz konto</h2>
        <p className="mt-2 text-sm text-gray-600">Dołącz do MatchOut</p>
      </div>
      
      {message && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
          {message}
        </div>
      )}

      <form className="mt-8 space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700">Imię</label>
          <input name="firstName" type="text" required className="mt-1 w-full rounded-md border border-gray-300 p-2" />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Telefon (Wymagane)</label>
          <input name="phone" type="tel" required placeholder="+48..." className="mt-1 w-full rounded-md border border-gray-300 p-2" />
          <p className="text-xs text-gray-500 mt-1">Będzie widoczny tylko dla członków Twojej grupy.</p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Email</label>
          <input name="email" type="email" required className="mt-1 w-full rounded-md border border-gray-300 p-2" />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Hasło (min. 6 znaków)</label>
          <input name="password" type="password" required minLength={6} className="mt-1 w-full rounded-md border border-gray-300 p-2" />
        </div>

        <button formAction={signup} className="w-full rounded-md bg-green-600 px-4 py-3 text-white font-medium hover:bg-green-700 transition">
          Zarejestruj się
        </button>
      </form>

      <div className="text-center text-sm text-gray-600 mt-4">
        Masz już konto?{' '}
        <Link href="/login" className="text-blue-600 font-medium hover:underline">
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
      <Suspense fallback={<div className="text-gray-500">Ładowanie...</div>}>
        <RegisterForm searchParams={searchParams} />
      </Suspense>
    </div>
  )
}