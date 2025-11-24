import Link from 'next/link'

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
            <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link href="/" className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">
                            👶 MaxiBingo
                        </Link>
                    </div>
                </div>
            </nav>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
                    <h1 className="text-4xl font-bold mb-8">Regulamin i Zasady Gry</h1>

                    <div className="prose prose-lg max-w-none space-y-6 text-gray-700">
                        <section>
                            <h2 className="text-2xl font-bold mb-4">1. Definicje</h2>
                            <p>
                                <strong>MaxiBingo</strong> - platforma internetowa umożliwiająca organizację prywatnych pul zakładów na datę urodzenia dziecka.
                            </p>
                            <p>
                                <strong>Organizator</strong> - osoba tworząca pulę zakładów (rodzic oczekujący dziecka).
                            </p>
                            <p>
                                <strong>Uczestnik</strong> - osoba biorąca udział w puli zakładów poprzez typowanie daty urodzenia i wpłatę określonej kwoty.
                            </p>
                            <p>
                                <strong>Pula</strong> - suma wszystkich wpłat uczestników pomniejszona o prowizję platformy (1%).
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4">2. Zasady Uczestnictwa</h2>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Każdy uczestnik może typować datę urodzenia tylko raz w danej puli</li>
                                <li>Uczestnik musi dokonać płatności w pełnej wysokości określonej przez organizatora</li>
                                <li>Płatności są przetwarzane przez Stripe i są nieodwracalne</li>
                                <li>Uczestnik musi posiadać konto (logowanie przez Google lub Facebook)</li>
                                <li>Minimalna kwota zakładu to 1 PLN</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4">3. Zasady Gry</h2>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>
                                    <strong>Dokładne trafienie:</strong> Jeśli uczestnik typuje dokładną datę urodzenia dziecka, wygrywa całą pulę
                                </li>
                                <li>
                                    <strong>Brak dokładnego trafienia:</strong> Jeśli nikt nie trafi dokładnej daty, wygrywa osoba która typowała najbliższą datę
                                </li>
                                <li>
                                    <strong>Remis:</strong> Jeśli kilka osób typowało tę samą datę (zwycięską), pula jest dzielona równo między wszystkich zwycięzców
                                </li>
                                <li>
                                    <strong>Ogłoszenie wyniku:</strong> Organizator ogłasza faktyczną datę urodzenia dziecka w systemie, co automatycznie określa zwycięzcę/zwycięzców
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4">4. Prowizja Platformy</h2>
                            <p>
                                Platforma MaxiBingo pobiera prowizję w wysokości <strong>1% od każdej wpłaty</strong> na pokrycie kosztów:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Opłat bramki płatniczej Stripe</li>
                                <li>Utrzymania serwera i infrastruktury</li>
                                <li>Wysyłki powiadomień email</li>
                            </ul>
                            <p>
                                Pozostałe 99% wpłaty trafia do puli i jest wypłacane zwycięzcy/zwycięzcom.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4">5. Wypłata Wygranej</h2>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Wypłata następuje automatycznie po ogłoszeniu daty urodzenia przez organizatora</li>
                                <li>Środki są przekazywane na konto bankowe zwycięzcy przez Stripe Connect</li>
                                <li>Czas realizacji wypłaty: 3-5 dni roboczych</li>
                                <li>Zwycięzca otrzyma powiadomienie email z potwierdzeniem wypłaty</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4">6. Polityka Zwrotów</h2>
                            <p>
                                <strong>Wpłaty są nieodwracalne.</strong> Zwroty są możliwe tylko w następujących przypadkach:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Organizator anuluje pulę przed ogłoszeniem daty urodzenia</li>
                                <li>Błąd techniczny platformy uniemożliwiający prawidłowe działanie</li>
                                <li>Naruszenie regulaminu przez organizatora</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4">7. Odpowiedzialność</h2>
                            <p>
                                MaxiBingo działa jako platforma techniczna umożliwiająca organizację prywatnych pul zakładów. Platforma:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Nie ponosi odpowiedzialności za spory między uczestnikami</li>
                                <li>Nie gwarantuje wypłaty w przypadku problemów z kontem bankowym zwycięzcy</li>
                                <li>Zastrzega sobie prawo do zamknięcia puli w przypadku podejrzenia oszustwa</li>
                                <li>Nie ponosi odpowiedzialności za błędy organizatora przy ogłaszaniu daty urodzenia</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4">8. Ochrona Danych Osobowych</h2>
                            <p>
                                Przetwarzanie danych osobowych odbywa się zgodnie z RODO. Szczegóły w{' '}
                                <Link href="/privacy" className="text-purple-600 hover:underline">
                                    Polityce Prywatności
                                </Link>
                                .
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4">9. Postanowienia Końcowe</h2>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Regulamin wchodzi w życie z dniem publikacji</li>
                                <li>Platforma zastrzega sobie prawo do zmiany regulaminu z 7-dniowym wyprzedzeniem</li>
                                <li>W sprawach nieuregulowanych regulaminem zastosowanie mają przepisy prawa polskiego</li>
                                <li>Wszelkie spory będą rozstrzygane przez sąd właściwy dla siedziby platformy</li>
                            </ul>
                        </section>

                        <section className="bg-purple-50 border border-purple-200 rounded-lg p-6 mt-8">
                            <h3 className="font-bold text-lg mb-2">⚖️ Aspekt Prawny</h3>
                            <p className="text-sm">
                                Pule zakładów organizowane przez MaxiBingo mają charakter prywatny i rozrywkowy.
                                Uczestnictwo jest dobrowolne i odbywa się między znajomymi i rodziną.
                                Platforma nie prowadzi działalności hazardowej w rozumieniu ustawy o grach hazardowych.
                            </p>
                        </section>
                    </div>

                    <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-600">
                        <p>Ostatnia aktualizacja: {new Date().toLocaleDateString('pl-PL')}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
