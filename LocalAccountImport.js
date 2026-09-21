import React,{useState} from 'react';
import {View,Text,TextInput,Pressable,ActivityIndicator} from 'react-native';
import {readLocalAccount} from './LocalAccount';

export default function LocalAccountImport({onImport,busy}) {
  const [source,setSource]=useState(''),[preview,setPreview]=useState(null),[error,setError]=useState(''),[consent,setConsent]=useState(false);
  const review=()=>{try{setPreview(readLocalAccount(source));setError('');}catch(e){setError(e.message);}};
  return <View testID="local-account-import">
    <Text style={{fontSize:33,fontWeight:'700',color:'#14263C',letterSpacing:-1,marginBottom:12}}>Tvůj místní účet.</Text>
    <Text style={{fontSize:14,lineHeight:22,color:'#627891',marginBottom:22}}>Zkopíruj celý obsah připraveného souboru účtu a vlož ho sem. Před uložením zkontroluješ údaje.</Text>
    {!preview?<>
      <TextInput accessibilityLabel="Obsah souboru účtu" multiline value={source} onChangeText={setSource} maxLength={12000} editable={!busy} autoCorrect={false} autoCapitalize="none" placeholder="Vlož obsah souboru…" placeholderTextColor="#627891" textAlignVertical="top" style={{minHeight:200,maxHeight:320,padding:18,borderRadius:22,borderWidth:1,borderColor:'#CFDEED',backgroundColor:'#FFFFFF',color:'#14263C',fontSize:13}}/>
      <Pressable accessibilityRole="button" accessibilityLabel="Zkontrolovat účet" disabled={busy} onPress={review} style={button}><Text style={buttonText}>Zkontrolovat účet</Text></Pressable>
    </>:<>
      <View style={{padding:20,borderRadius:24,borderWidth:1,borderColor:'#D9E5F1',backgroundColor:'#FFFFFFD9'}}>
        {[
          ['Profil',preview.firstName+' '+preview.lastName],['Kontakt',preview.email+'\n'+preview.phone],['Adresa',preview.address.street+', '+preview.address.city+' '+preview.address.postcode+'\n'+preview.address.country],
          ['Finance',preview.occupation+' · '+preview.income+'\n'+preview.sourceOfFunds+' · '+preview.purpose],['Daňová rezidence',preview.taxCountry+' · USA: '+(preview.usTax?'Ano':'Ne')+' · PEP: '+(preview.pep?'Ano':'Ne')],
          ['Totožnost',preview.identityMethod+' · '+(preview.verificationStatus==='verified'?'Totožnost ověřena':'Čeká na ověření')],['Plán','Zenvault Silver · 0 Kč'],['Přihlášení','Přes seznam místních účtů. Heslo nastavíš později.']
        ].map(([label,value])=><View key={label} style={{marginBottom:16}}><Text style={{fontSize:11,color:'#627891',marginBottom:5}}>{label}</Text><Text style={{fontSize:14,lineHeight:21,color:'#14263C',fontWeight:'600'}}>{value}</Text></View>)}
      </View>
      <Text style={{fontSize:12,lineHeight:20,color:'#627891',marginTop:15}}>Stav totožnosti je záznam v místním profilu, nikoli skutečná bankovní kontrola. Neuvedené osobní údaje zůstanou prázdné. Zůstatky a body začínají na nule.</Text>
      <Pressable accessibilityRole="checkbox" accessibilityLabel="Uložit tento místní účet na zařízení" accessibilityState={{checked:consent}} disabled={busy} onPress={()=>setConsent(!consent)} style={{paddingVertical:20,flexDirection:'row',gap:12,alignItems:'center'}}><Text style={{color:'#137FEA',fontSize:25}}>{consent?'☑':'□'}</Text><Text style={{flex:1,fontSize:14,lineHeight:21,fontWeight:'600',color:'#14263C'}}>Uložit tento místní účet na zařízení</Text></Pressable>
      <Pressable accessibilityRole="button" accessibilityLabel="Přidat místní účet" disabled={busy||!consent} onPress={()=>onImport(source,consent)} style={[button,{opacity:(busy||!consent)?0.55:1}]}>{busy?<ActivityIndicator color="#FFFFFF"/>:<Text style={buttonText}>Přidat místní účet</Text>}</Pressable>
      <Pressable accessibilityRole="button" accessibilityLabel="Upravit import" disabled={busy} onPress={()=>{setPreview(null);setConsent(false);}} style={{padding:20,alignItems:'center'}}><Text style={{color:'#137FEA',fontWeight:'600'}}>Upravit import</Text></Pressable>
    </>}
    {!!error&&<Text accessibilityRole="alert" style={{fontSize:13,color:'#A23346',lineHeight:21,marginTop:15}}>{error}</Text>}
  </View>;
}
const button={marginTop:20,padding:18,minHeight:56,borderRadius:22,backgroundColor:'#137FEA',alignItems:'center',justifyContent:'center'};
const buttonText={fontWeight:'700',fontSize:16,color:'#FFFFFF'};
