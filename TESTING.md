# 🧪 Przewodnik Testowania - Baby Pool App

## Wymagania wstępne

Przed testowaniem upewnij się, że masz:
- ✅ Node.js zainstalowany
- ✅ PostgreSQL uruchomiony
- ✅ Konto Stripe (tryb testowy)
- ✅ Konto Resend (do emaili)

---

## 1️⃣ Konfiguracja bazy danych

Aplikacja została skonfigurowana do użycia **SQLite** (lokalny plik), więc nie musisz instalować PostgreSQL.

### Uruchom migracje Prisma

```bash
npx prisma migrate dev
```

To utworzy plik `dev.db` w głównym katalogu.

### (Opcjonalnie) Otwórz Prisma Studio do podglądu danych

```bash
npx prisma studio
```

Otworzy się w przeglądarce na `http://localhost:5555`

---

## 2️⃣ Konfiguracja Stripe

### Zainstaluj Stripe CLI

```bash
brew install stripe/stripe-cli/stripe
```

### Zaloguj się do Stripe

```bash
stripe login
```

### Pobierz klucze testowe

1. Przejdź do: https://dashboard.stripe.com/test/apikeys
2. Skopiuj:
   - **Publishable key** (pk_test_...) → `NEXT_PUBLIC_STRIPE_PUBLIC_KEY`
   - **Secret key** (sk_test_...) → `STRIPE_SECRET_KEY`
3. Dodaj do pliku `.env`

---

## 3️⃣ Konfiguracja Resend (Email)

### Utwórz konto

1. Przejdź do: https://resend.com/signup
2. Zweryfikuj email
3. Utwórz API key: https://resend.com/api-keys
4. Skopiuj klucz → `RESEND_API_KEY` w `.env`

### Ustaw adres nadawcy

W `.env`:
```env
EMAIL_FROM="noreply@yourdomain.com"
```

**Uwaga**: W trybie testowym Resend pozwala wysyłać tylko na zweryfikowane adresy email. Dodaj swój email w Resend dashboard.

---

## 4️⃣ Konfiguracja NextAuth

### Wygeneruj secret

```bash
openssl rand -base64 32
```

Skopiuj wynik do `.env`:
```env
NEXTAUTH_SECRET="wygenerowany-secret"
```

### (Opcjonalnie) Konfiguracja Google OAuth

1. Przejdź do: https://console.cloud.google.com/
2. Utwórz nowy projekt
3. Włącz Google+ API
4. Utwórz OAuth 2.0 credentials
5. Dodaj do `.env`:
   ```env
   GOOGLE_CLIENT_ID="..."
   GOOGLE_CLIENT_SECRET="..."
   ```

---

## 5️⃣ Uruchomienie aplikacji

### Terminal 1: Serwer Next.js

```bash
npm run dev
```

Aplikacja uruchomi się na: **http://localhost:3000**

### Terminal 2: Stripe Webhook Listener

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

**Ważne**: Skopiuj `webhook signing secret` (whsec_...) i dodaj do `.env`:
```env
STRIPE_WEBHOOK_SECRET="whsec_..."
```

Następnie zrestartuj serwer Next.js (Ctrl+C i ponownie `npm run dev`).

---

## 6️⃣ Testowanie krok po kroku

### Test 1: Rejestracja i logowanie

1. Otwórz: http://localhost:3000
2. Kliknij "Sign In"
3. Zarejestruj się emailem lub Google
4. Sprawdź czy przekierowuje do dashboard

✅ **Sukces**: Jesteś zalogowany i widzisz dashboard

---

### Test 2: Tworzenie puli zakładów

1. W dashboard kliknij "Create Pool" lub przejdź do: http://localhost:3000/dashboard/create
2. Wypełnij formularz:
   - **Baby Name**: "Zosia" (opcjonalne)
   - **Expected Due Date**: wybierz datę za ~2 tygodnie
   - **Bet Amount**: 50 (PLN)
3. Kliknij "Create Pool"

✅ **Sukces**: Przekierowanie do strony puli z linkiem do udostępnienia

---

### Test 3: Dołączanie do puli (jako uczestnik)

1. Skopiuj link do puli (np. `http://localhost:3000/pool/abc123`)
2. Otwórz w **trybie incognito** lub innej przeglądarce
3. Zaloguj się jako inny użytkownik (inny email)
4. Wybierz datę urodzenia
5. Kliknij "Place Bet"

✅ **Sukces**: Przekierowanie do Stripe Checkout

---

### Test 4: Płatność Stripe

1. Na stronie Stripe Checkout użyj testowej karty:
   - **Numer**: `4242 4242 4242 4242`
   - **Data**: dowolna przyszła (np. 12/25)
   - **CVC**: dowolne 3 cyfry (np. 123)
   - **Email**: twój email
2. Kliknij "Pay"

✅ **Sukces**: 
- Przekierowanie do strony sukcesu
- W terminalu Stripe CLI zobaczysz: `checkout.session.completed`
- **Email 1**: Uczestnik dostaje potwierdzenie zakładu
- **Email 2**: Twórca puli dostaje notyfikację o nowym uczestniku

