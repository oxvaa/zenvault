import React from 'react';
import {View,Text,Image,Pressable} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {MERCHANT_TEMPLATES,merchantById} from './MerchantCatalog';

// Bundled official artwork: native Snack never has to fetch a logo at render time.
const LOGOS={
 'hbo-max':{source:require('./assets/brands/hbo-max.png'),background:'#080808',width:.78,height:.69},
 netflix:{source:require('./assets/brands/netflix-symbol.png'),background:'#080808',width:1,height:1},
 'disney-plus':{source:require('./assets/brands/disney-plus.png'),background:'#002938',width:1,height:1},
 alza:{source:require('./assets/brands/alza.png'),background:'#006DC2',width:.85,height:.7},
 kaufland:{source:require('./assets/brands/kaufland.png'),background:'#FFFFFF',width:.83,height:.83},
 allegro:{source:require('./assets/brands/allegro.png'),background:'#FFFFFF',width:1,height:1},
};
export const MerchantIcon=React.memo(function MerchantIcon({merchant,size=42}){
 const m=typeof merchant==='string'?merchantById(merchant):merchant,art=LOGOS[m?.id];
 if(m?.id==='apple')return <View testID="merchant-logo-apple" accessibilityLabel="Logo Apple" style={{width:size,height:size,borderRadius:Math.round(size*.29),backgroundColor:'#F4F4F4',alignItems:'center',justifyContent:'center',flexShrink:0}}><Ionicons name="logo-apple" size={size*.68} color="#111111"/></View>;
 if(!art)return null;
 return <View testID={'merchant-logo-'+m.id} style={{width:size,height:size,borderRadius:Math.round(size*.29),backgroundColor:art.background,overflow:'hidden',alignItems:'center',justifyContent:'center',flexShrink:0}}><Image accessibilityLabel={'Logo '+m.name} source={art.source} resizeMode="contain" fadeDuration={0} style={{width:size*art.width,height:size*art.height}}/></View>;
});
export function MerchantTemplates({t,onSelect,selected}){
 return <View testID="merchant-templates" style={{flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between',gap:9,marginVertical:8}}>{MERCHANT_TEMPLATES.map(m=><Pressable key={m.id} testID={'merchant-template-'+m.id} accessibilityRole="button" accessibilityLabel={'Šablona '+m.name} accessibilityState={{selected:selected===m.id}} onPress={()=>onSelect(m)} style={({pressed})=>({width:'31%',minHeight:103,paddingVertical:13,paddingHorizontal:4,borderRadius:21,alignItems:'center',justifyContent:'center',gap:10,backgroundColor:selected===m.id?t.soft:t.surface,borderWidth:1.5,borderColor:selected===m.id?t.accent:t.border,opacity:pressed?.75:1})}><MerchantIcon merchant={m}/><Text numberOfLines={1} style={{fontSize:11,fontWeight:'700',color:t.text}}>{m.name}</Text></Pressable>)}</View>;
}
