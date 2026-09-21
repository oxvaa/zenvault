import {normalizeEmail,normalizePhone,hasDuplicate,isAdult} from './AuthModel';
import {normalizeUser,makeId} from './engine';
import {defaultCardLimit} from './Membership';

export const verificationLabel = u => u.onboarding?.verificationStatus === 'verified' ? 'Totožnost ověřena' : 'Čeká na ověření';
const field = (value, label, optional = false) => {
  if (optional && (value === undefined || value === '')) return '';
  if (typeof value !== 'string' || !value.trim() || value.length > 180) throw Error('Import: zkontroluj pole „'+label+'“.');
  return value.trim();
};
// Only profile fields are imported. Funds, credentials, permissions, cards and
// paid entitlements cannot be smuggled into this local-account format.
export function readLocalAccount(text) {
  if (typeof text !== 'string' || text.length > 12000) throw Error('Import je příliš velký. Vlož soubor místního účtu.');
  let data;
  try { data = JSON.parse(text); } catch { throw Error('Vlož celý obsah souboru místního účtu včetně závorek.'); }
  if (data?.format !== 'zenvault-local-account' || data.version !== 1 || !data.profile || typeof data.profile !== 'object') throw Error('Tento soubor není podporovaný místní účet Zenvault.');
  const p = data.profile, address = p.address || {};
  const email = normalizeEmail(p.email), phone = normalizePhone(p.phone);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 || !/^\+[1-9]\d{7,14}$/.test(phone)) throw Error('Import obsahuje neplatný e-mail nebo telefon.');
  if (p.tier !== 'Silver') throw Error('Import místního profilu začíná plánem Silver. Členství změníš po přihlášení.');
  if (typeof p.usTax !== 'boolean' || typeof p.pep !== 'boolean') throw Error('Import: doplň daňová prohlášení.');
  if (!['pending','verified'].includes(p.verificationStatus) || !['Bank iD','Doklad a selfie'].includes(p.identityMethod)) throw Error('Import obsahuje neplatný stav totožnosti.');
  const birthDate = field(p.birthDate,'Datum narození',true);
  if (birthDate && !isAdult(birthDate)) throw Error('Import: zkontroluj datum narození osoby starší 18 let.');
  const postcode = field(address.postcode,'PSČ');
  if (!/^[A-Za-z0-9 -]{3,12}$/.test(postcode)) throw Error('Import: neplatné PSČ.');
  return {
    firstName:field(p.firstName,'Jméno'),lastName:field(p.lastName,'Příjmení'),email,phone,tier:'Silver',birthDate,citizenship:field(p.citizenship,'Občanství',true),
    address:{street:field(address.street,'Ulice'),city:field(address.city,'Město'),postcode,country:field(address.country,'Země')},
    occupation:field(p.occupation,'Pracovní situace'),income:field(p.income,'Příjem'),sourceOfFunds:field(p.sourceOfFunds,'Původ peněz'),purpose:field(p.purpose,'Účel účtu'),
    taxCountry:field(p.taxCountry,'Daňová rezidence'),taxId:field(p.taxId,'Daňový identifikátor',true),usTax:p.usTax,pep:p.pep,identityMethod:p.identityMethod,verificationStatus:p.verificationStatus
  };
}

export function importLocalAccount(users, text, consent, now = new Date()) {
  const p = readLocalAccount(text);
  if (consent !== true) throw Error('Potvrď uložení místního profilu na tomto zařízení.');
  if (hasDuplicate(users,p.email,p.phone)) throw Error('Tento e-mail nebo telefon už patří místnímu účtu. Otevři ho v seznamu účtů.');
  const {email,phone,tier,...profile} = p, date = now.toISOString();
  return normalizeUser({
    id:makeId(),name:p.firstName+' '+p.lastName,tier,appThemeId:'sky',contact:{email,phone},
    balances:{CZK:0,EUR:0,USD:0,GBP:0},budget:3000000,points:0,
    onboarding:{version:1,...profile,taxIdPending:!p.taxId,verificationSource:'local-user-import',importedAt:date,consents:{localAccount:true,date,marketing:false}},
    cards:[{id:makeId(),tier,type:'Virtuální',network:'Mastercard',design:0,last:'0000',limit:defaultCardLimit({tier}),frozen:false,online:true,contactless:true}],
    notifications:[{id:makeId(),title:'Místní účet je připravený. V Nastavení si můžeš přidat vlastní heslo.',date}]
  });
}
