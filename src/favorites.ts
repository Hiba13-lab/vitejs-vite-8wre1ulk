import './favorites.css';

type Favorite = { name:string; image:string; price:string; brand:string };
const KEY='osrah_favorites';
const read=():Favorite[]=>{try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch{return[]}};
const write=(items:Favorite[])=>localStorage.setItem(KEY,JSON.stringify(items));
const norm=(s:string)=>s.trim().toLowerCase();

function syncHearts(){
 const favs=read();
 document.querySelectorAll('.x-grid article').forEach(card=>{
  const name=card.querySelector('h3')?.textContent?.trim()||'';
  const heart=card.querySelector('.fav') as HTMLElement|null;
  if(!heart)return;
  const saved=favs.some(f=>norm(f.name)===norm(name));
  heart.classList.toggle('saved-favorite',saved);
  heart.setAttribute('aria-label',saved?'Retirer des favoris':'Ajouter aux favoris');
 });
 const headerFav=document.querySelector('.x-icons button:nth-child(2) small');
 if(headerFav) headerFav.textContent=`Favoris (${favs.length})`;
}

function productFromCard(card:Element):Favorite|null{
 const name=card.querySelector('h3')?.textContent?.trim();
 const image=(card.querySelector('.pimg img') as HTMLImageElement|null)?.src;
 const price=card.querySelector('.info>b')?.textContent?.trim();
 const brand=card.querySelector('.info>small')?.textContent?.trim()||'OSRAH';
 if(!name||!image||!price)return null;
 return {name,image,price,brand};
}

function showFavorites(){
 document.querySelector('.favorites-page')?.remove();
 document.querySelector('.tidy-men-page')?.remove();
 document.querySelectorAll('.men-hidden').forEach(el=>el.classList.remove('men-hidden'));
 const store=document.querySelector('.x-store'); if(!store)return;
 const homeSections=['.x-hero','.x-cats','.x-promos','.x-products','.x-loyal'];
 homeSections.forEach(s=>document.querySelector(s)?.classList.add('favorites-hidden'));
 const items=read();
 const page=document.createElement('section'); page.className='favorites-page';
 page.innerHTML=`<div class="favorites-head"><div><small>MES PRODUITS ENREGISTRÉS</small><h1>Mes favoris</h1><p>Retrouvez ici tous les produits que vous avez enregistrés.</p></div><div class="favorites-count">♥ ${items.length}</div></div>${items.length?`<div class="favorites-grid">${items.map((p,i)=>`<article><button class="favorites-remove" data-fav-remove="${i}" aria-label="Retirer des favoris">♥</button><div class="favorites-img"><img src="${p.image}" alt="${p.name}"></div><small>${p.brand}</small><h3>${p.name}</h3><div class="favorites-bottom"><b>${p.price}</b><button class="favorites-cart" data-fav-cart="${i}">Ajouter au panier</button></div></article>`).join('')}</div>`:`<div class="favorites-empty"><div>♡</div><h2>Aucun favori pour le moment</h2><p>Cliquez sur le cœur d’un produit pour l’enregistrer ici.</p><button class="favorites-back">Découvrir les produits</button></div>`}`;
 const footer=document.querySelector('.x-store footer'); store.insertBefore(page,footer);
 page.querySelectorAll('[data-fav-remove]').forEach(btn=>btn.addEventListener('click',()=>{
  const index=Number((btn as HTMLElement).dataset.favRemove); const next=read(); next.splice(index,1); write(next); showFavorites(); syncHearts();
 }));
 page.querySelectorAll('[data-fav-cart]').forEach(btn=>btn.addEventListener('click',()=>{
  const index=Number((btn as HTMLElement).dataset.favCart); const p=read()[index]; if(!p)return;
  const badge=document.querySelector('.x-icons .bag b'); if(badge) badge.textContent=String(Number(badge.textContent||0)+1);
  let toast=document.querySelector('.fav-toast') as HTMLElement|null; if(!toast){toast=document.createElement('div');toast.className='fav-toast';document.body.appendChild(toast)}
  toast.textContent=`✓ ${p.name} ajouté au panier`;toast.classList.add('show');setTimeout(()=>toast?.classList.remove('show'),2000);
 }));
 page.querySelector('.favorites-back')?.addEventListener('click',closeFavorites);
 page.scrollIntoView({behavior:'smooth',block:'start'});
}

function closeFavorites(){
 document.querySelector('.favorites-page')?.remove();
 document.querySelectorAll('.favorites-hidden').forEach(el=>el.classList.remove('favorites-hidden'));
 window.scrollTo({top:0,behavior:'smooth'});
 syncHearts();
}

document.addEventListener('click',e=>{
 const target=e.target as HTMLElement|null;
 const heart=target?.closest('.x-grid .fav') as HTMLElement|null;
 if(heart){
  const card=heart.closest('article'); if(!card)return;
  const product=productFromCard(card); if(!product)return;
  const favs=read(); const index=favs.findIndex(f=>norm(f.name)===norm(product.name));
  if(index>=0) favs.splice(index,1); else favs.push(product);
  write(favs); setTimeout(syncHearts,0); return;
 }
 const headerButton=target?.closest('.x-icons button:nth-child(2)');
 if(headerButton){e.preventDefault();e.stopPropagation();showFavorites();}
 const navBtn=target?.closest('.x-nav button');
 if(navBtn){closeFavorites();}
},true);

new MutationObserver(syncHearts).observe(document.body,{childList:true,subtree:true});
window.addEventListener('load',syncHearts);setTimeout(syncHearts,300);setTimeout(syncHearts,1000);
