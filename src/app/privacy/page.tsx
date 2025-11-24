import Link from 'next/link'

export default function PrivacyPage() {
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
                    <h1 className="text-4xl font-bold mb-8">Polityka Prywatności</h1>

                    <div className="prose prose-lg max-w-none space-y-6 text-gray-700">
                        <section>
                            <h2 className="text-2xl font-bold mb-4">1. Administrator Danych</h2>
                            <p>
                                Administratorem danych osobowych przetwarzanych w ramach platformy MaxiBingo jest [Nazwa firmy/osoby],
                                z siedzibą w [Adres], email: kontakt@pregenetor.com.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4">2. Jakie Dane Zbieramy</h2>
                            <p>Zbieramy następujące dane osobowe:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li><strong>Dane z konta:</strong> imię, nazwisko, adres email, zdjęcie profilowe (z Google/Facebook)</li>
                                <li><strong>Dane płatności:</strong> informacje o transakcjach (przetwarzane przez Stripe)</li>
                                <li><strong>Dane zakładów:</strong> typowane daty, kwoty wpłat</li>
                                <li><strong>Dane techniczne:</strong> adres IP, typ przeglądarki, czas wizyty</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4">3. Cel Przetwarzania Danych</h2>
                            <p>Przetwarzamy dane w następujących celach:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Świadczenie usług platformy (organizacja pul zakładów)</li>
                                <li>Przetwarzanie płatności i wypłat</li>
                                <li>Wysyłka powiadomień email o statusie puli</li>
                                <li>Zapewnienie bezpieczeństwa i przeciwdziałanie oszustwom</li>
                                <li>Analiza statystyk użytkowania platformy</li>
                                <li>Komunikacja z użytkownikami</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4">4. Podstawa Prawna</h2>
                            <p>Przetwarzanie danych odbywa się na podstawie:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li><strong>Zgoda</strong> - wyrażona poprzez rejestrację i korzystanie z platformy</li>
                                <li><strong>Wykonanie umowy</strong> - świadczenie usług platformy</li>
                                <li><strong>Obowiązek prawny</strong> - przechowywanie dokumentacji księgowej</li>
                                <li><strong>Prawnie uzasadniony interes</strong> - zapewnienie bezpieczeństwa platformy</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4">5. Udostępnianie Danych</h2>
                            <p>Twoje dane mogą być udostępniane:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li><strong>Stripe</strong> - procesor płatności (zgodnie z ich polityką prywatności)</li>
                                <li><strong>Resend</strong> - dostawca usług email</li>
                                <li><strong>Vercel</strong> - hosting aplikacji</li>
                                <li><strong>Innym uczestnikom puli</strong> - imię i typowana data (w ramach gry)</li>
                            </ul>
                            <p className="mt-2">
                                Nie sprzedajemy ani nie udostępniamy danych osobowych podmiotom trzecim w celach marketingowych.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4">6. Przechowywanie Danych</h2>
                            <p>Dane są przechowywane:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li><strong>Dane konta:</strong> do momentu usunięcia konta</li>
                                <li><strong>Dane transakcji:</strong> 5 lat (wymóg księgowy)</li>
                                <li><strong>Dane zakładów:</strong> przez cały czas trwania puli + 1 rok</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4">7. Twoje Prawa</h2>
                            <p>Zgodnie z RODO masz prawo do:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li><strong>Dostępu</strong> - uzyskania informacji o przetwarzanych danych</li>
                                <li><strong>Sprostowania</strong> - poprawy nieprawidłowych danych</li>
                                <li><strong>Usunięcia</strong> - żądania usunięcia danych ("prawo do bycia zapomnianym")</li>
                                <li><strong>Ograniczenia przetwarzania</strong> - w określonych sytuacjach</li>
                                <li><strong>Przenoszenia danych</strong> - otrzymania danych w formacie maszynowym</li>
                                <li><strong>Sprzeciwu</strong> - wobec przetwarzania danych</li>
                                <li><strong>Cofnięcia zgody</strong> - w dowolnym momencie</li>
                            </ul>
                            <p className="mt-4">
                                Aby skorzystać z powyższych praw, skontaktuj się z nami: kontakt@pregenetor.com
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4">8. Pliki Cookies</h2>
                            <p>
                                Używamy plików cookies do:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Utrzymania sesji zalogowanego użytkownika</li>
                                <li>Zapamiętywania preferencji</li>
                                <li>Analizy ruchu na stronie</li>
                            </ul>
                            <p className="mt-2">
                                Możesz zarządzać plikami cookies w ustawieniach przeglądarki.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4">9. Bezpieczeństwo</h2>
                            <p>
                                Stosujemy odpowiednie środki techniczne i organizacyjne w celu ochrony danych:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Szyfrowanie połączeń (HTTPS/SSL)</li>
                                <li>Bezpieczne przechowywanie haseł (hashing)</li>
                                <li>Regularne kopie zapasowe</li>
                                <li>Ograniczony dostęp do danych osobowych</li>
                                <li>Monitorowanie bezpieczeństwa</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4">10. Zmiany w Polityce</h2>
                            <p>
                                Zastrzegamy sobie prawo do aktualizacji niniejszej polityki prywatności.
                                O istotnych zmianach poinformujemy użytkowników poprzez email lub powiadomienie na stronie.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4">11. Kontakt</h2>
                            <p>
                                W razie pytań dotyczących przetwarzania danych osobowych, skontaktuj się z nami:
                            </p>
                            <p className="mt-2">
                                Email: <strong>kontakt@pregenetor.com</strong>
                            </p>
                            <p className="mt-4">
                                Masz również prawo wniesienia skargi do organu nadzorczego - Prezesa Urzędu Ochrony Danych Osobowych.
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
