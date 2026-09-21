# Zenvault Bank & Co. 5.0.0 — Your Money OS

Zenvault 5 je major update lokálního Expo / Snack bankovního frontendu. Zachovává datový základ a funkce řady 4.x, ale přestavuje hlavní práci s aplikací kolem **Financial Command Center**, Zenvault Intelligence, univerzálního Command vyhledávání, Card Center 5, Shared Vaults, Subscriptions Hub, Purchase Hub, Security Center 5, Plan Center 5, Zenvault Moments a Admin Studio 5.

Jde o funkční lokální prototyp. Neprovádí skutečné bankovní převody, KYC, vydávání platebních karet, passkeys ani externí zrušení předplatného. Místní data zůstávají v úložišti zařízení.

## Zenvault 5.0 — major update

- **Home 5 / Financial Command Center:** nový výchozí přehled s celkovou hodnotou účtů, Vaults a ručně sledovaných investic, forecastem konce měsíce, odhadem tempa výdajů a kontextovými doporučeními.
- **Zenvault Intelligence:** porovnání výdajů s minulým měsícem, budget risk, známé subscriptions, čekající převody a orientační forecast založený pouze na lokální historii profilu.
- **Zenvault Command:** globální vyhledávání akcí, transakcí, Vaults, karet a předplatných. Z jednoho pole lze otevřít Smart Transfer, Card Center, Security, Purchase Hub a další části.
- **Card Center 5:** live card přehled, Card Controls, Travel Mode, Subscriptions Hub a galerie na jednom místě.
- **Shared Vaults:** Vaulty podporují lokální členy a role **Viewer / Contributor / Manager**. Role jsou pouze součást prototypu a nevytvářejí společný bankovní účet.
- **Subscriptions Hub 5:** přehled měsíčního součtu, další známé platby, použitá karta a lokální historie změn ceny.
- **Purchase Hub:** rozšířený detail transakce s merchant identitou, kategorií, kartou, kanálem, zemí, referencí, dokumenty a návazností na split / request flow.
- **Security Center 5:** soustředí PIN, biometriku, trusted device, bezpečnostní historii a emergency controls. Passkey je zatím pouze připravená UI vrstva pro budoucí nativní integraci.
- **Plan Center 5:** membership, rewards, Card Gallery a Theme Studio v jednom centru bez přidávání dalších tarifů.
- **Admin Studio 5:** balance, transakce, body, membership / trial a bankovní komunikace doplněné snapshotem a client timeline.
- **Zenvault Moments:** nový vizuální feed milníků, security událostí a rewards. Fullscreen receipt a Welcome 5 používají stejný směr vizuální prezentace.
- **Welcome to Zenvault 5:** jednorázový pětidílný cinematic onboarding po prvním otevření verze 5 na zařízení.
- **Smart Transfer 5:** zachovává funkční flow z 4.6 — kontakt / IBAN, okamžitá, plánovaná a opakovaná platba, split, request, QR, cover, emoji a animovaný receipt.
- **Design System 5:** sjednocený glass / surface jazyk, nové feature gradient cards, command modal a responzivnější Money OS grid na tabletu.

## Kompatibilita a data

Zenvault 5 používá stejné hlavní úložiště `zenvault.bank.co.v2`. Migrační vrstva přidává pouze nové výchozí struktury a `featuresVersion: 5`; historie, karty, transakce, Vaults, membership i místní účty z 4.6.1 zůstávají zachované. Nové místní účty používají 180 000 PBKDF2 iterací a přihlášení zůstává kompatibilní se staršími 600 000 iteracemi.

## GitHub → Pages → Snack workflow

Vývojová distribuční cesta pro tablet je nyní **GitHub-first**. Zdrojový projekt je uložen v `oxvaa/zenvault`. Pro každou verzi vytvoř `snack-payload-<verze>.json`, aktualizuj root `index.html` a publikuj přes GitHub Pages. Stránka pak pomocí Snack SDK vytvoří nový multi-file Snack včetně assetů a dependencies bez ručního přesouvání souborů uvnitř Snack editoru.

Pro 5.0.0:

`python3 verify_project.py`

`python3 prepare_snack.py snack-payload-5.0.0.json`

Projekt zůstává na Expo SDK 54. Assets jsou beze změny proti 4.6.1: 50 JPG v `assets/cards`, 8 PNG v `assets/brands`, plus `mastercard.png` a `visa.png` v `assets/`.

## Historie funkcí 4.x

## Prestige & Prestige MAX · 4.5

### Aktualizace 4.6.0 — Smart Transfer

- Nový mobilní průchod: kontakt nebo účet/IBAN → částka, termín, zpráva a vzhled → kontrola → animovaná receipt karta. Podporuje omezený pohyb; potvrzení zůstává otevřené do zavření a lze jej sdílet.
- Místní klienti lze hledat podle jména nebo telefonu. Převod mezi místními účty je atomický, má společnou referenci a připisuje částku příjemci. Účet/IBAN se normalizuje; IBAN kontroluje modulo 97. Externí převody jsou pouze místní evidence, nikoli příkazy bankovní síti.
- Okamžité, plánované a týdenní/měsíční příkazy, úpravy a zrušení. Příkazy se provádějí při spuštění, návratu a pravidelné kontrole běžící aplikace. Při zavřené aplikaci neběží serverový plánovač. Neúspěch nezpůsobí záporný zůstatek; stav a chyba zůstávají viditelné.
- Split payment pro 2–20 osob rozděluje haléře beze ztráty; ruční evidence úhrad nemění zůstatek. U každého podílu lze vytvořit samostatnou žádost.
- Žádosti mají skutečný generovaný QR kód a sdílený JSON obsah Zenvault. QR platba načítá vložený obsah žádosti; nejde o bankovní SPD QR ani skenování kamerou. Při úhradě místní žádosti se kontroluje příjemce, částka, měna a dosavadní úhrada; opakovaná úhrada se odmítne.
- Čtyři cover styly, vlastní emoji, zpráva do 240 znaků a vlastní obrázek přes HTTPS URL. Obrázek se načítá ze zadané adresy; není součástí exportu a může být nedostupný. Platební text zůstává na podkladové barvě čitelný.
- Kontroly: engine atomické převody, idempotence, IBAN, uhrazení/replay žádosti, opakování, konec měsíce, nedostatek prostředků a rozdělení haléřů; mobilní UI 390px a 320px včetně receipt, úprav/rušení příkazů, splitu, QR a chybného požadavku.

### Aktualizace 4.5.1 — announcement carousel

Home oznámení nyní tvoří tři horizontálně listovatelné karty: **Prestige / Prestige MAX**, **Zenvault Mastercard × Netflix nebo HBO Max** a **Meet Zenvault × Apple**. Plynulé stránkování doplňuje jemná změna velikosti a průhlednosti, šipky a tečky. Bez automatického posouvání; při omezeném pohybu se přepíná bez animace. Obsah karty lze na malé obrazovce posunout svisle, zavření a hlavní akce zůstávají dostupné. Po znovuotevření nebo změně rozměrů se zobrazí první karta.

Oznámení se zobrazuje dospělým místním účtům včetně Business a Prestige. Junior zůstává bez nabídky. Akce otevírají nabídku tarifů, existující streaming promo a katalog obchodníků. Apple je nová šablona s logem z Ionicons; stejná identita a logo se propisují do potvrzení i historie místní platby. Nevytváří se nový cashback ani skutečné předplatné. Spolupráce s Apple je označena jako koncept, nikoli tvrzení o potvrzeném oficiálním partnerství. Nové chování carouselu nahrazuje níže popsané starší cílení popupu Unlimited MAX.

Ověřeno v mobilním Chromium: přetažení dotykem, šipky / tečky, všechny tři cílové obrazovky, zavření / znovuotevření, šířka 320 px, zobrazení naležato, Monochrome a Omezení pohybu. Aktivní karta, indikátor a hlavní akce se synchronizují přímo s posunem i ve webovém náhledu. Apple prošel výběrem šablony, potvrzením, zaúčtováním a historií s logem; nevzniká neohlášený cashback. Bez runtime a console chyb. Fyzický iPhone není k dispozici.

Pořadí: Silver → Gold → Platinum → Core → Pro → Ultra → Ultra MAX → Unlimited → Unlimited MAX → Business → **Prestige → Prestige MAX**. Business nadále používá vlastní podmínky; Prestige obsahuje osobní i Business nástroje.

| Výhoda | Prestige | Prestige MAX |
| --- | --- | --- |
| Cena za měsíc | 9 999 Kč | 19 999 Kč |
| Cashback u vybraných místních obchodníků | 6 % | 8 % |
| Body za každých celých 100 Kč karetního nákupu | 8 | 12 |
| Jednorázové uvítací body za první běžné sjednání daného plánu | 10 000 | 25 000 |
| Maximální denní limit jedné karty | 25 mil. Kč | 50 mil. Kč |
| Výchozí limit nové karty | 5 mil. Kč | 10 mil. Kč |
| Motivy v ceně builderu | 2 Prestige + 22 Unlimited / MAX | 3 Prestige MAX + 2 Prestige + 22 Unlimited / MAX |
| Priorita lokálních concierge požadavků | Prestige | Prestige MAX |
| Equity Circle — pouze návrh individuálního programu | až 0,01 % | až 0,05 % |

Oba tarify zahrnují Business workspace, týmové karty a expenses, všech 33 motivů aplikace, Candy Sky a Hologram Limited v ceně, jednorázové karty, privátní péči, family office a lifestyle požadavky. Concierge a další služby ukládají jen místní požadavek, nejsou napojené na skutečné poskytovatele. Cashback platí pro Zenvault Market, Travel a Café. Uvítací body nelze opakovaným přepínáním získávat znovu; trial je nepřipisuje.

