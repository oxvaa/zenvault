# Samsung Galaxy Tab — Zenvault GitHub / Snack workflow

Zenvault 5 používá na tabletu stabilnější cestu **GitHub → GitHub Pages → Expo Snack SDK**. Nepoužívej vestavěný Snack „Import git repository“ pro tento projekt; u binárních assets může selhávat.

## Aktualizace projektu

1. Otevři repozitář `oxvaa/zenvault` v Chrome v desktop režimu.
2. V rootu repozitáře aktualizuj změněné `.js`, `package.json`, `app.json`, dokumentaci a nový `snack-payload-5.1.0.json`.
3. Složky `assets/cards` a `assets/brands` není nutné znovu nahrávat, pokud se obrázky v dané verzi nemění.
4. Nahraď root `index.html` verzí pro 5.1.0.
5. GitHub Pages nech publikovat z větve `main`, složka `/(root)`.
6. Otevři `https://oxvaa.github.io/zenvault/` a klikni na tlačítko pro vytvoření nového Snacku.
7. Nově vzniklý Snack ulož do svého Expo účtu.

## Co obsahuje Snack payload 5.1.0

- všechny root `.js` moduly včetně `Home5.js` a `Zenvault5.js`;
- `app.json`;
- 58 Snack assets se zachovanými cestami `assets/cards/*` a `assets/brands/*`;
- 7 resolved dependencies ze `snack-dependencies.json`;
- Expo SDK 54.

`assets/mastercard.png` a `assets/visa.png` zůstávají v plném ZIPu a GitHub repu, ale současný Snack payload je nevyžaduje.

## Ověření před publikací

`python3 verify_project.py`

`python3 prepare_snack.py snack-payload-5.1.0.json`

Původní storage key `zenvault.bank.co.v2` se nemění, takže upgrade zachovává místní 4.x profily na stejném zařízení.
