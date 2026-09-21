import React from 'react';
import {View,Text} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {prestigePlan,PRESTIGE_PLANS} from './PrestigePlans';
import {builderRoute} from './Membership';

export default function PrestigeCenter({u,ui,go,onOpen,dispatch}){
 const {t,Panel,Label,Button,Section,Row}=ui,plan=prestigePlan(u.tier);
 if(!plan)return <Panel><Label style={{fontSize:30,fontWeight:'800'}}>Prestige Circle.</Label><Label muted style={{lineHeight:23,marginVertical:18}}>Dvě nejvyšší úrovně nad Business. Nové kolekce, privátní služby a prostor pro velké plány.</Label>{PRESTIGE_PLANS.map(p=><Button key={p.name} title={'Objevit '+p.name+' · '+p.price.toLocaleString('cs-CZ')+' Kč / měsíc'} onPress={()=>onOpen('tiers')} style={{marginTop:10}}/>)}</Panel>;
 const interest=u.serviceRequests.find(r=>r.kind==='Equity Circle'&&r.plan===u.tier);
 return <View testID="prestige-lounge">
  <LinearGradient colors={plan.colors} start={{x:0,y:0}} end={{x:1,y:1}} style={{padding:27,borderRadius:30,marginBottom:23,overflow:'hidden'}}><View pointerEvents="none" style={{position:'absolute',right:-55,top:-30,width:190,height:190,borderRadius:100,borderWidth:30,borderColor:'#FFFFFF10'}}/><Text style={{color:'#FFFFFFCF',fontSize:10,fontWeight:'800',letterSpacing:2}}>ZENVAULT® · ABOVE & BEYOND</Text><Text style={{color:'#FFFFFF',fontSize:36,fontWeight:'800',letterSpacing:-1.5,marginTop:14}}>{plan.name}</Text><Text style={{color:'#FFFFFF',lineHeight:22,marginTop:12}}>Tvůj přístup do nejvyššího patra.</Text></LinearGradient>
  <View style={{flexDirection:'row',gap:10,marginBottom:18}}>{[[plan.cashback*100+' %','cashback'],[plan.points+'×','body'],[plan.maxLimit/100000000+' mil.','limit Kč / den']].map(([v,label])=><Panel key={label} style={{flex:1,padding:12}}><Label adjustsFontSizeToFit numberOfLines={1} style={{fontSize:22,fontWeight:'800'}}>{v}</Label><Label muted style={{fontSize:10,marginTop:5}}>{label}</Label></Panel>)}</View>
  <Label muted style={{fontSize:12,lineHeight:20}}>Cashback platí u vybraných obchodníků. Limit je denní maximum jedné karty; vlastní limit nastavíš v Card Controls.</Label>
  <Button title={'Otevřít '+plan.name+' Atelier'} onPress={()=>go(builderRoute(u.tier))} style={{marginTop:22}}/>
  <Section title="Equity Circle"/>
  <Panel><Label muted style={{fontSize:10,fontWeight:'800',letterSpacing:1.3}}>NÁVRH PODÍLOVÉHO PROGRAMU</Label><Label style={{fontSize:43,fontWeight:'800',letterSpacing:-1,marginTop:13}}>až {plan.equity}</Label><Label style={{fontSize:15,fontWeight:'700',marginTop:7}}>akcií Zenvault® Bank & Co.</Label><Label muted style={{lineHeight:22,marginTop:16}}>Možnost budoucí individuální nabídky. Podíl není garantovaný, nejde o připsané akcie ani příslib výnosu. Získání podílu vyžaduje samostatnou nabídku a smlouvu. Aktivace plánu ani trial žádné akcie nepřevádí.</Label><Label muted style={{lineHeight:21,fontSize:12,marginTop:12}}>Tato aplikace pouze ukládá místní zájem o program. Neodesílá investiční pokyn ani skutečnou žádost bance.</Label><Button title={interest?'Zájem uložen v profilu':'Projevit nezávazný zájem'} secondary disabled={!!interest||!!u.planTrial} onPress={()=>dispatch({type:'equityInterest'},'Nezávazný zájem je uložený v profilu.')} style={{marginTop:20}}/>{u.planTrial&&<Label muted style={{lineHeight:20,fontSize:12,marginTop:10}}>Equity Circle není součástí zkušebního období.</Label>}</Panel>
  <Section title="Privátní ekosystém"/><Panel><Row icon="diamond-outline" title="Osobní manager a concierge" sub={'Priorita '+plan.name} onPress={()=>go('private')}/><Row icon="briefcase-outline" title="Business workspace" sub="Firemní cashflow, týmové karty a expenses" onPress={()=>go('business')}/><Row icon="gift-outline" title="Odměny a cashback" onPress={()=>go('rewards')}/><Row icon="options-outline" title="Vyšší limity a Card Controls" onPress={()=>go('controls')}/></Panel>
 </View>;
}
