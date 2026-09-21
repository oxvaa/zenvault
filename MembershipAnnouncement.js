import React,{useEffect,useRef,useState} from 'react';
import {View,Text,Pressable,Modal,ScrollView,useWindowDimensions,Animated} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {Ionicons} from '@expo/vector-icons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useReducedMotion} from './Motion';
import {MerchantIcon} from './MerchantUI';
const slides=[
 {id:'prestige',eyebrow:'ABOVE & BEYOND',title:'Prestige.\nA ještě dál.',description:'Prestige & Prestige MAX. Dvě nejvyšší úrovně Zenvaultu, nad Business.',detail:'Vlastní kolekce karet, privátní péče a vyšší limity. Od 9 999 Kč měsíčně.',button:'Prozkoumat Prestige',colors:['#39204D','#171523'],accent:'#E8CBFF'},
 {id:'promo',eyebrow:'ZENVAULT® MASTERCARD®',title:'Tvůj večer.\nTvoje premiéra.',description:'Netflix nebo HBO Max. Vyber si svůj první měsíc zábavy se Zenvault Mastercard.',detail:'Uložení výběru neaktivuje předplatné. Pokyny k uplatnění zatím nejsou dostupné.',button:'Vybrat Netflix nebo HBO Max',colors:['#18354A','#101C2C'],accent:'#B8E7FF'},
 {id:'apple',eyebrow:'MEET ZENVAULT® × APPLE',title:'Hello, Apple.',description:'Ikonická značka. Nově mezi tvými obchodníky v Zenvaultu.',detail:'Koncept spolupráce. Skutečné oficiální partnerství s Apple není potvrzené.',button:'Objevit Apple',colors:['#272C35','#11141A'],accent:'#FFFFFF'},
];
export default function MembershipAnnouncement({visible,onClose,onExplore,u,mono=false}){
 const reduced=useReducedMotion(),insets=useSafeAreaInsets(),{width,height}=useWindowDimensions();
 const pageWidth=Math.min(width-36,420),bodyHeight=Math.max(60,Math.min(450,height-insets.top-insets.bottom-244));
 const pager=useRef(null),offset=useRef(new Animated.Value(0)).current,[index,Index]=useState(0);
 useEffect(()=>{Index(0);offset.setValue(0);pager.current?.scrollTo({x:0,animated:false});},[visible,pageWidth,offset]);
 const jump=i=>{const n=Math.max(0,Math.min(2,i));Index(n);pager.current?.scrollTo({x:n*pageWidth,animated:!reduced});};
 const settle=e=>Index(Math.max(0,Math.min(2,Math.round(e.nativeEvent.contentOffset.x/pageWidth))));
 if(u.parentId||!visible)return null;
 const ink=mono?'#111111':'#FFFFFF',muted=mono?'#606060':'#CBD0DD';
 const arrow=(label,icon,to,disabled)=><Pressable accessibilityRole="button" accessibilityLabel={label} disabled={disabled} onPress={()=>jump(to)} style={{height:44,width:44,alignItems:'center',justifyContent:'center',opacity:disabled?.2:1}}><Ionicons name={icon} size={20} color={ink}/></Pressable>;
 return <Modal visible transparent animationType={reduced?'none':'fade'} onRequestClose={onClose}><View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'#030712C9',paddingTop:insets.top+12,paddingBottom:insets.bottom+12}}>
  <View testID="membership-announcement" accessibilityViewIsModal style={{width:pageWidth,backgroundColor:mono?'#FFFFFF':'#11141D',borderRadius:31,overflow:'hidden'}}>
   <View style={{height:65,paddingLeft:22,paddingRight:12,flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}><Text style={{fontSize:24,fontWeight:'800',letterSpacing:-1.2,color:ink}}>zenvault®</Text><Pressable accessibilityRole="button" accessibilityLabel="Zavřít oznámení" onPress={onClose} style={{height:44,width:44,alignItems:'center',justifyContent:'center'}}><Ionicons name="close-outline" size={26} color={ink}/></Pressable></View>
   <Animated.ScrollView ref={pager} testID="announcement-carousel" horizontal pagingEnabled snapToInterval={pageWidth} decelerationRate="fast" bounces={false} showsHorizontalScrollIndicator={false} scrollEventThrottle={16} onMomentumScrollEnd={settle} onScrollEndDrag={settle} onScroll={Animated.event([{nativeEvent:{contentOffset:{x:offset}}}],{useNativeDriver:true,listener:settle})} style={{height:bodyHeight,flexGrow:0}}>
    {slides.map((slide,i)=><View key={slide.id} testID={'announcement-slide-'+slide.id} accessibilityElementsHidden={index!==i} importantForAccessibility={index===i?'auto':'no-hide-descendants'} style={{width:pageWidth,height:bodyHeight}}><ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false} contentContainerStyle={{paddingHorizontal:17,paddingBottom:8}}>
     <Animated.View style={{opacity:reduced?1:offset.interpolate({inputRange:[(i-1)*pageWidth,i*pageWidth,(i+1)*pageWidth],outputRange:[.55,1,.55],extrapolate:'clamp'}),transform:[{scale:reduced?1:offset.interpolate({inputRange:[(i-1)*pageWidth,i*pageWidth,(i+1)*pageWidth],outputRange:[.95,1,.95],extrapolate:'clamp'})}]}}>
      <LinearGradient colors={mono?['#F6F6F6','#FFFFFF']:slide.colors} style={{padding:22,borderRadius:24,borderWidth:1,borderColor:mono?'#E6E6E6':'#FFFFFF15',minHeight:bodyHeight-8}}>
       <Text style={{fontSize:9,fontWeight:'800',letterSpacing:1.7,color:mono?'#555555':slide.accent}}>{slide.eyebrow}</Text>
       <View style={{height:105,alignItems:'center',justifyContent:'center',marginVertical:7}}>{i===0?<View style={{flexDirection:'row',alignItems:'center',gap:9}}><Text style={{fontSize:100,lineHeight:110,color:ink}}>∞</Text><View style={{borderRadius:10,padding:9,backgroundColor:mono?'#111111':'#E8CBFF'}}><Text style={{color:mono?'#FFFFFF':'#21122D',fontSize:17,fontWeight:'900',letterSpacing:2}}>MAX</Text></View></View>:i===1?<View style={{flexDirection:'row',alignItems:'center',gap:15}}><MerchantIcon merchant="netflix" size={72}/><Text style={{color:muted,fontSize:21}}>×</Text><MerchantIcon merchant="hbo-max" size={72}/></View>:<Ionicons accessibilityLabel="Apple" name="logo-apple" size={83} color={ink}/>}</View>
       <Text accessibilityRole="header" style={{fontSize:width<360?28:33,lineHeight:width<360?32:37,fontWeight:'800',letterSpacing:-1,color:ink}}>{slide.title}</Text><Text style={{fontSize:14,lineHeight:21,color:muted,marginTop:12}}>{slide.description}</Text><Text style={{fontSize:11,lineHeight:17,color:muted,marginTop:12}}>{slide.detail}</Text>
      </LinearGradient>
     </Animated.View>
    </ScrollView></View>)}
   </Animated.ScrollView>
   <View style={{paddingHorizontal:21,paddingBottom:9}}><View style={{height:45,flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>{arrow('Předchozí oznámení','arrow-back',index-1,index===0)}<View style={{flexDirection:'row'}}>{slides.map((s,i)=><Pressable key={s.id} accessibilityRole="button" accessibilityLabel={'Oznámení '+(i+1)+' ze 3'} accessibilityState={{selected:index===i}} onPress={()=>jump(i)} style={{height:44,width:34,alignItems:'center',justifyContent:'center'}}><View style={{height:5,width:index===i?23:6,borderRadius:4,backgroundColor:index===i?ink:muted,opacity:index===i?1:.4}}/></Pressable>)}</View>{arrow('Další oznámení','arrow-forward',index+1,index===2)}</View>
    <Pressable accessibilityRole="button" accessibilityLabel={slides[index].button} onPress={()=>onExplore(slides[index].id)} style={({pressed})=>({minHeight:49,paddingHorizontal:8,paddingVertical:14,borderRadius:17,alignItems:'center',justifyContent:'center',backgroundColor:mono?'#000000':slides[index].accent,opacity:pressed?.8:1})}><Text style={{fontSize:13,fontWeight:'800',color:mono?'#FFFFFF':'#111827',textAlign:'center'}}>{slides[index].button} ↗</Text></Pressable><Pressable accessibilityRole="button" accessibilityLabel="Pokračovat na přehled" onPress={onClose} style={{minHeight:44,justifyContent:'center',alignItems:'center'}}><Text style={{fontSize:12,color:muted}}>Pokračovat na přehled</Text></Pressable>
   </View>
  </View>
 </View></Modal>;
}
