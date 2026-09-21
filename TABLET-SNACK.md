# Samsung Galaxy Tab — Expo Snack workflow

## Doporučený postup

1. Rozbal `Zenvault-Bank-Co-Expo-4.6.1.zip` v aplikaci **Moje soubory / My Files**.
2. V Chrome nebo Samsung Internet zapni **Web pro počítač / Desktop site** a otevři `snack.expo.dev`.
3. Vytvoř nový Snack a přenes **celý obsah složky `zenvault/`**, ne pouze `App.js`.
4. Zachovej názvy a cesty `assets/cards/*` a `assets/brands/*`.
5. Dependencies nastav podle `package.json`. Pro automatizovaný Snack payload slouží `snack-dependencies.json`, `snack-assets.json` a `prepare_snack.py`.
6. Pokud používáš Expo Go, spusť projekt přes QR / otevření Snacku v Expo Go. Projekt zůstává na Expo SDK 54, aby se neměnil funkční základ 4.6.0.

## Co musí být ve Snacku

- všechny `.js` soubory v kořeni projektu;
- `app.json`;
- 50 JPG v `assets/cards/`;
- 8 PNG v `assets/brands/`.

Dva pomocné obrázky `assets/mastercard.png` a `assets/visa.png` jsou ponechané v archivu stejně jako v 4.6.0, ale aktuální UI používá vlastní síťové vykreslení a Snack payload je nevyžaduje.

## Ověření před uploadem

Na prostředí s Pythonem lze spustit:

`python3 verify_project.py`

A pro vytvoření payloadu:

`python3 prepare_snack.py snack-payload-4.6.1.json`
