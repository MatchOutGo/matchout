'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Cookie } from 'lucide-react'

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Проверяем, давал ли уже пользователь согласие
    const consent = localStorage.getItem('cookie_consent')
    if (!consent) {
      // Небольшая задержка, чтобы баннер выехал плавно после загрузки страницы
      const timer = setTimeout(() => setIsVisible(true), 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  const acceptCookies = () => {
    localStorage.setItem('cookie_consent', 'true')
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6 animate-in slide-in-from-bottom-10 fade-in duration-500 ease-out">
      <div className="max-w-4xl mx-auto bg-white/90 backdrop-blur-xl border border-gray-200 shadow-[0_8px_30px_rgba(0,0,0,0.12)] rounded-3xl p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-50 text-[#0071e3] rounded-2xl shrink-0 hidden sm:block">
            <Cookie className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Szanujemy Twoją prywatność</h3>
            <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
              Używamy niezbędnych plików cookies, aby zapewnić prawidłowe działanie serwisu (np. utrzymanie sesji logowania). Kontynuując, akceptujesz naszą <Link href="/privacy" className="text-[#0071e3] hover:underline font-medium">Politykę Prywatności</Link>.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto shrink-0 mt-2 md:mt-0">
          <button 
            onClick={acceptCookies}
            className="w-full md:w-auto px-8 py-3 bg-[#0071e3] text-white rounded-full font-medium hover:bg-[#0077ed] transition-colors shadow-sm whitespace-nowrap"
          >
            Akceptuję
          </button>
        </div>

      </div>
    </div>
  )
}