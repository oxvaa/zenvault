import React,{useMemo,useState} from 'react';
import {View,Pressable} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {RATES,fmt} from './engine';
import {tierLabel} from './Membership';

const totalBalance=u=>Object.entries(u?.balances||{}).reduce((n,[c,v])=>n+v*(RATES[c]||1),0);
const riskLabel=u=>{
 const negative=Object.values(u?.balances||{}).some(v=>v<0);
 if(negative)return 'Záporný zůstatek';
 if((u?.pendingTransfers||[]).some(x=>x.status==='waitingFunds'))return 'Čeká na prostředky';
 if((u?.security?.failedAttempts||0)>0)return 'Pokusy o přihlášení';
 return 'Bez aktivního flagu';
};
const auditItems=u=>[
 ...(u.adminLog||[]).map(x=>({...x,kind:'Admin'})),
 ...(u.security?.history||[]).map(x=>({...x,kind:'Security'})),
 ...(u.pointsLog||[]).map(x=>({id:x.id,name:x.name,date:x.date,kind:'Points',sub:x.note})),
 ...(u.planLog||[]).map(x=>({id:x.id,name:x.name||x.action||'Membership update',date:x.date,kind:'Plan',sub:x.status})),
].filter(x=>x?.date).sort((a,b)=>new Date(b.date)-new Date(a.date));

