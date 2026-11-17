'use client'

import { useState } from 'react'
import { Flag, X, Loader2 } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

export default function ReportButton({ listingId }: { listingId: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [reason, setReason] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [isSent, setIsSent] = useState(false)
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!reason.trim()) return

    setIsSending(true)
    
    // Получаем текущего пользователя
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      alert('Musisz być zalogowany, aby zgłosić ogłoszenie.')
      setIsSending(false)
      return
    }

    // Сохраняем жалобу в базу
    const { error } = await supabase.from('complaints').insert({
      listing_id: listingId,
      reporter_id: user.id,
      reason: reason.trim(),
      status: 'pending'
    })

    if (error) {
      console.error(error)
      alert('Wystąpił błąd podczas wysyłania zgłoszenia.')
    } else {
      setIsSent(true)
      // Отправляем уведомление админу (упрощенно - просто создаем запись в notifications)
      // В реальном проекте здесь может быть вызов серверной функции
      await supabase.from('notifications').insert({
        user_id: 'ID_АДМИНА_ЗДЕСЬ', // <-- Сюда нужно будет вставить ID Jędrka
        type: 'new_complaint',
        payload: { listing_id: listingId, reason: reason }
      })
    }
    setIsSending(false)
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)} 
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 transition-colors font-medium"
      >
        <Flag className="w-4 h-4" /> Zgłoś
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl relative">
            <button 
              onClick={() => setIsOpen(false)} 
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>

            {isSent ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Flag className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Dziękujemy!</h3>
                <p className="text-sm text-gray-500">Twoje zgłoszenie zostało wysłane. Administrator wkrótce je rozpatrzy.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Zgłoś to ogłoszenie</h3>
                <label className="block text-sm font-medium text-gray-700 mb-2">Powód zgłoszenia</label>
                <textarea
                  required
                  rows={4}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Opisz, dlaczego to ogłoszenie jest nielegalne lub nieodpowiednie..."
                  className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl p-3 text-sm outline-none focus:border-[#0066cc] mb-4"
                />
                <button
                  type="submit"
                  disabled={isSending || !reason.trim()}
                  className="w-full py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                  {isSending ? 'Wysyłanie...' : 'Wyślij zgłoszenie'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}