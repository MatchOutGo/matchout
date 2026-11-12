'use client'

import { ShieldAlert } from 'lucide-react'

export default function BanBanner({ 
  reason, 
  expiresAt 
}: { 
  reason: string | null, 
  expiresAt: string | null 
}) {
  // Если даты нет, значит бан перманентный
  const date = expiresAt 
    ? new Date(expiresAt).toLocaleDateString('pl-PL', {
        day: 'numeric', month: 'long', year: 'numeric'
      })
    : 'na stałe (permanentnie)'

  return (
    <div className="bg-red-600 text-white px-4 py-3 sticky top-0 z-[100] shadow-md">
      <div className="max-w-7xl mx-auto flex items-center gap-3 text-sm font-medium">
        <ShieldAlert className="w-5 h-5 shrink-0" />
        <div>
          <p className="font-bold">Twoje konto zostało zablokowane.</p>
          {reason && <p className="opacity-90">Powód: {reason}</p>}
          <p className="opacity-90 text-xs mt-1">Blokada wygasa: {date}</p>
        </div>
      </div>
    </div>
  )
}