**Equity Circle:** V Nastavení → Prestige Lounge lze uložit nezávazný zájem o navrhovaný podílový program. Pro každý plán se uloží nejvýše jeden záznam. Procenta jsou pouze návrh, nikoli garantovaný či připsaný podíl. Žádné akcie, skutečné vlastnictví, hlasovací právo ani výnos se nevytvářejí. Případné budoucí získání podílu vyžaduje samostatnou nabídku a smlouvu. Trial tuto akci neumožňuje.

### Odebrat plán / trial

**Nastavení → Režim aplikace → Administrátor → Odebrat plán / trial.** Vyber dospělého místního klienta, rozsah a důvod. Následuje samostatný náhled a potvrzení:

- **Pouze trial:** okamžitě ukončí trial a vrátí původní plán.
- **Celé členství:** ukončí současný plán i případný trial a přepne na Silver. Po původním konci trialu se již členství neobnoví. U Core jde o výslovný místní administrátorský override; původní závazek se archivuje.
- Změna upraví oprávnění, dostupný motiv aplikace a limity karet. Peníze, body, transakce, doklady, karty i zaplacené designy zůstávají zachované. Další úpravy prémiové karty vyžadují odpovídající členství.
- Ukládá se audit s klientem, administrátorem, důvodem, předchozím / novým plánem a časem; klient dostane oznámení. Neaktuální potvrzení, opakovaný pokyn a akce mimo režim Administrátor jsou ošetřené. Neprobíhá skutečné externí zrušení smlouvy ani refundace.

### Pět původních motivů a generátor

Prestige: **Crimson Thorns / Obsidian Bloom**. Prestige MAX: navíc **Violet Venom / Chrome Soul / Deep Night**. Všech pět dodaných originálů je převzato beze změny. Karta umožňuje celoplošné zobrazení, celý motiv bez ořezu nebo rámeček. Staré motivy i ručně zadaná čísla se zachovávají. Liquid Gold, Golden Current a Holo Medusa zůstávají volitelně za **899 Kč za jednu kartu**, i u Prestige tarifů.

V části **Card Builder → Vlastní číslo → Vygenerovat náhodné číslo** se vytvoří 16místné místní zobrazované číslo s prefixem `0000`. Po uložení zůstává na kartě i po restartu. Nejde o skutečné karetní přihlašovací údaje, PAN vydaný karetní sítí ani platební generátor.

## Oprava registrace 4.4.1

Na iOS mohl návrat z `setTimeout(0)` trvat déle než 12ms pracovní interval. Původní smyčka tento čas započítala do další iterace a znovu čekala; 600 000 iterací se tak mohlo rozpadnout na stovky tisíc návratů přes časovač. Oprava měří nový pracovní interval až po návratu z čekání. Síla hashování i kompatibilita dřívějších hesel zůstávají stejné.

Registrace i přihlášení ukazují průběh a dovolují zrušit pokus. Formulář při zrušení nebo chybě zůstává vyplněný. Generování soli má limit 10 sekund, celá operace 2 minuty. Zrušený ani vypršený pokus později nezaloží účet.

**Místní účet ze souboru:** Na Welcome stránce zvol **Importovat místní účet**, vlož celý obsah souboru formátu `zenvault-local-account`, zkontroluj náhled a potvrď uložení. Import zakládá Silver s nulovými zůstatky a jednou virtuální Mastercard; nepřijímá zůstatky, historii, hesla ani oprávnění ze souboru. Duplicitní e-mail/telefon se odmítne i u starších profilů bez hesla. Neuvedené osobní údaje zůstanou prázdné. Heslo lze doplnit přes **Nastavení → Nastavit přihlášení heslem**. Stav totožnosti se čte z profilu; hodnota „ověřena“ v místním importu nepředstavuje skutečnou KYC kontrolu.

Soukromé soubory profilů nejsou součástí veřejného Snacku ani zdrojového ZIPu.

**Ověření opravy:** Simulace 16ms zpoždění časovače porovnala původní a opravenou smyčku při 2 000 iteracích: 1 988 versus 5 čekání, shodný výsledek hashování. Plných 600 000 iterací prošlo porovnáním s Node PBKDF2, včetně Unicode a existujících hesel. Mobilní Chromium s čtyřnásobně zpomaleným procesorem dokončilo osm kroků registrace, zrušení, opakování, uložení i přihlášení heslem. Import byl ověřen včetně náhledu, uchování stávajících profilů, zobrazení totožnosti, restartu, dropdownu a odmítnutí duplikátu. Fyzický iPhone v tomto prostředí není dostupný.

## Publikování dalších aktualizací

Uživatel dne 16. 9. 2026 výslovně schválil zveřejnění verze 4.4.0 na Expo Snacku a přidal trvalý pokyn: „Souhlasim a automaticky vždy publikuj“. Dokončené a ověřené aktualizace Zenvaultu proto publikuj automaticky do Expo Snacku včetně projektového kódu a assetů, bez opakovaného vyžadování souhlasu pro každou verzi. Po publikaci ověř skutečný vzdálený obsah a aktualizuj odkaz v tomto souboru i ZIPu. Pokyn se týká publikování projektu; místní klientská data se neexportují.

## Oznámení a bankovní komunikace

**Nastavení → Režim aplikace → Administrátor → Bankovní komunikace.** Zvol konkrétního klienta, oddělení banky, prioritu, předmět a text. Přidej libovolnou kombinaci jedné trial nabídky a až tří textových dokumentů. Před odesláním je náhled příjemce, zprávy i příloh. Zpráva se doručí do vybraného místního účtu jménem **Zenvault Bank & Co.** Odeslaný obsah nelze měnit. Odeslané zprávy ukazují přečtení, aktivaci trialu i potvrzení dokumentů.

Po přepnutí účtu klient otevře zvoneček na Home nebo **Nastavení → Schránka banky**. Filtry: Vše, Nepřečtené, Nabídky, Dokumenty, Archiv. Zprávy mají samostatný detail. Otevření označí zprávu jako přečtenou, k dispozici je přečtení všech a vratná archivace. Indikátor na Home počítá jen nepřečtené nearchivované zprávy. Vypnutá preference oznámení skryje indikátor, samotná schránka zůstává dostupná.

Přílohy jsou dokumenty tvořené **názvem a plným editovatelným textem**, podobně jako ve Shifteru. Platnost: bez expirace / 7 / 30 / 90 dní. Volitelné potvrzení přečtení ukládá jméno, čas a neměnnou kopii do **Nastavení → Dokumenty**. Po expiraci se dokument dá číst, ale nelze nově potvrdit. Kopie a dokumenty zůstávají dostupné i po archivaci zprávy. Potvrzení je lokální záznam převzetí, nikoli kvalifikovaný elektronický podpis. Import PDF a přílohy jiných binárních formátů nejsou součástí této verze.

Zprávy ani nabídky se neposílají e-mailem nebo push kanálem a nepřenášejí se mezi zařízeními. Administrátorský režim je nástroj místního prototypu, ne serverové řízení oprávnění banky. Model ověřuje aktivní režim při odeslání; čtení přílohy a využití nabídky jsou omezené na účet příjemce. Přihlášení a přepnutí účtu vrací režim Klient.

## Free trials

Administrátor vybírá vyšší osobní placený plán a trial **7 / 14 / 30 dní**. Nabídka může mít platnost **7 / 14 / 30 dní** od doručení. Klient před aktivací vidí cenu **0 Kč**, délku, návrat na původní plán a podmínky; potvrzuje je sám.

- Trial je možné využít jednou, bez kombinování s jiným trialem. Nejde o automaticky obnovované předplatné.
- Po skončení nebo ručním ukončení se vrátí původní tarif. Jeho maximum znovu omezí karty a případný nedostupný theme se změní na Sky Atelier.
- Platby, dokumenty, nakoupené designy a jejich účtenky se zachovají. Další úpravy MAX karty znovu vyžadují aktivní MAX.
- Trial nepřipisuje jednorázové uvítací body a nevytváří závazek Core. Běžné získávání bodů a cashbacku za karetní nákupy odpovídá aktivnímu plánu.
- V průběhu trialu lze výslovně zvolit běžné členství. Trial skončí; první skutečné zvolení MAX může připsat jednorázový uvítací bonus, další opakování už ne.
- Core se sjednanou minimální dobou, Junior a Business nelze obejít nabídkou. U trialu Core platí také uzávěrka nového sjednání. Nabídky na stejný nebo nižší plán nejsou aktivovatelné.
- Expirace se vyhodnocuje při načtení, přihlášení, návratu do popředí, před každou modelovou akcí a periodicky v otevřené aplikaci. Offline aplikace nic neúčtuje; po dalším otevření zpracuje uplynulý konec trialu.

## Ultra MAX

Pořadí původních plánů: Silver → Gold → Platinum → Core → Pro → Ultra → **Ultra MAX** → Unlimited ∞ → Unlimited MAX → Business (samostatně, na vyžádání). Nad nimi jsou nově Prestige a Prestige MAX.

| Výhoda | Ultra | Ultra MAX | Unlimited ∞ | Unlimited MAX |
| --- | --- | --- | --- | --- |
| Cena měsíčně | 999 Kč | **1 499 Kč** | 1 999 Kč | 3 999 Kč |
| Cashback u vybraných partnerů | 2 % | **2,5 %** | 3 % | 5 % |
| Body za každých celých 100 Kč karetního nákupu | 1 | **2** | 3 | 5 |
| Maximální denní limit každé karty | 1 mil. Kč | **3 mil. Kč** | 5 mil. Kč | 10 mil. Kč |
| Výchozí limit nové karty | 50 tis. Kč¹ | **500 tis. Kč** | 1 mil. Kč | 2 mil. Kč |
| Private Banking priorita | Ultra | **Ultra MAX** | Unlimited | MAX |
| Vlastní kolekce karet | 3 motivy | **3 nové motivy** | 12 motivů v builderu | 22 v ceně + 3 placené |

¹ Původní rychlé přidání přes Card Gallery u starších tarifů používá limit 10 tis. Kč. Ultra MAX, Unlimited a MAX mají sjednocenou výchozí hodnotu ve všech cestách.

