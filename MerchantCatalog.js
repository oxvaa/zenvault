// Templates provide identity and category, never a live subscription price.
export const MERCHANT_TEMPLATES=[
 {id:'apple',name:'Apple',category:'Nákupy',channel:'online',aliases:['apple','apple.com','apple store',' apple']},
 {id:'hbo-max',name:'HBO Max',category:'Předplatné',channel:'online',aliases:['hbo max','hbomax']},
 {id:'netflix',name:'Netflix',category:'Předplatné',channel:'online',aliases:['netflix','netflix.com']},
 {id:'disney-plus',name:'Disney Plus',category:'Předplatné',channel:'online',aliases:['disney plus','disney+','disney +','disneyplus']},
 {id:'alza',name:'Alza',category:'Nákupy',channel:'online',aliases:['alza','alza.cz']},
 {id:'kaufland',name:'Kaufland',category:'Potraviny',channel:'contactless',aliases:['kaufland']},
 {id:'allegro',name:'Allegro',category:'Nákupy',channel:'online',aliases:['allegro','allegro.cz','allegro.pl']},
];
const clean=value=>String(value||'').trim().toLowerCase().replace(/\s+/g,' ');
export const merchantById=id=>MERCHANT_TEMPLATES.find(m=>m.id===id);
export const findMerchant=value=>MERCHANT_TEMPLATES.find(m=>m.id===clean(value)||m.aliases.includes(clean(value)));
export const merchantKey=value=>findMerchant(value)?.name.toLowerCase()||clean(value);
export const merchantBlocked=(blocked,name)=>blocked.some(n=>merchantKey(n)===merchantKey(name));
export function merchantForTransaction(x){
 const snapshot=merchantById(x.merchantId||x.merchantSnapshot?.id);
 if(snapshot)return snapshot;
 if(x.kind==='card'||(!x.kind&&x.value<0))return findMerchant(x.name);
 return undefined;
}
