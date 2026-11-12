'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { createClient } from '@/utils/supabase/client'
import { sendMessage, markChatAsRead, reportChat } from './actions'
import Link from 'next/link'
import { ArrowLeft, Send, Loader2, Flag, X } from 'lucide-react'

type ProfileData = { first_name: string | null; avatar_url: string | null }

type Message = {
  id: string
  content: string
  created_at: string | null 
  sender_id: string
  profiles: ProfileData | ProfileData[] | null 
}

type Profile = { id: string; first_name: string | null; avatar_url: string | null }

export default function ChatComponent({ 
  listingId, listingTitle, initialMessages, currentUser 
}: { 
  listingId: string, listingTitle: string, initialMessages: Message[], currentUser: Profile 
}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [newMessage, setNewMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  
  // Стейты для жалобы
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)
  const [reportReason, setReportReason] = useState('')
  const [isReporting, setIsReporting] = useState(false)

  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    markChatAsRead(listingId);
  }, [listingId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    const channel = supabase
      .channel(`chat_${listingId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `listing_id=eq.${listingId}` },
        async (payload) => {
          if (payload.new.sender_id === currentUser.id) return;

          const { data: newMsg } = await supabase
            .from('messages')
            .select(`*, profiles(first_name, avatar_url)`)
            .eq('id', payload.new.id)
            .single()

          if (newMsg) {
            setMessages((prev) => {
              if (prev.some(m => m.id === newMsg.id)) return prev;
              return [...prev, newMsg as Message]
            })
          }
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [listingId, currentUser.id, supabase])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || isSending) return

    setIsSending(true)
    const content = newMessage.trim()
    setNewMessage('')

    const tempId = `temp-${Date.now()}`
    const optimisticMsg: Message = {
      id: tempId,
      content: content,
      created_at: new Date().toISOString(),
      sender_id: currentUser.id,
      profiles: { first_name: currentUser.first_name, avatar_url: currentUser.avatar_url }
    }
    setMessages(prev => [...prev, optimisticMsg])

    const res = await sendMessage(listingId, content)
    
    if (res?.error) {
      alert("Ошибка отправки: " + res.error)
      setMessages(prev => prev.filter(m => m.id !== tempId))
    } else if (res?.message) {
      setMessages(prev => prev.map(m => m.id === tempId ? (res.message as unknown as Message) : m))
    }

    setIsSending(false)
  }

  const handleReport = async () => {
    if (!reportReason.trim()) return;
    setIsReporting(true);
    
    // Жалуемся на всю поездку в целом (target_id можно передать 'admin', если нет конкретного обидчика)
    const res = await reportChat(listingId, 'admin', reportReason);
    
    setIsReporting(false);
    if (res.error) {
      alert("Ошибка при отправке жалобы: " + res.error);
    } else {
      setIsReportModalOpen(false);
      setReportReason('');
      alert("Жалоба отправлена администратору. Спасибо!");
    }
  }

  const formatTime = (dateStr: string | null) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="max-w-3xl mx-auto h-[calc(100vh-8rem)] flex flex-col bg-white rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.06)] overflow-hidden border border-gray-100 relative">
      
      {/* Шапка чата */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Link href={`/listings/${listingId}`} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-lg font-semibold text-gray-900 truncate">{listingTitle}</h1>
            <p className="text-xs text-green-600 font-medium flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500 block"></span> Czat ekipy
            </p>
          </div>
        </div>
        
        <button 
          onClick={() => setIsReportModalOpen(true)}
          className="flex items-center gap-2 text-[13px] font-medium text-gray-600 bg-gray-50 hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-full transition-colors border border-gray-200 hover:border-red-100"
          title="Zgłoś problem"
        >
          <Flag className="w-4 h-4" />
          <span>Zgłoś</span>
        </button>
      </div>

      {/* Лента сообщений */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#f9f9f9]">
        {messages.length === 0 ? (
          <div className="text-center text-gray-400 mt-10">
            <p>Brak wiadomości. Napisz pierwszy!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender_id === currentUser.id
            const author = Array.isArray(msg.profiles) ? msg.profiles[0] : msg.profiles
            const authorName = author?.first_name || 'Użytkownik'
            const authorAvatar = author?.avatar_url

            return (
              <div key={msg.id} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                {!isMe && (
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center text-xs font-bold text-gray-600 overflow-hidden mt-auto">
                    {authorAvatar ? (
                      <img src={authorAvatar} alt="Ava" className="w-full h-full object-cover" />
                    ) : (
                      authorName.charAt(0)
                    )}
                  </div>
                )}
                
                <div className={`flex flex-col max-w-[75%] ${isMe ? 'items-end' : 'items-start'}`}>
                  {!isMe && <span className="text-xs text-gray-500 mb-1 ml-1">{authorName}</span>}
                  
                  <div className={`px-4 py-2.5 rounded-2xl ${isMe ? 'bg-[#0071e3] text-white rounded-br-sm' : 'bg-white text-gray-900 border border-gray-100 rounded-bl-sm shadow-sm'}`}>
                    <p className="whitespace-pre-wrap break-words text-[15px]">{msg.content}</p>
                  </div>
                  <span className="text-[11px] text-gray-400 mt-1 mx-1">{formatTime(msg.created_at)}</span>
                </div>
              </div>
            )
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Инпут отправки */}
      <div className="p-4 bg-white border-t border-gray-100">
        <form onSubmit={handleSend} className="flex gap-2">
          <input 
            type="text" 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Napisz wiadomość..."
            className="flex-1 bg-[#f5f5f7] border-none rounded-full px-5 py-3 text-[15px] text-gray-900 focus:ring-2 focus:ring-[#0071e3]/50 outline-none transition-all"
          />
          <button 
            type="submit"
            disabled={!newMessage.trim() || isSending}
            className="w-12 h-12 rounded-full bg-[#0071e3] text-white flex items-center justify-center hover:bg-[#0077ed] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5 ml-1" />}
          </button>
        </form>
      </div>

      {/* МОДАЛЬНОЕ ОКНО ЖАЛОБЫ */}
      {isReportModalOpen && (
        <div className="absolute inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 relative animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setIsReportModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-900"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Zgłoś problem</h3>
            <p className="text-sm text-gray-500 mb-4">
              Opisz, co jest nie tak w tym czacie. Administrator otrzyma dostęp do tej rozmowy, aby podjąć decyzję.
            </p>

            <textarea 
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              placeholder="np. Obraźliwe zachowanie, spam..."
              rows={3}
              className="w-full bg-[#f5f5f7] border-none rounded-xl p-3 text-[15px] focus:ring-2 focus:ring-[#0071e3]/50 outline-none mb-4"
            />

            <button 
              onClick={handleReport}
              disabled={!reportReason.trim() || isReporting}
              className="w-full py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
            >
              {isReporting ? 'Wysyłanie...' : 'Wyślij zgłoszenie'}
            </button>
          </div>
        </div>
      )}

    </div>
  )
}