export const HOME_MODES=[
 {id:'full',name:'Full',tag:'Výchozí',icon:'grid-outline',description:'Kompletní přehled podle tvého uspořádání widgetů.'},
 {id:'important',name:'Důležité',tag:'Rychlý přehled',icon:'flash-outline',description:'Zůstatek, výdaje a karty.'},
 {id:'details',name:'Details',tag:'Více souvislostí',icon:'list-outline',description:'Zůstatek, výdaje, historie transakcí a karty.'},
];
export const normalizeHomeMode=value=>HOME_MODES.some(m=>m.id===value)?value:'full';
export function homeWidgetIds(u){
 const mode=normalizeHomeMode(u.homeMode);
 return mode==='important'?['Balance','Spending','Cards']:mode==='details'?['Balance','Spending','History','Cards']:(u.widgets||[]).filter(w=>w.visible).map(w=>w.id);
}
