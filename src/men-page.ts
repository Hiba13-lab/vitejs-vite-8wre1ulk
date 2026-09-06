import './men-page.css';

const MEN_HERO='https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=1800&q=90';
const MEN_PRODUCTS = [
  {name:'Gel cheveux effet mouillé',price:'48.50',image:'https://osrahcosmetics.ma/cdn/shop/files/1-24_6c5cb3ca-733c-458e-845e-b65523785c81.webp?v=1769281684&width=1946',desc:'Fixation et effet mouillé sans résidus.'},
  {name:'Shampoing intense hydratation',price:'45.00',image:'https://osrahcosmetics.ma/cdn/shop/files/5.png?v=1769536753&width=1946',desc:'Nettoie en douceur et hydrate la fibre capillaire.'},
  {name:'Crème cheveux Leave-in',price:'75.00',image:'https://osrahcosmetics.ma/cdn/shop/products/CREMECHEVEUX.jpg?v=1768311382&width=1946',desc:'Nourrit, protège et facilite le coiffage.'},
  {name:'Gel cheveux fixation moyenne',price:'48.50',image:'https://osrahcosmetics.ma/cdn/shop/files/1-04_09aed7de-f163-4a9d-8165-74a227245bad.webp?v=1769281722&width=1946',desc:'Maintien naturel et souple toute la journée.'},
  {name:'Cire cheveux',price:'92.00',image:'https://osrahcosmetics.ma/cdn/shop/files/1-19_739a360c-2e5e-4d93-9b0c-ddb687d07b97.webp?v=1769281062&width=1946',desc:'Texture souple et coiffage longue durée.'},
  {name:'Gel exfoliant visage',price:'75.00',image:'https://osrahcosmetics.ma/cdn/shop/files/1-24_6c5cb3ca-733c-458e-845e-b65523785c81.webp?v=1769281684&width=1946',desc:'Purifie la peau et élimine les impuretés.'}
];

function menPage(){
 const store=document.querySelector('.x-store'); if(!store)return;
 document.querySelector('.tidy-men-page')?.remove();
 const hero=document.querySelector('.x-hero'); const cats=document.querySelector('.x-cats'); const promos=document.querySelector('.x-promos'); const products=document.querySelector('.x-products'); const loyal=document.querySelector('.x-loyal');
 [hero,cats,promos,products,loyal].forEach(el=>el?.classList.add('men-hidden'));
 const page=document.createElement('main'); page.className='tidy-men-page';
 page.innerHTML=`<section class="tidy-hero" style="background-image:linear-gradient(90deg,rgba(0,0,0,.08),rgba(0,0,0,.48) 55%,rgba(0,0,0,.88)),url('${MEN_HERO}')"><div class="tidy-copy"><small>COLLECTION HOMME</small><h1>TIDY MEN</h1><em>L’essentiel du grooming masculin</em><div class="tidy-benefits"><span>♧ <b>Soins adaptés</b></span><span>◇ <b>Performance</b></span><span>♢ <b>Confiance au quotidien</b></span></div></div></section><section class="tidy-products"><div class="tidy-title"><div><small>ACCUEIL / HOMME</small><h2>Tous les produits homme</h2></div><p>Des soins adaptés aux besoins de l’homme moderne.</p></div><div class="tidy-grid">${MEN_PRODUCTS.map((p,i)=>`<article><div class="tidy-img"><img src="${p.image}" alt="${p.name}"></div><h3>${p.name}</h3><p>${p.desc}</p><strong>${p.price} DH</strong><button data-men-add="${i}">🛒 &nbsp; Ajouter au panier</button></article>`).join('')}</div><div class="tidy-services"><span>🚚 <b>Livraison rapide</b><small>Partout au Maroc</small></span><span>♧ <b>Produits authentiques</b><small>Soins Tidy Men</small></span><span>◇ <b>Paiement sécurisé</b><small>100% fiable</small></span></div></section>`;
 const footer=document.querySelector('.x-store footer'); store.insertBefore(page,footer);
 page.scrollIntoView({behavior:'smooth',block:'start'});
 page.querySelectorAll('[data-men-add]').forEach(btn=>btn.addEventListener('click',()=>{
   const n=Number((btn as HTMLElement).dataset.menAdd); const p=MEN_PRODUCTS[n];
   let toast=document.querySelector('.men-toast') as HTMLElement|null; if(!toast){toast=document.createElement('div');toast.className='men-toast';document.body.appendChild(toast)}
   toast.textContent=`✓ ${p.name} ajouté au panier`; toast.classList.add('show'); setTimeout(()=>toast?.classList.remove('show'),2200);
   const badge=document.querySelector('.x-icons .bag b'); if(badge) badge.textContent=String(Number(badge.textContent||0)+1);
 }));
}
function homePage(){document.querySelector('.tidy-men-page')?.remove();document.querySelectorAll('.men-hidden').forEach(el=>el.classList.remove('men-hidden'));window.scrollTo({top:0,behavior:'smooth'});}

function install(){
 const nav=document.querySelector('.x-nav'); if(!nav||nav.querySelector('[data-homme]'))return;
 const promo=Array.from(nav.querySelectorAll('button')).find(b=>b.textContent?.trim()==='Promotions');
 const b=document.createElement('button');b.textContent='Homme';b.dataset.homme='1';b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();nav.querySelectorAll('button').forEach(x=>x.classList.remove('on'));b.classList.add('on');menPage()});
 nav.insertBefore(b,promo||null);
 nav.addEventListener('click',e=>{const t=e.target as HTMLElement;if(t.closest('button')&&!t.closest('[data-homme]'))homePage()});
}
new MutationObserver(install).observe(document.body,{childList:true,subtree:true}); install();
