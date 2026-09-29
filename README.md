# Lični sajt

Statički lični sajt (HTML + CSS + JS, bez build koraka). Kad pushuješ izmene na GitHub,
sajt se sam objavljuje na **GitHub Pages**.

## Struktura

```
index.html                   ← sav sadržaj sajta (traži komentare "ZAMENI")
css/style.css                ← izgled, boje (na vrhu fajla), svetla/tamna tema
js/main.js                   ← meni na telefonu, tema, animacije
images/profil.svg            ← placeholder; zameni svojom slikom
.github/workflows/deploy.yml ← automatsko objavljivanje na GitHub Pages
```

## 1. Popuni svoje podatke

1. Otvori folder u VS Code-u: `File → Open Folder… → licni-sajt`.
2. U `index.html` pretraži (`Ctrl+F`) reč **ZAMENI** i upiši svoje podatke:
   ime, zanimanje, tekst o sebi, poslove, projekte, hobije, zanimljivosti i kontakte.
3. Stavi svoju sliku u `images/` (npr. `profil.jpg`, kvadratna, ~600×600 px) i u
   `index.html` promeni `src="images/profil.svg"` u `src="images/profil.jpg"`.
4. Pregled: dupli klik na `index.html` otvara sajt u browseru
   (ili ekstenzija **Live Server** u VS Code-u za automatsko osvežavanje).

## 2. Jednokratno podešavanje objavljivanja (GitHub Pages)

1. Instaliraj Git: <https://git-scm.com/download/win> (podrazumevana podešavanja su OK),
   pa restartuj VS Code.
2. Napravi nalog na <https://github.com> (ako ga nemaš).
3. Na GitHub-u napravi novi **public** repozitorijum, npr. `licni-sajt` (prazan, bez README-a).
4. U terminalu VS Code-a (`Ctrl+ö` / *Terminal → New Terminal*), u ovom folderu:

   ```bash
   git init -b main
   git add .
   git commit -m "Prva verzija sajta"
   git remote add origin https://github.com/KORISNICKO-IME/licni-sajt.git
   git push -u origin main
   ```

   Pri prvom push-u Git će otvoriti prozor za prijavu na GitHub.
5. Na GitHub-u: repozitorijum → **Settings → Pages → Build and deployment → Source:
   GitHub Actions**.
6. U tabu **Actions** sačekaj da workflow „Objavi sajt" pozeleni (~1 min).
   Sajt je dostupan na: `https://KORISNICKO-IME.github.io/licni-sajt/`

## 3. Svaka sledeća izmena

Izmeni fajlove, pa:

```bash
git add .
git commit -m "Opis izmene"
git push
```

…ili u VS Code-u: panel **Source Control** → upiši poruku → **Commit** → **Sync Changes**.
Sajt se automatski ažurira za oko minut.
