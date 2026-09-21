import {trialError,finishTrial} from './Membership';

export const BANK_SENDER='Zenvault Bank & Co.';
export const BANK_DEPARTMENTS=['Klientská péče','Členské výhody','Private Banking','Zabezpečení'];
export const TRIAL_DAYS=[7,14,30];
export const OFFER_DAYS=[7,14,30];
export const DOCUMENT_DAYS=[0,7,30,90];
const check=(value,text)=>{if(!value)throw Error(text);};
const clean=(value,min,max,label)=>{const v=String(value??'').trim();check(v.length>=min&&v.length<=max,`${label}: vyplň ${min} až ${max} znaků.`);return v;};
const later=(now,days)=>new Date(+new Date(now)+days*86400000).toISOString();
export const messageDate=value=>new Date(value).toLocaleString('cs-CZ',{day:'numeric',month:'numeric',year:'numeric',hour:'2-digit',minute:'2-digit'});
export const inboxItems=u=>[
 ...(u.bankMessages||[]).map(m=>({...m,kind:'bank'})),
 ...(u.notifications||[]).map(m=>({...m,kind:'system'})),
].sort((a,b)=>new Date(b.date)-new Date(a.date));
export const unreadCount=u=>inboxItems(u).filter(m=>!m.readAt&&!m.archivedAt).length;
export function findMessage(u,id,kind='bank'){
 const m=(kind==='bank'?u.bankMessages:u.notifications)?.find(x=>x.id===id);
 check(m,'Zpráva nebyla nalezena v tomto účtu.');return m;
}
export function offerIssue(u,m,now=new Date()){
 if(!m.offer)return 'Tato zpráva neobsahuje nabídku.';
 if(m.offer.redeemedAt)return 'Tato nabídka už byla využita.';
 if(+new Date(m.offer.expiresAt)<=+new Date(now))return 'Platnost nabídky již skončila.';
 return trialError(u,m.offer.tier,now);
}
export function sendBankMessage(d,actor,a,now,id){
 check(d.mode==='Administrátor','Odesílání bankovních zpráv vyžaduje režim Administrátor.');
 const target=d.users.find(x=>x.id===a.target);check(target,'Vyber klienta.');
 check(BANK_DEPARTMENTS.includes(a.department),'Vyber oddělení banky.');
 check(['normal','important'].includes(a.priority),'Vyber prioritu zprávy.');
 const message={id:id(),sender:BANK_SENDER,department:a.department,priority:a.priority,
  title:clean(a.title,3,120,'Předmět'),body:clean(a.body,5,6000,'Zpráva'),date:new Date(now).toISOString(),recipientId:target.id,actorId:actor.id,readAt:null,archivedAt:null};
 check(Array.isArray(a.documents||[])&&(a.documents||[]).length<=3,'Přilož nejvýše 3 dokumenty.');
 message.documents=(a.documents||[]).map(doc=>{
  check(DOCUMENT_DAYS.includes(doc.validDays),'Neplatná platnost dokumentu.');
  return {id:id(),title:clean(doc.title,3,120,'Název dokumentu'),body:clean(doc.body,5,12000,'Text dokumentu'),requiresConfirmation:doc.requiresConfirmation===true,expiresAt:doc.validDays?later(now,doc.validDays):null};
 });
 if(a.offer){
  check(TRIAL_DAYS.includes(a.offer.days)&&OFFER_DAYS.includes(a.offer.validDays),'Vyber platnou délku trialu a nabídky.');
  const error=trialError(target,a.offer.tier,now);check(!error,error);
  message.offer={tier:a.offer.tier,days:a.offer.days,expiresAt:later(now,a.offer.validDays),price:0,currency:'CZK',autoRenew:false,redeemedAt:null};
 }
 target.bankMessages.unshift(message);
 d.bankOutbox=[{id:message.id,recipientId:target.id,recipientName:target.name,actorId:actor.id,date:message.date,title:message.title},...(d.bankOutbox||[])];
 return message;
}
export function redeemBankOffer(u,a,now){
 const m=findMessage(u,a.id);const error=offerIssue(u,m,now);check(!error,error);
 check(a.accepted===true,'Potvrď podmínky bezplatného zkušebního období.');
 const date=new Date(now).toISOString();
 u.planTrial={messageId:m.id,baseTier:u.tier,tier:m.offer.tier,startedAt:date,endsAt:later(now,m.offer.days),price:0,autoRenew:false};
 u.tier=m.offer.tier;m.offer.redeemedAt=date;m.offer.endsAt=u.planTrial.endsAt;m.readAt=m.readAt||date;
}
export function confirmBankDocument(u,a,now){
 const m=findMessage(u,a.id),doc=m.documents?.find(x=>x.id===a.documentId);check(doc,'Dokument nebyl nalezen.');
 check(doc.requiresConfirmation,'Tento dokument nevyžaduje potvrzení.');
 check(!doc.expiresAt||+new Date(doc.expiresAt)>+new Date(now),'Platnost dokumentu již skončila.');
 check(a.accepted===true,'Potvrď, že jsi dokument přečetl/a.');
 if(u.documents.some(x=>x.documentId===doc.id))return;
 const date=new Date(now).toISOString();
 u.documents.unshift({documentId:doc.id,messageId:m.id,title:doc.title,body:doc.body,sender:m.sender,department:m.department,receivedAt:m.date,confirmedAt:date,confirmedBy:u.name,confirmationType:'local-acknowledgement'});
 doc.confirmedAt=date;doc.confirmedBy=u.name;m.readAt=m.readAt||date;
}
export function notificationAction(u,a,now){
 const date=new Date(now).toISOString();
 if(a.type==='inboxReadAll'){[...u.bankMessages,...u.notifications].forEach(m=>{if(!m.archivedAt)m.readAt=m.readAt||date;});return;}
 const m=findMessage(u,a.id,a.kind);
 if(a.type==='inboxRead')m.readAt=m.readAt||date;
 else if(a.type==='inboxArchive')m.archivedAt=a.archived?date:null;
}
export function endUserTrial(u,now,status='expired'){
 const old=u.planTrial;if(!finishTrial(u,now,status))return false;
 u.notifications.unshift({id:'trial-ended-'+old.messageId,title:status==='expired'?'Zkušební období skončilo':'Zkušební období bylo ukončeno',body:'Tvůj plán je opět '+old.baseTier+'. Za zkušební období se nic neúčtuje.',date:new Date(now).toISOString()});
 return true;
}
