import {activatePrestige,isPrestigeTier} from './PrestigePlans';
import {defaultBuilderMotif} from './UnlimitedCatalog';
import {pbkdf2Async,sha256} from './PasswordKdf';
import {createAuthTask} from './AuthTask';
import {PERSONAL_TIERS,defaultCardLimit,coreOfferAvailable,coreTerm,activateCore,activateMax,isUnlimitedTier,MAX_TIER} from './Membership';
import {normalizeUser,makeId,validDay} from './engine';

export const AUTH_ITERATIONS=180000;
export const LEGACY_AUTH_ITERATIONS=600000;
const SUPPORTED_AUTH_ITERATIONS=new Set([AUTH_ITERATIONS,LEGACY_AUTH_ITERATIONS]);
export const normalizeEmail=value=>String(value||'').trim().toLowerCase();
export const normalizePhone=value=>{const v=String(value||'').replace(/[\s()-]/g,'');return v.startsWith('00')?'+'+v.slice(2):v;};
export const identityOf=u=>u.auth?.email||u.auth?.phone||'';
export const findLogin=(users,id)=>users.find(u=>u.auth&&(u.auth.email===normalizeEmail(id)||u.auth.phone===normalizePhone(id)));
export const hex=bytes=>Array.from(bytes,b=>b.toString(16).padStart(2,'0')).join('');
const unhex=value=>new Uint8Array(value.match(/../g).map(v=>parseInt(v,16)));
// Explicit UTF-8 encoding keeps Hermes independent of global TextEncoder.
export function utf8(value){const out=[];for(const letter of value){let c=letter.codePointAt(0);if(c>=0xD800&&c<=0xDFFF)c=0xFFFD;if(c<128)out.push(c);else if(c<2048)out.push(192|c>>6,128|c&63);else if(c<65536)out.push(224|c>>12,128|c>>6&63,128|c&63);else out.push(240|c>>18,128|c>>12&63,128|c>>6&63,128|c&63);}return new Uint8Array(out);}
export async function derivePassword(password,salt,task=createAuthTask(),iterations=AUTH_ITERATIONS){const bytes=utf8(password);try{return hex(await pbkdf2Async(sha256,bytes,unhex(salt),{c:iterations,dkLen:32,asyncTick:12,check:task.check,onProgress:task.onProgress}));}finally{bytes.fill(0);}}
export async function createCredential(password,salt,task){if(password.length<15||password.length>128)throw Error('Heslo musí mít 15 až 128 znaků.');if(!/^[a-f0-9]{32}$/.test(salt))throw Error('Nepodařilo se připravit zabezpečení. Zkus to znovu.');return {algorithm:'PBKDF2-SHA256',iterations:AUTH_ITERATIONS,salt,hash:await derivePassword(password,salt,task)};}
export async function verifyPassword(password,credential,task){if(typeof password!=='string'||password.length>128||!credential||credential.algorithm!=='PBKDF2-SHA256'||!SUPPORTED_AUTH_ITERATIONS.has(credential.iterations)||!/^[a-f0-9]{32}$/.test(credential.salt)||!/^[a-f0-9]{64}$/.test(credential.hash))return false;const actual=await derivePassword(password,credential.salt,task,credential.iterations);let diff=0;for(let i=0;i<64;i++)diff|=actual.charCodeAt(i)^credential.hash.charCodeAt(i);return diff===0;}
export function birthISO(value){const v=String(value||'').trim(),m=v.match(/^(\d{1,2})\.\s*(\d{1,2})\.\s*(\d{4})$/);return m?`${m[3]}-${m[2].padStart(2,'0')}-${m[1].padStart(2,'0')}`:v;}
export function isAdult(value,now=new Date()){const iso=birthISO(value);if(!validDay(iso))return false;const d=new Date(iso+'T12:00:00'),cutoff=new Date(now.getFullYear()-18,now.getMonth(),now.getDate(),23,59,59);return d<=cutoff&&d.getFullYear()>=now.getFullYear()-120;}
export const hasDuplicate=(users,email,phone)=>users.some(u=>[u.auth,u.contact].some(c=>c&&(normalizeEmail(c.email)===normalizeEmail(email)||normalizePhone(c.phone)===normalizePhone(phone))));
const filled=(v,min=2)=>typeof v==='string'&&v.trim().length>=min&&v.trim().length<=180;
export function validateRegistration(step,f,users,now=new Date()){
 if(step===0){if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizeEmail(f.email))||f.email.length>254)return 'Zadej platný e-mail.';if(!/^\+[1-9]\d{7,14}$/.test(normalizePhone(f.phone)))return 'Telefon zadej s předvolbou, například +420 777 123 456.';if(!f.password||f.password.length<15||f.password.length>128)return 'Použij heslo nebo frázi o 15 až 128 znacích.';if(f.password!==f.confirm)return 'Hesla se neshodují.';if(hasDuplicate(users,f.email,f.phone))return 'Tento e-mail nebo telefon už patří místnímu účtu.';}
 if(step===1){if(!filled(f.firstName)||!filled(f.lastName))return 'Vyplň jméno i příjmení.';if(!isAdult(f.birth,now))return 'Zadej platné datum narození. Osobní účet je od 18 let; Junior vytváří rodič.';if(!filled(f.citizenship))return 'Vyplň státní občanství.';}
 if(step===2){if(!filled(f.street)||!filled(f.city)||!filled(f.country))return 'Vyplň adresu trvalého pobytu.';if(!/^[A-Za-z0-9 -]{3,12}$/.test(f.postcode||''))return 'Zadej platné PSČ.';}
 if(step===3){if(!f.occupation||!f.income||!f.funds||!f.purpose)return 'Doplň zaměstnání, příjem, původ peněz a účel účtu.';}
 if(step===4){if(!filled(f.taxCountry)||!['Ano','Ne'].includes(f.usTax)||!['Ano','Ne'].includes(f.pep))return 'Doplň daňovou rezidenci a obě prohlášení.';if(!f.taxIdPending&&!filled(f.taxId,3))return 'Doplň daňový identifikátor, nebo zvol dodání při ověření.';}
 if(step===5){if(!['Bank iD','Doklad a selfie'].includes(f.identityMethod)||!f.identityAck)return 'Vyber způsob ověření a potvrď, že dokončení totožnosti proběhne později.';}
 if(step===6&&!PERSONAL_TIERS.includes(f.tier))return 'Vyber osobní plán.';
 if((step===6||step===7)&&f.tier==='Core'){if(!coreOfferAvailable(now))return 'Nové sjednání Core skončilo 1. 1. 2027.';if(!coreTerm(f.coreTerm))return 'Vyber půlroční nebo roční variantu Core.';if(step===7&&f.coreConsent!==true)return 'Potvrď minimální dobu a cenu členství Core.';}
 if(step===7&&(!f.localConsent||!f.accurate))return 'Potvrď podmínky místního účtu a správnost zadaných údajů.';
 return '';
}
export function registerUser(users,f,credential,now=new Date()){
 for(let i=0;i<8;i++){const error=validateRegistration(i,f,users,now);if(error)throw Error(error);}
 if(!credential?.hash||credential.algorithm!=='PBKDF2-SHA256')throw Error('Chybí zabezpečení účtu.');
 const date=now.toISOString(),id=makeId(),tier=f.tier;
 const user=normalizeUser({id,name:f.firstName.trim()+' '+f.lastName.trim(),tier,appThemeId:'sky',balances:{CZK:0,EUR:0,USD:0,GBP:0},budget:3000000,
  auth:{email:normalizeEmail(f.email),phone:normalizePhone(f.phone),credential,createdAt:date,failedAttempts:0,lockedUntil:0,emailVerified:false,phoneVerified:false},
  onboarding:{version:1,firstName:f.firstName.trim(),lastName:f.lastName.trim(),birthDate:birthISO(f.birth),citizenship:f.citizenship.trim(),address:{street:f.street.trim(),city:f.city.trim(),postcode:f.postcode.trim(),country:f.country.trim()},occupation:f.occupation,income:f.income,sourceOfFunds:f.funds,purpose:f.purpose,taxCountry:f.taxCountry.trim(),taxId:f.taxIdPending?'':f.taxId.trim(),taxIdPending:!!f.taxIdPending,usTax:f.usTax==='Ano',pep:f.pep==='Ano',identityMethod:f.identityMethod,verificationStatus:'pending',consents:{localAccount:true,accurate:true,marketing:!!f.marketing,date}},
  cards:[{id:makeId(),tier,type:'Virtuální',network:'Mastercard',design:0,last:'0000',limit:defaultCardLimit({tier}),frozen:false,online:true,contactless:true,...(isUnlimitedTier(tier)?{builder:{motif:tier==='Unlimited'?'unlimited-chrome-stars':defaultBuilderMotif(tier).id,edge:'hologram',color:'#46B8FF',layout:'full'}}:{})}],notifications:[{id:makeId(),title:'Vítej v Zenvault 4.6.1. Tvůj místní účet je připravený.',date}]});
 return tier==='Core'?normalizeUser(activateCore(user,f.coreTerm,f.coreConsent,now)):tier===MAX_TIER?normalizeUser(activateMax(user,now)):isPrestigeTier(tier)?normalizeUser(activatePrestige(user,tier,now)):user;
}
export function failedLogin(auth,now=Date.now()){const attempts=(auth.lockedUntil&&auth.lockedUntil<=now?0:auth.failedAttempts||0)+1;return {...auth,failedAttempts:attempts,lockedUntil:attempts>=5?now+60000:0};}
