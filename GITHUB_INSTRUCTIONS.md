# Instrukcje wrzucenia MaxiBingo na GitHub

## Krok 1: Utwórz nowe repozytorium na GitHub

1. Wejdź na https://github.com/new
2. Nazwa repozytorium: `maxibingo`
3. Opis: "Baby birth date betting pool application"
4. Wybierz: **Public** lub **Private** (według preferencji)
5. **NIE** zaznaczaj "Initialize this repository with a README" (już mamy)
6. Kliknij "Create repository"

## Krok 2: Połącz lokalne repozytorium z GitHub

Po utworzeniu repozytorium, GitHub pokaże Ci instrukcje. Użyj tych komend:

```bash
# Dodaj remote
git remote add origin https://github.com/poncheck/maxibingo.git

# Zmień nazwę brancha na main (jeśli potrzeba)
git branch -M main

# Wypchnij kod na GitHub
git push -u origin main
```

## Krok 3: Gotowe! 🎉

Twoje repozytorium jest teraz na GitHub pod adresem:
`https://github.com/poncheck/maxibingo`

## Opcjonalnie: Dodaj opis i tematy

Na stronie repozytorium możesz:
- Dodać opis: "Baby birth date betting pool application"
- Dodać tematy (topics): `nextjs`, `typescript`, `prisma`, `stripe`, `betting-pool`
- Dodać link do live demo (jeśli wdrożysz na Vercel)

## Wdrożenie na Vercel (opcjonalnie)

1. Wejdź na https://vercel.com
2. Kliknij "Import Project"
3. Wybierz swoje repozytorium GitHub `maxibingo`
4. Dodaj zmienne środowiskowe z `.env`
5. Kliknij "Deploy"

Gotowe! 🚀
