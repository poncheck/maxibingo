import Link from 'next/link'
import Image from 'next/image'

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
            <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link href="/" className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">
                            <Image src="/logo.png" alt="BabyBingo" width={40} height={40} className="inline-block" /> BabyBingo
                        </Link>
                    </div>
                </div>
            </nav>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
                    <h1 className="text-4xl font-bold mb-8">Regulamin Zbiórek Grupowych</h1>

                    <div className="prose prose-lg max-w-none space-y-6 text-gray-700">
                        <section>
                            <h2 className="text-2xl font-bold mb-4">1. Definicje</h2>
                            <p>
                                <strong>BabyBingo</strong> - platforma internetowa umożliwiająca organizację zbiórek grupowych na cele związane z narodzinami dziecka.
                            </p>
                            <p>
                                <strong>Organizator</strong> - osoba tworząca zbiórkę (rodzic oczekujący dziecka).
                            </p>
                            <p>
                                <strong>Uczestnik</strong> - osoba wspierająca zbiórkę poprzez wpłatę określonej kwoty i uczestnictwo w konkursie na datę urodzenia.
                            </p>
                            <p>
                                <strong>Cel zbiórki</strong> - konkretny cel określony przez organizatora (np. sesja zdjęciowa noworodkowa, wyprawka dla dziecka), na który zbierane są środki.
                            </p>
                            <p>
                                <strong>Zbiórka</strong> - suma wszystkich wpłat uczestników pomniejszona o prowizję platformy (1%).
                            </p>
                            <p>
                                <strong>Zwycięzca konkursu</strong> - osoba, która najdokładniej typowała datę urodzenia dziecka.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4">2. Charakter Zbiórki</h2>
                            <p>
                                BabyBingo umożliwia organizację zbiórek grupowych na konkretne cele związane z narodzinami dziecka. Zbiórka łączy:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li><strong>Cel charytatywny/prezentowy</strong> - zebrane środki służą realizacji określonego celu (np. sesja zdjęciowa, wyprawka)</li>
                                <li><strong>Element zabawy</strong> - uczestnicy typują datę urodzenia dziecka</li>
                                <li><strong>Wspólne działanie</strong> - zwycięzca konkursu realizuje cel w imieniu całej grupy</li>
                            </ul>
                            <p className="mt-4">
                                <strong>Ważne:</strong> To nie jest gra hazardowa. Zwycięzca konkursu otrzymuje środki wyłącznie w celu realizacji określonego celu zbiórki. Ewentualna nadwyżka po realizacji celu stanowi wynagrodzenie za organizację i koordynację.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4">3. Zasady Uczestnictwa</h2>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Każdy uczestnik może wesprzeć zbiórkę tylko raz (jedna wpłata + jedna data)</li>
                                <li>Uczestnik musi dokonać wpłaty w pełnej wysokości określonej przez organizatora</li>
                                <li>Płatności są przetwarzane przez Stripe i są nieodwracalne</li>
                                <li>Uczestnik musi posiadać konto (logowanie przez Google, Facebook lub email)</li>
                                <li>Minimalna kwota wpłaty to 2 PLN (wymaganie bramki płatniczej)</li>
                                <li>Uczestnik potwierdza, że zna cel zbiórki i akceptuje jego realizację przez zwycięzcę</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4">4. Cel Zbiórki i Obowiązki Zwycięzcy</h2>
                            <p>
                                <strong>Organizator określa konkretny cel zbiórki</strong>, np.:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Profesjonalna sesja zdjęciowa noworodkowa</li>
                                <li>Wyprawka dla dziecka</li>
                                <li>Album ze zdjęciami pierwszego roku</li>
                                <li>Inne cele związane z dzieckiem</li>
                            </ul>
                            <p className="mt-4">
                                <strong>Zwycięzca konkursu ma obowiązek:</strong>
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Zrealizować określony cel zbiórki (np. opłacić sesję zdjęciową)</li>
                                <li>Skontaktować się z organizatorem w celu koordynacji realizacji</li>
                                <li>Wykorzystać zebrane środki zgodnie z celem zbiórki</li>
                                <li>Ewentualna nadwyżka po realizacji celu pozostaje u zwycięzcy jako wynagrodzenie za organizację</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4">5. Zasady Konkursu na Datę Urodzenia</h2>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>
                                    <strong>Dokładne trafienie:</strong> Jeśli uczestnik typuje dokładną datę urodzenia dziecka, wygrywa konkurs
                                </li>
                                <li>
                                    <strong>Brak dokładnego trafienia:</strong> Jeśli nikt nie trafi dokładnej daty, wygrywa osoba która typowała najbliższą datę
                                </li>
                                <li>
                                    <strong>Remis:</strong> Jeśli kilka osób typowało tę samą datę (zwycięską), środki są dzielone równo między wszystkich zwycięzców, a cel realizują wspólnie
                                </li>
                                <li>
                                    <strong>Ogłoszenie wyniku:</strong> Organizator ogłasza faktyczną datę urodzenia dziecka w systemie, co automatycznie określa zwycięzcę/zwycięzców
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4">6. Prowizja Platformy</h2>
                            <p>
                                Platforma BabyBingo pobiera prowizję w wysokości <strong>1% od każdej wpłaty</strong> na pokrycie kosztów:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Opłat bramki płatniczej Stripe</li>
                                <li>Utrzymania serwera i infrastruktury</li>
                                <li>Wysyłki powiadomień email</li>
                            </ul>
                            <p>
                                Pozostałe 99% wpłaty trafia do zbiórki i jest przekazywane zwycięzcy/zwycięzcom na realizację celu.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4">7. Przekazanie Środków</h2>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Przekazanie następuje automatycznie po ogłoszeniu daty urodzenia przez organizatora</li>
                                <li>Środki są przekazywane na konto bankowe zwycięzcy przez Stripe Connect</li>
                                <li>Czas realizacji: 3-5 dni roboczych</li>
                                <li>Zwycięzca otrzyma powiadomienie email z instrukcjami realizacji celu</li>
                                <li>Zwycięzca zobowiązuje się do realizacji celu w rozsądnym terminie (max 60 dni)</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4">8. Opcja Darowizny</h2>
                            <p>
                                Uczestnik może zaznaczyć opcję <strong>"Przekaż nadwyżkę rodzicom"</strong> podczas wpłaty. W takim przypadku:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Jeśli wygra konkurs, zobowiązuje się przekazać całą nadwyżkę (po realizacji celu) rodzicom dziecka</li>
                                <li>Jest to dobrowolna deklaracja uczestnika</li>
                                <li>Platforma nie ponosi odpowiedzialności za realizację tej deklaracji</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4">9. Polityka Zwrotów</h2>
                            <p>
                                <strong>Wpłaty są nieodwracalne.</strong> Zwroty są możliwe tylko w następujących przypadkach:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Organizator anuluje zbiórkę przed ogłoszeniem daty urodzenia</li>
                                <li>Błąd techniczny platformy uniemożliwiający prawidłowe działanie</li>
                                <li>Naruszenie regulaminu przez organizatora</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4">10. Odpowiedzialność</h2>
                            <p>
                                BabyBingo działa jako platforma techniczna umożliwiająca organizację zbiórek grupowych. Platforma:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Nie ponosi odpowiedzialności za spory między uczestnikami</li>
                                <li>Nie gwarantuje realizacji celu przez zwycięzcę (to zobowiązanie społeczne, nie prawne)</li>
                                <li>Nie ponosi odpowiedzialności za jakość realizacji celu</li>
                                <li>Zastrzega sobie prawo do zamknięcia zbiórki w przypadku podejrzenia oszustwa</li>
                                <li>Nie ponosi odpowiedzialności za błędy organizatora przy ogłaszaniu daty urodzenia</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4">11. Ochrona Danych Osobowych</h2>
                            <p>
                                Przetwarzanie danych osobowych odbywa się zgodnie z RODO. Szczegóły w{' '}
                                <Link href="/privacy" className="text-purple-600 hover:underline">
                                    Polityce Prywatności
                                </Link>
                                .
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4">12. Postanowienia Końcowe</h2>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Regulamin wchodzi w życie z dniem publikacji</li>
                                <li>Platforma zastrzega sobie prawo do zmiany regulaminu z 7-dniowym wyprzedzeniem</li>
                                <li>W sprawach nieuregulowanych regulaminem zastosowanie mają przepisy prawa polskiego</li>
                                <li>Wszelkie spory będą rozstrzygane przez sąd właściwy dla siedziby platformy</li>
                            </ul>
                        </section>

                        <section className="bg-green-50 border border-green-200 rounded-lg p-6 mt-8">
                            <h3 className="font-bold text-lg mb-2">✅ Charakter Prawny</h3>
                            <p className="text-sm">
                                Zbiórki organizowane przez BabyBingo mają charakter <strong>charytatywny/prezentowy</strong> z elementem zabawy (konkurs na datę).
                                Uczestnictwo jest dobrowolne i odbywa się między znajomymi i rodziną.
                                Zebrane środki służą realizacji konkretnego celu określonego przez organizatora.
                                Platforma <strong>nie prowadzi działalności hazardowej</strong> w rozumieniu ustawy o grach hazardowych,
                                ponieważ zwycięzca konkursu otrzymuje środki wyłącznie w celu realizacji określonego celu zbiórki,
                                a nie jako wygraną pieniężną.
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
