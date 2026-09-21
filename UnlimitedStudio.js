import {prestigePlan,PRESTIGE_MAX_TIER} from './PrestigePlans';
import {isUnlimitedTier} from './Membership';
import {PRESTIGE_MOTIFS,PRESTIGE_MAX_MOTIFS,randomDisplayNumber} from './UnlimitedCatalog';
import React,{useState,useRef} from 'react';
import {View,Text,Pressable,Image} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {UNLIMITED_PRICE,UNLIMITED_BENEFITS,MAX_TIER,MAX_PRICE,MAX_BENEFITS,canBuildCards,tierLabel} from './Membership';
import {MAX_MOTIFS,MAX_ADDONS,motifCharge,UNLIMITED_MOTIFS,STATIC_EDGES,unlimitedMotif,parseDisplayNumber,formatDisplayNumber} from './UnlimitedCatalog';
import {cardArtwork} from './CardArtwork';
import {makeId} from './engine';

function PlanHero({tier,mono}){
 const max=tier===MAX_TIER,prestige=prestigePlan(tier);
 return <LinearGradient colors={mono?['#FFFFFF','#F4F4F4']:prestige?prestige.colors:max?['#160F19','#452442','#22162C']:['#141626','#263F64','#3D2255']} start={{x:0,y:0}} end={{x:1,y:1}} style={{borderRadius:25,padding:24,overflow:'hidden'}}>
  <View pointerEvents="none" style={{position:'absolute',width:220,height:220,borderRadius:110,borderWidth:1,borderColor:mono?'#E0E0E0':'#FFFFFF17',right:-100,top:-85}}/>
  <Text style={{color:mono?'#656565':max?'#F2ADD6':'#ADCFFF',fontSize:10,fontWeight:'800',letterSpacing:2}}>{prestige?'ZENVAULT · PRESTIGE CIRCLE':'ZENVAULT MEMBERSHIP'}</Text>
  <Text style={{color:mono?'#000000':'#FFFFFF',fontSize:32,fontWeight:'800',letterSpacing:-1,marginTop:12}}>{tierLabel(tier)}</Text>
  <Text style={{color:mono?'#656565':'#D3DFEE',fontSize:15,lineHeight:23,marginTop:10}}>{prestige?prestige.tag:max?'Všechno, co miluješ. Na maximum.':'Více prostoru. Vlastní podpis.'}</Text>
  <Text style={{color:mono?'#000000':'#FFFFFF',fontSize:24,fontWeight:'700',marginTop:20}}>{(prestige?prestige.price:max?MAX_PRICE:UNLIMITED_PRICE).toLocaleString('cs-CZ')} Kč<Text style={{fontSize:13,fontWeight:'500'}}> / měsíc</Text></Text>
 </LinearGradient>;
}

