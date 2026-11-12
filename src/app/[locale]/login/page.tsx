import { Suspense } from 'react'
import { login } from './actions'
import Link from 'next/link'

async function LoginForm({
  searchParams,
}: {
  searchParams: Promise<{ message: string }>
}) {
  const { message } = await searchParams

  return (
    <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-lg">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">Zaloguj się</h2>
        <p className="mt-2 text-sm text-gray-600">Witaj ponownie w MatchOut</p>
      </div>
      
      {message && (
        <div className="rounded-md bg-blue-50 p-3 text-sm text-blue-700">
          {message}
        </div>
      )}

      <form className="mt-8 space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700">Email</label>
          <input name="email" type="email" required className="mt-1 w-full rounded-md border border-gray-300 p-2" />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Hasło</label>
          <input name="password" type="password" required className="mt-1 w-full rounded-md border border-gray-300 p-2" />
        </div>

        <button formAction={login} className="w-full rounded-md bg-blue-600 px-4 py-3 text-white font-medium hover:bg-blue-700 transition">
          Zaloguj się
        </button>
      </form>

      <div className="text-center text-sm text-gray-600 mt-4">
        Nie masz konta?{' '}
        <Link href="/register" className="text-blue-600 font-medium hover:underline">
          Zarejestruj się
        </Link>
      </div>
    </div>
  )
}

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message: string }>
}) {
  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <Suspense fallback={<div className="text-gray-500">Ładowanie...</div>}>
        <LoginForm searchParams={searchParams} />
      </Suspense>
    </div>
  )
}