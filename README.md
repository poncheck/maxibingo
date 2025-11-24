# 🎯 MaxiBingo

MaxiBingo to aplikacja do organizowania zakładów na datę urodzenia dziecka. Platforma umożliwia tworzenie prywatnych pul zakładów, w których uczestnicy typują dokładną datę narodzin.

## ✨ Funkcje

- 👶 **Tworzenie pul zakładów** - organizuj własne pule dla przyjaciół i rodziny
- 🎯 **Typowanie daty** - każdy uczestnik wybiera swoją datę
- 💰 **Bezpieczne płatności** - integracja ze Stripe (lub tryb testowy)
- 🏆 **Automatyczne wyłanianie zwycięzców** - system sam określa zwycięzcę po deklaracji urodzenia
- 📧 **Powiadomienia email** - automatyczne maile o zakładach i wynikach
- 🔐 **Autoryzacja** - logowanie przez Google, Facebook lub email (Magic Links)

## 🚀 Technologie

- **Framework**: Next.js 16 (App Router)
- **Język**: TypeScript
- **Baza danych**: SQLite + Prisma ORM
- **Autoryzacja**: NextAuth.js v5
- **Płatności**: Stripe
- **Email**: Resend
- **Styling**: TailwindCSS

## 📦 Instalacja

```bash
# Sklonuj repozytorium
git clone https://github.com/twoj-username/maxibingo.git
cd maxibingo

# Zainstaluj zależności
npm install

# Skonfiguruj bazę danych
npx prisma generate
npx prisma migrate dev

# Uruchom serwer deweloperski
npm run dev
```

## ⚙️ Konfiguracja

Utwórz plik `.env` w głównym katalogu:

```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_SECRET="your-secret-key"

# Google OAuth (opcjonalne)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Facebook OAuth (opcjonalne)
FACEBOOK_CLIENT_ID="your-facebook-client-id"
FACEBOOK_CLIENT_SECRET="your-facebook-client-secret"

# Resend (email)
RESEND_API_KEY="your-resend-api-key"
EMAIL_FROM="onboarding@resend.dev"

# Stripe (opcjonalne - użyj trybu testowego)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Tryb testowy (pomija Stripe)
STRIPE_BYPASS_MODE="true"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## 🧪 Tryb testowy

Aplikacja posiada tryb testowy, który pozwala na pełne testowanie bez konfiguracji Stripe:

1. Ustaw `STRIPE_BYPASS_MODE="true"` w `.env`
2. Zakłady będą automatycznie oznaczane jako opłacone
3. Możesz testować całą funkcjonalność aplikacji

## 📝 Licencja

MIT

## 👨‍💻 Autor

Stworzono z ❤️ dla przyszłych rodziców
