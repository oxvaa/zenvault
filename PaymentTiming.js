export const CREDIT_DELAYS=[{days:0,label:'Okamžitě'},{days:2,label:'2 dny'},{days:3,label:'3 dny'},{days:6,label:'6 dní'}];
export const PAYMENT_REASONS=[
 {id:'bank',label:'Nepodporovaná banka',tone:'red',text:'🚫 Na banku příjemce prozatím nepodporujeme okamžité platby.',link:'Více o podporovaných bankách',title:'Podporované banky',info:'Podpora okamžitých plateb v Zenvaultu pro tuzemské platby v korunách: Air Bank (3030) a Raiffeisenbank (5500).'},
 {id:'issue',label:'Technický problém',tone:'red',text:'⚠️ Vyskytl se problém na kterém nyní pracujeme. Platba bude odeslána v nejbližším možném čase.',link:'Více informací zde',title:'Technické zdržení platby',info:'U této platby je zaznamenané technické zdržení. Předpokládaný termín najdeš v detailu platby. Stejnou platbu nezadávej opakovaně, aby nevznikla duplicita.'},
 {id:'review',label:'Kontrola platby',tone:'blue',text:'🔍 Tato platba byla předána kontrole, děkujeme za pochopení.',link:'Více informací zde',title:'Kontrola platby',info:'U této platby je zaznamenaná kontrola. Předpokládané datum připsání je uvedené v detailu platby. Zvolený důvod sám o sobě termín nemění.'},
];
export const paymentReason=id=>PAYMENT_REASONS.find(r=>r.id===id);
export function creditDate(days,now=new Date()){const due=new Date(now);due.setDate(due.getDate()+days);return due.toISOString();}
export const paymentStatus=x=>x.status==='waitingFunds'?'Čeká na prostředky':x.status==='pending'?'Čeká na připsání':x.status==='blocked'?'Připsání pozastaveno':'Zaúčtováno';
export const transactionFeed=u=>[...(u.pendingTransfers||[]),...u.transactions].sort((a,b)=>new Date(b.date)-new Date(a.date));
