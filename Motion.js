import React,{createContext,useContext,useEffect,useRef,useState} from 'react';
import {AccessibilityInfo,Animated,Easing,Pressable} from 'react-native';

const MotionContext=createContext(true);
export const useReducedMotion=()=>useContext(MotionContext);
export function MotionProvider({children}){
 const [reduced,setReduced]=useState(true);
 useEffect(()=>{let live=true;AccessibilityInfo.isReduceMotionEnabled().then(v=>{if(live)setReduced(v);}).catch(()=>{});const sub=AccessibilityInfo.addEventListener('reduceMotionChanged',setReduced);return()=>{live=false;sub.remove();};},[]);
 return <MotionContext.Provider value={reduced}>{children}</MotionContext.Provider>;
}
export function Enter({children,style}){
 const reduced=useReducedMotion(),v=useRef(new Animated.Value(1)).current;
 useEffect(()=>{if(reduced){v.setValue(1);return;}v.setValue(0);const a=Animated.timing(v,{toValue:1,duration:280,easing:Easing.out(Easing.cubic),useNativeDriver:true});a.start();return()=>a.stop();},[reduced,v]);
 return <Animated.View style={[style,{opacity:v,transform:[{translateY:v.interpolate({inputRange:[0,1],outputRange:[10,0]})}]}]}>{children}</Animated.View>;
}
const AP=Animated.createAnimatedComponent(Pressable);
export function Touch({children,style,onPressIn,onPressOut,...props}){
 const [pressed,setPressed]=useState(false),reduced=useReducedMotion(),scale=useRef(new Animated.Value(1)).current;
 const move=value=>{scale.stopAnimation();if(reduced)scale.setValue(1);else Animated.timing(scale,{toValue:value,duration:140,easing:Easing.out(Easing.quad),useNativeDriver:true}).start();};
 useEffect(()=>()=>scale.stopAnimation(),[scale]);
 return <AP {...props} onPressIn={e=>{setPressed(true);move(.976);onPressIn?.(e);}} onPressOut={e=>{setPressed(false);move(1);onPressOut?.(e);}} style={[typeof style==='function'?style({pressed}):style,{transform:[{scale}]}]}>{children}</AP>;
}
