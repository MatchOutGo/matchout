import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto py-12">
      <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-8 transition-colors group">
        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
        Wróć na stronę główną
      </Link>
      
      <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-sm border border-gray-100">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900 mb-2">Polityka Prywatności</h1>
        <p className="text-gray-500 mb-8 text-sm">Ostatnia aktualizacja: 12 Listopada 2026</p>

        <div className="space-y-6 text-gray-600 leading-relaxed text-[15px]">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Informacje ogólne</h2>
            <p>Niniejsza Polityka Prywatności określa zasady przetwarzania i ochrony danych osobowych Użytkowników serwisu MatchOut (zwanego dalej &quot;Serwisem&quot;). Administratorem danych jest właściciel Serwisu. Dbamy o Twoją prywatność i przestrzegamy RODO.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Jakie dane zbieramy?</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Dane profilowe:</strong> Imię, adres e-mail, numer telefonu, zdjęcie profilowe (avatar).</li>
              <li><strong>Dane o wyjazdach:</strong> Informacje o organizowanych lub poszukiwanych wyjazdach, w tym lokalizacja, daty i budżet.</li>
              <li><strong>Komunikacja:</strong> Wiadomości przesyłane w ramach wbudowanego czatu.</li>
              <li><strong>Dane techniczne:</strong> Adres IP, typ urządzenia i przeglądarki.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Cel i podstawa prawna przetwarzania</h2>
            <p>Przetwarzamy Twoje dane w celu świadczenia usług drogą elektroniczną (na podstawie umowy - art. 6 ust. 1 lit. b RODO), zapewnienia bezpieczeństwa (prawnie uzasadniony interes - art. 6 ust. 1 lit. f RODO) oraz wysyłania powiadomień (na podstawie Twojej zgody).</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Udostępnianie danych</h2>
            <p>Twoje dane (imię, zdjęcie, numer telefonu) są udostępniane innym Użytkownikom <strong>tylko po zaakceptowaniu Cię do grupy wyjazdowej</strong>. Twoje dane nie są sprzedawane podmiotom trzecim.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Twoje prawa</h2>
            <p>Masz prawo do: dostępu do swoich danych, ich sprostowania, usunięcia, ograniczenia przetwarzania, przenoszenia danych oraz wniesienia sprzeciwu. Możesz w każdej chwili usunąć swoje konto.</p>
          </section>
        </div>
      </div>
    </div>
  );
}