Ultra MAX zahrnuje jednorázové virtuální karty, concierge požadavky, finanční nástroje Ultra, 31 motivů aplikace v ceně a možnost získat Candy Sky za body. Nová kolekce **Champagne Orbit / Cobalt Ribbon / Noir Prism** používá tři odlišné nativní geometrické kompozice. Každá je dostupná jako virtuální nebo fyzická karta. Cashback je pro místní partnery Zenvault Market, Travel a Café; cenové a benefitové návrhy nejsou skutečnou smlouvou s bankou.

## MAX Art Editions

V **MAX Atelier → Art Editions · 899 Kč** jsou dodané obrázky přes celou kartu:

| Design | Příloha | Cena za design na jedné kartě |
| --- | --- | --- |
| Liquid Gold | IMG_2553.jpeg | **899 Kč** |
| Golden Current | IMG_2554.jpeg | **899 Kč** |
| Holo Medusa | IMG_2555.jpeg | **899 Kč** |

Původní 22 motivů zůstává v ceně MAX. Tři placené doplňky jsou dostupné s aktivním Unlimited MAX, Prestige či Prestige MAX, včetně aktivního trialu. Cena se jednorázově odečítá z místního zůstatku CZK až po samostatném potvrzení. Nákup se zapíše do historie, výdajů a účtenek konkrétní karty. Nevytváří body ani cashback.

Každá další karta vyžaduje nový nákup. U již koupeného motivu na stejné kartě jsou změny čísla, okraje a kompozice bez další platby; bezplatný je i návrat k němu po použití jiného motivu. Jiný placený motiv na stejné kartě vyžaduje nové potvrzení 899 Kč. Kontrola zůstatku, oprávnění, souhlasu s cenou a ochrana před opakovaným odečtem probíhají v modelu. Jde o lokální design karty, nikoli objednávku fyzického doručení.

Originály jsou převzaty bez změny bajtů, včetně tří řádných Snack ASSET položek. Žádná nová nativní závislost nepřibyla.

## Nové Home announcement

Popup představuje **Unlimited MAX**. Dospělý klient bez MAX otevře přehled plánu; člen MAX přímo novou kolekci Art Editions. Junior, Business ani Prestige / Prestige MAX tuto nabídku nedostávají. Opakované zobrazení při vstupu na Home zůstává zachované, přes jiné dialogy nebo zámek nevyskakuje.