export default function AdminStudio6({data,u,ui,onSheet,onGo,dispatch}){
 const {t,Panel,Label,Button,Icon,Section,Row,Chips}=ui;
 const [clientId,setClientId]=useState(u.id);
 const target=data.users.find(x=>x.id===clientId)||u;
 const choices=data.users.map(x=>x.name+' · '+x.id.slice(-4));
 const selectedLabel=target.name+' · '+target.id.slice(-4);
 const total=Math.round(totalBalance(target));
 const negative=Object.entries(target.balances||{}).filter(([,v])=>v<0);
 const audit=useMemo(()=>auditItems(target).slice(0,14),[target]);
 const action=(type,defaults={})=>onSheet(type,{}, {user:target.id,...defaults});
 if(data.mode!=='Administrátor')return <Panel><Icon name="lock-closed-outline" color={t.accent} size={36}/><Label style={{fontSize:23,fontWeight:'900',marginTop:14}}>Admin Studio 6 Beta je zamčené.</Label><Label muted style={{lineHeight:22,marginVertical:12}}>Přepni aplikaci do režimu Administrátor v Nastavení. Admin Studio pracuje pouze s místními testovacími profily.</Label><Button title="Otevřít nastavení" onPress={()=>onSheet('mode')}/></Panel>;
 return <>
  <LinearGradient colors={t.dark?['#160004','#3B0008','#7A0013']:['#FFF2F4','#FFE1E5','#FFFFFF']} start={{x:0,y:0}} end={{x:1,y:1}} style={{borderRadius:31,padding:24,borderWidth:1,borderColor:t.dark?'#FF365540':'#E6002318'}}>
   <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'flex-start',gap:16}}><View style={{flex:1}}><Label style={{fontSize:10,fontWeight:'900',letterSpacing:2.3,color:t.dark?'#FF9AAA':'#C70020'}}>INTERNAL · BETA</Label><Label style={{fontSize:33,fontWeight:'900',letterSpacing:-1.5,marginTop:8}}>Admin Studio 6 Beta</Label><Label muted style={{lineHeight:22,marginTop:9}}>Detailní klientská konzole pro finance, membership, karty, komunikaci, bezpečnost a auditní stopu.</Label></View><View style={{width:50,height:50,borderRadius:18,backgroundColor:t.surface,alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:t.border}}><Icon name="construct-outline" color={t.accent} size={25}/></View></View>
  </LinearGradient>

  <Section title="Klient"/>
  <Chips items={choices} value={selectedLabel} onChange={value=>{const next=data.users.find(x=>x.name+' · '+x.id.slice(-4)===value);if(next)setClientId(next.id);}}/>

  <View style={{flexDirection:'row',gap:10,flexWrap:'wrap',marginTop:13}}>
   {[['NET POSITION',fmt(total),'Součet měn v CZK','wallet-outline'],['PLAN',tierLabel(target.tier),target.planTrial?'Trial aktivní':'Standardní členství','diamond-outline'],['RISK',riskLabel(target),negative.length?negative.length+' záporné měny':'lokální kontrola','shield-outline'],['ACTIVITY',String((target.transactions||[]).length),(target.pendingTransfers||[]).length+' čekajících','pulse-outline']].map(([label,value,sub,icon])=><Panel key={label} style={{width:'48%',minWidth:150}}><Icon name={icon} color={t.accent}/><Label muted style={{fontSize:9,fontWeight:'900',letterSpacing:1.4,marginTop:12}}>{label}</Label><Label style={{fontSize:19,fontWeight:'900',marginTop:5}}>{value}</Label><Label muted style={{fontSize:10,lineHeight:16,marginTop:4}}>{sub}</Label></Panel>)}
  </View>

  <Section title="Financial controls"/>
  <Panel>
   <Row icon="create-outline" title="Změnit zůstatek" sub="Kladný i záporný zůstatek, povinný důvod pro dluh" value={negative.length?'DLUH':''} onPress={()=>action('adminBalance',{currency:'CZK',balanceSign:(target.balances.CZK||0)<0?'Záporný':'Kladný',op:Date.now().toString(36)})}/>
   <Row icon="swap-horizontal-outline" title="Vytvořit bankovní transakci" sub="Příchozí / odchozí, delay, kategorie, poznámka" onPress={()=>action('adminTx',{currency:'CZK',direction:'Příchozí',delayDays:0,op:Date.now().toString(36)})}/>
   <Row icon="sparkles-outline" title="Upravit body" sub="Nový bodový zůstatek + auditní poznámka" value={(target.points||0).toLocaleString('cs-CZ')} onPress={()=>action('adminPoints',{points:String(target.points||0),op:Date.now().toString(36)})}/>
  </Panel>

  <Section title="Účty a závazky"/>
  <Panel>{Object.entries(target.balances||{}).map(([currency,value])=><Row key={currency} title={currency} value={fmt(value,currency)} sub={value<0?'Záporný zůstatek · bankovní pohledávka v prototypu':'Disponibilní lokální zůstatek'}/>)}{negative.length>0&&<Label style={{fontSize:11,lineHeight:18,color:'#C9263E',marginTop:12}}>Záporný zůstatek je v Admin Studio 6 evidován s konkrétním důvodem. Jde o lokální prototyp, nikoli skutečný úvěr nebo pohledávku.</Label>}</Panel>

  <Section title="Membership & entitlements"/>
  <Panel><Row icon="diamond-outline" title="Membership / trial" sub={'Aktivní: Zenvault '+tierLabel(target.tier)} onPress={()=>onSheet('adminMembership',{targetId:target.id})}/><Row icon="sparkles-outline" title="Theme & benefit context" sub="Zkontrolovat tarifní funkce a motivy" onPress={()=>onGo('plans5')}/></Panel>

  <Section title="Cards & risk"/>
  <Panel><Row icon="card-outline" title="Karty klienta" value={String((target.cards||[]).length)} sub={(target.cards||[]).filter(c=>c.frozen).length+' zmrazených'} onPress={()=>target.id===u.id?onGo('cards5'):null}/><Row icon="snow-outline" title="Zmrazit všechny karty" sub="Okamžitý interní safety control" onPress={()=>dispatch({type:'adminFreezeCards',target:target.id,frozen:true,op:Date.now().toString(36)},'Všechny karty klienta byly zmrazeny.')}/><Row icon="refresh-outline" title="Resetovat bezpečnostní lock" sub="Vynuluje neúspěšné pokusy a lockout, nemění heslo" onPress={()=>dispatch({type:'adminSecurityReset',target:target.id,op:Date.now().toString(36)},'Bezpečnostní lock klienta byl resetován.')}/></Panel>

  <Section title="Communication & records"/>
  <Panel><Row icon="mail-outline" title="Bankovní komunikace" sub="Zprávy jménem Zenvault Bank & Co." onPress={()=>onSheet('adminMessages',{targetId:target.id})}/><Row icon="documents-outline" title="Dokumenty" value={String((target.documents||[]).length)} sub="Lokální dokumentové centrum" onPress={()=>target.id===u.id?onSheet('documents'):null}/><Row icon="notifications-outline" title="Oznámení" value={String((target.notifications||[]).length)} sub="Historie klientských notifikací" onPress={()=>target.id===u.id?onSheet('notifications'):null}/></Panel>

  <Section title="Client detail"/>
  <Panel><Row title="Client ID" value={target.id.slice(-12)}/><Row title="Totožnost" value={target.onboarding?.verificationStatus==='verified'?'Ověřena':'Neověřena / lokální'}/><Row title="Karty" value={String((target.cards||[]).length)}/><Row title="Transakce" value={String((target.transactions||[]).length)}/><Row title="Pending transfers" value={String((target.pendingTransfers||[]).length)}/><Row title="Subscriptions" value={String((target.subscriptions||[]).length)}/><Row title="Vaults" value={String((target.goals||[]).length)}/><Row title="Security events" value={String((target.security?.history||[]).length)}/></Panel>

  <Section title="Audit timeline"/>
  <Panel>{audit.map(e=><Row key={(e.kind||'e')+(e.id||e.date)} title={e.name||e.action||'Admin event'} sub={(e.kind||'Event')+' · '+new Date(e.date).toLocaleString('cs-CZ')+(e.sub?' · '+e.sub:'')}/>) }{!audit.length&&<Label muted>Timeline je zatím prázdná.</Label>}</Panel>
 </>;
}
