import React,{useState} from 'react';
import {View,Text,Pressable,Modal,StyleSheet,ScrollView,useWindowDimensions} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {paymentReason} from './PaymentTiming';
import SupportedBanks from './SupportedBanks';

export default function PaymentNote({reason,dark=false,dueAt}){
 const [visible,setVisible]=useState(false),insets=useSafeAreaInsets(),{height}=useWindowDimensions(),r=paymentReason(reason);
 if(!r)return null;
 const color=r.tone==='red'?(dark?'#FFB2B8':'#A92135'):(dark?'#ACD9FF':'#165EA6');
 const bg=r.tone==='red'?(dark?'#3E2029':'#FFF0F2'):(dark?'#182F49':'#EDF6FF');
 return <><View testID={'payment-note-'+r.tone} style={{padding:16,borderRadius:18,backgroundColor:bg,borderWidth:1,borderColor:color+'35',marginVertical:15}}>
  <Text style={{color,fontSize:14,lineHeight:22,fontWeight:'500'}}>{r.text}</Text>
  <Text accessibilityRole="link" onPress={()=>setVisible(true)} style={{color,fontSize:14,lineHeight:22,fontWeight:'700',textDecorationLine:'underline',marginTop:7}}>{r.link}</Text>
 </View><Modal visible={visible} transparent animationType="fade" onRequestClose={()=>setVisible(false)}>
  <View style={{flex:1,justifyContent:'flex-end',backgroundColor:'#07142577'}}>
   <Pressable accessibilityLabel="Zavřít informace o platbě" onPress={()=>setVisible(false)} style={StyleSheet.absoluteFillObject}/>
   <View style={{maxHeight:Math.max(160,height-insets.top-12),paddingTop:24,paddingBottom:Math.max(insets.bottom,16),borderTopLeftRadius:28,borderTopRightRadius:28,backgroundColor:dark?'#132235':'#FFFFFF'}}>
    <Text accessibilityRole="header" style={{fontSize:23,fontWeight:'800',color:dark?'#FFFFFF':'#132235',marginHorizontal:24,marginBottom:16}}>{r.title}</Text>
    <ScrollView style={{flexShrink:1}} contentContainerStyle={{paddingHorizontal:24,paddingBottom:6}} keyboardShouldPersistTaps="handled">
     {r.id==='bank'?<SupportedBanks dark={dark}/>:<Text style={{fontSize:15,lineHeight:24,color:dark?'#CBD9E8':'#526477'}}>{r.info}</Text>}
     {dueAt&&<Text style={{fontSize:14,lineHeight:22,color:dark?'#CBD9E8':'#526477',marginTop:16}}>Předpokládané připsání této platby: {new Date(dueAt).toLocaleString('cs-CZ')}</Text>}
    </ScrollView>
    <Pressable accessibilityRole="button" accessibilityLabel="Rozumím" onPress={()=>setVisible(false)} style={{backgroundColor:r.id==='bank'?(dark?'#9FD5FF':'#165EA6'):color,padding:15,borderRadius:16,alignItems:'center',marginTop:16,marginHorizontal:24}}><Text style={{fontSize:15,fontWeight:'700',color:dark?'#132235':'#FFFFFF'}}>Rozumím</Text></Pressable>
   </View>
  </View>
 </Modal></>;
}