Nekonečno jemně plave a mění náklon, štítek MAX se pomalu posouvá. Animují se pouze transformace, s nativním driverem. Zavření, pozadí aplikace a Omezení pohybu animaci zastaví; v Monochrome zůstává bílý povrch, černé tlačítko a bílý text. Postup odpovídá [React Native Animated](https://reactnative.dev/docs/animated) a [AppState](https://reactnative.dev/docs/appstate).

## Ověření 4.5

Modelové kontroly: pořadí a ceny tarifů, skutečný lokální cashback / body / limity, jednorázové bonusy, přístup ke kolekcím a Business nástrojům, 899 Kč za placený design, oddělený nezávazný equity zájem bez akciového držení, kontrola administrátora / klienta / aktuálního potvrzení, odebrání celého členství i samotného trialu, archivace závazku Core, zachování peněz / historie / zaplacených designů a žádné pozdější obnovení odebraného trialu. Bezplatné členské výhody nelze proměnit v trvalé bezplatné odemčení přes odměny.

Skutečné mobilní UI: oba Prestige upgrady, všech pět dekódovaných originálů a zděděné kolekce, generátor a uložení / úprava / restart karty, Prestige Lounge, nezávazný zájem, Business workspace, administrátorský náhled / zrušení / potvrzení a trial-only návrat na Ultra. Rozložení zkontrolováno při 390 a 320 px, bez runtime / console chyb. Prošla také regrese schránky, dokumentů, trialů, nákupů Art Editions a Ultra MAX.

Osm kroků registrace Prestige MAX, zrušení pokusu, opakování a přihlášení uloženým heslem prošlo na mobilním Chromium s 4× zpomaleným CPU (registrace přibližně 38 s). Síla hashování zůstává 600 000 iterací PBKDF2-SHA256 a ověřená proti referenční implementaci. Fyzický iPhone / nativní Face ID nebyly v tomto prostředí testovány.

## Ověření 4.4

Modelové testy ověřují adresáta, administrátorskou kontrolu, neměnné přílohy, potvrzení a expiraci dokumentů, jednorázové využití trialu, návrat tarifu a oprávnění, převod na běžné členství, Core / Junior / Business omezení, ceny a výhody Ultra MAX i atomické nákupy všech tří Art Editions. Prošly finanční regrese, odložené platby a regresní kontroly Unlimited MAX.

Průchod skutečným rozhraním na mobilním Chromium ověřil odeslání → přepnutí klienta → detail → dokument → trial, archiv a Dokumenty, nákup / zrušení nákupu, bezplatnou úpravu koupené karty, uložení a restart, ukončení trialu, Ultra MAX a historii odesilatele. Všechny tři nové obrázky se dekódují. Ověřeno při 390 a 320 px bez runtime a console chyb. Samostatně prošla skutečná změna transformace při animaci, okamžité zastavení po zapnutí Omezení pohybu, Monochrome a expirace trialu v otevřené aplikaci při posunu hodin přes jeho konec. Fyzický iPhone není k dispozici k přímému testu.

---

# Historie vydání

Následující poznámky popisují starší verze. Novější pravidla 4.5 a 4.4 uvedená výše mají přednost.

## Zenvault 4.3.0 — Unlimited MAX

Nový nejvyšší **osobní** plán je mezi Unlimited ∞ a Business. Business zůstává na vyžádání s individuálními podmínkami. MAX má cenu **3 999 Kč / měsíc**; nevyžaduje závazek Core a automatické účtování předplatného zůstává nepřipojené.

| Výhoda | Unlimited ∞ | Unlimited MAX |
| --- | --- | --- |
| Cashback u vybraných obchodníků | 3 % | 5 % |
| Body za každých celých 100 Kč karetního nákupu | 3 | 5 |
| Jednorázový uvítací bonus | — | 5 000 bodů |
| Maximální denní limit každé karty | 5 000 000 Kč | 10 000 000 Kč |
| Výchozí limit nové karty | 1 000 000 Kč | 2 000 000 Kč |
| Card Builder | 12 motivů | 10 nových + 12 Unlimited |
| Hologram Limited | 500 bodů | V ceně plánu |
| Candy Sky | 300 bodů | V ceně plánu |
| Unlimited Monochrome | V ceně | V ceně |
| Private Banking | Priorita Unlimited | Nejvyšší priorita MAX, lifestyle concierge |

MAX obsahuje všech 33 motivů aplikace, jednorázové virtuální karty a stávající finanční nástroje. Cashback platí u obchodníků Zenvault Market, Zenvault Travel a Zenvault Café. Karetní nákupy získávají body v korunovém ekvivalentu podle referenčních kurzů; výběry ATM, převody a admin úpravy body ani cashback negenerují. Ocenění a odměny fungují nad místními daty. Concierge ukládá požadavky s prioritou MAX; odesílání skutečnému týmu není připojené.

**MAX Atelier:** Zenvault Life → Unlimited MAX, Karty → Přidat kartu nebo Card Gallery → Unlimited MAX. Obsahuje Rose Thorns, Thorn Arc, Ghost Wings, Kitty Riot, Pink Chrome, Cobalt Chrome, Ember Blade, Hazard Club, Stellar Flame a Pink Americana. Všech deset motivů používá přesné dodané obrázky. Přepínač kolekcí odděluje deset novinek a dvanáct zděděných motivů; najednou se vykresluje jen vybraná kolekce.

Builder nabízí Mastercard / Visa, virtuální / fyzickou kartu, 16místné zobrazené číslo a okraj Hologram / Static v šesti barvách. Kompozice **Přes celou kartu** vyplní povrch a může oříznout ilustraci, **Celý motiv** zachová celý obrázek a **V rámečku** jej oddělí od údajů. Hologram je stabilní barevný přechod bez blikání. Přidání zobrazeného čísla nemění skutečný PAN ani údaje v karetní síti. Všechny náhledy používají statické nativní assety a explicitní rozměry; nepřibyla žádná závislost.

**Změny členství:** Bonus 5 000 bodů se připíše při první aktivaci nebo registraci MAX. Opakované potvrzení, přihlášení, restart či návrat do MAX bonus neopakují. Aktivace nezvyšuje limity dříve vydaných karet. Snížení tarifu přizpůsobí jejich limity novému maximu a ponechá design, číslo, ID, ovládací prvky a historii. Kartu MAX lze dále upravovat pouze s MAX; klient MAX může upravovat i své původní Unlimited karty s jejich původní kolekcí. Bezplatné Hologram Limited a Candy Sky jsou výhodami aktivního MAX; samostatně zakoupené odměny zůstávají odemčené. Rolling Loud nadále stojí 1 000 bodů. Závazek Core, izolace profilů, Junior a oddělená aktivace Business zůstávají zachované.

Home announcement považuje MAX za člena rodiny Unlimited: do konce nabídky zobrazuje Core, po uzávěrce Core žádné oznámení. Ostatní cílení z verze 4.2.1 zůstává beze změny.

Publikovaný projekt obsahuje 30 kódových souborů (29 JS + app.json), 50 Snack assetů a sedm závislostí s úplnými metadaty. Kód, assety a metadata závislostí zveřejněného Snacku přesně odpovídají připravenému projektu. Všech deset nově nahraných obrázků má ověřenou shodu bajtů a rozměrů s přílohami.

**Ověření:** Modelové testy pokrývají přesné odměny, kumulativní limity, bonus, přetečení bodů, 22 motivů, tři kompozice, vlastnictví a opakované akce, přechody mezi plány, 33 témat, Hologram, concierge, jednorázové karty i registraci. Prošly stávající testy Unlimited, Core, obchodních šablon, domácích přehledů, osobních údajů a finančních operací. Mobilní Chromium ověřilo aktivaci, načtení všech deseti různých obrázků, vytvoření fyzické Visa karty, její úpravu a uložení, limity, bezplatné odměny, Monochrome, concierge, restart a návrat do MAX bez bonusu. Samostatný průchod absolvoval osm kroků registrace a přihlášení heslem. Rozhraní ověřeno v šířkách 390 a 320 px, bez runtime/console chyb. Fyzický iPhone nebyl k dispozici k přímému testu.

## Zenvault 4.2.1 — oznámení podle členství

Verze 4.2.1 obsahovala 30 kódových souborů (29 JS + app.json), 40 Snack assetů a sedm závislostí s úplnými metadaty. Její zveřejněný obsah byl při vydání ověřen proti zdrojům verze 4.2.1.

Vyskakovací oznámení na Home respektuje právě aktivní profil:

| Aktivní tarif | Nabídka v oznámení |
|---|---|
| Unlimited ∞ | Zenvault Core |
| Core | Zenvault Unlimited ∞ |
| Silver, Gold, Platinum, Pro, Ultra, Business | Unlimited ∞ a Core v jednom okně, každé s vlastním tlačítkem |
| Junior | Bez nabídky placeného členství; tarif spravuje rodič |

**Objevit Core** otevře výběr půlroční / roční varianty a potvrzení ceny. **Objevit Unlimited ∞** otevře přehled Unlimited a jeho výhod. Samotné otevření nabídky nemění tarif ani body. Přechod z Core nadále respektuje jeho minimální dobu členství.

Oznámení lze zavřít křížkem nebo tlačítkem **Pokračovat na přehled**. Znovu se ukáže při vstupu na Home, opětovném klepnutí na kartu Přehled, přepnutí profilu nebo návratu aplikace do popředí na Home. Nevyskakuje přes přihlášení, zabezpečení, jiné stránky, formuláře ani potvrzení platby. Monochrome zůstává bílý s černými tlačítky a bílým textem. Jemný přechod respektuje systémové Omezení pohybu.

Uzávěrka Core je beze změny: **1. 1. 2027 včetně, čas v ČR**. Po konci nabídky se Core neinzeruje; Unlimited klientovi se toto oznámení přestane zobrazovat a ostatním dospělým klientům zůstane nabídka Unlimited. Pokud klient nechá okno otevřené přes uzávěrku, nabídka Core automaticky zmizí. Existující Core se neruší.

Ověření: mobilní Chromium 390 a 320 px, všech osm dospělých tarifů a Junior, obě cílové obrazovky, žádná automatická změna tarifu/bodů, opakovaný vstup na Home, zavření, přepnutí účtů, restart, Monochrome a přesná časová uzávěrka i v otevřeném okně. Bez runtime/console chyb. Kód nepřidává závislosti ani obrazové assety. Fyzický iPhone nebyl dostupný.

## Zenvault 4.2.0 — obchodníci a nový Core

**Přehled → Zenvault Life → Platba kartou → Šablony obchodníků**: HBO Max, Netflix, Disney Plus, Alza, Kaufland a Allegro. Každá šablona předvyplní název, kategorii a způsob platby (Kaufland bezkontaktně, ostatní online). Částku zadáváš sám a způsob platby můžeš upravit. Šablony se dají přepnout i uvnitř formuláře; rozepsaná částka zůstane zachovaná.

Původní loga jsou uložená lokálně a zobrazená v šablonách, potvrzení, posledních karetních platbách, hlavní historii, detailu i widgetu historie v režimu Details. S transakcí se ukládá stabilní merchantId a kopie identity obchodníka. Starší výdaje s rozpoznaným názvem dostanou logo také. Změna názvu na jiného obchodníka odstraní původní identitu. Blokace funguje i pro aliasy, například Disney+ / Disney Plus nebo Alza.cz / Alza. Kontroly karet, zůstatků, limitů a opakovaného potvrzení zůstávají aktivní. Těchto šest značek automaticky nezakládá nárok na cashback; vybranými partnery místního programu zůstávají Zenvault Market, Travel a Café.

### Zenvault Core

Řadí se mezi Platinum a Pro. Má štítky **NOVÉ!** a **Doporučeno**. Zvýhodněná cena je výměnou za delší minimální dobu členství:

| Varianta | Cena | Minimální doba | Celkem za minimální dobu |
|---|---|---|---|
| Půl roku | 249 Kč měsíčně | 6 měsíců | 1 494 Kč |
| Annual | 2 490 Kč ročně předem | 12 měsíců | 2 490 Kč |

Annual odpovídá 207,50 Kč měsíčně; úspora činí 498 Kč oproti 12 platbám po 249 Kč. Sjednání vyžaduje výslovné potvrzení ceny a délky. Změna vybrané varianty souhlas zruší a vyžádá nové potvrzení.

Výhody: 1,25% cashback u vybraných místních obchodníků, jednorázových 300 uvítacích bodů, vlastní kolekce Core Elements (Halo, Current, Pulse), 31 zahrnutých motivů aplikace, čtyři měnové účty, Vaults / automatické spoření, Insights, správa předplatných a Card Controls s maximálním denním limitem 1 000 000 Kč. Nová karta má výchozí limit 50 000 Kč. Candy Sky lze získat za 300 bodů. Jednorázové karty zůstávají pro Pro a výše; Private Banking pro Ultra a Unlimited.

**Nové sjednání do 1. 1. 2027 včetně, čas Europe/Prague.** Uzávěrka nastane 2. 1. 2027 v 00:00 českého času. Dostupnost hlídá katalog, potvrzení změny tarifu i dokončení registrace. Zánik nabídky neruší již sjednaný Core. V nastavení a přehledu členství zůstává cena, datum sjednání a konec minimální doby. Do jejího uplynutí nelze změnit tarif; potom je změna dostupná a nový závazek se automaticky neobnovuje. Opětovné zvolení stejného Core neposouvá datum ani nepřipisuje bonus znovu; bonus se neopakuje ani po odchodu a návratu.

Jde o místní frontend: ceny a doba se evidují v profilu, poplatky se automaticky neúčtují a nevzniká smlouva se skutečnou bankou. Registrace ponechává stav neověřené totožnosti. Zdrojové odkazy všech log jsou v ARTWORK.md.

### Ověření 4.2

Zveřejněný Snack 4.2.0 obsahuje přesně 29 kódových souborů (28 JS + app.json), 40 skutečných assetů a úplná metadata sedmi závislostí. Stažený obsah všech kódových souborů a metadata závislostí se přesně shodují s otestovaným projektem. Všech pět nových publikovaných log má shodné bajty i SHA-256 s lokálními soubory. Publikace byla dokončena po výslovném potvrzení uživatele.

Modelové kontroly: pořadí Core, ceny obou variant, přesná hranice nabídky v českém čase, šest/dvanáct kalendářních měsíců včetně konců měsíců, souhlas, zákaz změny tarifu během minimální doby, přetrvání Core po konci nabídky, jednorázový bonus i po odchodu a návratu, cashback 1,25 %, tři designy, registrace a odmítnutí dokončení po uzávěrce. Šest šablon: kategorie, platební kanál, uložení identity, blokace aliasů, opakované potvrzení bez dvojího odečtu, historie starých transakcí a odmítnutí chybného merchantId. Prošly i finanční regrese, plánované/admin platby, 33 motivů, tři režimy Home, profilové validace, Unlimited a přihlašování.

Mobilní Chromium: šest skutečných průchodů lokální karetní platbou s logy, dekódování všech obrázků, úprava názvu na vlastního obchodníka, detail a úplná historie, zachování dat po reloadu; výběr Core, obě cenové varianty a reset souhlasu při změně, blokace předčasné změny, tři vlastní motivy, přidání a výběr Core karty; kompletní osm kroků registrace s Annual, přihlášení heslem a neopakování bonusu. Ověřené uzavření nové nabídky po 1. 1. 2027 při zachování existujícího Core. Náhled při šířkách 390 a 320 px. Bez runtime/console chyb. Všech 28 JS souborů prošlo kontrolou syntaxe.

Fyzický iPhone není v tomto prostředí dostupný. SDK 54 a sedm stávajících závislostí zůstávají beze změny; mobilní webový test nenahrazuje test na skutečném zařízení.

## Zenvault 4.1.0 — motivy, profil a přehled podle tebe

Původních 16 motivů zůstává. Nově přibyly Azure Club, Dune Atelier, Rosewater, Pistachio Social, Cobalt Current, Terra Form, Arctic Air, Mocha Maison, Lavender Haze, Lagoon House, Solar Fizz, Ink District, Opal Orbit, Retro Wave, Ruby Afterhours a Carbon Studio.

**Unlimited Monochrome** je další, 33. motiv. Je dostupný pouze osobnímu účtu s plánem Unlimited ∞. Bílé pozadí, černé akcenty a tlačítka s bílým textem platí i pro přehled, navigaci, nastavení a Unlimited announcement. Tento motiv je vždy světlý; obecná volba tmavého/systémového vzhledu se znovu uplatní po přepnutí na jiný motiv. Při snížení tarifu se exkluzivní motiv nahradí Sky Atelier. Junior jej nemůže obejít nastavením stejného názvu tarifu. Oficiální loga a ilustrace karet si ponechávají vlastní barvy, chybové a kontrolní poznámky svůj významový červený/modrý tón.

Theme Studio obsahuje hledání, kolekce a filtr Nové, miniatury a světlé/tmavé náhledy. 31 motivů je v ceně všech plánů, Candy Sky zůstává odměnou za 300 bodů, Unlimited Monochrome je v ceně Unlimited. Barvy textu a povrchů byly prověřeny u všech 33 motivů. Bílý text na primárních tlačítkách má kontrast nejméně 5,59 : 1; akcentový text na sekundárních tlačítkách nejméně 4,5 : 1.

### Tři režimy domovského přehledu

V **Nastavení → Režim zobrazení přehledu**:

| Režim | Obsah |
|---|---|
| Full — výchozí | Kompletní přehled se stávajícím pořadím a viditelností widgetů; Business zachovává svůj firemní dashboard. |
| Důležité | Zůstatek, výdaje, karty. |
| Details | Zůstatek, výdaje, historie transakcí, karty. |

Režim se ukládá pro každý účet samostatně. Přepínání nevymaže vlastní uspořádání widgetů ve Full. Historie v Details obsahuje posledních pět pohybů včetně čekajících plateb, funkční detail a odkaz na úplnou historii. Skrytí částek funguje i zde. Starší profily automaticky dostanou Full.

### Rozšířené nastavení

- Osobní údaje: jméno, příjmení, datum narození a občanství; validace skutečných kalendářních dat.
- Kontaktní údaje: e-mail a telefon s předvolbou; změna kontaktů chráněného účtu vyžaduje aktuální heslo, odmítá duplicitní přihlašovací údaje a upraví následné přihlášení. Změněné kontakty zůstávají neověřené.
- Adresa: ulice, město, PSČ a země pobytu.
- Daňový a ekonomický profil: rezidence, identifikátor / pozdější doplnění, vazba na USA, PEP, zaměstnání a zdroj příjmů. Jde o místní evidenci pro pozdější ověření.
- Změna hesla: ověření stávajícího hesla, nové heslo/fráze 15–128 znaků, opakování pro kontrolu; nový náhodný salt a PBKDF2-SHA256 se 600 000 iteracemi. Původní rychlý lokální profil lze zabezpečit přihlašovacími údaji. Žádné heslo se neukládá čitelně. Chybné pokusy mají stejný cooldown jako přihlášení.
- Security Center: PIN, biometrie, automatický zámek, rozpoznávací věta, aktuální zařízení, historie a zmrazení karet; nově přímý vstup do změny hesla.
- Soukromí: skrytí částek, oznámení v aplikaci a uložený souhlas s nabídkami. Tyto volby samy neodesílají SMS, e-maily ani push oznámení.

Citlivá asynchronní úprava se neprovede po zavření dialogu nebo změně účtu. Aktualizace profilu nezasahuje do zůstatků, karet ani oprávnění a nepředstírá dokončené ověření totožnosti.

### Vzhled, výkon a loga

Přehled používá výrazný zůstatek, kulaté rychlé akce, kompaktní měnové účty a klidnější členění. Nastavení má vlastní profilový blok a srozumitelné skupiny. Velikost zůstatku se přizpůsobuje délce částky a šířce obrazovky, aby se neztrácela měna. Výpočty statistik a historie se ukládají mezi relevantními změnami; týdenní graf prochází data jednou. Miniatury motivů používají memoizaci. Sklo a animace zůstávají na původních stabilních Expo komponentách bez nové nativní závislosti.

Promo obsahuje původní oficiální Netflix RGB logo a aktuální oficiální HBO Max logo z webu Warner Bros. Discovery. Soubory jsou přibalené v `assets/brands/` a publikované jako skutečné Snack ASSET položky. Zdrojové odkazy a původ jsou v ARTWORK.md. Podmínka Mastercard / vyloučení Visa i způsob uložení výběru zůstávají zachované; samotný výběr nepředstavuje aktivaci předplatného.

### Ověření 4.1

Publikovaný Snack obsahuje 26 kódových souborů, 35 assetů a sedm závislostí s úplnými handly. Obsah všech souborů a metadat se přesně shoduje s ověřeným projektem; bajty obou nových log odpovídají publikovaným assetům.

Modelové testy: 33 jedinečných motivů a kontrast, dostupnost Unlimited, návrat po snížení tarifu, tři režimy a přesné pořadí bloků, zachování vlastních widgetů, izolace profilů, validační pravidla osobních údajů a kontaktů, zachování přihlašovacích hashů, finanční regrese a plánované platby.

Mobilní Chromium: editace profilu/adresy/kontaktů, zabezpečení starého profilu heslem, odmítnutí chybného hesla, změna kontaktu a hesla, přihlášení novým heslem, zamítnutí původního, přepnutí účtů a restart; všech 16 nových motivů, hledání a filtr, Unlimited gate a bílé zobrazení při zvoleném tmavém vzhledu; všechny tři režimy, detail historie, skrytí částek, obě oficiální loga a Mastercard promo. Ověřen byl i původní registrační průchod, 12 Unlimited karet, 19 modulů, administrace a termíny připsání. Bez runtime/console chyb. Zůstatek se vejde včetně měny při 320, 390 a 430 px. Importy a syntaxe prošly nativně neutrálním sestavením.

Fyzický iPhone není v tomto prostředí dostupný. Expo SDK 54 a úplná již vyřešená metadata sedmi závislostí jsou zachována; test nenahrazuje spuštění v Expo Go na telefonu.

## Zenvault 4.0.0 — nový začátek

Nová welcome stránka, nový dashboard, skleněná navigace, jemné přechody, přepracované společné komponenty a katalog Zenvault Life. Logo zenvault® zůstává. Vzhled používá stabilní průsvitné vrstvy a LinearGradient; nepoužívá experimentální nativní Liquid Glass API ani rozmazávání celé obrazovky. Krátké animace opacity/transform respektují systémové Omezení pohybu. Vypnutí Liquid Glass odstraní průsvitné panely a dekorativní odlesky. Všech 16 motivů aplikace funguje ve světlém i tmavém režimu.

### Přihlášení a registrace

Po otevření aplikace se zobrazí Welcome. Dropdown Místní účty nabídne profily z tohoto zařízení. Dřívější profil bez hesla lze otevřít přímo; jeho případný PIN/biometrický zámek zůstává aktivní. Účty z nové registrace vyžadují heslo i při výběru z dropdownu nebo přepnutí z jiného profilu. Přihlášení přijímá normalizovaný e-mail i telefon s mezinárodní předvolbou (+420 nebo 00420). Nastavení obsahuje Odhlásit se. Přihlášená relace se mezi spuštěními neukládá a přihlášení vrací režim aplikace na Uživatel / Klient.

Registrace má osm kroků:

1. E-mail, telefon, heslo a potvrzení hesla.
2. Jméno, příjmení, datum narození a státní občanství. Osobní registrace od 18 let, Junior vytváří rodič.
3. Adresa trvalého pobytu a země.
4. Pracovní situace, příjem, původ prostředků a účel účtu.
5. Daňová rezidence, TIN nebo odložení jeho doplnění, vazba na USA a prohlášení PEP.
6. Preferovaný způsob ověření Bank iD / doklad a selfie.
7. Osobní plán Silver až Unlimited; Business zůstává na vyžádání.
8. Editovatelný souhrn, povinná potvrzení a oddělená volitelná preference novinek.

Vytvořený profil má nulové zůstatky a body. Nevzniká skutečný bankovní účet a žádný tarif se neúčtuje. Totožnost, e-mail i telefon zůstávají neověřené. Doklady, selfie, SMS, Bank iD a kontrola KYC nejsou připojené; rozhraní je neoznačuje za úspěšně provedené. Registrační údaje jsou místní data, pro zkoušení používej testovací údaje. Nejde o potvrzení splnění právních požadavků na bankovní onboarding.

Hesla se neukládají v otevřeném tvaru. Místní ověření používá PBKDF2-HMAC-SHA256, 600 000 iterací, náhodnou 16bajtovou sůl z expo-crypto a 32bajtový výsledek. Heslo má 15–128 znaků; po pěti chybných pokusech následuje minutová prodleva. Výpočet průběžně uvolňuje JS vlákno. Samostatný PasswordKdf.js obsahuje potřebnou část @noble/hashes 2.0.1 včetně MIT licence, takže Snack nestahuje další balíček. Časovač po návratu do aplikace znovu zahájí měření pracovního úseku; čekání na vykreslení se nezapočítává. Další lokální změny přidávají průběh, zrušení a úklid při přerušení. Samotné PBKDF2, HMAC a SHA-256 zůstávají stejné. Implementace byla porovnána s Node PBKDF2 včetně Unicode. Zdroje: [noble-hashes](https://github.com/paulmillr/noble-hashes), [OWASP Password Storage](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html).

Místní profil není serverová identita: AsyncStorage nešifruje celý profil a lokální Admin režim není bezpečnostní role serveru. Obnova hesla e-mailem/SMS ani synchronizace dat nejsou k dispozici. Původní data z úložiště `zenvault.bank.co.v2` se zachovávají, včetně karet, zůstatků, transakcí, bodů, členství, motivů, Junior účtů a plánovaných plateb.

### Unlimited: 12 motivů a celoplošná kompozice

Nově Redline, Ethereal, Pink Inferno a Chrome Stars z posledních čtyř dodaných fotografií. Obrázky jsou přeneseny beze změny bajtů. Při tvorbě nebo úpravě karty lze u všech dvanácti motivů přepínat Přes celou kartu / V rámečku. Celoplošné provedení používá cover a ochranné kontrastní vrstvy pro značku a údaje. Starší karty bez nové volby zachovávají původní kompozici. Volba se ukládá do `card.builder.layout` jako `full` nebo `framed`. Nový účet s Unlimited získá Chrome Stars přes celou kartu.

Oznámení Unlimited se zobrazuje při vstupu na Home až po přihlášení a případném odemčení PINem. Ostatní výhody, limity, Hologram Limited zdarma s Business, Rolling Loud za 1 000 bodů a původní Mastercard promo se zachovávají.

### Ověření 4.0

Prošel také průchod všemi 19 původními moduly, finanční operace v UI, tvorba odložených plateb s důvody a jednorázové připsání. Nový Snack má ověřenou přesnou shodu 22 kódových souborů, 33 assetů a úplných metadat sedmi závislostí. Publikované obrázky mají shodné bajty i rozměry.

Mobilní Chromium ověřilo kompletní registraci, chybná i správná hesla, e-mail/telefon, odhlášení, přepínání chráněných profilů, dropdown, restart, zachování starého účtu, všechny nové obrázky a dvanáct celoplošných motivů, oba druhy kompozice, číslo, okraje, 16 témat a tmavý vzhled. Modelové testy ověřily KDF, věkové hranice, duplicitní kontakty, neověřený stav, cooldown, migraci a finanční regresi. Nativně neutrální sestavení ověřilo celý strom importů. Fyzický iPhone není v tomto prostředí dostupný; test v Expo Go na zařízení zůstává potřebný. Závislosti SDK 54 včetně úplných Snack handle metadat zůstávají stejné.

## Začátek

Výchozí profil Klient Zenvault má Ultra a nulové zůstatky. Jméno změníte v Nastavení. Nastavení → Režim aplikace → Administrátor dovolí nastavit zůstatek nebo vytvořit příchozí/odchozí transakci. Úprava zůstatku má vlastní kategorii Administrace a nezvyšuje příjmy či výdaje v Insights. Ručně vytvořené běžné transakce se do přehledů počítají, ale nevytvářejí cashback ani body.

Všechny nové moduly jsou na Přehledu pod Zenvault Life. Home Widgets mění pořadí a viditelnost sedmi widgetů pro každý profil. Business získá jiný přehled; aktivaci v tomto lokálním prostředí najdete v Administrátoru → Zenvault Life → Business. Změny členství nic neúčtují.

## Funkce 3.0

| Oblast | Dostupné chování |
| --- | --- |
| Insights | Kategorie výdajů, aktuální/minulý měsíc, procentní rozdíly a příjmy. Vnitřní přesuny se nezapočítávají do spotřeby. |
| Vaults / Spaces | Vlastní název, ikona, barva, cíl a průběh; vklad, výběr, automatické spoření. |
| Disposable card | Pro/Ultra: po lokální online platbě se změní čtyřčíslí a identifikátor karty. |
| Card Controls | Freeze, online, ATM, zahraničí, bezkontaktní platby, denní limit a povolené země. Kontroly skutečně blokují lokální karetní operace. |
| Rewards | Gold 0,5 %, Platinum 1 %, Pro 1,5 %, Ultra 2 % z platby u obchodníků v katalogu. Cashback se připíše do CZK. |
| Points | 1 bod za každých celých 100 Kč ekvivalentu karetního nákupu. Motiv, limited design, jednorázový cashback boost nebo subscription poukaz. |
| Subscription Manager | Cena, měna, další platba, volitelné opakované stržení, úprava/odstranění služby a blokace obchodníka. |
| Smart Transfer | Příjemce, účet/IBAN, poznámka, uložené kontakty, datum, opakování a split bill. |
| Payment Requests | Žádost s částkou, měnou, poznámkou, volitelným účtem, skutečně generovaný QR a sdílení textu. QR obsahuje text žádosti, není bankovní platební QR. |
| Multi-currency Wallet | CZK, EUR, USD, GBP; oddělené zůstatky a potvrzovaná směna pevným referenčním kurzem. |
| Travel Mode | Destinace, měna, cestovní peněženka, přístup ke kontrolám karet a nouzovému zmrazení. |
| Security Center | Nativní PIN, systémové ověření zařízení, automatický zámek, lokální historie otevření/odemknutí a rozpoznávací věta. |
| Zenvault Score | Interní orientační skóre z rezervy, rozpočtu a spoření, s rozepsanými faktory. Při nedostatku historie se skóre nevymýšlí. |
| Private Banking | Ultra prostor, přehled výhod a ukládání požadavků pro managera, podporu a concierge. |
| Business | Cashflow, zaměstnanecké karty a limity, evidence expenses a schválení/zamítnutí. Schválení samo neodešle peníze. |
| Junior | Vlastní podúčet, přesun kapesného od rodiče, pravidelný plán a společný denní limit karetních výdajů. |
| Card Gallery | 36 kombinací tieru, fyzické/virtuální karty a designu; Hologram Limited a festivalová edice Rolling Loud odemknutelné body. |
| Payment moment | Animované potvrzení operace a velkého příjmu, s respektováním omezeného pohybu. Nejde o systémovou iOS Live Activity. |
| Zenvault Assistant | Lokální odpovědi z historie na výdaje za jídlo/dopravu, minulý měsíc, body a orientační rezervu na odložení. |
| Home Widgets | Balance, Spending, Vaults, Investments, Rewards, Cards, Subscriptions; pořadí a viditelnost. Investments eviduje ručně zadávané náklady a hodnoty portfolia bez nákupu a bez živých cen. |

Příkazy se zpracují při otevření nebo návratu aplikace do popředí. Neprovádějí se na pozadí při zavřené aplikaci. Nedostatek peněz či blokace karty uloží důvod selhání; stejný neúspěch se automaticky neopakuje tentýž den. Jeden průchod zpracuje nejvýše 36 splatností každého plánu. Při několikaměsíční absenci se mohou zaúčtovat i starší splatnosti.

Split bill rozděluje i zbytek haléřů přesně; označení zaplaceno je ruční evidence a nezvyšuje zůstatek. U finančních operací je kontrola prostředků, částek a duplicitního potvrzení. CZK zůstatky a transakce jsou v haléřích, ostatní měny v obdobných nejmenších jednotkách.

Referenční kurzy: 1 EUR = 25 CZK, 1 USD = 23 CZK, 1 GBP = 29 CZK. Nejde o aktuální tržní nabídku.

## Členství a motivy

Navržené produktové ceny, nikoli účtované předplatné nebo nabídka skutečné banky:

| Tier | Cena / měsíc | Výhody a motivy |
| --- | --- | --- |
| Silver | 0 Kč | Základní nástroje, vlastní kolekce; Cloud Pop, Ice Arcade, Moon Milk. |
| Gold | 149 Kč | 0,5 % u katalogových partnerů; Honey Club, Peach Studio, Golden Hour. |
| Platinum | 299 Kč | 1 % u katalogových partnerů; Pearl Planet, Lilac Cloud, Mint Museum. |
| Pro | 499 Kč | 1,5 %, disposable karta; Sky Racer, Ocean Toy, Electric Grape. |
| Ultra | 999 Kč | 2 %, disposable karta, Private Banking prostor; Space Candy, Noir Balloon, Aurora Club. |
| Business | Na vyžádání | Individuální podmínky, firemní dashboard a týmové karty; Blueprint, Matcha Office, Coral Boardroom. |

Každý tier má tři fyzické a tři virtuální designy. Vlastní starší karty zůstávají zachované po změně členství; přidání nového designu vyžaduje jeho tier. Všechny motivy mají světlou i tmavou podobu. Motiv Candy Sky lze navíc odemknout body.

Katalog Zenvault Market, Zenvault Travel a Zenvault Café tvoří místní ukázkoví obchodníci, nikoli potvrzení skuteční partneři. Odměny jsou součástí lokální logiky. Subscription poukaz nevydává reálný aktivační kód.

## Zachované promo a Apple Pay

Plovoucí bublina úplně nahoře otevírá Netflix nebo HBO Max Promo. Výběr služby a způsobilé Zenvault Mastercard se ukládá do profilu. První měsíc zdarma je v návrhu nabídky výhradně pro Mastercard; Visa neplatí. Zmrazená karta nebo vypnuté online platby výběr blokují. Zvolení služby samo neaktivuje předplatné; partnerské kódy a reálné vyúčtování nejsou připojené.

Mastercard a Visa loga jsou vložená jako lokální obrázky, bez síťového načítání. Tlačítko Přidat do Apple Pay otevírá na iOS nativní Alert a na webu náhled. Věta „Karta úspěšně přidána do Apple Pay!“ je výslovně označená jako náhled; karta se nepřidává do systémové Peněženky.

## Data a bezpečnostní hranice

Frontend pracuje s lokálními daty v AsyncStorage. Zachovává klíč z verze 2, doplňuje nové atributy bez resetu existujících profilů a serializuje zápisy. Jiný Snack či jiná instalace nemusí sdílet původní úložiště.

PIN se ukládá pouze nativně jako osolený hash v SecureStore, nikoli otevřeně do AsyncStorage. Po pěti neúspěších se na minutu zablokuje ověřování PINu. Zámek chrání lokální rozhraní; AsyncStorage není šifrovaný bankovní trezor a režim Administrátor ani přepnutí lokálního profilu nejsou serverová oprávnění. Biometrie používá systémovou výzvu, případně povolený kód zařízení. Face ID v Expo Go není podporované; vlastní build potřebuje konfiguraci v app.json.

Aplikace neprovádí reálné bankovní platby, nevydává karty, nesjednává pojištění, nekupuje investice, nesynchronizuje vzdálené relace a neposílá požadavky pracovníkům. Externí integrace se v UI neoznačují jako hotové.

## Ověření vydání

Sestavení s reálnými webovými variantami Expo/React Native; Chromium s mobilním viewportem 390 × 844. Ověřené scénáře: načtení všech 19 modulů, platba s cashbackem/body, Vault, převod/split, QR žádost, předplatné/blokace, Junior kapesné, investiční evidence, pořadí a persistence widgetů, asistent, Business zaměstnanecká karta a schválení expenses, tmavý režim. Bez JavaScript runtime chyb.

Testy čistého datového modelu ověřují migraci, přesnost částek, limity a země karet, blokace, cashback/body, duplicity, změnu disposable karty, zachování peněz při přesunech, měsíční splatnosti včetně konců měsíců, chyby plánů, tier gating, investiční evidenci a cashflow. Nativní iOS spuštění, PIN, Face ID a systémový Alert nebyly fyzicky otestovány.

## Reference

- [Expo LocalAuthentication](https://docs.expo.dev/versions/v54.0.0/sdk/local-authentication/)
- [Expo SecureStore](https://docs.expo.dev/versions/v54.0.0/sdk/securestore/)
- [Apple PassKit](https://developer.apple.com/documentation/passkit/pkaddpaymentpassviewcontroller)
- [Mastercard grafika](https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg)
- [Visa grafika](https://github.com/aaronfagan/svg-credit-card-payment-icons/blob/master/flat/visa.svg)

Značky identifikují síť; nevyjadřují partnerské schválení projektu.

## Oprava 3.0.1 — načtení v iOS Snacku

Odstraněna vzdálená závislost qrcode-generator, jejíž načtení na iOS způsobovalo pád ihned při startu. Generátor QR je nyní vložen přímo v qr.js pod MIT licencí, s lokálním ESM importem. QR žádosti i čeština zůstávají funkční. Úložiště a datový model se nemění.

Ověřeno sestavení bez závislosti na npm balíčku qrcode-generator, shoda QR matic pro český text a mobilní webový průchod vytvořením QR žádosti. Na fyzickém iPhonu tato oprava nebyla otestována.

## Oprava 3.0.2 — metadata balíčků Snacku

Předchozí publikování ukládalo u závislostí jen verzi. U knihoven, které nejsou přednačtené v prostředí Snacku, chyběl `handle` od resolveru. Runtime pak sestavoval nesprávnou adresu balíčku a hlásil „Unable to fetch module“. Nová verze ukládá úplné výsledky resolveru včetně `handle` a `peerDependencies` pro všech sedm závislostí. PIN, SecureStore a biometrie zůstávají zachované.

Před zveřejněním ověřeno stažení všech sedmi iOS bundle.js ze stejné CDN a pomocí stejného formátu adres, které používá Snack runtime. Kontrola místního webu sama o sobě tuto chybu v publikačních metadatech nezachytila. Fyzický iPhone stále není součástí testovacího prostředí.

`snack-dependencies.json` uchovává ověřená metadata. `python3 prepare_snack.py` vytvoří payload pro publikaci a odmítne závislosti bez handle nebo nesoulad verzí. Při změně knihoven je nejprve znovu vyřešte prostřednictvím resolveru Snacku; nevytvářejte metadata pouhým zapsáním verze.

Technický podklad: https://github.com/expo/snack/blob/main/runtime/src/Modules.tsx a https://github.com/expo/snack/blob/main/packages/snack-sdk/src/DependencyResolver.ts

## Aktualizace 3.1.0 — Ink Collection

Karty mají čtyři nové originální ilustrace inspirované barevným tattoo/cartoon stylem dodané reference: Cyan Reaper, Acid Wings, Pink Phantom a Ember Moth. Lebky, motýlí křídla, černé kontury a drobné hvězdy. Každý tier nadále nabízí tři motivy pro virtuální i fyzickou kartu, celkem 36 kombinací. Fyzické karty mají kovový lem a zlatavý čip, virtuální stříbřitý čip; Hologram Limited má pastelový okraj. Označení sítě, čtyřčíslí, držitel i zmrazení zůstávají čitelné.

| Tier | Design 1 | Design 2 | Design 3 |
| --- | --- | --- | --- |
| Silver | Cyan Reaper | Acid Wings | Ember Moth |
| Gold | Ember Moth | Acid Wings | Pink Phantom |
| Platinum | Cyan Reaper | Pink Phantom | Acid Wings |
| Pro | Acid Wings | Cyan Reaper | Ember Moth |
| Ultra | Pink Phantom | Cyan Reaper | Ember Moth |
| Business | Cyan Reaper | Ember Moth | Acid Wings |

Změna v Karty → Design se ukládá stejně jako dříve. Karty, zůstatky a jejich identifikátory se nemění. Stejný nový renderer používá Home, Karty, výběr designu, Card Controls a Card Gallery.

Od opravy 3.1.1 odkazuje CardArtAssets.js na skutečné JPG soubory v assets/cards pomocí statických require. Snack je má jako čtyři ASSET položky, místní Expo projekt je balí standardně s aplikací. Při prvním spuštění Snacku je potřeba internet pro stažení obrázků. Žádná nová knihovna není potřeba. Ilustrace vznikly vestavěným imagegen; přesné prompty a původ podkladů jsou v ARTWORK.md. Nejde o partnerskou kolekci Clipper.

Ověřeno všech 36 kombinací v mobilním webovém náhledu, načtení všech čtyř obrázků, uložení a obnovení vybraného designu, světlý i tmavý režim a žádné runtime chyby. Zachována kompletní metadata sedmi závislostí z opravy 3.0.2. Fyzický iPhone nebyl otestován.

## Oprava 3.1.1 — chybějící ilustrace na iPhonu

Velké vložené data URI byly nahrazeny standardními souborovými assety. Každý obrázek má explicitní číselnou šířku podle onLayout a výšku podle velikosti karty; samotný absoluteFill se už pro obrázek nepoužívá. Při chybě načtení se objeví tlačítko pro opakování. Nový Snack obsahuje přímo všechny čtyři assety, nejen jejich názvy v kódu.

Publikační skript navíc kontroluje SHA-256 každého lokálního obrázku proti snack-assets.json. Při změně ilustrace nejprve nahrajte nový soubor pomocí Snack uploadAsset a aktualizujte jeho vrácenou URL a SHA-256; jinak skript publikaci odmítne. Zachována kontrola všech sedmi dependency handles z opravy 3.0.2.

Ověřeno: všechny čtyři publikované obrázky mají shodné bajty s lokálními JPG a nativní metadata 1000 × 667; veřejný Snack obsahuje přesně připravený kód, čtyři ASSET položky a sedm úplných závislostí. Mobilní webový test prošel 36 kombinacemi, uložením designu a světlým/tmavým režimem. Samostatná kontrola výběru designu ověřila skutečně načtené obrázky a jejich rámy 344 × 222 a 332 × 176 px. Fyzické iOS zařízení nebylo dostupné; nativní zobrazení zde nebylo přímo otestováno.

## Aktualizace 3.2.0 — Vlastní kolekce pro každý tier

| Tier | Design 1 | Design 2 | Design 3 |
| --- | --- | --- | --- |
| Silver | Cyan Reaper | Acid Wings | Pink Phantom |
| Gold | Ember Moth | Solar Scarab | Royal Roar |
| Platinum | Frost Fang | Moon Raven | Mercury Coil |
| Pro | Koi Current | Neon Tiger | Spirit Fox |
| Ultra | Void Dragon | Nova Phoenix | Abyss Kraken |
| Business | Emerald Falcon | Onyx Panther | Sovereign Stag |

Celkem 18 různých motivů, žádný se neopakuje mezi tiery. Pro každý existuje virtuální a fyzické provedení, tedy 36 kombinací. Nový Hologram Limited — Prismatic Apex — je devatenáctá samostatná ilustrace: duhová chromová dračí lebka a krystalická křídla. Hologram má vlastní označení a okraj bez animací. Starší karty a jejich identifikátory zůstávají zachované, jejich design 0/1/2 se zobrazí jako odpovídající motiv nové kolekce. Existující Limited karty automaticky zobrazí nový vlastní motiv.

**S plánem Business je Hologram Limited zdarma.** V Card Gallery je tlačítko Přidat Hologram Limited zdarma; nevyžaduje body a neodečte zůstatek. Benefit je uvedený také mezi výhodami plánu, v Business dashboardu, poptávce a Rewards. Ostatní plány mohou odemknout design za 500 bodů. Business má nadále cenu na vyžádání a individuální podmínky. Hologram je v galerii nabízen jako virtuální karta.

Ověřeno načtení 36 náhledů, 18 unikátních zdrojů a samostatný zdroj Hologramu, výběr/uložení designu a světlý/tmavý vzhled. UI test přidal Business Limited a po restartu ověřil zachování karty, bodů i zůstatku. Modelové testy ověřily získání při nule bodů u Business, 500bodové odemknutí u ostatních pěti tierů a odmítnutí podvrženého tarifu. Fyzické iOS zařízení není dostupné k testování.

## Aktualizace 3.3.0 — Rolling Loud, Theme Studio a admin body

**Zenvault × Rolling Loud — Afterhours Edition:** dvacátá samostatná ilustrace, neonová fialová a acid lime, palmy, stage, reproduktory a logo. Card Gallery → Odemknout za 1 000 bodů → potvrdit → Přidat Rolling Loud kartu. Odemknutí je jednorázové, další přidání už body neodečítá. Body se odečtou při potvrzení odemknutí, které se zapíše do historie. Stejná cena platí pro všechny plány včetně Business; Business benefit zdarma dál platí pouze pro Hologram Limited. Rolling Loud má vlastní záznam edition a vlastní detail designu. Logo pochází z oficiálního webu; původ a prompt jsou v ARTWORK.md.

**Theme Studio:** 16 motivů ve čtyřech kolekcích, s náhledy miniatur aplikace, filtrem a světlým/tmavým náhledem. Barvy, tlačítka, panely, navigace a dekorace pozadí se mění společně. Patnáct motivů je v ceně každého plánu; Candy Sky zůstává odměnou za 300 bodů. Výběr se ukládá pro každý profil, přetrvá restart i změnu plánu. Starší uložené motivy se převádějí na podobné nové motivy při načtení. Z odemčeného Candy Sky lze přepnout na jiný motiv. Dekorace používají běžné View/LinearGradient, bez nové nativní knihovny nebo nepřetržité animace.

| Kolekce | Motivy |
| --- | --- |
| Studio | Sky Atelier, Cloud Nine, Midnight Chrome, Blueprint Studio |
| Candy | Candy Sky, Peach Sorbet, Lilac Dream, Cherry Pop |
| Nature | Matcha Club, Golden Hour, Mint Museum, Ocean Drive |
| Night | Electric Grape, Aurora Borealis, Obsidian Noir, Festival Glow |

**Úprava zůstatku bodů:** Nastavení → Režim aplikace → Administrátor → Úprava zůstatku bodů. Vyber klienta, zadej nezáporný celý nový počet bodů a volitelný důvod, zkontroluj původní/nový stav a potvrď. Historie bodů ukládá rozdíl, původní i nový stav, datum, administrující profil a důvod. Změna nijak nehýbe peněžním zůstatkem nebo finančními transakcemi. Roli a validitu hodnot kontroluje také model operací.

Testy: všechny nové operace prošly kontrolami role, izolace klientů, bodových limitů, přesné ceny, opakovaného potvrzení a Business oprávnění. Mobilní webový test provedl změny motivů, kontrolu úpravy bodů, odemknutí a vydání Rolling Loud karty i obnovení po restartu. Nové assety mají ověřené shodné bajty a nativní rozměry. Kontrast bílého textu na tlačítkách všech 16 motivů je alespoň 5,11 : 1. Fyzický iPhone nebyl dostupný pro test.

Závěrečná kontrola 3.3.0: veřejný Snack obsahuje přesně připravených 10 kódových souborů, 21 assetů (20 ilustrací + logo) a úplná metadata sedmi závislostí. Samostatný UI test potvrdil odemknutí Candy Sky za 300 bodů, přepnutí na jiný motiv a opětovné nastavení Candy Sky s uložením po restartu.


## Aktualizace 3.4.0 — Termín připsání a poznámky k platbě

Administrátor → Vytvořit transakci nabízí připsání okamžitě nebo za 2, 3 či 6 kalendářních dní. U odložené platby zvolíte nepodporovanou banku nebo technický problém (červená poznámka), případně kontrolu platby (modrá poznámka). Podtržené odkazy otevírají vysvětlení přímo v aplikaci, aniž by se ztratily rozepsané údaje. Od verze 3.4.1 tento odkaz obsahuje seznam podpory v Zenvaultu s ověřenými identifikačními údaji bank.

Odložené příchozí i odchozí platby mají stav Čeká na připsání a očekávané datum v historii i detailu. Přehled ukazuje počet čekajících plateb. Do splatnosti nemění zůstatek ani Insights; prostředky pro odchozí platbu se předem nerezervují. Při nedostatku peněz v termínu zůstane platba ve stavu Čeká na prostředky a zkusí se zpracovat při další kontrole. Po zaúčtování zmizí poznámka o odložení. Export a sdílení obsahují stav i termín.

Kontrola splatnosti probíhá při otevření aplikace, návratu do popředí a každých 30 sekund za běhu. Zavřená aplikace platby na pozadí nezpracovává; splatné položky zpracuje po návratu. Jde o lokální frontendové zaúčtování. Každá položka se připíše pouze jednou.

Ověření 3.4.0: modelové testy všech čtyř termínů a tří důvodů, přesné hranice splatnosti, izolace profilů, validace role a vstupů, nedostatek prostředků, migrace a ochrana proti duplicitám. Mobilní webový průchod ověřil vytvoření, obě barvy poznámek, podtržené funkční odkazy, zachování formuláře, detail, uložení po restartu a jednorázové připsání. Předchozí finanční regresní testy a sestavení prošly. Fyzický iPhone nebyl dostupný pro ověření.

Veřejný Snack 3.4.0 ověřen: přesná shoda 12 kódových souborů, 21 assetů a úplných metadat sedmi závislostí.


## Aktualizace 3.4.1 — Podporované banky

Odkaz Více o podporovaných bankách v červené poznámce k platbě otevírá přehled Air Bank a Raiffeisenbank. Seznam je dostupný při vytváření transakce i v jejím detailu. Obsahuje oficiální název, kód banky, SWIFT/BIC, IČO, sídlo a funkční odkaz na oficiální zdroj. Identifikační údaje ověřeny 16. 9. 2026:

| Banka | Kód | SWIFT / BIC | IČO | Sídlo |
| --- | --- | --- | --- | --- |
| Air Bank a.s. | 3030 | AIRACZPP | 29045371 | Evropská 2690/17, 160 00 Praha 6 |
| Raiffeisenbank a.s. | 5500 | RZBCCZPP | 49240901 | Hvězdova 1716/2b, 140 78 Praha 4 |

Zdroje: [Air Bank – údaje pro platbu](https://www.airbank.cz/co-vas-nejvic-zajima/jake-udaje-mam-predat-tomu-kdo-mi-posila-zahranicni-platbu/), [Raiffeisenbank – kontakty a základní údaje](https://www.rb.cz/o-nas/kontakty).

Pod seznamem je poznámka: „Okamžité platby do ostatních českých a slovenských bank zatím v Zenvaultu nepodporujeme. Pracujeme na rozšíření podpory, abychom je v budoucnu zpřístupnili i pro další banky.“ Text popisuje požadovanou podporu produktu Zenvault, nikoli schopnosti ostatních bank nebo připojení ke skutečné platební infrastruktuře. Reálné bankovní převody nejsou připojené; administrátor dál volí termín ručně.

Informační okno se posouvá, má pevné tlačítko Rozumím a respektuje horní i dolní bezpečnou oblast displeje. Seznam funguje bez připojení; pouze otevření oficiálních webů vyžaduje internet. Nepřibyla žádná externí knihovna.

Ověření 3.4.1: sestavení, stávající průchod vytvářením a připsáním odložených plateb, zachování formuláře a vizuální kontrola seznamu na šířkách 390 a 320 px. Odkazy vyvolaly externí okna; načtení bankovských webů v lokálním Chromiu blokovalo testovací prostředí, jejich obsah byl ověřen samostatným webovým vyhledáním. Fyzický iPhone nebyl dostupný. Veřejný Snack přesně odpovídá 13 kódovým souborům, 21 assetům a úplným metadatům sedmi závislostí.


## Aktualizace 3.5.0 — Zenvault Unlimited ∞

Nový osobní plán následuje po Ultra a před Business. Navržená cena je 1 999 Kč měsíčně; výběr plánu v tomto frontendu nic neúčtuje. Business zůstává na vyžádání se samostatnými podmínkami.

| Výhoda | Ultra | Unlimited ∞ |
| --- | --- | --- |
| Cena / měsíc | 999 Kč | 1 999 Kč |
| Nejvyšší denní limit na jednu kartu | 1 000 000 Kč | 5 000 000 Kč |
| Výchozí limit nově vytvořené běžné karty | 50 000 Kč | 1 000 000 Kč |
| Cashback u obchodníků v katalogu | 2 % | 3 % |
| Body za každých celých 100 Kč karetního nákupu | 1 | 3 |
| Kolekce karet | 3 motivy Ultra | Card Builder s 8 motivy |
| Private Banking a jednorázové karty | Ano | Ano, požadavky s prioritou Unlimited |

Limity se skutečně kontrolují při karetní platbě, kumulativně za den v korunovém ekvivalentu. Platí i pro starší karty držené pod aktuálním plánem. Změna na Unlimited sama nezvyšuje klientem nastavené limity starších karet. Při přechodu na nižší plán se vyšší limity sníží na maximum nového plánu; design karet zůstane zachovaný. Ostatní osobní plány mají strop 1 milion Kč, Business 10 milionů Kč a Junior limit stanovený rodičem. Nejde o neomezený zůstatek ani neomezené platby.

Body a cashback jsou propojené se stávající logikou karetních nákupů. ATM, interní přesuny a administrátorské úpravy body nevytvářejí. Private Banking ukládá požadavky lokálně včetně priority; žádný skutečný bankéř ani externí concierge nejsou připojení.

### Card Builder

Vstup: Unlimited Studio v Zenvault Life, tlačítko přidání karty u Unlimited klienta nebo Card Gallery → Unlimited ∞. Stávající Unlimited kartu upravíte přes Karty → Design. Osm dodaných motivů: Superstar, Iconic Pink, Iconic Blue, No Time 4 Luv, Rebel Star, Crimson Vision, Pink Venom a No More Love. U nové karty lze vybrat virtuální/fyzické provedení a Mastercard/Visa. Okraj je Hologram s pevným duhovým přechodem, nebo Static v šesti barvách. Žádné nepřetržité animace.

Pole Zobrazené číslo karty přijímá přesně 16 číslic, případně oddělených mezerami. Ukládá se jako displayNumber a poslední čtyřčíslí, pouze pro vzhled lokální karty. Nejde o vydání nebo změnu skutečného PAN; nezískává se CVV ani oprávnění k platbám v karetní síti. Úprava zachovává identitu karty, její zmrazení, nastavené limity a historii. Jednorázové a speciální edice se tímto editorem nemění. Vytvoření a editaci kontroluje také datový model, včetně oprávnění aktuálního profilu a ochrany před dvojitým potvrzením.

Karty uložené před snížením členství se dál zobrazují, další úpravy vyžadují Unlimited. Hologram okraj v Builderu je odlišný od edice Hologram Limited; její benefit zdarma pro Business i cena 500 bodů pro ostatní plány zůstávají. Rolling Loud stále stojí 1 000 bodů ve všech plánech.

### Home announcement

Oznámení Zenvault Unlimited ∞ se zobrazí po načtení aplikace a každém vstupu na Přehled, včetně opětovného klepnutí na tuto záložku a návratu aplikace do popředí na Home. Zavření platí jen pro aktuální návštěvu. Tlačítko otevře přehled výhod, u Unlimited klienta rovnou Card Builder. Oznámení respektuje zamčenou aplikaci, bezpečné oblasti displeje a další otevřené dialogy. Původní bublina Netflix/HBO Max zůstává nahoře na Přehledu.

Ověření 3.5.0: finanční regrese, přesné 3% cashback a trojnásobné body, hraniční kumulativní limity, zachování historie a kontrol karty, izolace klientů, Junior oprávnění, downgrade a opakované potvrzení. Mobilní webový průchod ověřil aktivaci Unlimited, načtení všech 8 různých obrázků, vytvoření a editaci karty, celé 16místné číslo, oba okraje, limity a uložení po restartu, opakování Home oznámení a tmavý vzhled. Fyzický iPhone nebyl dostupný pro test. Nové assety jsou standardní soubory s explicitními rozměry v nativním rendereru a bez nové závislosti.

Publikace 3.5.0 ověřena: přesná shoda 17 kódových souborů, 29 assetů a úplných metadat sedmi závislostí. Osm nově publikovaných obrázků má shodné bajty a rozměry s dodanými originály. Závěrečná kontrola navíc ověřila oddělení motivu a celého čísla karty, vstup z Card Gallery a zavření oznámení na malém displeji.
