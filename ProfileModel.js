import {normalizeEmail,normalizePhone,birthISO,isAdult} from './AuthModel';

const clean=value=>String(value||'').trim();
const required=(value,label,min=2)=>{const v=clean(value);if(v.length<min||v.length>180)throw Error('Vyplň '+label+' (max. 180 znaků).');return v;};
export function validateContact(users,id,email,phone){
 const e=normalizeEmail(email),p=normalizePhone(phone);
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)||e.length>254)throw Error('Zadej platný e-mail.');
 if(!/^\+[1-9]\d{7,14}$/.test(p))throw Error('Telefon zadej s mezinárodní předvolbou.');
 if(users.some(u=>u.id!==id&&[u.auth,u.contact].some(c=>c&&(normalizeEmail(c.email)===e||normalizePhone(c.phone)===p))))throw Error('Tento e-mail nebo telefon už patří jinému místnímu účtu.');
 return {email:e,phone:p};
}
export function profileValues(u,kind){
 const o=u.onboarding||{};
 if(kind==='personal')return {firstName:o.firstName||u.name.split(' ')[0]||'',lastName:o.lastName||u.name.split(' ').slice(1).join(' '),birth:o.birthDate||'',citizenship:o.citizenship||''};
 if(kind==='address')return {street:'',city:'',postcode:'',country:'Česko',...o.address};
 if(kind==='contact'||kind==='password')return {email:u.auth?.email||u.contact?.email||'',phone:u.auth?.phone||u.contact?.phone||'',currentPassword:'',password:'',confirm:''};
 if(kind==='taxProfile')return {taxCountry:o.taxCountry||'',taxId:o.taxId||'',taxIdPending:o.taxIdPending??true,usTax:o.usTax??false,pep:o.pep??false,occupation:o.occupation||'',sourceOfFunds:o.sourceOfFunds||''};
 return {};
}
// Explicit fields avoid overwriting balances, entitlements or credentials from a form.
export function profilePatch(u,kind,f,users,now=new Date()){
 const o=u.onboarding||{};
 if(kind==='personal'){
  const firstName=required(f.firstName,'jméno'),lastName=required(f.lastName,'příjmení'),birthDate=birthISO(f.birth),citizenship=clean(f.citizenship);
  if(!u.parentId&&birthDate&&!isAdult(birthDate,now))throw Error('Zadej platné datum narození osoby starší 18 let.');
  if(u.parentId&&birthDate!==o.birthDate)throw Error('Datum narození Junior účtu spravuje rodič.');
  if(citizenship&&citizenship.length>100)throw Error('Zkrať název občanství.');
  return {name:firstName+' '+lastName,onboarding:{...o,firstName,lastName,birthDate,citizenship}};
 }
 if(kind==='address'){
  const address={street:required(f.street,'ulici a číslo domu'),city:required(f.city,'město'),country:required(f.country,'zemi'),postcode:clean(f.postcode)};
  if(!/^[A-Za-z0-9 -]{3,12}$/.test(address.postcode))throw Error('Zadej platné PSČ.');
  return {onboarding:{...o,address}};
 }
 if(kind==='contact'){
  const identity=validateContact(users,u.id,f.email,f.phone);
  return u.auth?{auth:{...u.auth,...identity,emailVerified:identity.email===u.auth.email&&!!u.auth.emailVerified,phoneVerified:identity.phone===u.auth.phone&&!!u.auth.phoneVerified}}:{contact:identity};
 }
 if(kind==='taxProfile')return {onboarding:{...o,taxCountry:required(f.taxCountry,'zemi daňové rezidence'),taxId:f.taxIdPending?'':required(f.taxId,'daňový identifikátor',3),taxIdPending:!!f.taxIdPending,usTax:!!f.usTax,pep:!!f.pep,occupation:required(f.occupation,'zaměstnání nebo ekonomickou činnost'),sourceOfFunds:required(f.sourceOfFunds,'zdroj příjmů')}};
 throw Error('Neznámá úprava profilu.');
}
