import {PRESTIGE_TIER,PRESTIGE_MAX_TIER,isPrestigeTier,prestigePlan} from './PrestigePlans';
// Monetary limits in minor units (CZK haléře).
export const ULTRA_MAX_TIER='Ultra MAX';
export const ULTRA_MAX_PRICE=1499;
export const MAX_TIER='Unlimited MAX';
export const PERSONAL_TIERS=['Silver','Gold','Platinum','Core','Pro','Ultra',ULTRA_MAX_TIER,'Unlimited',MAX_TIER,PRESTIGE_TIER,PRESTIGE_MAX_TIER];
export const TIER_ORDER=[...PERSONAL_TIERS.slice(0,-2),'Business',PRESTIGE_TIER,PRESTIGE_MAX_TIER];
export const builderRoute=tier=>tier===PRESTIGE_MAX_TIER?'prestigeMax':tier===PRESTIGE_TIER?'prestige':tier===MAX_TIER?'unlimitedMax':'unlimited';
export const UNLIMITED_PRICE=1999;
export const MAX_PRICE=3999;
export const isUnlimitedTier=tier=>tier==='Unlimited'||tier===MAX_TIER||isPrestigeTier(tier);
export const isMax=u=>!u.parentId&&u.tier===MAX_TIER;
export const hasMaxBenefits=u=>!u.parentId&&(isMax(u)||isPrestigeTier(u.tier));
export const hasBusinessTools=u=>!u.parentId&&(u.tier==='Business'||isPrestigeTier(u.tier));
export const canBuildCards=(u,tier=u.tier)=>!u.parentId&&isUnlimitedTier(tier)&&isUnlimitedTier(u.tier)&&TIER_ORDER.indexOf(u.tier)>=TIER_ORDER.indexOf(tier);
export const tierLabel=tier=>tier==='Unlimited'?'Unlimited ∞':tier;
export const maxCardLimit=u=>u.parentId?(u.juniorLimit||0):prestigePlan(u.tier)?.maxLimit||(isMax(u)||u.tier==='Business'?1000000000:u.tier==='Unlimited'?500000000:u.tier===ULTRA_MAX_TIER?300000000:100000000);
export const defaultCardLimit=u=>Math.min(prestigePlan(u.tier)?.defaultLimit||(isMax(u)?200000000:u.tier==='Unlimited'?100000000:u.tier===ULTRA_MAX_TIER?50000000:5000000),maxCardLimit(u));
export const pointsMultiplier=u=>u.parentId?1:prestigePlan(u.tier)?.points||(isMax(u)?5:u.tier==='Unlimited'?3:u.tier===ULTRA_MAX_TIER?2:1);
export const pointsRateLabel=u=>pointsMultiplier(u)>=5?pointsMultiplier(u)+' bodů':pointsMultiplier(u)===3?'3 body':pointsMultiplier(u)===2?'2 body':'1 bod';
export const hasPrivateBanking=u=>!u.parentId&&(['Ultra',ULTRA_MAX_TIER].includes(u.tier)||isUnlimitedTier(u.tier));
export const hasDisposable=u=>!u.parentId&&(['Pro','Ultra',ULTRA_MAX_TIER].includes(u.tier)||isUnlimitedTier(u.tier));
export const ULTRA_MAX_BENEFITS=[
 'Všechny nástroje Ultra za 1 499 Kč měsíčně, bez půlročního závazku',
 'Cashback 2,5 % u vybraných obchodníků',
 '2 body za každých celých 100 Kč karetního nákupu',
 'Denní limit každé karty až 3 000 000 Kč',
 'Nové karty s výchozím limitem 500 000 Kč',
 '3 vlastní designy: Champagne Orbit, Cobalt Ribbon a Noir Prism',
 'Private Banking s prioritou Ultra MAX a concierge požadavky',
 'Jednorázové virtuální karty, Vaults, Insights a správa předplatných',
 '31 motivů aplikace v ceně; Candy Sky lze získat za body',
];
export const MAX_BENEFITS=[
 'Cashback 5 % u vybraných obchodníků',
 '5 bodů za každých celých 100 Kč karetního nákupu',
 '5 000 uvítacích bodů při prvním sjednání MAX',
 'Denní limit každé karty až 10 000 000 Kč',
 'Nové MAX karty s výchozím limitem 2 000 000 Kč',
 'MAX Card Builder: 22 motivů v ceně + 3 Art Editions za 899 Kč / kartu',
 'Vlastní zobrazené číslo, celoplošná kompozice a Hologram / Static okraj',
 'Hologram Limited v ceně, bez odečtení bodů',
 'Všech 36 motivů aplikace včetně Candy Sky a Unlimited Monochrome',
 'Private Banking s prioritou Unlimited MAX a lifestyle concierge',
 'Jednorázové virtuální karty, měnové účty a všechny nástroje Unlimited',
];
export function activateMax(u,now=new Date()){
 if(u.parentId)throw Error('Tarif Junior účtu spravuje rodič.');
 const first=!u.maxWelcomeAwarded,points=u.points||0;
 if(first&&(!Number.isSafeInteger(points)||points<0||!Number.isSafeInteger(points+5000)))throw Error('Zůstatek bodů by překročil limit. Nejprve uprav počet bodů.');
 return {...u,tier:MAX_TIER,maxWelcomeAwarded:true,points:points+(first?5000:0),pointsLog:first?[{id:'max-welcome-'+u.id,value:5000,name:'Vítej v Zenvault Unlimited MAX',date:new Date(now).toISOString()},...(u.pointsLog||[])]:u.pointsLog||[]};
}
export const UNLIMITED_BENEFITS=[
 'Card Builder: 12 exkluzivních motivů, vlastní zobrazené číslo a okraj',
 'Denní limit každé karty až 5 000 000 Kč',
 'Nové Unlimited karty s výchozím limitem 1 000 000 Kč',
 'Cashback 3 % u vybraných obchodníků',
 '3 body za každých celých 100 Kč karetního nákupu',
 'Private Banking s prioritou Unlimited a concierge',
 'Jednorázové virtuální karty a 34 motivů aplikace',
 'Exkluzivní Unlimited Monochrome: bílé prostředí a černé akcenty',
];

