import './perfume-page.css';

type Perfume={name:string;price:string;image:string;category:string};
const HERO='https://osrahcosmetics.ma/cdn/shop/files/69ff4d88-a340-4379-b528-b7f3d5e398fe.png?v=1780763528&width=1254';
const MUSC='https://osrahcosmetics.ma/cdn/shop/files/45.webp?v=1769541018&width=1946';
const OUD='data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABIMDRANCxIQDhAUExIVGywdGxgYGzYnKSAsQDlEQz85Pj1HUGZXR0thTT0+WXlaYWltcnNyRVV9hnxvhWZwcm7/2wBDARMUFBsXGzQdHTRuST5Jbm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm7/wAARCACPAIwDASIAAhEBAxEB/8QAGwABAQACAwEAAAAAAAAAAAAAAAYDBQIEBwH/xAA0EAACAQMCAwUGBAcAAAAAAAAAAQIDBBEFIQYSMSJBcZGxExUlMmGBNXKh8CMzUVJi0eH/xAAZAQEBAQEBAQAAAAAAAAAAAAAAAQIDBAX/xAAcEQEBAQACAwEAAAAAAAAAAAAAAQIDQRESMSH/2gAMAwEAAhEDEQA/ALAAEaAAAAAAAAAAAAAAAAAAAPqk0tmfAAAAAAAAAAMN1cK2oOq482GljODMa/W5uNjiKbcprp5gde31v213Gl7DlU58ikp5/Q3BEWMnR1SnOSf81ZLcJAABQAAAAAAAAAAAAAAAAjeLr64o6rGlSrzhBU0+WLwslkRXEVr7x1idSjVSjGKi3jPQCele3Pbmrirlbp87PSNErTr6PaVaknKcqabk+rZ5tVtJQlOHOms46F/wtdU6+j0aUH26C5JLO/iDxW4AAAAAAAAAAAAAAAAAAHT1a5drp1aqnhpYX3I20uVyPml/Ek99io4maWkyy9uZEdCUO001k48mrn49PDjOp+uFei6lebjJYcs9DvcOVp2WsU4uWYVOzJGODhHZyj5nO1nT96W6U45513nHPJq6d98ePVegA9j54AAAAAAAAAAAAAAADTcV7aLP8yIeMYypyUm08P0LnitZ0Sol/ciLjc1EmnBbrvT/AH3hKwUqcfb55tmZLFfHbX869TnSuJRq83Iv2j7bTlV161k44xJepUelgAjQAAAAAAAAAAAAAAADUcU/gtTxRH28U0+dzT+mSx4o/BK32I+hVm1mLbx/iv8AZBmUKaks1Jrcw20Wtdt852l3+J2k5KMcZ6deX/pitJc2uUG9sPfYqPQX1AAUAAAAAAAAAAAAAAABqOKM+5KuOuUQ1Ock8beRd8SrOjVfFepB04yc0+VtPvwTsdt1ZKMdo+Q0+cnqtPOPmj0X1FSlPC7EvI5WEHHUKOVh869S1HogACgAAAAAAAAAAAAAAANbxAs6TVX1RDxoxWe04vP9C519fCa329SGdSMJfMZt8N5zL2yOOcJ1H5My2axe0sb9tHWdzBd7M1lVUryjjdua9Se1vTV45J9eiAA25AAAAAAAAAAAAAAAAOM4RqQlCcVKMlhp95pLjhKwrScoTrUs90ZJr9TegCaXBVrnMruu/BJGwsOHbCwqxq04TqVI7qVSWcfbobUAAAAAAAAAAAB//9k=';
const VANILLA='https://osrahcosmetics.ma/cdn/shop/files/1-20_e3d23aa1-331c-4276-953b-556d8f34d7a7.webp?v=1769432013&width=1946';
const EAU_PARFUM='https://osrahcosmetics.ma/cdn/shop/products/prod02_70918b81-223f-43ff-ac3f-f3767301cd88.jpg?v=1768311319&width=1946';
const COLOGNE='https://osrahcosmetics.ma/cdn/shop/files/1-20_bdb9ffcd-3827-4234-82d0-e202492e5948.webp?v=1769274653&width=1946';
const DIFFUSEUR='https://osrahcosmetics.ma/cdn/shop/products/prod02_70918b81-223f-43ff-ac3f-f3767301cd88.jpg?v=1768311319&width=1946';
const BOUGIE_VANILLE='https://osrahcosmetics.ma/cdn/shop/files/56_2.webp?v=1769540944&width=1946';
const BOUGIE_MUSC='https://osrahcosmetics.ma/cdn/shop/files/9.png?v=1769540070&width=1946';

