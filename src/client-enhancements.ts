type FavItem={name:string;price:string;image:string;category:string};
const FAV_KEY='osrah_favorites_ui';
const readFavs=():FavItem[]=>{try{return JSON.parse(localStorage.getItem(FAV_KEY)||'[]')}catch{return[]}};
const writeFavs=(items:FavItem[])=>localStorage.setItem(FAV_KEY,JSON.stringify(items));

function parseCard(btn:HTMLElement):FavItem|null{
  const article=btn.closest('article');if(!article)return null;
  const name=article.querySelector('h3')?.textContent?.trim()||'';
  const image=(article.querySelector('img') as HTMLImageElement|null)?.src||'';
  const category=article.querySelector('small')?.textContent?.trim()||'OSRAH';
  const price=article.querySelector('.promo-price span,.info>b')?.textContent?.trim()||'';
  return name&&image?{name,image,category,price}:null;
}
function refreshFavBadge(){
  const fav=Array.from(document.querySelectorAll<HTMLButtonElement>('.x-icons>button')).find(b=>b.textContent?.includes('Favoris'));if(!fav)return;
  let badge=fav.querySelector('.fav-count') as HTMLElement|null;const n=readFavs().length;
  if(!badge){badge=document.createElement('b');badge.className='fav-count';fav.appendChild(badge)}
  badge.textContent=String(n);badge.style.display=n?'grid':'none';
}
function syncHearts(){
  const names=new Set(readFavs().map(x=>x.name));
  document.querySelectorAll<HTMLElement>('.x-grid article').forEach(a=>{const name=a.querySelector('h3')?.textContent?.trim()||'';const heart=a.querySelector<HTMLElement>('.fav');if(!heart)return;heart.classList.toggle('liked',names.has(name));heart.setAttribute('aria-pressed',names.has(name)?'true':'false');heart.style.cursor='pointer';heart.style.pointerEvents='auto'});
}
function toggleFavorite(btn:HTMLElement){
  const item=parseCard(btn);if(!item)return;const items=readFavs();const i=items.findIndex(x=>x.name===item.name);
  if(i>=0)items.splice(i,1);else items.push(item);writeFavs(items);syncHearts();refreshFavBadge();
}
function closeFavs(){document.querySelector('.favorites-panel-wrap')?.remove();document.body.classList.remove('favorites-open')}
function renderFavs(){
  closeFavs();const items=readFavs();document.body.classList.add('favorites-open');const wrap=document.createElement('div');wrap.className='favorites-panel-wrap';
  wrap.innerHTML=`<aside class="favorites-panel"><header><div><small>VOTRE SÉLECTION</small><h2>Mes favoris <sup>${items.length}</sup></h2></div><button class="favorites-close">×</button></header><div class="favorites-list">${items.length?items.map((p,i)=>`<article><div class="fav-img"><img src="${p.image}" alt="${p.name}"></div><div><small>${p.category}</small><h3>${p.name}</h3><b>${p.price}</b></div><button data-fav-remove="${i}">♡</button></article>`).join(''):`<div class="favorites-empty"><span>♡</span><b>Aucun favori pour le moment</b><p>Cliquez sur le cœur d’un produit pour le retrouver ici.</p></div>`}</div><footer><button class="favorites-continue">Continuer mes achats</button></footer></aside>`;
  document.body.appendChild(wrap);wrap.addEventListener('click',e=>{const t=e.target as HTMLElement;if(t===wrap||t.closest('.favorites-close')||t.closest('.favorites-continue')){closeFavs();return}const r=t.closest('[data-fav-remove]') as HTMLElement|null;if(r){const a=readFavs();a.splice(Number(r.dataset.favRemove),1);writeFavs(a);renderFavs();refreshFavBadge();syncHearts()}})
}
function ensureLogout(){const icons=document.querySelector('.x-store .x-icons');if(!icons||icons.querySelector('.client-logout'))return;const b=document.createElement('button');b.className='client-logout';b.innerHTML='↪<small>Déconnexion</small>';b.addEventListener('click',()=>{sessionStorage.clear();location.reload()});icons.appendChild(b)}
function enhance(){ensureLogout();refreshFavBadge();syncHearts()}

document.addEventListener('click',e=>{
  const t=e.target as HTMLElement|null;if(!t)return;
  const heart=t.closest('.x-grid article .fav') as HTMLElement|null;
  if(heart){e.preventDefault();e.stopImmediatePropagation();toggleFavorite(heart);return}
  const topFav=t.closest('.x-icons>button') as HTMLElement|null;
  if(topFav&&topFav.textContent?.includes('Favoris')){e.preventDefault();e.stopImmediatePropagation();renderFavs();return}
},true);
window.addEventListener('load',()=>setTimeout(enhance,150));
document.addEventListener('click',()=>setTimeout(enhance,80),false);
export {};
