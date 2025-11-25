# Instrukcja Wdrożenia (Production Deployment)

Aby aplikacja działała stabilnie w tle na serwerze, używamy **PM2**.

## 1. Pierwsze uruchomienie

1. **Zainstaluj PM2 (jeśli nie masz):**
   ```bash
   sudo npm install -g pm2
   ```

2. **Pobierz najnowszy kod:**
   ```bash
   cd ~/maxibingo
   git pull
   npm install
   ```

3. **Zaktualizuj bazę danych:**
   ```bash
   npx prisma generate
   npx prisma migrate deploy
   ```

4. **Zbuduj aplikację (Wymagane dla produkcji!):**
   ```bash
   npm run build
   ```

5. **Uruchom w tle:**
   ```bash
   pm2 start npm --name "babybingo" -- start
   ```

6. **Ustaw autostart (żeby wstawało po restarcie serwera):**
   ```bash
   pm2 save
   pm2 startup
   ```
   *(Wykonaj komendę, którą wyświetli `pm2 startup`)*

---

## 2. Aktualizacja aplikacji (po zmianach w kodzie)

Gdy wprowadzisz zmiany i zrobisz `git push`, na serwerze wykonaj:

```bash
# 1. Pobierz zmiany
cd ~/maxibingo
git pull

# 2. Zainstaluj nowe biblioteki (jeśli są)
npm install

# 3. Zaktualizuj bazę (jeśli były zmiany w schema.prisma)
npx prisma generate
npx prisma migrate deploy

# 4. Przebuduj aplikację
npm run build

# 5. Zrestartuj proces
pm2 restart babybingo
```

## 3. Przydatne komendy

- **Sprawdź status:** `pm2 status`
- **Zobacz logi:** `pm2 logs babybingo`
- **Zatrzymaj:** `pm2 stop babybingo`
