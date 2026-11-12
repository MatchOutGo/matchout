import { type NextRequest } from 'next/server'
import createMiddleware from 'next-intl/middleware'
import { updateSession } from '@/utils/supabase/middleware'

const intlMiddleware = createMiddleware({
  locales: ['pl', 'en'],
  defaultLocale: 'pl',
  localePrefix: 'always'
})

export async function middleware(request: NextRequest) {
  // 1. Сначала обрабатываем интернационализацию (добавляем /pl или /en)
  const response = intlMiddleware(request)
  
  // 2. Затем обновляем сессию Supabase
  const supabaseResponse = await updateSession(request)
  
  // Объединяем куки
  supabaseResponse.cookies.getAll().forEach(cookie => {
    response.cookies.set(cookie.name, cookie.value)
  })

  return response
}

export const config = {
  // Пропускаем статические файлы и картинки
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
}