import {MAX_TIER} from './Membership';
import {PRESTIGE_MAX_TIER,isPrestigeTier} from './PrestigePlans';

export const UNLIMITED_MOTIFS=[
 {id:'unlimited-redline',name:'Redline',base:'#0B090C',ink:'#FFFFFF',accent:'#FF6767',zoom:1,fullBleed:true},
 {id:'unlimited-ethereal',name:'Ethereal',base:'#FFFFFF',ink:'#12212E',accent:'#457689',zoom:1,fullBleed:true},
 {id:'unlimited-pink-inferno',name:'Pink Inferno',base:'#050505',ink:'#FFFFFF',accent:'#FFA5CF',zoom:1,fullBleed:true},
 {id:'unlimited-chrome-stars',name:'Chrome Stars',base:'#090504',ink:'#FFFFFF',accent:'#FFB1DB',zoom:1,fullBleed:true},

 {id:'unlimited-superstar',name:'Superstar',base:'#260821',ink:'#FFFFFF',accent:'#FF97E0',zoom:1},
 {id:'unlimited-iconic-pink',name:'Iconic Pink',base:'#ED008F',ink:'#FFFFFF',accent:'#FFFFFF',zoom:1.8},
 {id:'unlimited-iconic-blue',name:'Iconic Blue',base:'#064DF9',ink:'#FFFFFF',accent:'#BFDFFF',zoom:1.8},
 {id:'unlimited-no-time',name:'No Time 4 Luv',base:'#FDFDFD',ink:'#11121A',accent:'#252733',zoom:1.3},
 {id:'unlimited-star',name:'Rebel Star',base:'#FFFFFF',ink:'#11121A',accent:'#252733',zoom:1.05},
 {id:'unlimited-red-eye',name:'Crimson Vision',base:'#FFFFFF',ink:'#11121A',accent:'#C42031',zoom:1.05},
 {id:'unlimited-spider',name:'Pink Venom',base:'#FFFFFF',ink:'#11121A',accent:'#A93276',zoom:1.1},
 {id:'unlimited-no-love',name:'No More Love',base:'#FFFFFF',ink:'#11121A',accent:'#A93276',zoom:1.4},
];
export const MAX_MOTIFS=[
 {id:'max-rose-thorns',name:'Rose Thorns',base:'#FFFFFF',ink:'#11121A',accent:'#AD0870',zoom:1,fullBleed:true,layout:'full'},
 {id:'max-thorn-arc',name:'Thorn Arc',base:'#F1F1F1',ink:'#11121A',accent:'#AD0870',zoom:1,fullBleed:true,layout:'full'},
 {id:'max-ghost-wings',name:'Ghost Wings',base:'#FFFFFF',ink:'#11121A',accent:'#963863',zoom:1,fullBleed:true,layout:'fit'},
 {id:'max-kitty-riot',name:'Kitty Riot',base:'#FFFFFF',ink:'#20151A',accent:'#963863',zoom:1,fullBleed:true,layout:'fit'},
 {id:'max-pink-chrome',name:'Pink Chrome',base:'#EEEEEE',ink:'#11121A',accent:'#AD0870',zoom:1,fullBleed:true,layout:'fit'},
 {id:'max-cobalt-chrome',name:'Cobalt Chrome',base:'#EEEEEE',ink:'#11121A',accent:'#144DB7',zoom:1,fullBleed:true,layout:'fit'},
 {id:'max-ember-blade',name:'Ember Blade',base:'#FFFFFF',ink:'#11121A',accent:'#A23D15',zoom:1,fullBleed:true,layout:'fit'},
 {id:'max-hazard',name:'Hazard Club',base:'#F6F6F6',ink:'#11121A',accent:'#806114',zoom:1,fullBleed:true,layout:'fit'},
 {id:'max-stellar',name:'Stellar Flame',base:'#E8E4E1',ink:'#11121A',accent:'#A91C7A',zoom:1,fullBleed:true,layout:'fit'},
 {id:'max-pink-americana',name:'Pink Americana',base:'#EF087F',ink:'#FFFFFF',accent:'#FFFFFF',zoom:1,fullBleed:true,layout:'full'},
];
export const MAX_ADDONS=[
 {id:'max-liquid-gold',name:'Liquid Gold',base:'#B86C05',ink:'#FFFFFF',accent:'#FFF1BC',zoom:1,fullBleed:true,layout:'full',price:89900},
 {id:'max-golden-current',name:'Golden Current',base:'#221500',ink:'#FFFFFF',accent:'#FFE59B',zoom:1,fullBleed:true,layout:'full',price:89900},
 {id:'max-holo-medusa',name:'Holo Medusa',base:'#000000',ink:'#FFFFFF',accent:'#F4BEE5',zoom:1,fullBleed:true,layout:'full',price:89900},
];
// Purchases belong to this card. Creating another card always requires its own purchase.
export const motifCharge=(card,motif)=>motif?.price&&!card?.artPurchases?.some(p=>p.motifId===motif.id&&p.amount===motif.price)?motif.price:0;
export const PRESTIGE_MOTIFS=[
 {id:'prestige-crimson-thorns',name:'Crimson Thorns',base:'#F6070B',ink:'#FFFFFF',accent:'#FFD0D0',zoom:1,fullBleed:true,layout:'full'},
 {id:'prestige-obsidian-bloom',name:'Obsidian Bloom',base:'#100506',ink:'#FFFFFF',accent:'#FFABAB',zoom:1,fullBleed:true,layout:'full'},
];
export const PRESTIGE_MAX_MOTIFS=[
 {id:'prestige-violet-spider',name:'Violet Venom',base:'#140614',ink:'#FFFFFF',accent:'#F2ACFF',zoom:1,fullBleed:true,layout:'full'},
 {id:'prestige-chrome-soul',name:'Chrome Soul',base:'#17031B',ink:'#FFFFFF',accent:'#F2ACFF',zoom:1,fullBleed:true,layout:'full'},
 {id:'prestige-deep-night',name:'Deep Night',base:'#030303',ink:'#FFFFFF',accent:'#F2ACFF',zoom:1,fullBleed:true,layout:'full'},
];
export const builderMotifs=tier=>isPrestigeTier(tier)?[...(tier===PRESTIGE_MAX_TIER?PRESTIGE_MAX_MOTIFS:[]),...PRESTIGE_MOTIFS,...MAX_MOTIFS,...UNLIMITED_MOTIFS,...MAX_ADDONS]:tier===MAX_TIER?[...MAX_MOTIFS,...UNLIMITED_MOTIFS,...MAX_ADDONS]:UNLIMITED_MOTIFS;
export const defaultBuilderMotif=tier=>builderMotifs(tier)[0];
export const STATIC_EDGES=[{name:'Sky Blue',color:'#46B8FF'},{name:'Chrome',color:'#B6C4D4'},{name:'Hot Pink',color:'#FF48B8'},{name:'Ink Black',color:'#15151D'},{name:'Ultra Violet',color:'#9473FF'},{name:'Acid Lime',color:'#CDEA61'}];
export const unlimitedMotif=(id,tier='Unlimited')=>builderMotifs(tier).find(x=>x.id===id)||defaultBuilderMotif(tier);
export function parseDisplayNumber(value){const s=String(value??'').trim();if(!/^[\d\s]+$/.test(s))return null;const n=s.replace(/\s/g,'');return /^\d{16}$/.test(n)?n:null;}
export const formatDisplayNumber=value=>(String(value||'').replace(/\s/g,'').match(/.{1,4}/g)||[]).join(' ');
// Cosmetic number only, deliberately outside Visa/Mastercard IIN prefixes.
// Never used as a real payment credential or as a security secret.
export function randomDisplayNumber(random=Math.random){
 let digits='0000';for(let i=0;i<12;i++)digits+=Math.floor(random()*10)%10;
 return digits;
}
