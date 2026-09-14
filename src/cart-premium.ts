import './cart-premium.css';

type CartItem={name:string;price:number;image:string;category:string;qty:number};
const KEY='osrah_cart_preview';
const read=():CartItem[]=>{try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch{return[]}};
const write=(x:CartItem[])=>{localStorage.setItem(KEY,JSON.stringify(x));syncBadge()};
const money=(n:number)=>`${n.toFixed(2)} DH`;
const parsePrice=(s:string)=>Number((s.replace(/[^0-9.,]/g,'').replace(',','.')))||0;

function syncBadge(){
 const badge=document.querySelector<HTMLElement>('.x-icons .bag b');
 if(!badge)return;
 badge.textContent=String(read().reduce((s,p)=>s+p.qty,0));
}
function fromArticle(article:Element):Omit<CartItem,'qty'>|null{
 const name=article.querySelector('h3')?.textContent?.trim()||'';
 const image=(article.querySelector('img') as HTMLImageElement|null)?.src||'';
 const category=article.querySelector('small')?.textContent?.trim()||'OSRAH';
 const price=parsePrice(article.querySelector('.promo-price span,.info>b')?.textContent||'');
 return name&&image&&price?{name,price,image,category}:null;
}
function fromDetail():Omit<CartItem,'qty'>|null{
 const box=document.querySelector('.x-detail main');if(!box)return null;
 const name=box.querySelector('h1')?.textContent?.trim()||'';
 const image=(box.querySelector('.photo img') as HTMLImageElement|null)?.src||'';
 const category=box.querySelector('small')?.textContent?.trim()||'OSRAH';
 const price=parsePrice(box.querySelector('h2')?.textContent||'');
 return name&&image&&price?{name,price,image,category}:null;
}
function addItem(p:Omit<CartItem,'qty'>){const a=read();const i=a.findIndex(x=>x.name===p.name);if(i>=0)a[i].qty+=1;else a.push({...p,qty:1});write(a)}
function closeCart(){document.querySelector('.cart-page-wrap')?.remove();document.body.classList.remove('cart-open')}
function renderCart(){
 closeCart();const items=read();const count=items.reduce((s,p)=>s+p.qty,0);const subtotal=items.reduce((s,p)=>s+p.price*p.qty,0);const shipping=subtotal>=249||subtotal===0?0:20;const total=subtotal+shipping;
 const wrap=document.createElement('div');wrap.className='cart-page-wrap';document.body.classList.add('cart-open');
 wrap.innerHTML=`<section class="cart-page"><header class="cart-page-header"><div class="cart-brand"><b>OSRAH</b><small>COSMÉTIQUES</small></div><nav><button class="cart-home">Accueil</button></nav><button class="cart-close">×</button></header><div class="cart-title"><div><small>VOTRE SÉLECTION OSRAH</small><h1>Mon panier <sup>${count}</sup></h1><p>Retrouvez ici tous les produits ajoutés à votre panier.</p></div></div><main class="cart-layout"><section class="cart-products-panel"><div class="cart-product-list">${items.length?items.map((p,i)=>`<article class="cart-product-row"><div class="cart-prod-main"><div class="cart-prod-img"><img src="${p.image}" alt="${p.name}"></div><div><small>${p.category}</small><h3>${p.name}</h3><span class="stock">● En stock</span></div></div><b>${money(p.price)}</b><div class="cart-qty"><button data-cart-minus="${i}">−</button><span>${p.qty}</span><button data-cart-plus="${i}">+</button></div><div class="cart-row-total"><b>${money(p.price*p.qty)}</b><button data-cart-remove="${i}">×</button></div></article>`).join(''):`<div class="cart-empty"><b>Votre panier est vide</b><span>Ajoutez un produit depuis la boutique.</span></div>`}</div><div class="cart-products-foot"><button class="cart-back">← Continuer mes achats</button>${items.length?'<button class="cart-clear">Vider le panier</button>':''}</div></section><aside class="cart-summary-panel"><span class="summary-kicker">VOTRE COMMANDE</span><h2>Résumé</h2><p><span>Sous-total</span><b>${money(subtotal)}</b></p><p><span>Livraison</span><b>${shipping?money(shipping):'Gratuite'}</b></p><div class="cart-total"><span>Total TTC</span><b>${money(total)}</b></div><button class="cart-checkout" ${items.length?'':'disabled'}>Passer au paiement →</button></aside></main></section>`;
 document.body.appendChild(wrap);
 wrap.addEventListener('click',e=>{const t=e.target as HTMLElement;if(t===wrap||t.closest('.cart-close')||t.closest('.cart-back')||t.closest('.cart-home')){closeCart();return}if(t.closest('.cart-clear')){write([]);renderCart();return}const rem=t.closest('[data-cart-remove]') as HTMLElement|null;if(rem){const a=read();a.splice(Number(rem.dataset.cartRemove),1);write(a);renderCart();return}const minus=t.closest('[data-cart-minus]') as HTMLElement|null;if(minus){const a=read(),i=Number(minus.dataset.cartMinus);if(a[i]){a[i].qty--;if(a[i].qty<=0)a.splice(i,1);write(a);renderCart()}return}const plus=t.closest('[data-cart-plus]') as HTMLElement|null;if(plus){const a=read(),i=Number(plus.dataset.cartPlus);if(a[i]){a[i].qty++;write(a);renderCart()}return}if(t.closest('.cart-checkout')){closeCart();const bag=document.querySelector('.x-icons .bag') as HTMLButtonElement|null;if(bag){bag.dataset.cartBypass='1';bag.click();setTimeout(()=>delete bag.dataset.cartBypass,0)}}});
}

document.addEventListener('click',e=>{
 const t=e.target as HTMLElement|null;if(!t)return;
 const add=t.closest('.x-grid .info>button,.x-detail .actions button:first-child') as HTMLElement|null;
 if(add){const article=add.closest('article');const p=article?fromArticle(article):fromDetail();if(p){addItem(p);setTimeout(syncBadge,0)}}
 const buy=t.closest('.x-detail .actions button:nth-child(2)') as HTMLElement|null;
 if(buy){const p=fromDetail();if(p)addItem(p)}
 const bag=t.closest('.x-icons .bag') as HTMLButtonElement|null;
 if(bag&&!bag.dataset.cartBypass){e.preventDefault();e.stopPropagation();renderCart()}
},true);

window.addEventListener('load',()=>setTimeout(syncBadge,150));
setTimeout(syncBadge,500);
