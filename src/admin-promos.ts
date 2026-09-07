const PROMO_KEY='osrah-admin-promos';
type Promo={price:number;old:number};
function readPromos():Record<string,Promo>{try{return JSON.parse(localStorage.getItem(PROMO_KEY)||'{}')}catch{return{}}}
function writePromos(x:Record<string,Promo>){localStorage.setItem(PROMO_KEY,JSON.stringify(x));window.dispatchEvent(new Event('storage'))}
function numberFrom(text:string){return Number((text||'').replace(/[^0-9.,]/g,'').replace(',','.'))||0}
function enhance(){
 const section=document.querySelector('[data-admin-section="products"]');if(!section)return;
 section.querySelectorAll<HTMLTableRowElement>('tbody tr').forEach(row=>{
  if(row.querySelector('.admin-promo-btn'))return;
  const name=row.querySelector('.admin-prod b')?.textContent?.trim()||'';if(!name)return;
  const priceCell=row.children[2] as HTMLElement|undefined;const actions=row.children[4] as HTMLElement|undefined;if(!priceCell||!actions)return;
  const promos=readPromos();const active=promos[name];
  if(active){priceCell.innerHTML=`<b style="color:#c72f67">${active.price.toFixed(0)} DH</b><br><del>${active.old.toFixed(0)} DH</del>`}
  const btn=document.createElement('button');btn.type='button';btn.className='admin-edit admin-promo-btn';btn.textContent=active?'Modifier promo':'Mettre en promo';
  btn.addEventListener('click',()=>{
   const current=readPromos();const oldDefault=current[name]?.old||numberFrom(priceCell.textContent||'');
   const oldRaw=prompt(`Prix normal de ${name} (DH)`,String(oldDefault));if(oldRaw===null)return;
   const old=Number(oldRaw.replace(',','.'));if(!old||old<=0)return alert('Prix normal invalide.');
   const promoRaw=prompt(`Nouveau prix promo de ${name} (DH)`,current[name]?String(current[name].price):String(Math.max(1,Math.round(old*.8))));if(promoRaw===null)return;
   const promo=Number(promoRaw.replace(',','.'));if(!promo||promo<=0||promo>=old)return alert('Le prix promo doit être inférieur au prix normal.');
   current[name]={price:promo,old};writePromos(current);enhance();
  });
  actions.appendChild(btn);
  if(active){const cancel=document.createElement('button');cancel.type='button';cancel.className='admin-delete admin-promo-cancel';cancel.textContent='Retirer promo';cancel.addEventListener('click',()=>{const current=readPromos();delete current[name];writePromos(current);location.reload()});actions.appendChild(cancel)}
 });
}
new MutationObserver(()=>enhance()).observe(document.body,{childList:true,subtree:true});
window.addEventListener('load',enhance);setInterval(enhance,1500);setTimeout(enhance,400);
