import {isPrestigeTier} from './PrestigePlans';
import {verificationLabel} from './LocalAccount';
import {TrialStatus} from './Inbox';
import React,{useEffect,useRef,useState} from 'react';
import {View,Text,Pressable,Switch,Platform,ActivityIndicator} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {HOME_MODES,normalizeHomeMode} from './HomeModes';
import {tierLabel} from './Membership';
import {CoreContract} from './CorePlan';
import {profileValues} from './ProfileModel';

export function SettingsHome({u,data,ui,theme,onOpen,onGo,onSetting,onLogout}){
 const {t,Panel,Label,Icon,Row,Section,Button}=ui;
 const profile=(type)=>onOpen(type);
 return <>
  <Label muted style={{fontSize:10,fontWeight:'700',letterSpacing:2,marginBottom:8}}>MADE FOR YOU</Label><Label style={{fontSize:35,fontWeight:'700',letterSpacing:-1.5,marginBottom:24}}>Nastavení</Label>
  <Pressable accessibilityRole="button" accessibilityLabel="Upravit osobní profil" onPress={()=>profile('personal')} style={{flexDirection:'row',gap:15,alignItems:'center',marginBottom:22}}><View style={{width:62,height:62,borderRadius:31,backgroundColor:t.soft,alignItems:'center',justifyContent:'center'}}><Label style={{fontWeight:'700',fontSize:23,color:t.accent}}>{u.name.split(' ').map(x=>x[0]).slice(0,2).join('')}</Label></View><View style={{flex:1}}><Label style={{fontSize:23,fontWeight:'700',letterSpacing:-.7}}>{u.name}</Label><Label muted style={{fontSize:12,marginTop:5}}>{u.auth?.email||u.contact?.email||'Tvůj osobní prostor'}</Label></View><Icon name="chevron-forward" size={18} color={t.muted}/></Pressable>
  <Pressable accessibilityRole="button" accessibilityLabel="Spravovat členství" onPress={()=>onOpen('tiers')}><LinearGradient colors={[t.button,t.button]} style={{borderRadius:24,padding:23,overflow:'hidden'}}><View style={{position:'absolute',right:-24,top:-32,width:150,height:150,borderRadius:80,borderWidth:22,borderColor:'#FFFFFF0C'}}/><View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}><View style={{flex:1,marginRight:12}}><Text style={{color:'#FFFFFF',opacity:.8,fontSize:10,letterSpacing:1.8}}>ZENVAULT MEMBERSHIP</Text><Text numberOfLines={1} adjustsFontSizeToFit minimumFontScale={.8} style={{color:'#FFFFFF',fontSize:26,fontWeight:'700',letterSpacing:-.6,marginTop:8}}>{tierLabel(u.tier)}</Text><Text style={{color:'#FFFFFF',fontSize:12,marginTop:12}}>Tvůj plán a všechny jeho výhody  ↗</Text></View><Icon name={['Unlimited','Unlimited MAX'].includes(u.tier)?'infinite-outline':'sparkles-outline'} color="#FFFFFF" size={31}/></View></LinearGradient></Pressable>
  {u.tier==='Core'&&!u.planTrial&&<CoreContract membership={u.coreMembership} t={t}/>}
  <TrialStatus u={u} ui={ui} onManage={()=>onOpen('notifications',{initialId:u.planTrial?.messageId})}/>
  {isPrestigeTier(u.tier)&&<Button title="Prestige Lounge" icon="diamond-outline" secondary onPress={()=>onGo('prestigeLounge')} style={{marginBottom:20}}/>}
  <Section title="Osobní profil"/><Panel>
   <Row icon="person-outline" title="Osobní údaje" sub="Jméno, datum narození a občanství" onPress={()=>profile('personal')}/>
   <Row icon="at-outline" title="Kontaktní údaje" sub="E-mail a telefonní číslo" onPress={()=>profile('contact')}/>
   <Row icon="location-outline" title="Adresa bydliště" sub={u.onboarding?.address?.city||'Trvalý pobyt a PSČ'} onPress={()=>profile('address')}/>
   <Row icon="document-text-outline" title="Daňové a ekonomické údaje" onPress={()=>profile('taxProfile')}/>
   {u.onboarding?.identityMethod&&<Row icon="person-circle-outline" title="Ověření totožnosti" sub={verificationLabel(u)} onPress={()=>onOpen('registrationInfo')}/>}
  </Panel>
  <Section title="Zprávy a dokumenty"/><Panel><Row icon="mail-outline" title="Schránka banky" sub="Oznámení, osobní nabídky a Free trials" onPress={()=>onOpen('notifications')}/><Row icon="documents-outline" title="Dokumenty" sub="Přílohy a potvrzené kopie" onPress={()=>onOpen('documents')}/></Panel>
  <Section title="Zabezpečení a soukromí"/><Panel>
   <Row icon="key-outline" title={u.auth?'Změna hesla':'Nastavit přihlášení heslem'} sub={u.auth?'Chraň přístup ke svému účtu':'Přidej e-mail, telefon a vlastní heslo'} onPress={()=>profile('password')}/>
   <Row icon="shield-checkmark-outline" title="Security Center" sub="PIN, biometrie, zařízení a historie" onPress={()=>onGo('security')}/>
   <Row icon="finger-print-outline" title="Soukromí a oznámení" sub="Viditelnost částek a tvoje preference" onPress={()=>profile('privacy')}/>
  </Panel>
  <Section title="Vzhled a přehled"/><Panel>
   <Row icon="sparkles-outline" title="Motiv aplikace" value={theme.name} sub="Theme Studio · 36 motivů" onPress={()=>onOpen('appThemes')}/>
   <Row icon="contrast-outline" title="Vzhled" value={theme.forceLight?'Vždy světlý':{light:'Světlý',dark:'Tmavý',system:'Systémový'}[data.theme]} onPress={()=>onOpen('theme')}/>
   <Row icon="water-outline" title="Liquid Glass" sub="Jemné průsvitné vrstvy" right={<Switch accessibilityLabel="Liquid Glass" value={data.glass} onValueChange={v=>onSetting('glass',v)} trackColor={{true:t.button}}/>}/>
   <Row icon="albums-outline" title="Režim zobrazení přehledu" value={HOME_MODES.find(m=>m.id===normalizeHomeMode(u.homeMode)).name} onPress={()=>onOpen('homeMode')}/>
   <Row icon="grid-outline" title="Home Widgets" sub="Uspořádej si domovskou stránku" onPress={()=>onGo('widgets')}/>
  </Panel>
  <Section title="Účty a služby"/><Panel><Row icon="people-outline" title="Přepnout účet" sub={data.users.length+' lokálních profilů'} onPress={()=>onOpen('accounts')}/><Row icon="happy-outline" title="Zenvault Junior" onPress={()=>onGo('junior')}/><Row icon="apps-outline" title="Všechny funkce" onPress={()=>onGo('hub')}/></Panel>
  <Section title="Správa a podpora"/><Panel><Row icon="layers-outline" title="Režim aplikace" value={data.mode} onPress={()=>onOpen('mode')}/>{data.mode==='Administrátor'&&<><Row icon="remove-circle-outline" title="Odebrat plán / trial" sub="Vrátit původní členství nebo přejít na Silver" onPress={()=>onOpen('adminMembership')}/><Row icon="mail-outline" title="Bankovní komunikace" sub="Poslat zprávu, trial nebo dokument klientovi" onPress={()=>onOpen('adminMessages')}/><Row icon="create-outline" title="Změnit zůstatek klienta" onPress={()=>onOpen('adminBalance',{}, {user:u.id,currency:'CZK'})}/><Row icon="sparkles-outline" title="Úprava zůstatku bodů" onPress={()=>onOpen('adminPoints',{}, {user:u.id,points:String(u.points),op:Date.now().toString(36)})}/><Row icon="add-circle-outline" title="Vytvořit transakci" onPress={()=>onOpen('adminTx',{}, {user:u.id,currency:'CZK',direction:'Příchozí',delayDays:0,op:Date.now().toString(36)})}/></>}<Row icon="help-circle-outline" title="Centrum nápovědy" onPress={()=>onOpen('help')}/><Row icon="information-circle-outline" title="O Zenvault" onPress={()=>onOpen('about')}/></Panel>
  <Button title="Odhlásit se" secondary icon="log-out-outline" style={{marginTop:25}} onPress={onLogout}/><Label muted style={{fontSize:10,textAlign:'center',marginTop:25,letterSpacing:1.8}}>ZENVAULT BANK & CO. · 4.5</Label>
 </>;
}