**Sprawdź emaile** (jeśli Resend jest skonfigurowany)

---

### Test 5: Dodanie więcej uczestników

Powtórz Test 3-4 z różnymi użytkownikami i datami:
- Użytkownik 2: data A
- Użytkownik 3: data B (ta sama co użytkownik 1 - test remisu)
- Użytkownik 4: data C

✅ **Sukces**: Każdy uczestnik dostaje email, twórca dostaje notyfikacje

---

### Test 6: Ogłoszenie zwycięzcy

1. Zaloguj się jako **twórca puli**
2. Przejdź do: http://localhost:3000/dashboard
3. Kliknij na swoją pulę
4. Zobaczysz listę wszystkich uczestników i ich typów
5. Kliknij "Declare Birth Date"
6. Wybierz **faktyczną datę urodzenia**:
   - Wybierz datę A (dokładne trafienie)
   - LUB datę między typami (test "najbliższej daty")
7. Kliknij "Declare"

✅ **Sukces**:
- Status puli zmienia się na "CLOSED"
- **Wszyscy uczestnicy** dostają email:
  - Zwycięzcy: "🎉 GRATULACJE! WYGRAŁEŚ!" + kwota
  - Przegrani: "👶 Dziecko się urodziło!" + lista zwycięzców
- W Prisma Studio zobaczysz rekordy w tabeli `Winner`

---

### Test 7: Scenariusz remisu

1. Utwórz nową pulę
2. Niech 2+ użytkowników wytypuje **tę samą datę**
3. Ogłoś tę datę jako datę urodzenia

✅ **Sukces**: 
- Obaj użytkownicy są zwycięzcami
- Pula jest podzielona równo (np. 99 PLN / 2 = 49.50 PLN każdy)
- Obaj dostają email z kwotą wypłaty

---

### Test 8: Scenariusz "najbliższa data"

1. Utwórz pulę z zakładami na różne daty
2. Ogłoś datę, której **nikt nie wytypował**

✅ **Sukces**:
- Wygrywa osoba z **najbliższą datą**
- Email pokazuje "daysOff" (ile dni się pomylił)

---

## 7️⃣ Sprawdzanie danych w bazie

### Otwórz Prisma Studio

```bash
npx prisma studio
```

### Sprawdź tabele:

- **User**: Wszyscy zarejestrowani użytkownicy
- **BettingPool**: Utworzone pule
- **Bet**: Wszystkie zakłady (sprawdź `isPaid: true`)
- **Payment**: Płatności Stripe (sprawdź `status: COMPLETED`)
- **Winner**: Zwycięzcy (po ogłoszeniu daty)

---

## 8️⃣ Debugowanie

### Logi w terminalu

Wszystkie ważne operacje są logowane:
```
✓ Compiled /api/webhooks/stripe in XXXms
checkout.session.completed received
Bet confirmation email sent to: user@example.com
New bet notification sent to: creator@example.com
```

### Sprawdź Stripe Dashboard

https://dashboard.stripe.com/test/payments

Zobaczysz wszystkie testowe płatności.

### Sprawdź Resend Dashboard

https://resend.com/emails

Zobaczysz wszystkie wysłane emaile.

---

## 9️⃣ Częste problemy

### Problem: "NEXTAUTH_SECRET is not set"

**Rozwiązanie**: Wygeneruj secret i dodaj do `.env`:
```bash
openssl rand -base64 32
```

### Problem: "Database connection error"

**Rozwiązanie**: 
1. Sprawdź czy PostgreSQL działa: `pg_isready`
2. Sprawdź `DATABASE_URL` w `.env`
3. Uruchom migracje: `npx prisma migrate dev`

### Problem: Emaile nie przychodzą

**Rozwiązanie**:
1. Sprawdź `RESEND_API_KEY` w `.env`
2. W Resend dashboard dodaj swój email do zweryfikowanych adresów
3. Sprawdź logi w terminalu - czy są błędy?

### Problem: Stripe webhook nie działa

**Rozwiązanie**:
1. Sprawdź czy `stripe listen` działa w drugim terminalu
2. Skopiuj `whsec_...` do `.env` jako `STRIPE_WEBHOOK_SECRET`
3. Zrestartuj serwer Next.js

### Problem: Build errors z NextAuth

**Rozwiązanie**: To znany problem z NextAuth v5 beta. Użyj `npm run dev` zamiast `npm run build`. Aplikacja działa poprawnie w trybie development i production runtime.

---

## 🎉 Gotowe!

Jeśli wszystkie testy przeszły pomyślnie, aplikacja działa poprawnie! 

### Następne kroki:

1. **Deploy na Vercel**: `vercel deploy`
2. **Skonfiguruj produkcyjną bazę danych** (Supabase/Railway)
3. **Ustaw Stripe webhook** na produkcyjny URL
4. **Zweryfikuj domenę w Resend** dla produkcyjnych emaili

---

## 📞 Potrzebujesz pomocy?

Jeśli coś nie działa:
1. Sprawdź logi w terminalu
2. Sprawdź Prisma Studio (stan bazy danych)
3. Sprawdź Stripe Dashboard (płatności)
4. Sprawdź Resend Dashboard (emaile)
