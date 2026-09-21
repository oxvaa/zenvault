import React,{useMemo} from 'react';
import {View,Text,Pressable,ScrollView,useWindowDimensions} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {CURRENCIES,RATES,fmt} from './engine';
import {transactionFeed} from './PaymentTiming';
import {tierLabel} from './Membership';
import {MerchantIcon} from './MerchantUI';
import {merchantForTransaction} from './MerchantCatalog';
import {financialForecast,intelligenceItems,netWorth} from './Zenvault5';
import {Touch} from './Motion';

export default function Home5({u,data,ui,go,onOpen,renderCard,currency,setCurrency,onTransaction,onCommand}){
 const {t,Panel,Label,Icon,Section,Button,Row}=ui,hidden=data.hide,mode=u.homeMode||'full';
 const f=useMemo(()=>financialForecast(u),[u.transactions,u.subscriptions,u.balances,u.budget]);
 const recent=useMemo(()=>transactionFeed(u).slice(0,5),[u.transactions,u.pendingTransfers]);
 const worth=useMemo(()=>netWorth(u),[u.balances,u.goals,u.investments]);
 const {width}=useWindowDimensions();
 const tileWidth=width>=900?'31.5%':'48%';
 const money=n=>hidden?'••••••':fmt(n);
 const actions=[['arrow-up-outline','Odeslat','transfer'],['arrow-down-outline','Vyžádat','requests'],['card-outline','Karty','cards5'],['search-outline','Command','command']];
 return <>
  <View style={{marginBottom:18}}><View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}><View><Label muted style={{fontSize:10,fontWeight:'800',letterSpacing:2.2}}>ZENVAULT 5</Label><Label style={{fontSize:29,fontWeight:'900',letterSpacing:-1.2,marginTop:4}}>Financial Command Center</Label></View><Pressable accessibilityRole="button" accessibilityLabel="Otevřít Zenvault Command" onPress={onCommand} style={{width:47,height:47,borderRadius:18,backgroundColor:t.surface,borderWidth:1,borderColor:t.border,alignItems:'center',justifyContent:'center'}}><Icon name="search" color={t.accent}/></Pressable></View></View>
  <LinearGradient colors={t.featureGradient} start={{x:0,y:0}} end={{x:1,y:1}} style={{borderRadius:31,padding:23,borderWidth:1,borderColor:t.border,overflow:'hidden'}}>
   <View style={{position:'absolute',right:-40,top:-55,width:190,height:190,borderRadius:100,borderWidth:35,borderColor:'#FFFFFF24'}}/>
   <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}><Label muted style={{fontSize:11,fontWeight:'700'}}>CELKEM V ZENVAULTU</Label><Pressable onPress={()=>go('intelligence5')} style={{padding:8,borderRadius:18,backgroundColor:t.surface}}><Icon name="sparkles" color={t.accent} size={18}/></Pressable></View>
   <Label numberOfLines={1} adjustsFontSizeToFit minimumFontScale={.55} style={{fontSize:Math.min(44,width/9),fontWeight:'900',letterSpacing:-1.5,marginTop:8}}>{money(worth)}</Label>
   <Label muted style={{fontSize:11,lineHeight:18,marginTop:6}}>Účty + Vaults + ručně sledované investice</Label>
   <View style={{flexDirection:'row',gap:10,marginTop:21}}><View style={{flex:1,backgroundColor:t.surface,borderRadius:19,padding:14,borderWidth:1,borderColor:t.border}}><Label muted style={{fontSize:9,fontWeight:'800',letterSpacing:1.3}}>FORECAST</Label><Label style={{fontSize:17,fontWeight:'800',marginTop:7}}>{money(f.projectedBalance)}</Label><Label muted style={{fontSize:9,marginTop:4}}>konec měsíce</Label></View><View style={{flex:1,backgroundColor:t.surface,borderRadius:19,padding:14,borderWidth:1,borderColor:t.border}}><Label muted style={{fontSize:9,fontWeight:'800',letterSpacing:1.3}}>MĚSÍČNÍ TEMPO</Label><Label style={{fontSize:17,fontWeight:'800',marginTop:7}}>{money(f.projectedSpend)}</Label><Label muted style={{fontSize:9,marginTop:4}}>odhad výdajů</Label></View></View>
  </LinearGradient>

  <View style={{flexDirection:'row',gap:9,marginTop:20,marginBottom:10}}>{actions.map(([icon,label,id],i)=><Touch key={id} accessibilityRole="button" accessibilityLabel={label} onPress={()=>id==='command'?onCommand():go(id)} style={{flex:1,alignItems:'center',gap:8}}><View style={{height:52,width:52,borderRadius:19,backgroundColor:i===0?t.button:t.surface,borderWidth:1,borderColor:i===0?t.button:t.border,alignItems:'center',justifyContent:'center'}}><Icon name={icon} color={i===0?'#fff':t.accent} size={22}/></View><Label style={{fontSize:10,fontWeight:'700'}}>{label}</Label></Touch>)}</View>

  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{gap:7,paddingVertical:11}}>{CURRENCIES.map(c=><Pressable key={c} onPress={()=>setCurrency(c)} style={{borderRadius:20,paddingVertical:8,paddingHorizontal:13,backgroundColor:currency===c?t.text:t.soft}}><Text style={{fontSize:11,fontWeight:'800',color:currency===c?t.bg:t.muted}}>{c} · {hidden?'•••':fmt(u.balances[c]||0,c)}</Text></Pressable>)}</ScrollView>

  <Section title="For you" action="Intelligence" onPress={()=>go('intelligence5')}/>
  {intelligenceItems(u).slice(0,2).map(x=><Pressable key={x.title} onPress={()=>go('intelligence5')} style={{marginBottom:10}}><Panel style={{padding:18}}><View style={{flexDirection:'row',gap:12,alignItems:'center'}}><View style={{width:40,height:40,borderRadius:15,backgroundColor:t.soft,alignItems:'center',justifyContent:'center'}}><Icon name={x.icon} color={t.accent}/></View><View style={{flex:1}}><Label style={{fontWeight:'800',fontSize:14}}>{x.title}</Label><Label muted numberOfLines={2} style={{fontSize:11,lineHeight:17,marginTop:4}}>{x.body}</Label></View><Icon name="chevron-forward" size={15} color={t.muted}/></View></Panel></Pressable>)}

  {mode==='full'&&<><Section title="Money OS"/>
  <View style={{flexDirection:'row',flexWrap:'wrap',gap:10,justifyContent:'space-between'}}>{[
   ['cards5','card-outline','Card Center 5','Karty, travel a subscriptions'],
   ['sharedVaults5','people-outline','Shared Vaults','Společné cíle a role'],
   ['subscriptions5','repeat-outline','Subscriptions','Známé další platby'],
   ['purchase5','receipt-outline','Purchase Hub','Platby, receipts a merchant detail'],
   ['moments5','flash-outline','Moments','Milníky a důležité změny'],
   ['security5','shield-checkmark-outline','Security','Identity & emergency'],
   ['plans5','diamond-outline','Plan Center','Membership na jednom místě'],
   ...(data.mode==='Administrátor'?[['admin5','construct-outline','Admin Studio 6 Beta','Detailní interní klientské nástroje']]:[])
  ].map(([id,icon,title,sub])=><Touch key={id} accessibilityRole="button" accessibilityLabel={title} onPress={()=>go(id)} style={{width:tileWidth,minHeight:132,backgroundColor:t.surface,borderWidth:1,borderColor:t.border,borderRadius:24,padding:17}}><View style={{width:39,height:39,borderRadius:14,backgroundColor:t.soft,alignItems:'center',justifyContent:'center'}}><Icon name={icon} size={20} color={t.accent}/></View><Label style={{fontSize:14,fontWeight:'800',marginTop:13}}>{title}</Label><Label muted style={{fontSize:10,lineHeight:16,marginTop:5}}>{sub}</Label></Touch>)}</View></>}

  <Section title="Tvoje karta" action="Card Center" onPress={()=>go('cards5')}/>
  {u.cards[0]?<Pressable onPress={()=>go('cards5')}>{renderCard(u.cards[0])}</Pressable>:<Panel><Label muted>Přidej svou první kartu.</Label></Panel>}

  {mode!=='important'&&<><Section title="Poslední pohyby" action="Vše" onPress={()=>onOpen('Platby')}/>
  <Panel style={{paddingVertical:4}}>{recent.length?recent.map(x=><Row key={x.id} leading={merchantForTransaction(x)?<MerchantIcon merchant={merchantForTransaction(x)}/>:null} icon={x.value>0?'arrow-down-outline':'arrow-up-outline'} title={x.name} sub={x.category+' · '+new Date(x.dueAt||x.date).toLocaleDateString('cs-CZ',{day:'numeric',month:'short'})} onPress={()=>onTransaction(x)} right={<Label style={{fontSize:13,fontWeight:'800',color:x.value>0?t.positive:t.text}}>{hidden?'••••':(x.value>0?'+':'')+fmt(x.value,x.currency)}</Label>}/>):<View style={{padding:20}}><Label muted>Zatím žádné pohyby.</Label></View>}</Panel></>}

  <Pressable onPress={()=>go('widgets')} style={{alignItems:'center',paddingTop:18}}><Label muted style={{fontSize:11,fontWeight:'700'}}>Režim {mode==='important'?'Důležité':mode==='details'?'Details':'Full'} · Upravit přehled</Label></Pressable>
  <Pressable onPress={()=>go('hub')} style={{alignItems:'center',padding:30}}><Label style={{fontSize:20,fontWeight:'900',letterSpacing:-1}}>zenvault® 5</Label><Label muted style={{fontSize:9,letterSpacing:2.3,marginTop:5}}>YOUR MONEY OS</Label></Pressable>
 </>;
}