export function ProfileEditor({kind,u,ui,onSave}){
 const {t,Field,Label,Button,Row,Panel}=ui,[form,setForm]=useState(()=>profileValues(u,kind)),[error,setError]=useState(''),[processing,setProcessing]=useState(false),pending=useRef(false),alive=useRef(true);
 useEffect(()=>{alive.current=true;return()=>{alive.current=false;};},[]);
 const f=(key,value)=>{setForm(v=>({...v,[key]:value}));setError('');};
 const field=(key,label,props={})=><Field label={label} value={form[key]||''} onChangeText={v=>f(key,v)} maxLength={180} editable={!processing} {...props}/>;
 const password=(key,label)=><>{field(key,label,{secureTextEntry:true,autoCapitalize:'none',autoCorrect:false,maxLength:128,textContentType:key==='currentPassword'?'password':'newPassword'})}</>;
 const save=async()=>{if(pending.current)return;pending.current=true;setProcessing(true);setError('');try{await onSave(kind,form);}catch(e){if(alive.current)setError(e.message);}finally{pending.current=false;if(alive.current)setProcessing(false);}};
 return <View testID={'profile-editor-'+kind}>
  {kind==='personal'&&<>{field('firstName','Jméno',{textContentType:'givenName'})}{field('lastName','Příjmení',{textContentType:'familyName'})}{field('birth','Datum narození',{placeholder:'DD. MM. RRRR',editable:!processing&&!u.parentId})}{field('citizenship','Státní občanství',{placeholder:'České'})}<Label muted style={{fontSize:12,lineHeight:19,marginBottom:18}}>Uložením aktualizuješ údaje místního profilu. Stav ověření totožnosti se tím nemění.</Label></>}
  {kind==='address'&&<>{field('street','Ulice a číslo domu',{textContentType:'streetAddressLine1'})}{field('city','Město',{textContentType:'addressCity'})}{field('postcode','PSČ',{textContentType:'postalCode',maxLength:12})}{field('country','Země pobytu',{textContentType:'countryName'})}</>}
  {(kind==='contact'||(kind==='password'&&!u.auth))&&<>{field('email','E-mail',{keyboardType:'email-address',autoCapitalize:'none',autoCorrect:false,textContentType:'emailAddress',maxLength:254})}{field('phone','Telefonní číslo',{keyboardType:'phone-pad',textContentType:'telephoneNumber',placeholder:'+420 777 123 456',maxLength:25})}</>}
  {(kind==='contact'||kind==='password')&&u.auth&&password('currentPassword','Stávající heslo')}
  {kind==='contact'&&<Label muted style={{fontSize:12,lineHeight:19,marginBottom:18}}>{u.auth?'Nové kontakty použiješ i při přihlášení.':'Kontakty budou součástí místního profilu. Přihlášení heslem nastavíš v Zabezpečení.'} E-mail ani telefon se tím neověřují.</Label>}
  {kind==='password'&&<>{password('password','Nové heslo')}{password('confirm','Zopakuj nové heslo')}<Panel style={{marginBottom:18}}><Label style={{fontWeight:'700',fontSize:13}}>Silná fráze se dobře pamatuje.</Label><Label muted style={{fontSize:12,lineHeight:20,marginTop:7}}>Použij 15 až 128 znaků. Heslo se neukládá v čitelné podobě; chrání přihlášení k tomuto místnímu účtu.</Label></Panel></>}
  {kind==='taxProfile'&&<>{field('taxCountry','Země daňové rezidence')}{!form.taxIdPending&&field('taxId','Daňový identifikátor')}<Row title="Identifikátor doplním při ověření" right={<Switch accessibilityLabel="Identifikátor doplním při ověření" disabled={processing} value={form.taxIdPending} onValueChange={v=>f('taxIdPending',v)} trackColor={{true:t.button}}/>}/><Row title="Daňová povinnost v USA" right={<Switch accessibilityLabel="Daňová povinnost v USA" disabled={processing} value={form.usTax} onValueChange={v=>f('usTax',v)} trackColor={{true:t.button}}/>}/><Row title="Politicky exponovaná osoba" right={<Switch accessibilityLabel="Politicky exponovaná osoba" disabled={processing} value={form.pep} onValueChange={v=>f('pep',v)} trackColor={{true:t.button}}/>}/><View style={{height:16}}/>{field('occupation','Zaměstnání / ekonomická činnost')}{field('sourceOfFunds','Zdroj příjmů')}<Label muted style={{fontSize:12,lineHeight:19,marginBottom:18}}>Údaje se ukládají do profilu pro pozdější ověření.</Label></>}
  {!!error&&<View accessibilityRole="alert" style={{padding:14,borderRadius:15,backgroundColor:t.soft,marginBottom:15}}><Label style={{color:t.text,fontSize:13,lineHeight:20}}>{error}</Label></View>}
  {processing&&<View style={{flexDirection:'row',gap:10,justifyContent:'center',marginBottom:14}}><ActivityIndicator color={t.accent}/><Label muted>Bezpečně ukládám…</Label></View>}
  <Button title={kind==='password'?'Uložit nové heslo':'Uložit změny'} disabled={processing} onPress={save}/>
 </View>;
}
export function PrivacySettings({u,data,ui,onSetting,onMarketing}){
 const {t,Panel,Row,Label}=ui;
 return <><Panel><Row icon="eye-off-outline" title="Skrýt částky" sub="Zůstatky a historie se zobrazí diskrétně." right={<Switch accessibilityLabel="Skrýt částky" value={data.hide} onValueChange={v=>onSetting('hide',v)} trackColor={{true:t.button}}/>}/><Row icon="notifications-outline" title="Oznámení v aplikaci" sub="Zobrazovat indikátor nových zpráv. Schránka zůstává přístupná." right={<Switch accessibilityLabel="Oznámení v aplikaci" value={data.notifications} onValueChange={v=>onSetting('notifications',v)} trackColor={{true:t.button}}/>}/><Row icon="megaphone-outline" title="Souhlas s nabídkami" sub="Uložená preference pro budoucí komunikaci." right={<Switch accessibilityLabel="Souhlas s nabídkami" value={!!u.onboarding?.consents?.marketing} onValueChange={onMarketing} trackColor={{true:t.button}}/>}/></Panel><Label muted style={{fontSize:12,lineHeight:20,marginTop:17}}>Nastavení částek a oznámení platí pro tuto instalaci. Souhlas s nabídkami je uložený u tvého profilu. Aplikace nyní neodesílá e-maily, SMS ani push oznámení.</Label></>;
}