export default function UnlimitedStudio({u,ui,dispatch,renderCard,card,plan,onSaved,onMembership,initialCollection}){
 const {t,Panel,Label,Button,Section,Field,Chips}=ui;
 const tier=card?.tier||plan||(isUnlimitedTier(u.tier)?u.tier:'Unlimited'),prestige=prestigePlan(tier),max=tier===MAX_TIER||!!prestige;
 const initial=unlimitedMotif(card?.builder?.motif,tier);
 const [motif,M]=useState(initial.id),[edge,E]=useState(card?.builder?.edge||'hologram'),[color,C]=useState(card?.builder?.color||STATIC_EDGES[0].color);
 const [number,N]=useState(formatDisplayNumber(card?.displayNumber||('000000000000'+(card?.last||'0000')))),[kind,K]=useState(card?.type||'Virtuální'),[network,S]=useState(card?.network||'Mastercard');
 const [layout,L]=useState(card?.builder?.layout||initial.layout||(card?'framed':'full'));
 const [collection,Collection]=useState(initialCollection==='art'||initial.price?'Art Editions · 899 Kč':PRESTIGE_MAX_MOTIFS.some(m=>m.id===initial.id)?'Prestige MAX · 3':PRESTIGE_MOTIFS.some(m=>m.id===initial.id)?'Prestige · 2':initial.id.startsWith('max-')?'MAX · 10':'Unlimited · 12');
 const saving=useRef(false),op=useRef(makeId()),[review,Review]=useState(null);
 const selectedMotif=unlimitedMotif(motif,tier),price=motifCharge(card,selectedMotif);
 const preview={...card,tier,type:kind,network,builder:{motif,edge,color,layout},displayNumber:parseDisplayNumber(number)||undefined,last:card?.last||'0000'};
 const benefits=prestige?prestige.benefits:max?MAX_BENEFITS:UNLIMITED_BENEFITS;
 if(!canBuildCards(u,tier))return <>
  <PlanHero tier={tier} mono={t.mono}/><View style={{marginVertical:20}}>{renderCard(preview)}</View>
  <Panel><Label style={{fontSize:21,fontWeight:'800',marginBottom:14}}>{prestige?'Vstup do Prestige Circle.':max?'Tvůj MAX level.':'Nad úrovní Ultra.'}</Label>{benefits.map(b=><Label key={b} muted style={{fontSize:14,lineHeight:23,marginBottom:10}}>✓ {b}</Label>)}</Panel>
  {card&&<Label muted style={{lineHeight:22,marginTop:16}}>Tvůj uložený design zůstává zachovaný. Další úpravy vyžadují aktivní {tierLabel(tier)}{max?'':' nebo Unlimited MAX'}.</Label>}
  <Button title={'Získat '+tierLabel(tier)} style={{marginTop:20}} onPress={()=>onMembership(tier)}/>
 </>;
 const submit=action=>{if(saving.current)return;saving.current=true;const ok=dispatch(action,action.purchaseConsent?'Art Edition je zakoupená a karta uložená.':card?'Design karty byl uložen.':tierLabel(tier)+' karta byla přidána.');if(ok){Review(null);onSaved?.();}else saving.current=false;};
 const save=()=>{const action={type:'buildCard',tier,id:card?.id,motif,edge,color,layout,displayNumber:number,cardType:kind,network,op:op.current};if(price){Review({...action,quotedPrice:price,purchaseConsent:true});ui.scrollTop?.();}else submit(action);};
 if(review)return <View testID="art-edition-checkout">
  <Label style={{color:t.accent,fontSize:10,fontWeight:'800',letterSpacing:1.5,marginBottom:10}}>MAX ART EDITIONS · JEDNORÁZOVÝ NÁKUP</Label>
  <Label style={{fontSize:29,fontWeight:'800',letterSpacing:-.8,marginBottom:21}}>{selectedMotif.name}</Label>
  {renderCard(preview)}
  <Panel style={{marginTop:20}}><Label muted style={{fontSize:12}}>Cena designu pro tuto kartu</Label><Label style={{fontSize:35,fontWeight:'800',marginTop:10}}>899 Kč</Label><Label muted style={{lineHeight:22,fontSize:13,marginTop:13}}>Odečte se z tvého účtu v CZK. Každá další karta potřebuje vlastní nákup. Úpravy čísla, okraje a kompozice tohoto zakoupeného motivu jsou bez poplatku. Nejde o objednávku doručení fyzické karty.</Label><Label style={{fontSize:13,lineHeight:22,marginTop:15}}>Zůstatek: {(u.balances.CZK/100).toLocaleString('cs-CZ')} Kč{'\n'}{u.balances.CZK>=price?'Po nákupu: '+((u.balances.CZK-price)/100).toLocaleString('cs-CZ')+' Kč':'Nedostatek prostředků na účtu CZK.'}</Label></Panel>
  <Button title="Koupit design za 899 Kč" disabled={u.balances.CZK<price} onPress={()=>submit(review)} style={{marginTop:22}}/>
  <Button title="Zpět do editoru" secondary onPress={()=>Review(null)} style={{marginTop:10}}/>
 </View>;

 const gallery=(items,title)=> <><Section title={title}/><View style={{flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between',gap:12}}>{items.map(m=>{
  const source=cardArtwork({tier,builder:{motif:m.id}}).source;
  return <Pressable key={m.id} testID={'motif-option-'+m.id} accessibilityRole="button" accessibilityLabel={'Motiv '+m.name} accessibilityState={{selected:motif===m.id}} onPress={()=>{M(m.id);L(m.layout||'full');}} style={{width:'48%',padding:8,borderRadius:19,borderWidth:2,borderColor:motif===m.id?t.accent:t.border,backgroundColor:t.panel,alignItems:'center'}}>
   <View style={{width:'100%',height:104,borderRadius:12,backgroundColor:m.base,alignItems:'center',justifyContent:'center',overflow:'hidden'}}><Image accessible={false} source={typeof source==='string'?{uri:source}:source} resizeMode="contain" fadeDuration={0} style={{width:110,height:104}}/></View>
   <Label numberOfLines={2} style={{fontSize:12,fontWeight:'700',marginTop:9,textAlign:'center',minHeight:30}}>{m.name}{motif===m.id?' ✓':''}</Label>{m.price&&<Label style={{fontSize:11,fontWeight:'800',color:t.accent,marginBottom:3}}>{motifCharge(card,m)?'899 Kč / karta':'Na této kartě zakoupeno'}</Label>}
  </Pressable>;
 })}</View></>;
 return <View testID="unlimited-builder">
  <Label muted style={{fontSize:10,fontWeight:'800',letterSpacing:1.7,marginBottom:8}}>{prestige?tier.toUpperCase()+' · ATELIER':max?'UNLIMITED MAX · ATELIER':'UNLIMITED ∞ · CARD BUILDER'}</Label>
  <Label style={{fontSize:29,fontWeight:'800',letterSpacing:-.8,marginBottom:8}}>{prestige?'Signature without limits.':max?'Maximum osobnosti.':'Karta podle tebe.'}</Label>
  <Label muted style={{fontSize:14,lineHeight:22,marginBottom:20}}>{prestige?(tier===PRESTIGE_MAX_TIER?'Pět Prestige motivů a 22 Unlimited / MAX motivů v ceně.':'Dva Prestige motivy a 22 Unlimited / MAX motivů v ceně.')+' Art Editions zůstávají za 899 Kč za kartu.':max?'22 motivů v ceně. A tři Art Editions pro výjimečný podpis.':'Tvůj motiv. Tvoje číslo. Tvůj podpis na každém detailu.'}</Label>
  {renderCard(preview)}
  {max&&<View style={{flexDirection:'row',gap:8,marginTop:15}}>{[[(prestige?prestige.cashback*100:5)+' %','cashback'],[(prestige?prestige.points:5)+'×','body'],[(prestige?prestige.maxLimit/100000000:10)+' mil.','limit Kč / den']].map(([value,label])=><View key={label} style={{flex:1,backgroundColor:t.soft,borderRadius:16,paddingVertical:13,paddingHorizontal:6,alignItems:'center'}}><Label numberOfLines={1} adjustsFontSizeToFit minimumFontScale={.75} style={{fontSize:value==='10 mil.'?16:20,fontWeight:'800'}}>{value}</Label><Label muted style={{fontSize:9,marginTop:5}}>{label}</Label></View>)}</View>}
  {max&&<Label muted style={{fontSize:11,lineHeight:18,marginTop:9}}>Cashback u vybraných obchodníků. Maximální denní limit každé karty; aktuální limit nastavíš v Card Controls.</Label>}
  {!card&&<View style={{marginTop:16}}><Chips items={['Virtuální','Fyzická']} value={kind} onChange={K}/><Chips items={['Mastercard','Visa']} value={network} onChange={S}/></View>}
  {max&&<View style={{marginTop:18}}><Chips items={[...(tier===PRESTIGE_MAX_TIER?['Prestige MAX · 3']:[]),...(prestige?['Prestige · 2']:[]),'MAX · 10','Unlimited · 12','Art Editions · 899 Kč']} value={collection} onChange={Collection}/></View>}
  {prestige&&collection==='Prestige MAX · 3'?gallery(PRESTIGE_MAX_MOTIFS,'01 · Prestige MAX Signature'):prestige&&collection==='Prestige · 2'?gallery(PRESTIGE_MOTIFS,'01 · Prestige Crimson Collection'):max&&collection==='Art Editions · 899 Kč'?gallery(MAX_ADDONS,'Art Editions · 899 Kč za každou kartu'):max&&collection==='MAX · 10'?gallery(MAX_MOTIFS,'01 · MAX Collection — 10 motivů'):gallery(UNLIMITED_MOTIFS,max?'01 · Unlimited Collection v ceně':'01 · Vyber motiv')}
  <Section title="Kompozice motivu"/>
  <Chips items={['Přes celou kartu','Celý motiv','V rámečku']} value={layout==='full'?'Přes celou kartu':layout==='fit'?'Celý motiv':'V rámečku'} onChange={v=>L(v==='Přes celou kartu'?'full':v==='Celý motiv'?'fit':'framed')}/>
  <Label muted style={{fontSize:12,lineHeight:20,marginTop:8}}>Celoplošná kompozice vyplní kartu až k okrajům. Celý motiv zachová ilustraci bez ořezu. Rámeček oddělí motiv od údajů.</Label>
  <Section title="02 · Vlastní číslo"/>
  <Field label="Zobrazené číslo karty" value={number} onChangeText={N} keyboardType="number-pad" placeholder="0000 0000 0000 0000" maxLength={19}/>
  <Button title="Vygenerovat náhodné číslo" icon="shuffle-outline" secondary onPress={()=>N(formatDisplayNumber(randomDisplayNumber()))} style={{marginBottom:12}}/>
  <Label muted style={{fontSize:12,lineHeight:20,marginBottom:8}}>Zadej 16 číslic. Generátor vytvoří nové místní číslo s prefixem 0000; nejde o platební údaje. Měníš číslo zobrazené na kartě v aplikaci; platební údaje v karetní síti se tím nemění.</Label>
  <Section title="03 · Okraj karty"/>
  <View style={{flexDirection:'row',gap:10}}><Button style={{flex:1}} title="Hologram" secondary={edge!=='hologram'} onPress={()=>E('hologram')}/><Button style={{flex:1}} title="Static" secondary={edge!=='static'} onPress={()=>E('static')}/></View>
  <Label muted style={{fontSize:12,lineHeight:20,marginTop:12}}>{edge==='hologram'?'Duhový chromový lem s jemnými přechody.':'Jednobarevný lem. Vyber si svůj odstín.'}</Label>
  {edge==='static'&&<View style={{flexDirection:'row',flexWrap:'wrap',gap:10,marginTop:14}}>{STATIC_EDGES.map(e=><Pressable key={e.color} accessibilityRole="button" accessibilityLabel={'Okraj '+e.name} accessibilityState={{selected:color===e.color}} onPress={()=>C(e.color)} style={{flexDirection:'row',alignItems:'center',gap:7,padding:10,borderRadius:16,borderWidth:1,borderColor:color===e.color?t.accent:t.border,backgroundColor:t.panel,minHeight:44}}><View style={{width:18,height:18,borderRadius:9,backgroundColor:e.color,borderWidth:.5,borderColor:t.border}}/><Label style={{fontSize:12,fontWeight:'600'}}>{e.name}{color===e.color?' ✓':''}</Label></Pressable>)}</View>}
  {!!selectedMotif.price&&<Panel style={{marginTop:20}}><Label style={{fontWeight:'800',fontSize:17}}>{price?'Art Edition · 899 Kč':'Tento motiv je na kartě zakoupený'}</Label><Label muted style={{fontSize:12,lineHeight:20,marginTop:10}}>{price?'Cena platí za jeden design na jedné kartě. Před odečtením částky ještě vše potvrdíš.':'Změny čísla, okraje a kompozice jsou bez dalšího poplatku.'}</Label></Panel>}
  <Button title={price?'Pokračovat k nákupu za 899 Kč':prestige?(card?'Uložit '+tier+' kartu':'Vytvořit '+tier+' kartu'):card?(max?'Uložit MAX kartu':'Uložit Unlimited kartu'):(max?'Vytvořit MAX kartu':'Vytvořit Unlimited kartu')} onPress={save} style={{marginTop:25}}/>
 </View>;
}
