import {isUnlimitedTier} from './Membership';
import React,{useState} from 'react';
import {View,Text,Image,Pressable,StyleSheet} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {Ionicons} from '@expo/vector-icons';
import images,{rollingLoudLogo} from './CardArtAssets';
import UnlimitedCard from './UnlimitedCard';
import {unlimitedMotif} from './UnlimitedCatalog';

export const INK_ART={
 'ultramax-orbit':{name:'Champagne Orbit',base:'#1F1813',accent:'#F4DBA7',ultraMax:'orbit'},
 'ultramax-ribbon':{name:'Cobalt Ribbon',base:'#06162E',accent:'#A7DCFF',ultraMax:'ribbon'},
 'ultramax-prism':{name:'Noir Prism',base:'#111117',accent:'#E6D9FF',ultraMax:'prism'},

 "core-halo":{name:"Core Halo",accent:"#B8F2FF",base:"#081B32",core:"halo"},
 "core-current":{name:"Core Current",accent:"#B9FFDE",base:"#062921",core:"current"},
 "core-pulse":{name:"Core Pulse",accent:"#FFE8BB",base:"#30160E",core:"pulse"},
 "rolling-loud": {name:"Zenvault × Rolling Loud",accent:"#D8F889",base:"#160D25"},
 "cyan": {
  "name": "Cyan Reaper",
  "accent": "#69F1F3",
  "base": "#04191E"
 },
 "lime": {
  "name": "Acid Wings",
  "accent": "#E3F955",
  "base": "#111807"
 },
 "pink": {
  "name": "Pink Phantom",
  "accent": "#FF75B4",
  "base": "#220B19"
 },
 "orange": {
  "name": "Ember Moth",
  "accent": "#FFAC62",
  "base": "#201007"
 },
 "gold-scarab": {
  "name": "Solar Scarab",
  "accent": "#FFE09A",
  "base": "#191207"
 },
 "gold-lion": {
  "name": "Royal Roar",
  "accent": "#F3CA73",
  "base": "#1D1208"
 },
 "platinum-wolf": {
  "name": "Frost Fang",
  "accent": "#B9E5FF",
  "base": "#09121F"
 },
 "platinum-raven": {
  "name": "Moon Raven",
  "accent": "#D1CCFF",
  "base": "#10101C"
 },
 "platinum-serpent": {
  "name": "Mercury Coil",
  "accent": "#D2F2F4",
  "base": "#071519"
 },
 "pro-koi": {
  "name": "Koi Current",
  "accent": "#67EAD9",
  "base": "#10171C"
 },
 "pro-tiger": {
  "name": "Neon Tiger",
  "accent": "#FFA869",
  "base": "#1C0C13"
 },
 "pro-kitsune": {
  "name": "Spirit Fox",
  "accent": "#EA97FF",
  "base": "#160D22"
 },
 "ultra-dragon": {
  "name": "Void Dragon",
  "accent": "#B6A0FF",
  "base": "#0F0C21"
 },
 "ultra-phoenix": {
  "name": "Nova Phoenix",
  "accent": "#FF93B1",
  "base": "#1E0811"
 },
 "ultra-kraken": {
  "name": "Abyss Kraken",
  "accent": "#72EDD6",
  "base": "#07181E"
 },
 "business-falcon": {
  "name": "Emerald Falcon",
  "accent": "#8DE2BA",
  "base": "#071B15"
 },
 "business-panther": {
  "name": "Onyx Panther",
  "accent": "#DCC993",
  "base": "#0B1712"
 },
 "business-stag": {
  "name": "Sovereign Stag",
  "accent": "#A6D8B5",
  "base": "#0D1911"
 },
 "hologram-apex": {
  "name": "Hologram Limited",
  "accent": "#D8FCFF",
  "base": "#080B13"
 }
};
export const CARD_COLLECTIONS={
 "Ultra MAX":["ultramax-orbit","ultramax-ribbon","ultramax-prism"],
 "Core":["core-halo","core-current","core-pulse"],
 "Silver": [
  "cyan",
  "lime",
  "pink"
 ],
 "Gold": [
  "orange",
  "gold-scarab",
  "gold-lion"
 ],
 "Platinum": [
  "platinum-wolf",
  "platinum-raven",
  "platinum-serpent"
 ],
 "Pro": [
  "pro-koi",
  "pro-tiger",
  "pro-kitsune"
 ],
 "Ultra": [
  "ultra-dragon",
  "ultra-phoenix",
  "ultra-kraken"
 ],
 "Business": [
  "business-falcon",
  "business-panther",
  "business-stag"
 ]
};
export const COLLECTION_NAMES={Silver:"Ink Origins",Gold:"Golden Relics",Platinum:"Frozen Legends",Core:"Core Elements","Ultra MAX":"Ultra Max Editions",Pro:"Tokyo Ink",Ultra:"Mythic Afterdark",Business:"Emerald Society",Unlimited:"Unlimited Studio","Unlimited MAX":"MAX Atelier",Prestige:"Prestige Atelier","Prestige MAX":"Prestige MAX Atelier"};
export function cardArtwork(card){if(isUnlimitedTier(card.tier)&&!card.limited&&!card.edition){const art=unlimitedMotif(card.builder?.motif,card.tier);return {...art,source:images[art.id],index:0};}const index=[0,1,2].includes(card.design)?card.design:0;const id=card.edition==='rollingLoud'?'rolling-loud':card.limited?'hologram-apex':(CARD_COLLECTIONS[card.tier]||CARD_COLLECTIONS.Silver)[index];return {...INK_ART[id],id,source:images[id],index};}
export function cardDesignName(card){return cardArtwork(card).name;}

