import {hasMaxBenefits} from './Membership';
import {isUnlimitedTier} from './Membership';
// Stable ids keep a user's choice across app updates and plan changes.
const luminance=c=>{const rgb=c.slice(1).match(/../g).map(x=>parseInt(x,16)/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4);return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722;};
// Accent text must remain readable on the tinted secondary-button surface.
function readableAccent(color,surface){let rgb=color.slice(1).match(/../g).map(x=>parseInt(x,16)),out=color;for(let i=0;i<24&&(luminance(surface)+.05)/(luminance(out)+.05)<4.6;i++){rgb=rgb.map(x=>Math.floor(x*.95));out='#'+rgb.map(x=>x.toString(16).padStart(2,'0')).join('');}return out;}
const make=(id,name,group,shape,icon,accent,glow,light,soft,night,panel,darkAccent)=>({id,name,group,shape,icon,accent:readableAccent(accent,soft),glow,light,soft,night,panel,darkAccent});
export const APP_THEMES=[
 make('sky','Sky Atelier','Studio','orbital','planet-outline','#176CC2','#62D6FF','#F1F7FF','#E1EDFC','#081729','#142C46','#8CD4FF'),
 make('cloud','Cloud Nine','Studio','cloud','cloud-outline','#526DA8','#C0D9FF','#F6F8FF','#E8EEFC','#11192A','#243149','#B9D3FF'),
 make('candy','Candy Sky','Candy','bloom','sparkles-outline','#9A347F','#FEACE5','#FFF4FC','#F5DDEE','#251125','#46203E','#FFB6E7'),
 make('peach','Peach Sorbet','Candy','bloom','sunny-outline','#A54D2D','#FFC9A1','#FFF6EF','#FBE7D8','#261710','#46291F','#FFC8A6'),
 make('lilac','Lilac Dream','Candy','orbital','moon-outline','#7548AD','#CEB9FF','#FAF6FF','#EEE3FC','#1B1329','#332249','#D6BBFF'),
 make('matcha','Matcha Club','Nature','leaf','leaf-outline','#4F712F','#C1E584','#F5FAEF','#E6F0D5','#162015','#2D3C23','#C8EAA0'),
 make('gold','Golden Hour','Nature','sun','sunny-outline','#936014','#FFD57B','#FFFAEF','#F7E9CB','#23190B','#42301A','#FFDB93'),
 make('cherry','Cherry Pop','Candy','bloom','heart-outline','#B32F54','#FFADB6','#FFF3F5','#FADFE6','#290F1A','#4C2331','#FFB0C1'),
 make('mint','Mint Museum','Nature','leaf','flower-outline','#21745F','#9DE3CA','#F0FCF7','#DBF0E6','#0E201C','#1E3B31','#A5EAD3'),
 make('ocean','Ocean Drive','Nature','wave','water-outline','#137788','#71E8E0','#EFFBFD','#D8EFF3','#0A1E27','#193846','#93EBEA'),
 make('grape','Electric Grape','Night','prism','flash-outline','#7544C5','#BD92FF','#F6F2FF','#E9DFFB','#170D2C','#2D204A','#C9AEFF'),
 make('aurora','Aurora Borealis','Night','wave','color-wand-outline','#286B79','#A7A4FF','#F0FAFC','#DFF0F0','#081D26','#19373F','#A3F1DA'),
 make('chrome','Midnight Chrome','Studio','prism','diamond-outline','#4B6179','#C0DDE8','#F3F7FA','#E1EAF0','#0A131D','#23303E','#CDE5F6'),
 make('noir','Obsidian Noir','Night','orbital','ellipse-outline','#4D5366','#BAC3DA','#F6F6F9','#E7E8EE','#0B0C13','#23252F','#DADEEA'),
 make('blueprint','Blueprint Studio','Studio','grid','grid-outline','#285EB4','#A1BFFF','#F2F6FE','#DFE9FC','#0C1830','#213552','#AECBFF'),
 make('festival','Festival Glow','Night','streak','musical-notes-outline','#6534AB','#C8F36B','#F8F4FF','#EBDFFC','#190F2A','#30213E','#DCB6FF'),
 {...make('z5-red','Bright Red','Zenvault 5','streak','flash-outline','#E60023','#FF526A','#FFF5F6','#FFE1E5','#210006','#42000B','#FF6579'),edition:'z5'},
 {...make('z5-red-black','Bright Red & Black','Zenvault 5','prism','contrast-outline','#FF1738','#FF4963','#151515','#231014','#050505','#151515','#FF4963'),edition:'z5',forceDark:true},
 {...make('z5-red-silver','Bright Red & Silver','Zenvault 5','grid','diamond-outline','#D90429','#FF526A','#F7F8FA','#E7E9EE','#101114','#282A30','#FF6A7E'),edition:'z5'},
 ...[
 make('azure','Azure Club','Studio','wave','water-outline','#005AC7','#77CDFF','#F3F8FF','#E0EEFF','#08152A','#162D49','#91CAFF'),
 make('dune','Dune Atelier','Nature','arc','sunny-outline','#785A35','#E9C894','#FBF8F2','#EFE7D8','#201B13','#373024','#E3C79D'),
 make('rosewater','Rosewater','Candy','bloom','rose-outline','#A13F65','#F6ACCE','#FFF7FA','#F6E3EC','#25121C','#402432','#F8B7D3'),
 make('pistachio','Pistachio Social','Nature','dots','leaf-outline','#446B3A','#C4E5A3','#F6FAF2','#E5EFD9','#151F12','#2C3B25','#C4E1A8'),
 make('cobalt','Cobalt Current','Studio','grid','flash-outline','#193FB5','#90ADFF','#F4F6FF','#E5EAFE','#0A1230','#202D50','#ABBFFF'),
 make('terracotta','Terra Form','Nature','arc','aperture-outline','#96452F','#EDB295','#FFF7F1','#F5E3D9','#251711','#442A20','#EBC2AA'),
 make('arctic','Arctic Air','Studio','prism','snow-outline','#35647A','#A5DEEA','#F4FBFD','#E0F0F4','#0D1D26','#223541','#B2E6F2'),
 make('mocha','Mocha Maison','Nature','checker','cafe-outline','#6E5147','#D5B8AA','#FAF6F3','#EBE1DA','#211916','#382B26','#E0C4B7'),
 make('lavender','Lavender Haze','Candy','cloud','cloud-outline','#70449D','#DAC1F6','#FBF7FF','#EEE4F8','#21152C','#382745','#DFC0F5'),
 make('lagoon','Lagoon House','Nature','wave','fish-outline','#066D71','#8EE3D9','#F1FCFA','#D9F1EB','#091F21','#1C393B','#9BE7E0'),
 make('solar','Solar Fizz','Candy','sun','sunny-outline','#8B5C0D','#F8D45D','#FFFBEE','#F8EECD','#241C0B','#41351B','#F4D988'),
 make('ink','Ink District','Night','grid','pencil-outline','#3E526D','#B6C8E4','#F5F7FB','#E4EAF2','#101722','#273343','#CBD6E8'),
 make('opal','Opal Orbit','Studio','orbital','planet-outline','#64528C','#C7D7F9','#F9F8FE','#EBE8F5','#191728','#322D47','#D1C6ED'),
 make('retro','Retro Wave','Candy','checker','game-controller-outline','#9D3A44','#EDB489','#FFF6F2','#F5E2D9','#29151B','#432631','#F9B7A9'),
 make('ruby','Ruby Afterhours','Night','streak','diamond-outline','#A12744','#EB92A8','#FFF4F7','#F5DFE6','#260E19','#442132','#F4A7BB'),
 make('carbon','Carbon Studio','Night','prism','cube-outline','#4C5759','#B8CDCC','#F5F8F8','#E3EBEA','#101818','#283434','#CFDEDC'),
 ].map(m=>({...m,edition:'new'})),
 {...make('unlimited-monochrome','Unlimited Monochrome','Private','arc','infinite-outline','#000000','#D8D8D8','#FFFFFF','#F3F3F3','#FFFFFF','#FFFFFF','#000000'),edition:'new',exclusive:'Unlimited',forceLight:true},
];
export const THEME_GROUPS=['Vše','Nové','Zenvault 5','Studio','Candy','Nature','Night','Private'];
export const canUseTheme=(u,m)=>!!m&&(!m.exclusive||(!u.parentId&&(u.tier===m.exclusive||(m.exclusive==='Unlimited'&&isUnlimitedTier(u.tier)))))&&(m.id!=='candy'||hasMaxBenefits(u)||!!u.unlocks?.includes('theme'));
const legacy={Silver:['cloud','ocean','lilac'],Gold:['gold','peach','gold'],Platinum:['chrome','lilac','mint'],Pro:['sky','ocean','grape'],Ultra:['candy','noir','aurora'],Business:['blueprint','matcha','peach']};
export function resolveAppTheme(u){
 if(u.rewardTheme&&(hasMaxBenefits(u)||u.unlocks?.includes('theme')))return APP_THEMES.find(m=>m.id==='candy');
 const requested=APP_THEMES.find(m=>m.id===u.appThemeId);
 if(canUseTheme(u,requested))return requested;
 let id=(legacy[u.tier]||legacy.Silver)[u.appThemes?.[u.tier]??(u.tier==='Ultra'?1:0)]||'sky';
 if(id==='candy'&&!u.unlocks?.includes('theme'))id='cherry';
 return APP_THEMES.find(m=>m.id===id)||APP_THEMES[0];
}
export function themeTokens(m,dark){
 const mono=!!m.forceLight;dark=m.forceDark?true:(mono?false:!!dark);
 return {dark,mono,bg:dark?m.night:m.light,panel:dark?m.panel:'#FFFFFF',surface:dark?m.panel+'ED':'#FFFFFFED',text:mono?'#0A0A0A':dark?'#F5F7FC':'#142235',muted:mono?'#656565':dark?'#B5C0D2':'#586B7D',soft:dark?m.panel:m.soft,border:mono?'#E6E6E6':dark?'#FFFFFF18':m.accent+'14',accent:dark?m.darkAccent:m.accent,button:m.accent,positive:mono?'#000000':dark?'#82DDAB':'#14754F',featureGradient:dark?[m.panel,m.night]:[m.soft,m.light],theme:m};
}
