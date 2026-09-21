import React,{useState} from 'react';
import {View,Text,Pressable,Linking} from 'react-native';

// Identification data verified on the banks' official websites, 2026-09-16.
// This is Zenvault's product support list, not a market-wide instant-payment registry.
const BANKS=[
 {name:'Air Bank a.s.',code:'3030',bic:'AIRACZPP',ico:'29045371',address:'Evropská 2690/17, 160 00 Praha 6',source:'https://www.airbank.cz/co-vas-nejvic-zajima/jake-udaje-mam-predat-tomu-kdo-mi-posila-zahranicni-platbu/'},
 {name:'Raiffeisenbank a.s.',code:'5500',bic:'RZBCCZPP',ico:'49240901',address:'Hvězdova 1716/2b, 140 78 Praha 4',source:'https://www.rb.cz/o-nas/kontakty'},
];

export default function SupportedBanks({dark=false}){
 const [linkError,setLinkError]=useState(false);
 const text=dark?'#F6FAFF':'#132235',muted=dark?'#BDCDDE':'#526477',accent=dark?'#9FD5FF':'#165EA6',border=dark?'#30455C':'#DFE8F1';
 const openSource=async url=>{setLinkError(false);try{await Linking.openURL(url);}catch{setLinkError(true);}};
 return <View testID="supported-banks">
  <Text style={{fontSize:12,fontWeight:'800',letterSpacing:1.4,color:accent,marginBottom:8}}>OKAMŽITÉ PLATBY · CZK</Text>
  <Text style={{fontSize:15,lineHeight:23,color:muted,marginBottom:20}}>Přehled bank zařazených do podpory okamžitých plateb v Zenvaultu pro tuzemské platby v korunách.</Text>
  {BANKS.map(bank=><View key={bank.code} style={{borderWidth:1,borderColor:border,borderRadius:22,padding:18,backgroundColor:dark?'#192C41':'#F8FBFF',marginBottom:14}}>
   <Text accessibilityRole="header" style={{fontSize:20,fontWeight:'800',color:text,marginBottom:16}}>{bank.name}</Text>
   <View style={{flexDirection:'row',flexWrap:'wrap',gap:12,marginBottom:16}}>
    <View style={{flexGrow:1,minWidth:100}}><Text style={{fontSize:12,color:muted,marginBottom:4}}>Kód banky</Text><Text selectable style={{fontSize:26,fontWeight:'800',letterSpacing:1,color:accent}}>{bank.code}</Text></View>
    <View style={{flexGrow:1,minWidth:125}}><Text style={{fontSize:12,color:muted,marginBottom:4}}>SWIFT / BIC</Text><Text selectable style={{fontSize:18,fontWeight:'700',color:text,lineHeight:32}}>{bank.bic}</Text></View>
   </View>
   <Text selectable style={{fontSize:13,color:muted,lineHeight:21}}>IČO: {bank.ico}</Text>
   <Text selectable style={{fontSize:13,color:muted,lineHeight:21,marginTop:4}}>Sídlo: {bank.address}</Text>
   <Pressable accessibilityRole="link" accessibilityLabel={'Oficiální informace — '+bank.name} accessibilityHint="Otevře oficiální web banky v prohlížeči." onPress={()=>openSource(bank.source)} style={{minHeight:44,justifyContent:'center',marginTop:8}}>
    <Text style={{fontSize:14,fontWeight:'700',color:accent,textDecorationLine:'underline'}}>Oficiální informace ↗</Text>
   </Pressable>
  </View>)}
  <View testID="other-banks-note" style={{padding:17,borderRadius:18,backgroundColor:dark?'#182F49':'#EDF6FF',borderWidth:1,borderColor:dark?'#385F84':'#C4DFFD',marginTop:4}}>
   <Text style={{color:accent,fontSize:15,fontWeight:'800',marginBottom:7}}>Další české a slovenské banky</Text>
   <Text style={{color:accent,fontSize:14,lineHeight:22}}>Okamžité platby do ostatních českých a slovenských bank zatím v Zenvaultu nepodporujeme. Pracujeme na rozšíření podpory, abychom je v budoucnu zpřístupnili i pro další banky.</Text>
  </View>
  {linkError&&<Text accessibilityRole="alert" style={{color:dark?'#FFB2B8':'#A92135',fontSize:14,lineHeight:22,marginTop:12}}>Oficiální stránku se nepodařilo otevřít. Zkus to prosím znovu.</Text>}
  <Text style={{fontSize:12,lineHeight:19,color:muted,marginTop:16,marginBottom:4}}>Identifikační údaje ověřeny 16. 9. 2026 na oficiálních webech bank.</Text>
 </View>;
}