export default function CollectorCard(props){return isUnlimitedTier(props.card.tier)&&!props.card.limited&&!props.card.edition?<UnlimitedCard {...props} art={cardArtwork(props.card)}/>:<InkCard {...props}/>;}
function UltraMaxPattern({art,width,height}){
 const tones=art.ultraMax==='orbit'?['#80663A','#FFF4D2','#B49A69']:art.ultraMax==='ribbon'?['#0E3D82','#C2F4FF','#397BC7']:['#24202D','#E8DDF1','#6C5C7D'];
 return <View testID={'ultramax-pattern-'+art.ultraMax} pointerEvents="none" style={[StyleSheet.absoluteFillObject,{overflow:'hidden'}]}>
  <LinearGradient colors={[art.base,tones[0]]} start={{x:0,y:0}} end={{x:1,y:1}} style={StyleSheet.absoluteFillObject}/>
  {art.ultraMax==='orbit'?<View style={{position:'absolute',right:-width*.13,top:-height*.37,width:height*1.6,height:height*1.6,transform:[{rotate:'-33deg'},{scaleX:.66}]}}>{[0,1,2].map(i=><LinearGradient key={i} colors={tones} start={{x:0,y:0}} end={{x:1,y:1}} style={{position:'absolute',top:i*36,bottom:i*36,right:i*36,left:i*36,borderRadius:300,padding:18}}><View style={{flex:1,borderRadius:300,backgroundColor:art.base}}/></LinearGradient>)}</View>:art.ultraMax==='ribbon'?<View style={{position:'absolute',right:-width*.13,top:-height*.38,width:width*.9,height:height*1.9,transform:[{rotate:'-36deg'}]}}>{[0,1,2,3].map(i=><LinearGradient key={i} colors={tones} start={{x:0,y:0}} end={{x:1,y:.4}} style={{position:'absolute',left:i*57,width:42,top:i%2?22:0,height:height*1.9,borderRadius:90}}/>)}</View>:<View style={{position:'absolute',right:-28,top:-50,width:height*1.45,height:height*1.45,transform:[{rotate:'32deg'}]}}>{[0,1,2,3].map(i=><LinearGradient key={i} colors={tones} start={{x:0,y:0}} end={{x:1,y:.7}} style={{position:'absolute',left:i*24,top:i*24,right:i*24,bottom:i*24,padding:13,borderRadius:3}}><View style={{flex:1,backgroundColor:art.base}}/></LinearGradient>)}</View>}
 </View>;
}
function CorePattern({art,width,height}){
 const colors={halo:['#D7F6FF','#69BDEA','#2865AF'],current:['#D3FFE8','#62E1BE','#187C70'],pulse:['#FFF1C4','#F5AA67','#B35B69']}[art.core];
 return <View testID={'core-pattern-'+art.core} pointerEvents="none" style={[StyleSheet.absoluteFillObject,{overflow:'hidden'}]}>
  <LinearGradient colors={[art.base,colors[2]]} start={{x:0,y:.3}} end={{x:1,y:1}} style={StyleSheet.absoluteFillObject}/>
  {art.core==='halo'?<View style={{position:'absolute',right:-width*.12,top:-height*.26,width:height*1.55,height:height*1.55,transform:[{rotate:'-25deg'},{scaleX:.83}]}}>{[0,1,2,3].map(i=><LinearGradient key={i} colors={i%2?[art.base,colors[2],art.base]:colors} start={{x:0,y:0}} end={{x:1,y:1}} style={{position:'absolute',top:i*23,left:i*23,right:i*23,bottom:i*23,borderRadius:300,padding:10}}><View style={{flex:1,borderRadius:300,backgroundColor:art.base}}/></LinearGradient>)}</View>:art.core==='current'?<View style={{position:'absolute',right:-32,top:-height*.35,width:width*.72,height:height*1.9,transform:[{rotate:'36deg'}]}}>{[0,1,2,3,4].map(i=><LinearGradient key={i} colors={colors} start={{x:0,y:0}} end={{x:1,y:1}} style={{position:'absolute',left:i*42,top:i%2?27:0,width:28,height:height*1.9,borderRadius:60}}/>)}</View>:<View style={{position:'absolute',right:-25,top:-30,width:height*1.18,height:height*1.18,transform:[{rotate:'-32deg'}]}}>{[0,1,2,3].map(i=><LinearGradient key={i} colors={colors} start={{x:0,y:0}} end={{x:1,y:1}} style={{position:'absolute',top:i*23,left:i*23,right:i*23,bottom:i*23,borderRadius:45-i*7,padding:9}}><View style={{flex:1,borderRadius:35-i*7,backgroundColor:art.base}}/></LinearGradient>)}</View>}
 </View>;
}
function InkCard({card,name='',compact=false,renderNetwork}){
 const art=cardArtwork(card),physical=card.type==='Fyzická',rolling=card.edition==='rollingLoud',special=rolling||card.limited;
 const [width,setWidth]=useState(0),[failed,setFailed]=useState(null),[retry,setRetry]=useState(0);
 const height=compact?176:222;
 // Native Image needs a concrete frame; do not rely on absoluteFill sizing.
 const source=typeof art.source==='string'?{uri:art.source}:art.source;
 const edge=rolling?['#D2F481','#9471ED','#C6F08A']:card.limited?['#A1FBFF','#B899FF','#FFA3E8','#EDFFA2','#87F8EB']:physical?['#D8DCE1','#69747B','#C2C8CD']:['#FFFFFF35','#FFFFFF10'];
 return <LinearGradient colors={edge} start={{x:0,y:0}} end={{x:1,y:1}} style={{padding:special?2:physical?1.5:1,borderRadius:25,opacity:card.frozen?.68:1}}>
  <View onLayout={event=>{const next=event.nativeEvent.layout.width;if(next>0)setWidth(next);}} accessibilityLabel={'Zenvault '+card.tier+', '+cardDesignName(card)+', '+card.type+', '+(card.network||'Mastercard')+', '+(card.frozen?'zmrazená':'aktivní')} style={{height,borderRadius:23.5,overflow:'hidden',backgroundColor:art.base}}>
   {width>0&&(art.ultraMax?<UltraMaxPattern art={art} width={width} height={height}/>:art.core?<CorePattern art={art} width={width} height={height}/>:<Image key={art.id+retry} testID="card-illustration" accessible={false} source={source} resizeMode="cover" fadeDuration={0} onLoad={()=>setFailed(null)} onError={()=>setFailed(art.id)} style={{position:'absolute',left:0,top:0,width,height}}/>)}
   <LinearGradient pointerEvents="none" colors={['#00000064','#00000000']} start={{x:0,y:0}} end={{x:1,y:0}} style={StyleSheet.absoluteFillObject}/>
   <LinearGradient pointerEvents="none" colors={['#00000085','#00000000']} style={{position:'absolute',left:0,right:0,top:0,height:66}}/>
   <LinearGradient pointerEvents="none" colors={['#00000000','#000000B8']} style={{position:'absolute',left:0,right:0,bottom:0,height:compact?70:87}}/>
   {!special&&art.index===1&&<View pointerEvents="none" style={{position:'absolute',left:8,right:8,top:8,bottom:8,borderWidth:1,borderColor:art.accent+'5C',borderRadius:17}}/>}
   {!special&&art.index===2&&<View pointerEvents="none" style={{position:'absolute',top:0,bottom:0,left:0,width:4,backgroundColor:art.accent}}/>}
   <View style={{flex:1,padding:compact?17:21}}>
    <View style={styles.row}><Text style={{color:'#FFF',fontWeight:'800',fontSize:compact?22:26,letterSpacing:-1.2}}>zenvault<Text style={{fontWeight:'400',fontSize:14}}>®</Text></Text><View style={{paddingHorizontal:9,paddingVertical:6,borderRadius:8,backgroundColor:'#0000009C',borderWidth:.5,borderColor:art.accent+'75'}}><Text style={{color:art.accent,fontSize:9,fontWeight:'700',letterSpacing:1.6}}>{rolling?'FESTIVAL':card.limited?'HOLOGRAM':(card.tier||'Silver').toUpperCase()}</Text></View></View>
    <View style={{flex:1,justifyContent:'center',alignItems:'flex-start'}}>
     <View style={{flexDirection:'row',alignItems:'center',gap:8}}><LinearGradient colors={physical?['#F1E1BE','#BCA36C','#E7D6A8']:['#E1E9E9','#98ADB0','#D7E0E1']} style={{width:33,height:25,borderRadius:6,overflow:'hidden',borderWidth:.5,borderColor:'#FFF9'}}><View style={{position:'absolute',left:10,right:10,top:0,bottom:0,borderLeftWidth:.6,borderRightWidth:.6,borderColor:'#17232E60'}}/><View style={{position:'absolute',top:8,left:0,right:0,height:8,borderTopWidth:.6,borderBottomWidth:.6,borderColor:'#17232E60'}}/></LinearGradient><Ionicons name="wifi-outline" size={17} color="#FFFFFFBA" style={{transform:[{rotate:'90deg'}]}}/></View>
     {!compact&&<Text style={{color:art.accent,fontSize:8,fontWeight:'700',letterSpacing:1.8,marginTop:11}}>{rolling?'FESTIVAL · AFTERHOURS':card.limited?'PRISMATIC · LIMITED':(COLLECTION_NAMES[card.tier]||'Ink Origins').toUpperCase()+' · 0'+(art.index+1)}</Text>}
    </View>
    <View style={[styles.row,{alignItems:'flex-end'}]}><View style={{flex:1,paddingRight:9}}><Text style={{color:'#FFF',fontSize:compact?12:14,fontWeight:'600',letterSpacing:2.4}}>••••  {card.last||'••••'}</Text><Text numberOfLines={1} style={{color:'#F0F2F5',fontSize:9,letterSpacing:1.15,marginTop:compact?6:9}}>{name.toUpperCase()}</Text></View><View style={{alignItems:'flex-end',gap:5}}>{renderNetwork(card.network||'Mastercard')}<Text style={{color:'#FFFFFFDB',fontSize:8,fontWeight:'600',letterSpacing:.5}}>{card.frozen?'ZMRAZENO':rolling?'ROLLING LOUD':card.limited?'LIMITED EDITION':physical?'METAL · FYZICKÁ':'VIRTUÁLNÍ'}</Text></View></View>
   </View>
   {rolling&&<Image testID="rolling-loud-logo" accessible={false} source={typeof rollingLoudLogo==='string'?{uri:rollingLoudLogo}:rollingLoudLogo} resizeMode="contain" fadeDuration={0} style={{position:'absolute',top:compact?53:67,right:compact?19:25,width:compact?118:144,height:compact?66:80,tintColor:'#FFFFFF'}}/>}
   {failed===art.id&&<Pressable accessibilityRole="button" accessibilityLabel="Znovu načíst ilustraci karty" onPress={()=>{setFailed(null);setRetry(value=>value+1);}} style={{position:'absolute',alignSelf:'center',top:height/2-20,paddingHorizontal:14,paddingVertical:10,borderRadius:12,backgroundColor:'#101C2BF2'}}><Text style={{color:'#FFFFFF',fontSize:12}}>Načíst ilustraci znovu ↻</Text></Pressable>}
   {card.frozen&&<View pointerEvents="none" style={{position:'absolute',right:18,top:'45%',backgroundColor:'#111C2AE8',padding:8,borderRadius:20}}><Ionicons name="snow-outline" size={19} color="#CDECFB"/></View>}
  </View>
 </LinearGradient>;
}
const styles=StyleSheet.create({row:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',gap:8}});
