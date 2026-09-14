type FavItem={name:string;price:string;image:string;category:string};
const FAV_KEY='osrah_favorites';
const readFavs=():FavItem[]=>{try{return JSON.parse(localStorage.getItem(FAV_KEY)||'[]')}catch{return[]}};
const writeFavs=(items:FavItem[])=>localStorage.setItem(FAV_KEY,JSON.stringify(items));

function hideButtonByText(selector:string,label:string){
  document.querySelectorAll<HTMLElement>(selector).forEach(el=>{
    if(el.textContent?.trim()===label)el.style.display='none';
  });
}

function applyOsrahFinalFixes(){
  const hero=document.querySelector<HTMLImageElement>('.x-hero .visual img');
  if(hero){
    hero.src='/osrah-hero.jpg?v=4';
    hero.alt='OSRAH Cosmétiques';
    hero.style.objectFit='cover';
    hero.style.objectPosition='center';
  }

  hideButtonByText('.x-nav button','Nouveautés');
  hideButtonByText('.x-nav button','Nos marques');
  hideButtonByText('.x-cats button','Nouveautés');
  hideButtonByText('.x-cats button','Nos marques');

  const categoryButtons=Array.from(document.querySelectorAll<HTMLButtonElement>('.x-cats button'));
  const promoButton=categoryButtons.find(btn=>btn.textContent?.trim()==='Promotions');
  const promoImage=promoButton?.querySelector<HTMLImageElement>('img');
  if(promoImage){
    promoImage.src='/promo-osrah.svg?v=2';
    promoImage.alt='Promotions OSRAH';
  }
}

function productFromFavButton(btn:HTMLElement):FavItem|null{
  const article=btn.closest('article');
  if(!article)return null;
  const name=article.querySelector('h3')?.textContent?.trim()||'';
  const image=(article.querySelector('img') as HTMLImageElement|null)?.src||'';
  const category=article.querySelector('small')?.textContent?.trim()||'OSRAH';
  const price=article.querySelector('.promo-price span,.info>b')?.textContent?.trim()||'';
  return name&&image?{name,price,image,category}:null;
}

function closeFavs(){document.querySelector('.osrah-favs-overlay')?.remove()}
function showFavs(){
  closeFavs();
  const items=readFavs();
  const overlay=document.createElement('div');
  overlay.className='osrah-favs-overlay';
  overlay.innerHTML=`<div class="osrah-favs-panel"><header><div><small>VOTRE SÉLECTION</small><h2>Mes favoris</h2></div><button data-close-favs>×</button></header><div class="osrah-favs-list">${items.length?items.map((p,i)=>`<article><img src="${p.image}" alt="${p.name}"><div><small>${p.category}</small><h3>${p.name}</h3><b>${p.price}</b></div><button data-remove-fav="${i}">Supprimer</button></article>`).join(''):'<div class="osrah-favs-empty">Aucun favori pour le moment.</div>'}</div></div>`;
  document.body.appendChild(overlay);
  overlay.addEventListener('click',e=>{
    const t=e.target as HTMLElement;
    if(t===overlay||t.closest('[data-close-favs]')){closeFavs();return}
    const rem=t.closest('[data-remove-fav]') as HTMLElement|null;
    if(rem){const a=readFavs();a.splice(Number(rem.dataset.removeFav),1);writeFavs(a);showFavs()}
  });
}

function injectFavStyles(){
  if(document.getElementById('osrah-favs-style'))return;
  const style=document.createElement('style');style.id='osrah-favs-style';style.textContent=`
  .osrah-favs-overlay{position:fixed;inset:0;background:rgba(35,11,23,.45);z-index:10000;display:flex;justify-content:flex-end}
  .osrah-favs-panel{width:min(480px,92vw);height:100%;background:#fff;padding:24px;overflow:auto;box-shadow:-20px 0 50px rgba(0,0,0,.15)}
  .osrah-favs-panel header{display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #eee;padding-bottom:16px}.osrah-favs-panel h2{margin:4px 0;font:500 30px Georgia,serif;color:#4b1028}.osrah-favs-panel header>button{border:0;background:#f5edf1;width:36px;height:36px;border-radius:50%;font-size:22px;cursor:pointer}
  .osrah-favs-list article{display:grid;grid-template-columns:90px 1fr auto;gap:14px;align-items:center;padding:16px 0;border-bottom:1px solid #eee}.osrah-favs-list img{width:90px;height:90px;object-fit:contain;background:#faf7f8;border-radius:10px}.osrah-favs-list h3{margin:4px 0 7px;font-size:15px}.osrah-favs-list article>button{border:0;background:transparent;color:#c93d70;cursor:pointer}.osrah-favs-empty{padding:50px 10px;text-align:center;color:#76666d}
  `;document.head.appendChild(style)
}

document.addEventListener('click',e=>{
  const t=e.target as HTMLElement|null;if(!t)return;
  const headerFav=t.closest('.x-icons button:nth-child(2)');
  if(headerFav){e.preventDefault();e.stopPropagation();showFavs();return}
  const fav=t.closest('.x-grid .fav') as HTMLElement|null;
  if(fav){const p=productFromFavButton(fav);if(!p)return;const a=readFavs();const i=a.findIndex(x=>x.name===p.name);if(i>=0)a.splice(i,1);else a.push(p);writeFavs(a)}
},true);

injectFavStyles();
window.addEventListener('load',applyOsrahFinalFixes);
setTimeout(applyOsrahFinalFixes,100);
setTimeout(applyOsrahFinalFixes,600);
const observer=new MutationObserver(()=>applyOsrahFinalFixes());
observer.observe(document.documentElement,{childList:true,subtree:true});
