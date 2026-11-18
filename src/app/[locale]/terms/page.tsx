import { Link } from '@/i18n/routing';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-gray-100">
        
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Regulamin wyszukiwarki Snow&Go</h1>
        <p className="text-sm text-gray-500 mb-8 border-b border-gray-100 pb-6">Ostatnia aktualizacja: 18 listopada 2026</p>

        <div className="space-y-6 text-gray-700 leading-relaxed">
          
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Postanowienia ogólne</h2>
            <p>Wyszukiwarkę Snow&Go (S&G) dostępną pod adresem <a href="https://www.snowandgo.pl" className="text-[#0066cc] hover:underline">snowandgo.pl</a>, prowadzi właściciel Jędrzej Lachowicz, adres e-mail: <a href="mailto:contact@snowandgo.pl" className="text-[#0066cc] hover:underline">contact@snowandgo.pl</a> („Operator”). Strona internetowa i aplikacja wyszukiwarki jest wyłącznie platformą technologiczną umożliwiającą bezpłatne kojarzenie osób jadących pojazdach osobowymi (do maksymalnie 9 miejsc siedzących i DMC do 3,5 tony) na kilkudniowe wyjazdy na narty, snowboard, z osobami szukającymi wolnego miejsca w pojazdach na takie wyjazdy. Korzystanie ze strony internetowej i aplikacji wyszukiwarki oznacza akceptację niniejszego Regulaminu.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Charakter wyszukiwarki</h2>
            <p>Snow&Go jest wyłącznie wyszukiwarką kojarzącą użytkowników. Operator nie jest organizatorem wyjazdów, biurem podróży, przewoźnikiem ani pośrednikiem finansowym. Operator nie zawiera żadnych umów między użytkownikami i nie uczestniczy w realizacji wyjazdu.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Ustalenia i płatności między użytkownikami</h2>
            <p>Termin, trasa, wysokość i podział kosztów lub ustalona przez oferującego kwota, oraz wszelkie rozliczenia, w tym ewentualne zaliczki, są ustalane i realizowane bezpośrednio między użytkownikami, poza aplikacją. Operator nie pośredniczy w żadnych płatnościach i nie ponosi odpowiedzialności za rozliczenia ani ich brak.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Obowiązki użytkownika</h2>
            <p className="mb-2">Użytkownik wyszukiwarki zobowiązuje się do:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>podawania prawdziwych danych, w tym obowiązkowo numeru telefonu kontaktowego;</li>
              <li>kulturalnego zachowania w komunikacji z innymi użytkownikami;</li>
              <li>niepublikowania ofert komercyjnych, niezgodnych z prawem.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Brak weryfikacji i brak gwarancji</h2>
            <p>Operator wyszukiwarki nie weryfikuje tożsamości, uprawnień do kierowania pojazdem, stanu technicznego pojazdu, ubezpieczenia ani prawdziwości ofert. Operator nie gwarantuje, że zgłoszony wyjazd dojdzie do skutku. Przed wyjazdem użytkownicy powinni samodzielnie zweryfikować te informacje oraz potwierdzić warunki.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Moderacja i blokowanie kont</h2>
            <p>Operator może zablokować konto użytkownika, w szczególności w przypadku: zgłoszenia przez innego użytkownika (np. niestawienia się na wyjazd bez uprzedzenia lub odwołanie wyjazdu bez podania przyczyny), zachowań agresywnych lub wulgarnych, naruszenia prawa lub niniejszego Regulaminu. Zablokowany użytkownik otrzyma informację o powodzie blokady. Rozpatrując zgłoszenie, Operator może mieć wgląd w wiadomości związane ze zgłoszeniem, zgodnie z Polityką prywatności.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Odpowiedzialność Operatora</h2>
            <p>W zakresie dozwolonym przez prawo Operator nie odpowiada za działania użytkowników, treść ofert, przebieg wyjazdu ani skutki ustaleń między użytkownikami. Regulamin nie wyłącza odpowiedzialności, której nie można wyłączyć na mocy prawa.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Prawa autorskie</h2>
            <p>Wszelkie treści, grafiki, logotypy i elementy interfejsu Aplikacji są chronione prawem autorskim. Kopiowanie, modyfikowanie lub rozpowszechnianie ich bez zgody Operatora jest zabronione.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Linki zewnętrzne</h2>
            <p>Aplikacja może zawierać linki do zewnętrznych stron internetowych. Operator nie ponosi odpowiedzialności za treści, polityki prywatności ani praktyki stosowane przez te strony.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">10. Wyłączenie odpowiedzialności</h2>
            <p>Operator dokłada wszelkich starań, aby Aplikacja działała poprawnie, jednak nie gwarantuje, że będzie ona wolna od błędów lub przerw w działaniu. Operator nie ponosi odpowiedzialności za ewentualne szkody wynikające z korzystania z Aplikacji, w zakresie dopuszczalnym przez obowiązujące prawo. Zasady odpowiedzialności za działania użytkowników opisane są szczegółowo w Regulaminie.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">11. Dane osobowe i kontakt</h2>
            <p>Zasady przetwarzania danych, w tym wglądu w wiadomości przy zgłoszeniach, opisuje <Link href="/privacy" className="text-[#0066cc] hover:underline font-medium">Polityka prywatności</Link>. Zgłoszenia i pytania: <a href="mailto:contact@snowandgo.pl" className="text-[#0066cc] hover:underline">contact@snowandgo.pl</a>. Operator zastrzega sobie prawo do zmiany Regulaminu, o czym poinformuje użytkowników w wyszukiwarce.</p>
          </section>

        </div>
      </div>
    </div>
  );
}