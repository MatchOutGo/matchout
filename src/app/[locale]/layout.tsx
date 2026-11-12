import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { createClient } from "@/utils/supabase/server";
import { connection } from "next/server";
import { Suspense } from "react";
import HeaderClient from "./HeaderClient";
import CookieBanner from "@/components/CookieBanner";
import BanBanner from "@/components/BanBanner";
import { Link } from '@/i18n/routing';

async function Header() {
  await connection(); 
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  let profile = null;
  let unreadCount = 0;
  let notifCount = 0; 
  let activeBan = null;

  if (user) {
    const { data } = await supabase.from('profiles').select('first_name, avatar_url, phone, role, is_banned').eq('id', user.id).single();
    profile = data;
    
    if (profile?.is_banned) {
      const { data: ban } = await supabase
        .from('blacklist')
        .select('reason, expires_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      activeBan = ban || { reason: "Naruszenie regulaminu (szczegóły u administratora)", expires_at: null };
    }

    const { data: count } = await supabase.rpc('get_unread_messages_count');
    unreadCount = count || 0;

    const { count: nCount } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('is_read', false);
    notifCount = nCount || 0;
  }

  const isProfileIncomplete = !!(user && (!profile?.first_name || profile?.phone === 'BRAK' || !profile?.phone));

  return (
    <>
      {activeBan && (
        <BanBanner 
          reason={activeBan.reason} 
          expiresAt={activeBan.expires_at} 
        />
      )}
      
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-xl font-semibold text-gray-900 tracking-tight group-hover:opacity-70 transition-opacity">
              MatchOut
            </span>
          </Link>
          
          <HeaderClient 
            user={user} 
            profile={profile} 
            unreadCount={unreadCount} 
            notifCount={notifCount}
            isProfileIncomplete={isProfileIncomplete} 
          />
        </div>
      </header>
    </>
  );
}

function HeaderSkeleton() {
  return <header className="h-16 bg-white/70 border-b border-gray-200/50"></header>;
}

// 1. Выносим всю асинхронную логику в отдельный компонент
async function LayoutContent({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <Suspense fallback={<HeaderSkeleton />}>
        <Header />
      </Suspense>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full">
        {children}
      </main>

      <footer className="border-t border-gray-200/50 bg-white/50 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>© 2026 MatchOut. Wszelkie prawa zastrzeżone.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-gray-900 transition-colors">Polityka Prywatności</Link>
            <Link href="/terms" className="hover:text-gray-900 transition-colors">Regulamin</Link>
          </div>
        </div>
      </footer>

      <CookieBanner />
    </NextIntlClientProvider>
  );
}

// 2. Синхронный экспорт с оберткой Suspense
export default function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500 text-lg">Ładowanie...</div>
      </div>
    }>
      <LayoutContent params={params}>
        {children}
      </LayoutContent>
    </Suspense>
  );
}