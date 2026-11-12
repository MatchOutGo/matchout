import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto py-12">
      <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-8 transition-colors group">
        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
        Wróć na stronę główną
      </Link>
      
      <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-sm border border-gray-100">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900 mb-2">Regulamin Serwisu</h1>
        <p className="text-gray-500 mb-8 text-sm">Ostatnia aktualizacja: 12 Listopada 2026</p>

        <div className="space-y-6 text-gray-600 leading-relaxed text-[15px]">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Postanowienia ogólne</h2>
            <p>Serwis MatchOut służy do nawiązywania kontaktów w celu wspólnych wyjazdów sportowych (np. narciarskich, snowboardowych, kajakowych). Korzystanie z Serwisu oznacza akceptację niniejszego Regulaminu.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Charakter Serwisu i odpowiedzialność</h2>
            <p><strong>MatchOut jest wyłącznie platformą łączącą Użytkowników.</strong> Nie jesteśmy organizatorem wyjazdów, biurem podróży ani pośrednikiem finansowym. Nie ponosimy odpowiedzialności za jakość, bezpieczeństwo, ani legalność wyjazdów organizowanych przez Użytkowników.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Płatności i Zaliczki</h2>
            <p>Wszelkie rozliczenia finansowe (w tym zaliczki) odbywają się <strong>bezpośrednio między Użytkownikami</strong> poza systemem Serwisu. MatchOut nie pośredniczy w płatnościach i nie ponosi odpowiedzialności za transakcje między Użytkownikami.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Obowiązki Użytkownika i Zakaz Spamu</h2>
            <p>Użytkownik zobowiązuje się do:</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>Podawania prawdziwych danych kontaktowych (w tym obowiązkowego numeru telefonu).</li>
              <li>Kulturalnego zachowania na czacie.</li>
              <li>Nieorganizowania wyjazdów o charakterze komercyjnym bez zgody administratora.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Moderacja i Czarna Lista</h2>
            <p>Administrator ma prawo do zablokowania konta Użytkownika (wpisania na Czarną Listę) w przypadku:</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>Zgłoszenia przez innych Użytkowników (np. za niestawienie się na wyjazd bez uprzedzenia).</li>
              <li>Zachowań agresywnych, wulgarnych lub łamiących prawo.</li>
              <li>Spamu w wiadomościach.</li>
            </ul>
            <p className="mt-2">W przypadku zgłoszenia, Administrator ma prawo wglądu w historię czatu w celu rozpatrzenia sprawy. Zablokowany Użytkownik otrzyma powiadomienie o powodzie i czasie trwania bana.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Postanowienia końcowe</h2>
            <p>Administrator zastrzega sobie prawo do zmiany Regulaminu. O wszelkich zmianach Użytkownicy będą informowani za pośrednictwem Serwisu.</p>
          </section>
        </div>
      </div>
    </div>
  );
}