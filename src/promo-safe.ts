import './promotion.css';

type Promo={price:number;old:number};
const KEY='osrah-admin-promos';

function read():Record<string,Promo>{try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch{return{}}}
function write(x:Record<string,Promo>){localStorage.setItem(KEY,JSON.stringify(x))}
function num(s:string){return Number((s||'').replace(/[^0-9.,]/g,'').replace(',','.'))||0}

function enhanceAdmin(){
 const section=document.querySelector('[data-admin-section="products"]');
 if(!section)return;
 const promos=read();
 section.querySelectorAll<HTMLTableRowElement>('tbody tr').forEach(row=>{
  const name=row.querySelector('.admin-prod b')?.textContent?.trim()||'';
  if(!name)return;
  const priceCell=row.children[2] as HTMLElement|undefined;
  const actions=row.children[4] as HTMLElement|undefined;
  if(!priceCell||!actions)return;
  const active=promos[name];
  if(active){
   priceCell.innerHTML=`<b style="color:#c72f67">${active.price.toFixed(0)} DH</b><br><del style="color:#9b7b87">${active.old.toFixed(0)} DH</del>`;
  }
  if(actions.querySelector('[data-promo-name]'))return;
  const btn=document.createElement('button');
  btn.type='button';btn.className='admin-edit';btn.dataset.promoName=name;
  btn.textContent=active?'Modifier promo':'Mettre en promo';
  actions.appendChild(btn);
  if(active){
   const remove=document.createElement('button');remove.type='button';remove.className='admin-delete';remove.dataset.promoRemove=name;remove.textContent='Retirer promo';actions.appendChild(remove);
  }
 });
}

function applyClient(){
 const promos=read();
 document.querySelectorAll<HTMLElement>('.x-grid article').forEach(card=>{
  const name=card.querySelector('h3')?.textContent?.trim()||'';
  const promo=promos[name];
  if(!promo)return;
  let badge=card.querySelector('.promo-badge') as HTMLElement|null;
  if(!badge){badge=document.createElement('span');badge.className='promo-badge';badge.textContent='PROMO';card.prepend(badge)}
  const info=card.querySelector('.info');if(!info)return;
  let block=info.querySelector('.promo-price') as HTMLElement|null;
  if(!block){
   const regular=Array.from(info.children).find(el=>el.tagName==='B');
   block=document.createElement('div');block.className='promo-price';
   if(regular)regular.replaceWith(block);else info.querySelector('button')?.before(block);
  }
  block.innerHTML=`<span>${promo.price.toFixed(0)} DH</span><del>${promo.old.toFixed(0)} DH</del>`;
 });
 const detail=document.querySelector('.x-detail main');
 if(detail){
  const name=detail.querySelector('h1')?.textContent?.trim()||'';const promo=promos[name];
  if(promo){const h2=detail.querySelector('h2');if(h2)h2.textContent=`${promo.price.toFixed(2)} DH`;let old=detail.querySelector('.detail-old-price') as HTMLElement|null;if(!old){old=document.createElement('div');old.className='detail-old-price';h2?.after(old)}old.textContent=`${promo.old.toFixed(0)} DH`;}
 }
}

function refresh(){enhanceAdmin();applyClient()}

document.addEventListener('click',e=>{
 const t=e.target as HTMLElement|null;if(!t)return;
 const promoBtn=t.closest('[data-promo-name]') as HTMLElement|null;
 if(promoBtn){
  e.preventDefault();e.stopPropagation();
  const name=promoBtn.dataset.promoName||'';const promos=read();
  const row=promoBtn.closest('tr');const current=promos[name];
  const base=current?.old||num((row?.children[2] as HTMLElement|null)?.textContent||'');
  const oldRaw=prompt(`Prix normal de ${name} (DH)`,String(base));if(oldRaw===null)return;
  const old=Number(oldRaw.replace(',','.'));if(!old||old<=0)return alert('Prix normal invalide.');
  const promoRaw=prompt(`Prix promo de ${name} (DH)`,String(current?.price||Math.max(1,Math.round(old*.8))));if(promoRaw===null)return;
  const price=Number(promoRaw.replace(',','.'));if(!price||price<=0||price>=old)return alert('Le prix promo doit être inférieur au prix normal.');
  promos[name]={price,old};write(promos);refresh();return;
 }
 const remove=t.closest('[data-promo-remove]') as HTMLElement|null;
 if(remove){e.preventDefault();e.stopPropagation();const promos=read();delete promos[remove.dataset.promoRemove||''];write(promos);const row=remove.closest('tr');if(row){const name=row.querySelector('.admin-prod b')?.textContent?.trim()||'';const p=promos[name];if(!p)location.reload()}return;}
 setTimeout(refresh,60);
},true);

window.addEventListener('load',refresh);
setTimeout(refresh,250);
setTimeout(refresh,900);