export function HomeModePicker({u,ui,onSelect}){
 const {t,Panel,Label,Icon}=ui;
 return <><Label muted style={{fontSize:14,lineHeight:22,marginBottom:20}}>Kolik toho chceš mít po ruce? Režim se uloží pro tento účet. Tvoje vlastní uspořádání ve Full zůstane zachované.</Label>{HOME_MODES.map(m=>{const active=normalizeHomeMode(u.homeMode)===m.id;return <Pressable key={m.id} testID={'home-mode-'+m.id} accessibilityRole="button" accessibilityLabel={'Režim '+m.name} accessibilityState={{selected:active}} onPress={()=>onSelect(m.id)} style={{marginBottom:13}}><Panel style={{borderWidth:active?2:1,borderColor:active?t.accent:t.border,padding:20}}><View style={{flexDirection:'row',alignItems:'center',gap:13}}><View style={{width:45,height:45,borderRadius:23,backgroundColor:active?t.button:t.soft,alignItems:'center',justifyContent:'center'}}><Icon name={m.icon} size={22} color={active?'#FFFFFF':t.accent}/></View><View style={{flex:1}}><Label style={{fontSize:20,fontWeight:'700',letterSpacing:-.5}}>{m.name}</Label><Label muted style={{fontSize:10,marginTop:4}}>{m.tag}</Label></View>{active&&<Icon name="checkmark-circle" color={t.accent}/>}</View><Label muted style={{fontSize:13,lineHeight:20,marginTop:15}}>{m.description}</Label></Panel></Pressable>;})}</>;
}
