import Link from 'next/link'
import { auth } from '@/auth'

export default async function LandingPage() {
  const session = await auth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
                👶 MaxiBingo
              </Link>
            </div>
            <div className="flex items-center gap-4">
              {session ? (
                <>
                  <Link
                    href="/dashboard"
                    className="text-gray-700 hover:text-gray-900 transition-smooth"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/api/auth/signout"
                    className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-smooth"
                  >
                    Wyloguj
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/signin"
                    className="text-gray-700 hover:text-gray-900 transition-smooth"
                  >
                    Zaloguj
                  </Link>
                  <Link
                    href="/dashboard/create"
                    className="px-6 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold hover:shadow-lg transition-smooth"
                  >
                    Utwórz Pulę
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-32 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-gray-900">
              Zakłady na datę<br />
              <span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
                urodzenia dziecka
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto">
              Stwórz zabawną pulę zakładów dla przyjaciół i rodziny.
              Kto trafi datę porodu, zgarnia całą pulę! 🎉
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/dashboard/create"
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-lg font-semibold hover:shadow-2xl transform hover:-translate-y-1 transition-smooth"
              >
                Utwórz Pulę Zakładów
              </Link>
              <Link
                href="#how-it-works"
                className="px-8 py-4 rounded-xl bg-white border-2 border-purple-200 text-gray-700 text-lg font-semibold hover:border-purple-400 transition-smooth"
              >
                Jak to działa?
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-smooth">
              <div className="text-4xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent mb-2">
                1%
              </div>
              <div className="text-gray-600">Prowizja platformy</div>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-smooth">
              <div className="text-4xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent mb-2">
                100%
              </div>
              <div className="text-gray-600">Bezpieczne płatności</div>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-smooth">
              <div className="text-4xl font-bold gradient-primary bg-clip-text text-transparent mb-2">
                24/7
              </div>
              <div className="text-gray-600">Dostępność</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            Jak to działa?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-20 h-20 rounded-full gradient-primary text-white text-3xl font-bold flex items-center justify-center mx-auto mb-6">
                1
              </div>
              <h3 className="text-2xl font-bold mb-4">Utwórz Pulę</h3>
              <p className="text-gray-600">
                Rodzice tworzą pulę zakładów, ustawiają planowaną datę porodu i kwotę zakładu.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-20 h-20 rounded-full gradient-primary text-white text-3xl font-bold flex items-center justify-center mx-auto mb-6">
                2
              </div>
              <h3 className="text-2xl font-bold mb-4">Zaproś Znajomych</h3>
              <p className="text-gray-600">
                Udostępnij link na Facebooku lub wyślij znajomym. Każdy typuje datę i wpłaca kwotę.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-20 h-20 rounded-full gradient-accent text-white text-3xl font-bold flex items-center justify-center mx-auto mb-6">
                3
              </div>
              <h3 className="text-2xl font-bold mb-4">Zwycięzca Zgarnia Pulę!</h3>
              <p className="text-gray-600">
                Po narodzinach dziecka, osoba która trafiła datę (lub najbliższą) wygrywa całą pulę!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            Dlaczego MaxiBingo?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-smooth">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-bold mb-3">Bezpieczne Płatności</h3>
              <p className="text-gray-600">
                Płatności obsługiwane przez Stripe - światowy lider w bezpiecznych transakcjach online.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-smooth">
              <div className="text-4xl mb-4">📧</div>
              <h3 className="text-xl font-bold mb-3">Powiadomienia Email</h3>
              <p className="text-gray-600">
                Automatyczne powiadomienia o nowych uczestnikach, dziennych aktualizacjach i zwycięzcy.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-smooth">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold mb-3">Statystyki Live</h3>
              <p className="text-gray-600">
                Zobacz rozkład typowanych dat, aktualną pulę i liczbę uczestników w czasie rzeczywistym.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-smooth">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold mb-3">Sprawiedliwe Zasady</h3>
              <p className="text-gray-600">
                Jeśli kilka osób trafi tę samą datę, pula jest dzielona równo między zwycięzców.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-smooth">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-bold mb-3">Niska Prowizja</h3>
              <p className="text-gray-600">
                Tylko 1% prowizji na pokrycie kosztów bramki płatniczej. 99% trafia do puli!
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-smooth">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-bold mb-3">Szybka Wypłata</h3>
              <p className="text-gray-600">
                Automatyczna wypłata dla zwycięzcy w ciągu 3-5 dni roboczych po ogłoszeniu wyniku.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Gotowy na zabawę?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Utwórz pulę zakładów w mniej niż minutę!
          </p>
          <Link
            href="/dashboard/create"
            className="inline-block px-10 py-5 rounded-xl gradient-primary text-white text-xl font-semibold hover:shadow-2xl transform hover:-translate-y-1 transition-smooth"
          >
            Rozpocznij Teraz →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">MaxiBingo</h3>
              <p className="text-gray-400">
                Zabawne zakłady na datę urodzenia dziecka dla przyjaciół i rodziny.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Linki</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/terms" className="text-gray-400 hover:text-white transition-smooth">
                    Regulamin
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-gray-400 hover:text-white transition-smooth">
                    Polityka Prywatności
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Kontakt</h3>
              <p className="text-gray-400">
                kontakt@pregenetor.com
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© {new Date().getFullYear()} MaxiBingo. Wszystkie prawa zastrzeżone.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
