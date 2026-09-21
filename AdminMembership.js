import React,{useState} from 'react';
import {View} from 'react-native';
import {membershipStamp} from './AdminMembershipModel';
import {makeId} from './engine';

export default function AdminMembership({data,u,ui,dispatch,onDone}){
 const {t,Panel,Label,Button,Chips,Field,Section}=ui,clients=data.users.filter(x=>!x.parentId);
 const [targetId,Target]=useState(clients.find(x=>x.id===u.id)?.id||clients[0]?.id),[scope,Scope]=useState('all'),[reason,Reason]=useState(''),[review,Review]=useState(null),[error,ErrorText]=useState('');
 const target=clients.find(x=>x.id===targetId),title=x=>x.name+' · '+x.id.slice(-4);
 if(data.mode!=='Administrátor')return <Label muted>Tato funkce vyžaduje režim Administrátor.</Label>;
 if(!target)return <Label muted>Nejprve vytvoř dospělý místní účet.</Label>;
 const check=()=>{if(reason.trim().length<3){ErrorText('Uveď důvod odebrání (alespoň 3 znaky).');return;}Review({type:'adminMembershipRemove',target:target.id,scope,reason:reason.trim(),expected:membershipStamp(target),accepted:true,op:makeId()});ErrorText('');ui.scrollTop?.();};
 return <View testID="admin-membership">
  <Label style={{fontSize:26,fontWeight:'800',marginBottom:13}}>Členství pod kontrolou.</Label>
  <Label muted style={{lineHeight:22,marginBottom:19}}>Odeber pouze trial, nebo celé členství. Změna se provede okamžitě v místním účtu a uloží do historie.</Label>
  {!review&&<Chips items={clients.map(title)} value={title(target)} onChange={v=>{Target(clients.find(x=>title(x)===v).id);Scope('all');ErrorText('');}}/>}
  <Panel style={{marginVertical:17}}><Label style={{fontSize:20,fontWeight:'800'}}>{target.name}</Label><Label muted style={{marginTop:10,lineHeight:23}}>Aktivní plán: {target.tier}{target.planTrial?' · Trial':''}{target.planTrial?'\nPůvodní plán: '+target.planTrial.baseTier:''}</Label></Panel>
  {review?<>
   <Panel style={{borderColor:'#D75269',borderWidth:1}}><Label style={{fontWeight:'800',color:'#B32B46'}}>Potvrzení odebrání</Label><Label style={{marginTop:13,lineHeight:23}}>Nový plán: {review.scope==='trial'?target.planTrial?.baseTier:'Silver'}</Label><Label muted style={{marginTop:12,lineHeight:21}}>{review.reason}</Label><Label muted style={{marginTop:12,lineHeight:21}}>Oprávnění a maximální limity se přizpůsobí novému plánu. Zaplacené designy, body a transakce se nemažou.</Label>{review.scope==='all'&&target.coreMembership&&<Label style={{marginTop:12,lineHeight:21,color:'#B32B46'}}>Ukončí se také místní závazek Core. Záznam zůstane v historii. Nejde o zrušení skutečné externí smlouvy.</Label>}</Panel>
   <Button title={review.scope==='trial'?'Potvrdit odebrání trialu':'Potvrdit odebrání členství'} style={{marginTop:22}} onPress={()=>{if(dispatch(review,'Členství klienta bylo upraveno.'))onDone();else Review(null);}}/>
   <Button title="Zpět bez změny" secondary style={{marginTop:10}} onPress={()=>Review(null)}/>
  </>:<>
   <Section title="Co odebrat"/>
   <Button title="Pouze trial · vrátit původní plán" secondary={scope!=='trial'} disabled={!target.planTrial} onPress={()=>Scope('trial')}/>
   <Button title="Celé členství · přejít na Silver" secondary={scope!=='all'} style={{marginTop:10}} onPress={()=>Scope('all')}/>
   <Label muted style={{marginVertical:15,lineHeight:21}}>Celé členství zahrnuje i aktivní trial; jeho původní plán se už po skončení neobnoví.</Label>
   <Field label="Důvod odebrání" value={reason} onChangeText={Reason} maxLength={300} multiline/>
   {!!error&&<Label accessibilityRole="alert" style={{color:'#B32B46',marginTop:10}}>{error}</Label>}
   <Button title="Zkontrolovat odebrání" disabled={target.tier==='Silver'&&!target.planTrial} onPress={check} style={{marginTop:20}}/>
  </>}
 </View>;
}
