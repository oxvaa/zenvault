import React from 'react';
import {Image,View} from 'react-native';
// Original Netflix RGB PNG; official WBD HBO Max SVG rendered to PNG.
// Kept as bundled assets so the service logos do not depend on external requests.
const logos={Netflix:require('./assets/brands/netflix.png'),'HBO Max':require('./assets/brands/hbo-max.png')};
export default function ServiceLogo({name}){
 return <View style={{height:98,justifyContent:'center',alignItems:'flex-start',marginTop:5,marginBottom:5}}><Image testID={name==='Netflix'?'promo-netflix-logo':'promo-hbo-max-logo'} accessibilityLabel={'Oficiální logo '+name} source={logos[name]} resizeMode="contain" style={{width:name==='Netflix'?214:190,height:name==='Netflix'?90:98}}/></View>;
}
