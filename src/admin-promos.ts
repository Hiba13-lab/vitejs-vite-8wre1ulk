const PROMO_KEY='osrah-admin-promos';
type Promo={price:number;old:number};

const DEFAULT_PROMOS:Record<string,Promo>={
 'Brume parfumée':{price:55,old:69},
 "Gel douche Fleur d'Oranger":{price:44,old:55},
 'Gommage corps sucre rose':{price:39,old:49},
 'Savon noir Eucalyptus':{price:31,old:39},
 'Huile de bronzage':{price:63,old:79},
 'Écran solaire SPF 50+':{price:99,old:129},
 "Masques Terre d'Arômes":{price:47,old:59},
 'Masque Blond Lumière':{price:128,old:160},
 'Shampooing Couleur Magnétique':{price:112,old:140},
 'Lotion micellaire':{price:58,old:72}
};

function readSaved():Record<string,Promo>{try{return JSON.parse(localStorage.getItem(PROMO_KEY)||'{}')}catch{return{}}}
function readPromos():Record<string,Promo>{return {...DEFAULT_PROMOS,...readSaved()}}
function writePromos(x:Record<string,Promo>){localStorage.setItem(PROMO_KEY,JSON.stringify(x));window.dispatchEvent(new Event('osrah-promos-changed'))}
function numberFrom(text:string){return Number((text||'').replace(/[^0-9.,]/g,'').replace(',','.'))||0}

function enhance(){
 const section=document.querySelector('[data-admin-section="products"]');if(!section)return;
 section.querySelectorAll<HTMLTableRowElement>('tbody tr').forEach(row=>{
  const name=row.querySelector('.admin-prod b')?.textContent?.trim()||'';if(!name)return;
  const priceCell=row.children[2] as HTMLElement|undefined;const actions=row.children[4] as HTMLElement|undefined;if(!priceCell||!actions)return;
  const promos=readPromos();const active=promos[name];

  row.querySelectorAll('.admin-promo-btn,.admin-promo-cancel,.admin-promo-state').forEach(x=>x.remove());
  if(active){
   priceCell.innerHTML=`<b style="color:#c72f67">${active.price.toFixed(0)} DH</b><br><del>${active.old.toFixed(0)} DH</del>`;
   const state=document.createElement('span');state.className='admin-badge admin-promo-state';state.textContent='En promo';actions.appendChild(state);
  }

  const btn=document.createElement('button');btn.type='button';btn.className='admin-edit admin-promo-btn';btn.textContent=active?'Modifier promo':'Mettre en promo';
  btn.addEventListener('click',()=>{
   const all=readPromos();const saved=readSaved();const current=all[name];const oldDefault=current?.old||numberFrom(priceCell.textContent||'');
   const oldRaw=prompt(`Prix normal de ${name} (DH)`,String(oldDefault));if(oldRaw===null)return;
   const old=Number(oldRaw.replace(',','.'));if(!old||old<=0)return alert('Prix normal invalide.');
   const promoRaw=prompt(`Nouveau prix promo de ${name} (DH)`,current?String(current.price):String(Math.max(1,Math.round(old*.8))));if(promoRaw===null)return;
   const promo=Number(promoRaw.replace(',','.'));if(!promo||promo<=0||promo>=old)return alert('Le prix promo doit être inférieur au prix normal.');
   saved[name]={price:promo,old};writePromos(saved);enhance();
  });
  actions.appendChild(btn);

  if(active && !DEFAULT_PROMOS[name]){
   const cancel=document.createElement('button');cancel.type='button';cancel.className='admin-delete admin-promo-cancel';cancel.textContent='Retirer promo';cancel.addEventListener('click',()=>{const saved=readSaved();delete saved[name];writePromos(saved);location.reload()});actions.appendChild(cancel)
  }
 });
}
new MutationObserver(()=>enhance()).observe(document.body,{childList:true,subtree:true});
window.addEventListener('load',enhance);window.addEventListener('osrah-promos-changed',enhance);setInterval(enhance,1500);setTimeout(enhance,400);
