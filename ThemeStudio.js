import React,{useState,useMemo,memo} from 'react';
import {View,Text,Pressable,ScrollView,StyleSheet,TextInput} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {Ionicons} from '@expo/vector-icons';
import {APP_THEMES,THEME_GROUPS,themeTokens,canUseTheme} from './ThemeCatalog';

function Motif({theme:m,dark,small=false}){
 const tint=dark?m.glow:m.accent,opacity=dark?.18:.1,side=small?130:310;
 const base={position:'absolute',right:small?-20:-55,top:small?-30:-45,width:side,height:side};
 if(m.shape==='dots'||m.shape==='checker')return <View style={[base,{opacity,flexDirection:'row',flexWrap:'wrap',transform:[{rotate:'-18deg'}]}]}>{Array.from({length:16},(_,i)=><View key={i} style={{width:side/4,height:side/4,borderRadius:m.shape==='dots'?side:5,backgroundColor:(i+Math.floor(i/4))%2?tint:'transparent'}}/>)}</View>;
 if(m.shape==='arc')return <View style={[base,{opacity}]}>{[0,1,2,3].map(i=><View key={i} style={{position:'absolute',top:i*side*.16,left:i*side*.06,width:side*.85,height:side*.85,borderRadius:side,borderWidth:small?3:8,borderColor:tint}}/>)}</View>;
 if(m.shape==='cloud')return <View style={[base,{opacity}]}>{[0,1,2,3,4].map(i=><View key={i} style={{position:'absolute',left:i*side*.17,top:(i%2)*side*.14,width:side*.56,height:side*.56,borderRadius:side,backgroundColor:tint}}/>)}</View>;
 if(m.shape==='bloom'||m.shape==='leaf')return <View style={[base,{opacity,transform:[{rotate:'-20deg'}]}]}>{[0,1,2,3].map(i=><View key={i} style={{position:'absolute',left:side*.28,top:0,width:side*.44,height:side,borderRadius:side*.45,backgroundColor:tint,transform:[{rotate:(i*45)+'deg'}]}}/>)}</View>;
 if(m.shape==='grid')return <View style={[base,{opacity,transform:[{rotate:'-18deg'}]}]}>{[0,1,2,3,4].map(i=><React.Fragment key={i}><View style={{position:'absolute',left:i*side/4,top:0,bottom:0,width:1,backgroundColor:tint}}/><View style={{position:'absolute',top:i*side/4,left:0,right:0,height:1,backgroundColor:tint}}/></React.Fragment>)}</View>;
 if(m.shape==='wave'||m.shape==='streak')return <View style={[base,{opacity,transform:[{rotate:m.shape==='wave'?'-30deg':'-50deg'}]}]}>{[0,1,2].map(i=><LinearGradient key={i} colors={[tint,m.glow+'08']} style={{position:'absolute',left:i*side*.25,top:-side*.1,width:side*.28,height:side*1.6,borderRadius:side*.3}}/>)}</View>;
 if(m.shape==='prism')return <View style={[base,{opacity,transform:[{rotate:'-24deg'}]}]}>{[0,1,2].map(i=><View key={i} style={{position:'absolute',left:i*side*.13,top:i*side*.11,width:side*.68,height:side*.68,borderRadius:side*.16,borderWidth:small?10:25,borderColor:tint}}/>)}</View>;
 return <View style={[base,{opacity,transform:[{rotate:'-25deg'}]}]}>{[0,1,2].map(i=><View key={i} style={{position:'absolute',left:i*side*.12,top:i*side*.12,width:side*(1-i*.24),height:side*(m.shape==='sun'?1-i*.24:.68-i*.17),borderRadius:side,borderWidth:small?8:18,borderColor:tint}}/>)}</View>;
}
export function ThemeBackdrop({theme,dark,glass=true}){if(theme.forceLight)return null;return <View pointerEvents="none" style={[StyleSheet.absoluteFillObject,{overflow:'hidden'}]}><LinearGradient colors={[dark?theme.panel:theme.soft,(dark?theme.night:theme.light)+'00']} start={{x:1,y:0}} end={{x:0,y:1}} style={{position:'absolute',right:0,top:0,width:'100%',height:560}}/>{glass&&<><View style={{position:'absolute',right:-155,top:75,width:360,height:490,borderRadius:230,borderWidth:1,borderColor:dark?'#FFFFFF0C':'#FFFFFFAE',transform:[{rotate:'-28deg'}]}}/><View style={{position:'absolute',right:-150,top:130,width:330,height:465,borderRadius:230,borderWidth:35,borderColor:dark?'#FFFFFF03':'#FFFFFF30',transform:[{rotate:'-28deg'}]}}/><View style={{position:'absolute',left:-90,top:530,width:230,height:230,borderRadius:120,borderWidth:1,borderColor:dark?'#FFFFFF08':'#FFFFFFB0'}}/></>}</View>;}
const MiniPreview=memo(function MiniPreview({theme,dark,hero=false}){
 const t=themeTokens(theme,dark);
 return <View style={{height:hero?180:118,backgroundColor:t.bg,borderRadius:hero?23:17,overflow:'hidden',padding:hero?18:12}}>
  <Motif theme={theme} dark={t.dark} small/>
  <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}><Text style={{fontSize:hero?17:11,fontWeight:'800',letterSpacing:-.6,color:t.text}}>zenvault®</Text><View style={{backgroundColor:t.soft,width:hero?25:15,height:hero?25:15,borderRadius:20}}/></View>
  <Text style={{color:t.muted,fontSize:hero?10:7,marginTop:hero?15:10}}>Celkový zůstatek</Text>
  <Text style={{color:t.text,fontSize:hero?27:18,fontWeight:'800',letterSpacing:-.6,marginTop:4}}>••• ••• Kč</Text>
  <View style={{flexDirection:'row',gap:5,marginTop:hero?16:10}}>{[0,1,2].map(i=><View key={i} style={{height:hero?24:14,flex:1,borderRadius:8,backgroundColor:i===0?t.button:t.soft}}/>)}</View>
  {hero&&<View style={{backgroundColor:t.panel,position:'absolute',right:17,bottom:19,padding:9,borderRadius:14}}><Ionicons name={theme.icon} size={21} color={t.accent}/></View>}
 </View>;
});
export default function ThemeStudio({selected,dark,u,t,onSelect,onRewards,onUnlimited}){
 const [group,setGroup]=useState('Vše'),[previewDark,setPreviewDark]=useState(dark),[query,setQuery]=useState('');
 const themes=useMemo(()=>APP_THEMES.filter(m=>(group==='Vše'||(group==='Nové'?m.edition==='new':m.group===group))&&m.name.toLowerCase().includes(query.trim().toLowerCase())),[group,query]);
 const label={color:t.text},muted={color:t.muted};
 return <View>
  <Text style={[muted,{fontSize:10,fontWeight:'700',letterSpacing:2,marginBottom:8}]}>THEME STUDIO · 33</Text>
  <Text style={[label,{fontWeight:'800',fontSize:29,letterSpacing:-1}]}>Změň barvy. Zůstaň svůj.</Text>
  <Text style={[muted,{lineHeight:21,fontSize:13,marginTop:8,marginBottom:18}]}>16 nových atmosfér a exkluzivní Unlimited Monochrome. Jeden dotek promění celý tvůj Zenvault.</Text>
  <MiniPreview theme={selected} dark={previewDark} hero/>
  <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginVertical:14}}><View style={{flex:1}}><Text style={[label,{fontWeight:'700',fontSize:16}]}>{selected.name}</Text><Text style={[muted,{fontSize:11,marginTop:4}]}>{selected.forceLight?'Aktivní · vždy světlý':'Aktivní motiv'}</Text></View><View style={{flexDirection:'row',gap:5}}>{[false,true].map(v=><Pressable key={String(v)} accessibilityRole="button" accessibilityLabel={v?'Tmavý náhled motivů':'Světlý náhled motivů'} accessibilityState={{selected:previewDark===v}} onPress={()=>setPreviewDark(v)} style={{padding:12,borderRadius:24,backgroundColor:previewDark===v?t.button:t.soft}}><Ionicons name={v?'moon-outline':'sunny-outline'} size={18} color={previewDark===v?'#FFF':t.accent}/></Pressable>)}</View></View>
  <View style={{flexDirection:'row',alignItems:'center',gap:10,backgroundColor:t.soft,borderRadius:18,paddingHorizontal:14}}><Ionicons name="search-outline" size={18} color={t.muted}/><TextInput accessibilityLabel="Hledat motiv" placeholder="Najdi svoji atmosféru" placeholderTextColor={t.muted} value={query} onChangeText={setQuery} autoCorrect={false} style={{flex:1,color:t.text,height:46,fontSize:13}}/>{!!query&&<Pressable accessibilityRole="button" accessibilityLabel="Vymazat hledání motivu" onPress={()=>setQuery('')} style={{padding:10}}><Ionicons name="close" size={18} color={t.muted}/></Pressable>}</View>
  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{gap:7,paddingVertical:14}}>{THEME_GROUPS.map(g=><Pressable key={g} accessibilityRole="button" accessibilityLabel={'Kategorie '+g} accessibilityState={{selected:group===g}} onPress={()=>setGroup(g)} style={{paddingHorizontal:14,paddingVertical:11,borderRadius:22,backgroundColor:group===g?t.button:t.soft}}><Text style={{color:group===g?'#FFF':t.accent,fontSize:12,fontWeight:'700'}}>{g}</Text></Pressable>)}</ScrollView>
  <Text accessibilityLiveRegion="polite" style={[muted,{fontSize:11,marginBottom:12}]}>{themes.length} motivů · klepnutím nastavíš</Text>
  <View style={{flexDirection:'row',flexWrap:'wrap',gap:12}}>{themes.map(m=>{const locked=!canUseTheme(u,m),active=selected.id===m.id;return <Pressable testID={'theme-option-'+m.id} key={m.id} accessibilityRole="button" accessibilityLabel={'Motiv '+m.name} accessibilityState={{selected:active}} onPress={()=>locked?(m.exclusive?onUnlimited():onRewards()):onSelect(m.id)} style={{width:'48%',flexGrow:1,maxWidth:'49%',padding:4,borderWidth:1.5,borderColor:active?t.accent:t.border,borderRadius:22,backgroundColor:t.panel}}>
   <MiniPreview theme={m} dark={previewDark}/><View style={{paddingHorizontal:7,paddingVertical:10}}><Text numberOfLines={2} style={[label,{fontWeight:'700',fontSize:12,lineHeight:17,minHeight:34}]}>{m.name}</Text><View style={{flexDirection:'row',justifyContent:'space-between',marginTop:6}}><Text style={[muted,{fontSize:10}]}>{m.exclusive?'Unlimited / MAX':m.id==='candy'&&!locked&&!u.unlocks?.includes('theme')?'V ceně MAX':locked?'300 bodů':active?'Nastaveno':m.edition==='new'?'NOVINKA':m.group}</Text><Ionicons name={locked?'lock-closed-outline':active?'checkmark-circle':'color-palette-outline'} size={13} color={active?t.accent:t.muted}/></View></View>
  </Pressable>;})}</View>
  {!themes.length&&<Text style={[muted,{padding:20,textAlign:'center'}]}>Žádný motiv neodpovídá hledání.</Text>}
  <Text style={[muted,{fontSize:11,lineHeight:18,marginTop:18}]}>31 motivů je v ceně všech plánů. Candy Sky odemkneš za 300 bodů v Rewards; s MAX je v ceně. Unlimited Monochrome je součástí Unlimited ∞ a MAX: bílé prostředí, černé akcenty a bílý text na černých tlačítkách. Tento motiv zůstává vždy světlý; ostatní se řídí nastavením Vzhledu.</Text>
 </View>;
}
