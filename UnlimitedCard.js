import {MAX_TIER,tierLabel} from './Membership';
import React,{useState} from 'react';
import {View,Text,Image,Pressable} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {Ionicons} from '@expo/vector-icons';
import {STATIC_EDGES,formatDisplayNumber} from './UnlimitedCatalog';

export default function UnlimitedCard({card,art,name='',compact=false,renderNetwork}){
 const [width,W]=useState(0),[failed,F]=useState(false),[retry,R]=useState(0);
 const height=compact?206:248,holo=card.builder?.edge!=='static',edge=card.builder?.color||STATIC_EDGES[0].color;
 const colors=holo?['#86F4FF','#C1ACFF','#FFB2E5','#FFF3AE','#91EBE2']: [edge,edge];
 const layout=card.builder?.layout||art.layout||(art.fullBleed?'full':'framed'),full=layout!=='framed',fit=layout==='fit',light=art.ink!=='#FFFFFF',max=card.tier===MAX_TIER;
 const boxWidth=Math.max(0,width-82),boxHeight=height-128,source=typeof art.source==='string'?{uri:art.source}:art.source;
 return <LinearGradient testID="unlimited-card" colors={colors} start={{x:0,y:0}} end={{x:1,y:1}} style={{padding:4,borderRadius:26,opacity:card.frozen?.65:1}}>
  <View onLayout={e=>W(e.nativeEvent.layout.width)} accessibilityLabel={'Zenvault '+tierLabel(card.tier)+', '+art.name+', '+(holo?'Hologram':'Static')+', '+card.type} style={{height,borderRadius:22,overflow:'hidden',backgroundColor:art.base}}>
   {width>0&&<View pointerEvents="none" testID={fit?'fitted-art':full?'full-bleed-art':'framed-art'} style={{position:'absolute',top:full?0:43,right:full?0:16,width:full?width:boxWidth,height:full?height:boxHeight,overflow:'hidden',alignItems:'center',justifyContent:'center'}}><Image key={art.id+retry+layoutKey(card)} testID="card-illustration" accessible={false} source={source} resizeMode={fit?'contain':full?'cover':'contain'} fadeDuration={0} onLoad={()=>F(false)} onError={()=>F(true)} style={{width:full?width:boxWidth*art.zoom,height:full?height:boxHeight*art.zoom}}/></View>}
   {full&&<><LinearGradient pointerEvents="none" colors={light?['#FFFFFFF2','#FFFFFF00']:['#04070BC9','#04070B00']} style={{position:'absolute',left:0,right:0,top:0,height:75}}/><LinearGradient pointerEvents="none" colors={light?['#FFFFFF00','#FFFFFFED','#FFFFFF']:['#04070B00','#04070BCF','#04070BF0']} style={{position:'absolute',left:0,right:0,bottom:0,height:110}}/></>}
   <View style={{flex:1,padding:compact?16:19}}>
    <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',gap:5}}><Text style={{color:art.ink,fontWeight:'800',fontSize:compact?22:25,letterSpacing:-1}}>zenvault®</Text><Text style={{color:art.ink,fontSize:max?8:9,fontWeight:'800',letterSpacing:max?.6:1}}>{tierLabel(card.tier).toUpperCase()}</Text></View>
    <View pointerEvents="none" style={{flex:1,justifyContent:'center',alignItems:'flex-start'}}><LinearGradient colors={['#F1F2F5','#9BA6B5','#DDE1E8']} style={{width:29,height:23,borderRadius:6,borderWidth:.5,borderColor:'#FFFFFFA0',overflow:'hidden'}}><View style={{position:'absolute',left:10,right:10,top:0,bottom:0,borderLeftWidth:.5,borderRightWidth:.5,borderColor:'#34425590'}}/><View style={{position:'absolute',top:8,left:0,right:0,height:7,borderTopWidth:.5,borderBottomWidth:.5,borderColor:'#34425590'}}/></LinearGradient><Ionicons name={card.frozen?'snow-outline':'wifi-outline'} color={art.ink} size={18} style={{marginTop:9,transform:[{rotate:'90deg'}]}}/></View>
    <Text testID="unlimited-card-number" numberOfLines={1} adjustsFontSizeToFit minimumFontScale={.7} style={{fontSize:compact?13:16,color:art.ink,fontWeight:'700',letterSpacing:compact?1:1.3,marginBottom:10}}>{card.displayNumber?formatDisplayNumber(card.displayNumber):'••••  ••••  ••••  '+(card.last||'0000')}</Text>
    <View style={{flexDirection:'row',alignItems:'flex-end',justifyContent:'space-between',gap:10}}><View style={{flex:1}}><Text numberOfLines={1} style={{color:art.ink,fontSize:8,fontWeight:'600',letterSpacing:1}}>{name.toUpperCase()}</Text><Text style={{color:art.accent,fontSize:7,fontWeight:'700',letterSpacing:1,marginTop:4}}>{card.frozen?'ZMRAZENO':card.disposable?'DISPOSABLE':card.type==='Fyzická'?'METAL · FYZICKÁ':'VIRTUÁLNÍ'} · {holo?'HOLOGRAM':'STATIC'}</Text></View>{renderNetwork(card.network||'Mastercard')}</View>
   </View>
   {failed&&<Pressable accessibilityRole="button" accessibilityLabel="Znovu načíst Unlimited motiv" onPress={()=>{F(false);R(x=>x+1);}} style={{position:'absolute',top:height/2-16,right:16,backgroundColor:'#172337',padding:10,borderRadius:10}}><Text style={{fontSize:12,color:'#FFFFFF'}}>Načíst motiv ↻</Text></Pressable>}
  </View>
 </LinearGradient>;
}

const layoutKey=card=>card.builder?.layout||'default';
