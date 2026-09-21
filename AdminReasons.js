export const NEGATIVE_BALANCE_REASONS=[
 {id:'merchant-coverage',title:'Platba uhrazena bankou',text:'Prodejce si vyžádal platbu, tak jsme ji za vás zaplatili z důvodu nedostatku prostředků.'},
 {id:'enforcement',title:'Exekuční / vykonávací příkaz',text:'Záporný zůstatek vznikl na základě evidovaného exekučního nebo jiného vykonatelného příkazu.'},
 {id:'offline-settlement',title:'Dodatečné zaúčtování karetní platby',text:'Dříve autorizovaná karetní platba byla bankou dodatečně zaúčtována po dokončení zpracování obchodníkem.'},
 {id:'reversed-credit',title:'Storno dříve připsané částky',text:'Dříve připsaná částka byla po kontrole stornována nebo vrácena odesílateli.'},
 {id:'bank-obligation',title:'Vyrovnání závazku vůči bance',text:'Na účtu byl zaúčtován splatný závazek evidovaný bankou.'},
 {id:'accounting-correction',title:'Účetní oprava po kontrole',text:'Banka provedla účetní opravu po ruční kontrole historie účtu.'},
 {id:'other',title:'Jiný důvod',text:'Jiný bankovní důvod. V administraci je nutné doplnit vlastní vysvětlení do poznámky.'},
];
export const negativeBalanceReason=id=>NEGATIVE_BALANCE_REASONS.find(x=>x.id===id)||null;
export const negativeBalanceReasonText=id=>negativeBalanceReason(id)?.text||'';
