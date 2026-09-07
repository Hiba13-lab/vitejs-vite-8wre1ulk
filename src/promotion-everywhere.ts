type Promo={price:number;old:number};
const KEY='osrah-admin-promos';
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
function customPromos():Record<string,Promo>{try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch{return{}}}
function promos(){return {...DEFAULT_PROMOS,...customPromos()}}
function setPriceBlock(info:Element,promo:Promo){
 let block=info.querySelector('.promo-price') as HTMLElement|null;
 if(!block){block=document.createElement('div');block.className='promo-price';const regular=Array.from(info.children).find(el=>el.tagName==='B');if(regular)regular.replaceWith(block);else info.querySelector('button')?.before(block)}
 block.innerHTML=`<span>${promo.price} DH</span><del>${promo.old} DH</del>`;
}
function applyPromoPrices(){
 const map=promos();
 document.querySelectorAll<HTMLElement>('.x-grid article').forEach(card=>{
  const name=card.querySelector('h3')?.textContent?.trim()||'';const promo=map[name];if(!promo)return;
  if(!card.querySelector('.promo-badge')){const badge=document.createElement('span');badge.className='promo-badge';badge.textContent='PROMO';card.prepend(badge)}
  const info=card.querySelector('.info');if(info)setPriceBlock(info,promo);
 });
 const detail=document.querySelector('.x-detail main');
 if(detail){const name=detail.querySelector('h1')?.textContent?.trim()||'';const promo=map[name];if(promo){const h2=detail.querySelector('h2');if(h2)h2.textContent=`${promo.price.toFixed(2)} DH`;let old=detail.querySelector('.detail-old-price') as HTMLElement|null;if(!old){old=document.createElement('div');old.className='detail-old-price';h2?.after(old)}old.textContent=`${promo.old.toFixed(0)} DH`;}}
}
let scheduled=false;function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;applyPromoPrices()})}
new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true});
document.addEventListener('click',()=>setTimeout(applyPromoPrices,30));
document.addEventListener('input',()=>setTimeout(applyPromoPrices,30));
window.addEventListener('storage',applyPromoPrices);window.addEventListener('load',applyPromoPrices);setTimeout(applyPromoPrices,300);setTimeout(applyPromoPrices,900);
