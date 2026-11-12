'use client'

import { useEffect, useMemo } from 'react'
import { useRouter, usePathname, Link } from '@/i18n/routing'
import { useLocale, useTranslations } from 'next-intl'
import { createClient } from '@/utils/supabase/client'
import { MessageCircle, Bell } from 'lucide-react'
import { User } from '@supabase/supabase-js'

type Profile = {
  first_name: string | null
  avatar_url: string | null
  phone: string | null
  role: string | null
  is_banned: boolean | null
}

export default function HeaderClient({ 
  user, profile, unreadCount, notifCount, isProfileIncomplete 
}: { 
  user: User | null, 
  profile: Profile | null, 
  unreadCount: number, 
  notifCount: number,
  isProfileIncomplete: boolean 
}) {
  const router = useRouter()
  const pathname = usePathname()
  const locale = useLocale()
  const t = useTranslations('Nav')
  
  const supabase = useMemo(() => createClient(), [])

  // Realtime подписка на сообщения и уведомления
  useEffect(() => {
    if (!user) return;
    const channel = supabase.channel('global_messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        if (payload.new.sender_id !== user.id) router.refresh()
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications' }, (payload) => {
        if (payload.new.user_id === user.id) router.refresh()
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [user?.id, supabase, router])

  // Функция переключения языка
  const toggleLanguage = () => {
    const nextLocale = locale === 'pl' ? 'en' : 'pl';
    router.replace(pathname, { locale: nextLocale });
  }

  return (
    <nav className="flex items-center gap-3 sm:gap-5">
      {user ? (
        <>
          {/* Статус: Забанен / Не заполнен профиль / Кнопка Создать */}
          {profile?.is_banned ? (
            <span className="hidden sm:block text-[13px] font-bold text-red-600 bg-red-50 px-3 py-1.5 rounded-full border border-red-100">
              {t('blocked')}
            </span>
          ) : isProfileIncomplete ? (
            <Link href="/profile" className="hidden sm:flex items-center gap-2 text-[13px] font-medium text-red-600 bg-red-50 px-3 py-1.5 rounded-full animate-pulse border border-red-100">
              {t('completeProfile')}
            </Link>
          ) : (
            <Link href="/listings/create" className="hidden sm:block text-[14px] font-medium text-gray-900 bg-gray-100 hover:bg-gray-200 px-4 py-1.5 rounded-full transition-colors">
              {t('create')}
            </Link>
          )}
          
          {/* Иконка Чатов */}
          <Link href="/chats" className="relative text-gray-500 hover:text-gray-900 transition-colors">
            <MessageCircle className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white animate-in zoom-in">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Link>

          {/* Иконка Уведомлений */}
          <Link href="/notifications" className="relative text-gray-500 hover:text-gray-900 transition-colors">
            <Bell className="w-5 h-5" />
            {notifCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white animate-in zoom-in">
                {notifCount > 9 ? '9+' : notifCount}
              </span>
            )}
          </Link>

          {/* Переключатель языков */}
          <button 
            onClick={toggleLanguage}
            className="text-[13px] font-bold text-gray-500 hover:text-gray-900 transition-colors uppercase border border-gray-200 px-2.5 py-1 rounded-md bg-white shadow-sm"
          >
            {locale === 'pl' ? 'EN' : 'PL'}
          </button>

          {/* Аватар и Имя */}
          <Link href="/profile" className="flex items-center gap-2 hover:opacity-70 transition-opacity">
            <span className="text-[14px] font-medium text-gray-900 hidden sm:block">
              {profile?.first_name || t('profile')}
            </span>
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-medium text-gray-600 overflow-hidden ring-2 ring-transparent hover:ring-[#0071e3] transition-all">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                profile?.first_name?.charAt(0) || user.email?.charAt(0)
              )}
            </div>
          </Link>
        </>
      ) : (
        <>
          {/* Кнопки для гостей */}
          
          {/* Переключатель языков для гостей */}
          <button 
            onClick={toggleLanguage}
            className="text-[13px] font-bold text-gray-500 hover:text-gray-900 transition-colors uppercase border border-gray-200 px-2.5 py-1 rounded-md bg-white shadow-sm"
          >
            {locale === 'pl' ? 'EN' : 'PL'}
          </button>

          <Link href="/login" className="text-[14px] font-medium text-gray-500 hover:text-gray-900 transition-colors">
            {t('login')}
          </Link>
          <Link href="/register" className="text-[14px] font-medium text-white bg-[#0071e3] hover:bg-[#0077ed] px-5 py-2 rounded-full transition-colors">
            {t('register')}
          </Link>
        </>
      )}
    </nav>
  )
}