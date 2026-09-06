const PROMOS:Record<string,{price:number;old:number}>={
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

function applyPromoPrices(){
 document.querySelectorAll<HTMLElement>('.x-grid article').forEach(card=>{
  const name=card.querySelector('h3')?.textContent?.trim()||'';
  const promo=PROMOS[name];
  if(!promo)return;
  if(!card.querySelector('.promo-badge')){
   const badge=document.createElement('span');
   badge.className='promo-badge';badge.textContent='PROMO';card.prepend(badge);
  }
  const info=card.querySelector('.info');if(!info)return;
  if(!info.querySelector('.promo-price')){
   const regular=Array.from(info.children).find(el=>el.tagName==='B');
   const price=document.createElement('div');price.className='promo-price';
   price.innerHTML=`<span>${promo.price} DH</span><del>${promo.old} DH</del>`;
   if(regular)regular.replaceWith(price);else info.querySelector('button')?.before(price);
  }
 });
}

let scheduled=false;
function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;applyPromoPrices()})}
new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true});
document.addEventListener('click',()=>setTimeout(applyPromoPrices,30));
document.addEventListener('input',()=>setTimeout(applyPromoPrices,30));
window.addEventListener('load',applyPromoPrices);
setTimeout(applyPromoPrices,300);
setTimeout(applyPromoPrices,900);