const PERFUMES:Perfume[]=[
 {name:'Brume parfumée Musc de Nuit',price:'69',image:MUSC,category:'Corps et Cheveux · 200ml'},
 {name:'Brume parfumée Oud Oriental',price:'69',image:OUD,category:'Corps et Cheveux · 200ml'},
 {name:'Brume parfumée Vanille Tropicale',price:'69',image:VANILLA,category:'Corps et Cheveux · 200ml'},
 {name:"TERRE D’ARÔMES - Eau de parfum",price:'350',image:EAU_PARFUM,category:'Eau de parfum · 50ml'},
 {name:'Eau de Cologne Citron',price:'50',image:COLOGNE,category:'Eau de Cologne · 1000ml'},
 {name:'Diffuseur de Parfum Musc Ellil',price:'169',image:DIFFUSEUR,category:'Diffuseur ambiance'},
 {name:'Bougie parfumée Vanille',price:'119',image:BOUGIE_VANILLE,category:'Bougie parfumée'},
 {name:'Bougie parfumée Musc de nuit',price:'119',image:BOUGIE_MUSC,category:'Bougie parfumée'}
];
const FAV_KEY='osrah_favorites';
const readFav=():any[]=>{try{return JSON.parse(localStorage.getItem(FAV_KEY)||'[]')}catch{return[]}};
const writeFav=(x:any[])=>localStorage.setItem(FAV_KEY,JSON.stringify(x));
const norm=(s:string)=>s.trim().toLowerCase();
let opening=false;

function toast(msg:string){let t=document.querySelector('.perfume-toast') as HTMLElement|null;if(!t){t=document.createElement('div');t.className='perfume-toast';document.body.appendChild(t)}t.textContent=msg;t.classList.add('show');setTimeout(()=>t?.classList.remove('show'),2000)}
function closePerfume(){document.querySelector('.perfume-page')?.remove();document.querySelectorAll('.perfume-hidden').forEach(el=>el.classList.remove('perfume-hidden'));}
function renderPerfume(){
 if(opening||document.querySelector('.perfume-page'))return; opening=true;
 try{
  const store=document.querySelector('.x-store');if(!store)return;
  document.querySelector('.tidy-men-page')?.remove();document.querySelector('.favorites-page')?.remove();
  document.querySelectorAll('.men-hidden,.favorites-hidden').forEach(el=>{el.classList.remove('men-hidden');el.classList.remove('favorites-hidden')});
  ['.x-hero','.x-cats','.x-promos','.x-products','.x-loyal'].forEach(s=>document.querySelector(s)?.classList.add('perfume-hidden'));
  const favs=readFav(); const page=document.createElement('main');page.className='perfume-page';
  page.innerHTML=`<section class="perfume-hero"><div class="perfume-copy"><small>COLLECTION</small><h1>TERRE D’ARÔMES</h1><em>Des parfums qui racontent votre histoire</em><p>Laissez-vous emporter par des senteurs uniques qui éveillent les sens.</p></div><div class="perfume-visual"><img src="${HERO}" alt="Collection parfums Terre d'Arômes"></div></section><section class="perfume-products"><div class="perfume-title"><div><small>ACCUEIL / PARFUMS</small><h2>Tous nos parfums</h2></div><p>Des senteurs uniques pour chaque moment de votre vie.</p></div><div class="perfume-grid">${PERFUMES.map((p,i)=>{const saved=favs.some(f=>norm(f.name)===norm(p.name));return `<article data-perfume-card="${i}"><button class="perfume-heart ${saved?'saved':''}" data-perfume-fav="${i}">${saved?'♥':'♡'}</button><div class="perfume-img"><img src="${p.image}" alt="${p.name}"></div><h3>${p.name}</h3><small>${p.category}</small><strong>${p.price} DH</strong><button class="perfume-cart" data-perfume-cart="${i}">Ajouter au panier</button></article>`}).join('')}</div><div class="perfume-services"><span>🚚 <b>Livraison rapide</b><small>Partout au Maroc</small></span><span>▣ <b>Paiement sécurisé</b><small>100% fiable</small></span><span>♧ <b>Produits authentiques</b><small>Qualité garantie</small></span><span>🎧 <b>Service client</b><small>À votre écoute</small></span></div></section>`;
  const footer=document.querySelector('.x-store footer');store.insertBefore(page,footer);page.scrollIntoView({behavior:'smooth',block:'start'});
  page.querySelectorAll('[data-perfume-cart]').forEach(btn=>btn.addEventListener('click',()=>{const p=PERFUMES[Number((btn as HTMLElement).dataset.perfumeCart)];const badge=document.querySelector('.x-icons .bag b');if(badge)badge.textContent=String(Number(badge.textContent||0)+1);toast(`✓ ${p.name} ajouté au panier`)}));
  page.querySelectorAll('[data-perfume-fav]').forEach(btn=>btn.addEventListener('click',()=>{const el=btn as HTMLElement;const p=PERFUMES[Number(el.dataset.perfumeFav)];const favs=readFav();const idx=favs.findIndex(f=>norm(f.name)===norm(p.name));let saved=false;if(idx>=0)favs.splice(idx,1);else{favs.push({name:p.name,image:p.image,price:`${p.price} DH`,brand:'TERRE D’ARÔMES'});saved=true}writeFav(favs);el.classList.toggle('saved',saved);el.textContent=saved?'♥':'♡';const headerFav=document.querySelector('.x-icons button:nth-child(2) small');if(headerFav)headerFav.textContent=`Favoris (${favs.length})`}));
 }finally{opening=false}
}

document.addEventListener('click',e=>{const t=e.target as HTMLElement|null;const btn=t?.closest('.x-nav button');if(!btn)return;const label=btn.textContent?.trim();if(label==='Parfums'){e.preventDefault();e.stopPropagation();document.querySelectorAll('.x-nav button').forEach(b=>b.classList.remove('on'));btn.classList.add('on');renderPerfume()}else{closePerfume()}},true);
