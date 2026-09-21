export const PRESTIGE_TIER='Prestige';
export const PRESTIGE_MAX_TIER='Prestige MAX';
export const isPrestigeTier=tier=>tier===PRESTIGE_TIER||tier===PRESTIGE_MAX_TIER;
export const PRESTIGE_PLANS=[
 {name:PRESTIGE_TIER,price:9999,cashback:.06,points:8,welcome:10000,maxLimit:2500000000,defaultLimit:500000000,equity:'0,01 %',colors:['#AC102A','#21090F'],tag:'Nad Business. Osobní finance, podnikání a privátní péče v jednom.',motif:'prestige-crimson-thorns',benefits:[
  'Cashback 6 % u vybraných obchodníků a 8 bodů za každých celých 100 Kč nákupu',
  '10 000 uvítacích bodů při prvním běžném sjednání Prestige',
  'Denní limit každé karty až 25 000 000 Kč; nové karty začínají na 5 000 000 Kč',
  'Prestige Card Builder: 2 vlastní červené motivy + 22 motivů kolekcí Unlimited a MAX',
  'Všech 33 motivů aplikace, Candy Sky i Hologram Limited v ceně',
  'Business nástroje: firemní cashflow, týmové karty, limity a schvalování výdajů',
  'Privátní péče s prioritou Prestige, osobní manager a globální concierge',
  'Family office požadavky, lifestyle rezervace a cestovní asistence',
  'Equity Circle: návrh podílového programu až 0,01 % akcií Zenvault® Bank & Co.',
  'Akciový program vyžaduje samostatné sjednání; aktivací tarifu žádné akcie nezískáváš',
  'Jednorázové karty, multi-currency účty, Vaults, Insights a správa předplatných',
 ]},
 {name:PRESTIGE_MAX_TIER,price:19999,cashback:.08,points:12,welcome:25000,maxLimit:5000000000,defaultLimit:1000000000,equity:'0,05 %',colors:['#66197C','#190921'],tag:'Absolutní vrchol Zenvaultu. Vlastní svět. Vlastní pravidla.',motif:'prestige-violet-spider',benefits:[
  'Cashback 8 % u vybraných obchodníků a 12 bodů za každých celých 100 Kč nákupu',
  '25 000 uvítacích bodů při prvním běžném sjednání Prestige MAX',
  'Denní limit každé karty až 50 000 000 Kč; nové karty začínají na 10 000 000 Kč',
  'Prestige MAX Atelier: 3 vlastní fialové motivy, 2 Prestige motivy a 22 Unlimited / MAX motivů',
  'Všechny výhody Prestige včetně Business nástrojů a 33 motivů aplikace',
  'Nejvyšší priorita Prestige MAX pro managera, podporu a concierge',
  'Family office, privátní cestovní plánování a VIP lifestyle požadavky',
  'Hologram Limited a Candy Sky bez bodů; archiv vlastních karet a designů',
  'Equity Circle: návrh podílového programu až 0,05 % akcií Zenvault® Bank & Co.',
  'Podíl není automatický ani garantovaný; vyžaduje samostatnou nabídku a smlouvu',
  'Nabídky partnerů a reálné concierge služby podléhají dostupnosti a samostatným podmínkám',
 ]},
];
export const prestigePlan=tier=>PRESTIGE_PLANS.find(p=>p.name===tier);
export function activatePrestige(u,tier,now=new Date()){
 const plan=prestigePlan(tier);if(!plan||u.parentId)throw Error('Vyber platný Prestige plán pro dospělý účet.');
 const first=!(u.prestigeWelcomeAwarded||[]).includes(tier),points=u.points||0;
 if(!Number.isSafeInteger(points)||points<0||!Number.isSafeInteger(points+(first?plan.welcome:0)))throw Error('Zůstatek bodů by překročil limit.');
 return {...u,tier,prestigeWelcomeAwarded:[...new Set([...(u.prestigeWelcomeAwarded||[]),tier])],points:points+(first?plan.welcome:0),pointsLog:first?[{id:'welcome-'+tier+'-'+u.id,name:'Vítej v Zenvault '+tier,value:plan.welcome,date:now.toISOString()},...(u.pointsLog||[])]:u.pointsLog||[]};
}