// The last enrolment day is 1 January 2027, inclusive, in Europe/Prague.
// That day's end is 2 January 00:00 CET = 1 January 23:00 UTC.
export const CORE_OFFER_END='2027-01-01T23:00:00.000Z';
export const CORE_TERMS=[
 {id:'semiannual',name:'Půl roku',months:6,paymentAmount:24900,totalAmount:149400,monthlyEquivalent:24900,billing:'monthly'},
 {id:'annual',name:'Annual',months:12,paymentAmount:249000,totalAmount:249000,monthlyEquivalent:20750,billing:'annual'},
];
export const CORE_BENEFITS=[
 'Cashback 1,25 % u vybraných obchodníků',
 '300 uvítacích bodů při prvním sjednání Core',
 '3 vlastní designy Core: Halo, Current a Pulse',
 '31 motivů aplikace v ceně; Candy Sky lze získat za 300 bodů',
 'Účty v CZK, EUR, USD a GBP a směna mezi nimi',
 'Vaults s automatickým spořením, Insights a správa předplatných',
 'Denní limit karty až 1 000 000 Kč, freeze a Card Controls',
];
export const coreTerm=id=>CORE_TERMS.find(t=>t.id===id);
export const coreOfferAvailable=(now=new Date())=>Number.isFinite(+new Date(now))&&+new Date(now)<+new Date(CORE_OFFER_END);
export function announcementPlans(user){
 return user.parentId||user.tier==='Business'||isPrestigeTier(user.tier)?[]:[MAX_TIER];
}
export function addTermMonths(value,months){
 const d=new Date(value),day=d.getUTCDate();d.setUTCDate(1);d.setUTCMonth(d.getUTCMonth()+months);d.setUTCDate(Math.min(day,new Date(Date.UTC(d.getUTCFullYear(),d.getUTCMonth()+1,0)).getUTCDate()));return d.toISOString();
}
export function createCoreMembership(termId,accepted,now=new Date()){
 if(!coreOfferAvailable(now))throw Error('Nabídka Core skončila 1. 1. 2027. Nové sjednání už není dostupné.');
 const term=coreTerm(termId);if(!term)throw Error('Vyber půlroční nebo roční variantu Core.');
 if(accepted!==true)throw Error('Potvrď minimální dobu a cenu členství Core.');
 const startedAt=new Date(now).toISOString();
 return {...term,term:term.id,startedAt,commitmentEndsAt:addTermMonths(startedAt,term.months),offerEndsAt:CORE_OFFER_END,acceptedAt:startedAt,version:1,currency:'CZK',autoRenew:false};
}
export const coreCommitmentActive=(u,now=new Date())=>u.tier==='Core'&&!!u.coreMembership&&+new Date(u.coreMembership.commitmentEndsAt)>+new Date(now);
export function assertTierChange(u,tier,now=new Date()){
 if(tier!==u.tier&&coreCommitmentActive(u,now))throw Error('Core má sjednanou minimální dobu do '+new Date(u.coreMembership.commitmentEndsAt).toLocaleDateString('cs-CZ',{timeZone:'Europe/Prague'})+'. Potom můžeš tarif změnit.');
}
export function activateCore(u,termId,accepted,now=new Date()){
 if(u.tier==='Core'&&u.coreMembership)return u;
 const coreMembership=createCoreMembership(termId,accepted,now),first=!u.coreWelcomeAwarded;
 if(first&&!Number.isSafeInteger((u.points||0)+300))throw Error('Zůstatek bodů by překročil limit. Nejprve uprav počet bodů.');
 return {...u,tier:'Core',coreMembership,coreWelcomeAwarded:true,points:(u.points||0)+(first?300:0),pointsLog:first?[{id:'core-welcome-'+u.id,value:300,name:'Vítej v Zenvault Core',date:coreMembership.startedAt},...(u.pointsLog||[])]:u.pointsLog||[]};
}

// Trial entitlement is temporary. No subscription debit, commitment or welcome award.
export function trialError(u,tier,now=new Date()){
 if(u.parentId||u.tier==='Business')return 'Zkušební plány jsou určené dospělým osobním účtům.';
 if(!PERSONAL_TIERS.includes(tier)||tier==='Silver')return 'Vyber placený osobní plán.';
 if(u.planTrial)return 'Nejprve dokonči aktuální zkušební období.';
 if(coreCommitmentActive(u,now))return 'Nejprve musí skončit sjednaná minimální doba členství Core.';
 if(PERSONAL_TIERS.indexOf(tier)<=PERSONAL_TIERS.indexOf(u.tier))return 'Nabídka musí být na vyšší plán, než je tvůj aktuální tarif.';
 if(tier==='Core'&&!coreOfferAvailable(now))return 'Nabídka nového členství Core již skončila.';
 return '';
}
export function finishTrial(u,now=new Date(),status='expired'){
 const trial=u.planTrial;if(!trial)return false;
 u.tier=trial.baseTier;
 u.trialHistory=[{...trial,status,finishedAt:new Date(now).toISOString()},...(u.trialHistory||[])];
 u.planTrial=null;
 return true;
}
