'use client'

import { useState, useEffect, useRef } from 'react'
import { Download, X, Share } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PWAInstallPrompt() {
  const [isVisible, setIsVisible] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  
  const deferredPrompt = useRef<BeforeInstallPromptEvent | null>(null)

  useEffect(() => {
    // Оборачиваем в setTimeout, чтобы React 19 не ругался на синхронный setState
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setTimeout(() => setIsInstalled(true), 0)
      return
    }

    const isIosDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as unknown as { MSStream?: unknown }).MSStream
    setTimeout(() => setIsIOS(isIosDevice), 0)

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      deferredPrompt.current = e as BeforeInstallPromptEvent
      setTimeout(() => setIsVisible(true), 0)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // Для мобильных устройств показываем баннер через 3 секунды
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    if (isMobile) {
      const timer = setTimeout(() => setIsVisible(true), 3000)
      return () => clearTimeout(timer)
    }

    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
  }, [])

  const handleInstallClick = async () => {
    if (isIOS) {
      alert("Aby zainstalować na iPhone:\n1. Kliknij ikonę 'Udostępnij' (kwadrat ze strzałką) na dole ekranu.\n2. Przewiń w dół i wybierz 'Dodaj do ekranu początkowego'.")
      setIsVisible(false)
      return
    }

    if (deferredPrompt.current) {
      deferredPrompt.current.prompt()
      const { outcome } = await deferredPrompt.current.userChoice
      if (outcome === 'accepted') {
        setIsVisible(false)
      }
      deferredPrompt.current = null
    } else {
      alert("Aby zainstalować aplikację, otwórz tę stronę w przeglądarce Chrome lub Safari.")
    }
  }

  if (!isVisible || isInstalled) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-[100] animate-in slide-in-from-bottom-10 fade-in">
      <div className="bg-white/90 backdrop-blur-xl border border-gray-200 shadow-2xl rounded-2xl p-5 flex items-start gap-4 relative">
        <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center shrink-0">
          <img src="/logo.png" alt="Logo" className="w-8 h-8 rounded-lg" />
        </div>
        <div className="flex-1 pr-6">
          <h3 className="font-semibold text-gray-900 mb-1">Zainstaluj Snow&Go</h3>
          <p className="text-xs text-gray-500 mb-3">
            {isIOS 
              ? "Dodaj nas do ekranu głównego, aby mieć szybki dostęp." 
              : "Zainstaluj naszą aplikację, aby mieć szybki dostęp i powiadomienia."}
          </p>
          <div className="flex gap-2">
            <button onClick={handleInstallClick} className="bg-[#3a3a5c] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#2c2c45] transition-colors flex items-center gap-2">
              {isIOS ? <Share className="w-4 h-4" /> : <Download className="w-4 h-4" />}
              {isIOS ? 'Jak zainstalować?' : 'Zainstaluj'}
            </button>
            <button onClick={() => setIsVisible(false)} className="text-gray-500 text-sm font-medium px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors">
              Później
            </button>
          </div>
        </div>
        <button onClick={() => setIsVisible(false)} className="text-gray-400 hover:text-gray-600 absolute top-4 right-4">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}