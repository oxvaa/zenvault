import React,{useState} from 'react';
import {View,Pressable,Switch} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {inboxItems,unreadCount,messageDate,offerIssue,BANK_SENDER} from './BankMessages';
import {tierLabel} from './Membership';

export function TrialStatus({u,ui,onManage}){
 const {t,Label}=ui,trial=u.planTrial;if(!trial)return null;
 return <Pressable accessibilityRole="button" accessibilityLabel="Spravovat zkušební plán" onPress={onManage} style={{padding:17,borderRadius:20,backgroundColor:t.soft,borderWidth:1,borderColor:t.border,marginVertical:14}}>
  <Label style={{fontSize:11,fontWeight:'800',color:t.accent}}>FREE TRIAL · 0 Kč</Label>
  <Label style={{fontSize:18,fontWeight:'700',marginTop:6}}>{tierLabel(trial.tier)}</Label>
  <Label muted style={{fontSize:12,lineHeight:19,marginTop:6}}>Do {messageDate(trial.endsAt)}. Potom opět {trial.baseTier}, bez automatického prodloužení.</Label>
 </Pressable>;
}
function Consent({ui,value,onChange,label}){
 const {t,Label}=ui;
 return <View style={{flexDirection:'row',alignItems:'center',gap:12,marginVertical:15}}><Switch accessibilityLabel={label} value={value} onValueChange={onChange} trackColor={{true:t.button}}/><Label style={{fontSize:12,lineHeight:19,flex:1}}>{label}</Label></View>;
}
function Offer({u,m,ui,dispatch}){
 const {t,Panel,Label,Button}=ui,[accepted,A]=useState(false),[review,R]=useState(false),offer=m.offer;
 const issue=offerIssue(u,m),active=u.planTrial?.messageId===m.id;
 return <Panel style={{marginTop:20,borderWidth:1,borderColor:t.border}}>
  <Label style={{color:t.accent,fontSize:10,fontWeight:'800',letterSpacing:1.5}}>OSOBNÍ NABÍDKA</Label>
  <Label style={{fontSize:24,fontWeight:'800',letterSpacing:-.5,marginTop:10}}>Free trial {tierLabel(offer.tier)}</Label>
  <Label style={{fontSize:32,fontWeight:'800',marginTop:13}}>0 Kč<Label muted style={{fontSize:14}}> / {offer.days} dní</Label></Label>
  {offer.redeemedAt?<><Label muted style={{lineHeight:22,marginTop:13}}>{active?'Zkušební období je aktivní.':'Nabídka byla využita.'}{'\n'}Aktivováno {messageDate(offer.redeemedAt)}. Původní konec: {messageDate(offer.endsAt)}.</Label>{active&&<TrialStatus u={u} ui={ui} onManage={()=>R(!review)}/>}</>:<><Label muted style={{lineHeight:21,fontSize:13,marginVertical:13}}>Aktivuj do {messageDate(offer.expiresAt)}. Získáš funkce plánu na {offer.days} dní. Po skončení se vrátí {u.tier}; bez automatické platby nebo prodloužení. Jednorázové uvítací body se při trialu nepřipisují. Placené designy karet se kupují samostatně.</Label>{issue?<Label style={{color:t.accent,fontSize:13,lineHeight:21}}>{issue}</Label>:<><Consent ui={ui} value={accepted} onChange={A} label="Souhlasím s podmínkami bezplatného trialu"/><Button title={'Aktivovat '+offer.days+' dní zdarma'} disabled={!accepted} onPress={()=>dispatch({type:'bankOffer',id:m.id,accepted},'Zkušební plán je aktivní.')}/></>}</>}
  {active&&review&&<><Label muted style={{lineHeight:21,marginBottom:12}}>Ukončením se hned vrátíš na {u.planTrial.baseTier}. Tuto nabídku už znovu využít nepůjde.</Label><Button title="Ukončit trial a vrátit původní plán" secondary onPress={()=>{if(dispatch({type:'trialCancel'},'Původní tarif byl obnoven.'))R(false);}}/></>}
 </Panel>;
}
function DocumentDetail({u,m,doc,ui,dispatch,onBack}){
 const {t,Panel,Label,Button}=ui,[accepted,A]=useState(false),copy=u.documents.find(x=>x.documentId===doc.id),expired=doc.expiresAt&&+new Date(doc.expiresAt)<=Date.now();
 return <View testID="bank-document-detail">
  <Button title="Zpět na zprávu" secondary onPress={onBack}/>
  <View style={{marginVertical:24}}><Label style={{color:t.accent,fontSize:10,fontWeight:'800',letterSpacing:1.5}}>DOKUMENT · {m.department?.toUpperCase()}</Label><Label style={{fontSize:26,fontWeight:'800',letterSpacing:-.7,marginTop:10}}>{doc.title}</Label><Label muted style={{fontSize:12,marginTop:9}}>{BANK_SENDER} · {messageDate(m.date)}</Label></View>
  <Panel><Label selectable style={{fontSize:15,lineHeight:25}}>{copy?.body||doc.body}</Label></Panel>
  {doc.expiresAt&&<Label muted style={{fontSize:12,lineHeight:20,marginTop:15}}>Platnost do {messageDate(doc.expiresAt)}.</Label>}
  {copy?<Panel style={{marginTop:20}}><Label style={{fontSize:17,fontWeight:'700'}}>✓ Potvrzeno</Label><Label muted style={{marginTop:10,lineHeight:22}}>{copy.confirmedBy}{'\n'}{messageDate(copy.confirmedAt)}</Label><Label muted style={{fontSize:12,lineHeight:20,marginTop:10}}>Kopie je uložená v Nastavení → Dokumenty.</Label></Panel>:doc.requiresConfirmation?<>
   <Label muted style={{fontSize:12,lineHeight:20,marginTop:20}}>Potvrdíš přečtení dokumentu v této aplikaci. Jde o lokální potvrzení, nikoli kvalifikovaný elektronický podpis.</Label>
   {expired?<Label style={{color:t.accent,marginTop:14}}>Dokument již nelze potvrdit, jeho platnost skončila.</Label>:<><Consent ui={ui} value={accepted} onChange={A} label="Dokument jsem přečetl/a a potvrzuji převzetí"/><Button title="Potvrdit dokument" disabled={!accepted} onPress={()=>dispatch({type:'bankDocument',id:m.id,documentId:doc.id,accepted},'Potvrzená kopie je uložená v Dokumentech.')}/></>}
  </>:<Label muted style={{fontSize:12,lineHeight:20,marginTop:18}}>Dokument je pro informaci. Potvrzení není potřeba.</Label>}
 </View>;
}
export function MessageDetail({u,m,ui,dispatch,onBack}){
 const {t,Panel,Label,Button,Icon,Row,Section}=ui,[docId,D]=useState(null),doc=m.documents?.find(x=>x.id===docId);
 if(doc)return <DocumentDetail key={doc.id} u={u} m={m} doc={doc} ui={ui} dispatch={dispatch} onBack={()=>{D(null);ui.scrollTop?.();}}/>;
 return <View testID="bank-message-detail">
  <Button title="Zpět do schránky" secondary onPress={onBack}/>
  <View style={{marginTop:25,flexDirection:'row',gap:13,alignItems:'center'}}><View style={{width:46,height:46,borderRadius:17,backgroundColor:t.soft,alignItems:'center',justifyContent:'center'}}><Icon name={m.kind==='system'?'notifications-outline':'shield-checkmark-outline'} color={t.accent}/></View><View style={{flex:1}}><Label style={{fontWeight:'700'}}>{m.kind==='system'?'Zenvault':m.sender}</Label><Label muted style={{fontSize:12,lineHeight:19}}>{m.department||'Oznámení aplikace'} · {messageDate(m.date)}</Label></View></View>
  {m.priority==='important'&&<Label style={{color:t.accent,fontSize:10,fontWeight:'800',letterSpacing:1.3,marginTop:20}}>DŮLEŽITÁ ZPRÁVA</Label>}
  <Label accessibilityRole="header" style={{fontSize:28,fontWeight:'800',letterSpacing:-.7,marginTop:20,marginBottom:18}}>{m.title}</Label>
  <Panel><Label selectable style={{fontSize:15,lineHeight:25}}>{m.body||m.title}</Label></Panel>
  {m.offer&&<Offer key={m.id} u={u} m={m} ui={ui} dispatch={dispatch}/>}
  {!!m.documents?.length&&<><Section title={'Přílohy · '+m.documents.length}/><Panel>{m.documents.map(x=><Row key={x.id} icon="document-text-outline" title={x.title} sub={x.confirmedAt?'✓ Potvrzeno':x.requiresConfirmation?'Vyžaduje potvrzení':'Dokument k přečtení'} onPress={()=>{D(x.id);ui.scrollTop?.();}}/>)}</Panel></>}
  <Button title={m.archivedAt?'Vrátit do doručených':'Archivovat zprávu'} secondary style={{marginTop:25}} onPress={()=>{if(dispatch({type:'inboxArchive',id:m.id,kind:m.kind,archived:!m.archivedAt},m.archivedAt?'Zpráva vrácena do schránky.':'Zpráva archivována.'))onBack();}}/>
 </View>;
}
export default function Inbox({u,ui,dispatch,initialId=null}){
 const {t,Panel,Label,Button,Icon,Chips}=ui,[filter,F]=useState('Vše'),[selected,S]=useState(initialId?{id:initialId,kind:'bank'}:null);
 const all=inboxItems(u),m=selected&&all.find(x=>x.id===selected.id&&x.kind===selected.kind);
 const open=x=>{dispatch({type:'inboxRead',id:x.id,kind:x.kind,silent:true});S({id:x.id,kind:x.kind});ui.scrollTop?.();};
 if(m)return <MessageDetail key={m.id} u={u} m={m} ui={ui} dispatch={dispatch} onBack={()=>S(null)}/>;
 const items=all.filter(x=>filter==='Archiv'?x.archivedAt:!x.archivedAt&&(filter==='Vše'||filter==='Nepřečtené'&&!x.readAt||filter==='Nabídky'&&x.offer||filter==='Dokumenty'&&x.documents?.length));
 return <View testID="bank-inbox">
  <LinearGradient colors={[t.button,t.button]} style={{borderRadius:24,padding:22,marginBottom:17}}><Label style={{color:'#FFFFFF',fontSize:10,fontWeight:'700',letterSpacing:1.8}}>ZENVAULT INBOX</Label><Label style={{color:'#FFFFFF',fontSize:27,fontWeight:'800',letterSpacing:-.8,marginTop:10}}>Jsme na příjmu.</Label><Label style={{color:'#FFFFFF',opacity:.85,fontSize:13,lineHeight:21,marginTop:9}}>Zprávy od banky, osobní nabídky a dokumenty. Všechno na jednom místě.</Label></LinearGradient>
  <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:8}}><Label muted style={{fontSize:12}}>{unreadCount(u)} nepřečtených</Label>{unreadCount(u)>0&&<Pressable accessibilityRole="button" accessibilityLabel="Označit vše jako přečtené" onPress={()=>dispatch({type:'inboxReadAll'},'Schránka je přečtená.')} style={{paddingVertical:12,paddingLeft:12}}><Label style={{color:t.accent,fontSize:12,fontWeight:'700'}}>Přečíst vše</Label></Pressable>}</View>
  <Chips items={['Vše','Nepřečtené','Nabídky','Dokumenty','Archiv']} value={filter} onChange={F}/>
  <View style={{gap:12,marginTop:14}}>{items.map(x=><Pressable key={x.kind+x.id} accessibilityRole="button" accessibilityLabel={'Otevřít zprávu '+x.title} onPress={()=>open(x)} style={{backgroundColor:t.panel,borderWidth:1,borderColor:t.border,borderRadius:22,padding:18}}>
   <View style={{flexDirection:'row',gap:12,alignItems:'flex-start'}}><View style={{width:42,height:42,borderRadius:15,backgroundColor:t.soft,alignItems:'center',justifyContent:'center'}}><Icon name={x.offer?'gift-outline':x.documents?.length?'document-text-outline':x.kind==='bank'?'shield-checkmark-outline':'notifications-outline'} size={21} color={t.accent}/></View><View style={{flex:1}}><View style={{flexDirection:'row',gap:8,alignItems:'center'}}><Label muted style={{fontSize:10,fontWeight:'700',flex:1}}>{x.kind==='bank'?x.department:'Zenvault'}</Label>{!x.readAt&&<View accessibilityLabel="Nepřečtená zpráva" style={{width:7,height:7,borderRadius:4,backgroundColor:t.accent}}/>}</View><Label numberOfLines={2} style={{fontSize:16,lineHeight:22,fontWeight:x.readAt?'600':'800',marginTop:7}}>{x.title}</Label><Label muted numberOfLines={2} style={{fontSize:12,lineHeight:19,marginTop:6}}>{x.body||'Otevřít detail oznámení'}</Label><Label muted style={{fontSize:10,marginTop:11}}>{messageDate(x.date)}{x.documents?.length?' · '+x.documents.length+(x.documents.length===1?' příloha':x.documents.length<5?' přílohy':' příloh'):''}{x.priority==='important'?' · Důležité':''}</Label></View></View>
  </Pressable>)}</View>
  {!items.length&&<Panel style={{marginTop:18}}><Icon name="mail-open-outline" size={30} color={t.accent}/><Label style={{fontSize:20,fontWeight:'700',marginTop:15}}>Tady máš čisto.</Label><Label muted style={{lineHeight:21,marginTop:8}}>V této složce zatím nejsou žádné zprávy.</Label></Panel>}
 </View>;
}
export function Documents({u,ui,dispatch}){
 const {Panel,Label,Row,Chips}=ui,[selected,S]=useState(null),[filter,F]=useState('Všechny dokumenty');
 const m=u.bankMessages.find(x=>x.id===selected?.messageId),doc=m?.documents.find(x=>x.id===selected?.documentId);
 if(doc)return <DocumentDetail key={doc.id} u={u} m={m} doc={doc} ui={ui} dispatch={dispatch} onBack={()=>S(null)}/>;
 const items=u.bankMessages.flatMap(m=>(m.documents||[]).map(doc=>({m,doc}))).filter(({doc})=>filter!=='Potvrzené'||u.documents.some(x=>x.documentId===doc.id));
 return <><Label muted style={{lineHeight:22,marginBottom:14}}>Dokumenty doručené bankou a kopie tvých potvrzení. Zůstanou tady i po archivaci zprávy.</Label><Chips items={['Všechny dokumenty','Potvrzené']} value={filter} onChange={F}/><Panel style={{marginTop:15}}>{items.length?items.map(({m,doc})=><Row key={doc.id} icon="document-text-outline" title={doc.title} sub={doc.confirmedAt?'Potvrzeno · '+messageDate(doc.confirmedAt):messageDate(m.date)} onPress={()=>{dispatch({type:'inboxRead',id:m.id,kind:'bank',silent:true});S({messageId:m.id,documentId:doc.id});}}/>):<Label muted>Zatím žádné dokumenty.</Label>}</Panel></>;
}
