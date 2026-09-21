import {finishTrial} from './Membership';

export const membershipStamp=u=>JSON.stringify({tier:u.tier,trial:u.planTrial||null,core:u.coreMembership||null});
export function removeMembership(d,actor,a,now,makeId){
 const check=(ok,message)=>{if(!ok)throw Error(message);};
 check(d.mode==='Administrátor','Odebrání plánu vyžaduje režim Administrátor.');
 const u=d.users.find(x=>x.id===a.target);
 check(u&&!u.parentId,'Vyber dospělý místní účet.');
 check(['trial','all'].includes(a.scope),'Vyber rozsah odebrání.');
 check(a.accepted===true,'Potvrď odebrání plánu.');
 check(a.expected===membershipStamp(u),'Členství klienta se změnilo. Zkontroluj ho znovu.');
 const reason=String(a.reason||'').trim();check(reason.length>=3&&reason.length<=300,'Uveď důvod odebrání (3 až 300 znaků).');
 check(a.scope==='trial'?!!u.planTrial:(u.tier!=='Silver'||!!u.planTrial),'Klient nemá členství, které lze takto odebrat.');
 const date=now.toISOString(),oldTier=u.tier,trial=u.planTrial?{...u.planTrial}:null,core=u.coreMembership?{...u.coreMembership}:null;
 if(u.planTrial)finishTrial(u,now,'admin-revoked');
 if(a.scope==='all'){
  u.tier='Silver';
  if(u.coreMembership){u.coreMembershipHistory=[{...u.coreMembership,endedAt:date,status:'admin-revoked',reason},...(u.coreMembershipHistory||[])];u.coreMembership=null;}
 }
 const audit={id:makeId(),actorId:actor.id,targetId:u.id,scope:a.scope,fromTier:oldTier,toTier:u.tier,trial,core,reason,date};
 u.membershipHistory=[audit,...(u.membershipHistory||[])];
 u.adminLog=[{id:makeId(),name:a.scope==='trial'?'Odebrání trialu':'Odebrání členství',fromTier:oldTier,toTier:u.tier,reason,date,actor:actor.id},...(u.adminLog||[])];
 d.membershipAudit=[audit,...(d.membershipAudit||[])];
 u.notifications.unshift({id:makeId(),title:a.scope==='trial'?'Zkušební plán byl odebrán':'Členství bylo odebráno',body:'Banka upravila tvůj místní účet. Aktivní plán: Zenvault '+u.tier+'. Důvod: '+reason+'. Zůstatky, body, karty a historie zůstávají zachované. Žádný poplatek ani refundace se neúčtuje.',date});
 return u;
}
