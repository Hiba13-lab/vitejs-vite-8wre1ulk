import './cart-premium.css';

type CartItem={name:string;price:number;image:string;category:string;qty:number};
const KEY='osrah_cart_preview';
const read=():CartItem[]=>{try{return JSON.parse(sessionStorage.getItem(KEY)||'[]')}catch{return[]}};
const write=(x:CartItem[])=>sessionStorage.setItem(KEY,JSON.stringify(x));
const money=(n:number)=>`${n.toFixed(2)} DH`;
const parsePrice=(s:string)=>Number((s.replace(/[^0-9.,]/g,'').replace(',','.')))||0;

function productFromArticle(article:Element):Omit<CartItem,'qty'>|null{
 const name=article.querySelector('h3')?.textContent?.trim()||'';
 const image=(article.querySelector('img') as HTMLImageElement|null)?.src||'';
 const category=article.querySelector('small')?.textContent?.trim()||'OSRAH';
 const priceText=article.querySelector('.promo-price span,.info>b,strong')?.textContent||'';
 const price=parsePrice(priceText);
 if(!name||!image||!price)return null;
 return{name,price,image,category};
}
function productFromDetail():Omit<CartItem,'qty'>|null{
 const box=document.querySelector('.x-detail main');if(!box)return null;
 const name=box.querySelector('h1')?.textContent?.trim()||'';
 const image=(box.querySelector('.photo img') as HTMLImageElement|null)?.src||'';
 const category=box.querySelector('small')?.textContent?.trim()||'OSRAH';
 const price=parsePrice(box.querySelector('h2')?.textContent||'');
 return name&&image&&price?{name,price,image,category}:null;
}
function addMirror(p:Omit<CartItem,'qty'>){const items=read();const i=items.findIndex(x=>x.name===p.name);if(i>=0)items[i].qty+=1;else items.push({...p,qty:1});write(items)}
function syncMirrorFromAdd(target:HTMLElement){
 const addBtn=target.closest('.info>button,.perfume-cart,[data-men-add],.x-detail .actions button:first-child') as HTMLElement|null;
 if(!addBtn)return;
 const article=addBtn.closest('article');const p=article?productFromArticle(article):productFromDetail();if(p)addMirror(p);
}
function closeCart(){document.querySelector('.cart-page-wrap')?.remove();document.body.classList.remove('cart-open')}
function renderCart(){
 closeCart();
 const items=read();
 const count=items.reduce((s,p)=>s+p.qty,0);
 const subtotal=items.reduce((s,p)=>s+p.price*p.qty,0);
 const shipping=subtotal>=249||subtotal===0?0:20;
 const total=subtotal+shipping;
 const remaining=Math.max(0,249-subtotal);
 const progress=Math.min(100,(subtotal/249)*100);
 const wrap=document.createElement('div');wrap.className='cart-page-wrap';document.body.classList.add('cart-open');
 wrap.innerHTML=`<section class="cart-page">
   <header class="cart-page-header"><div class="cart-brand"><b>OSRAH</b><small>COSMÉTIQUES</small></div><nav><span>Accueil</span><span>Visage</span><span>Corps</span><span>Cheveux</span><span>Solaire</span><span>Parfums</span><span>Promotions</span></nav><button class="cart-close">×</button></header>
   <div class="cart-services"><span>🚚 <b>Livraison gratuite</b><small>dès 249 DH au Maroc</small></span><span>♧ <b>Produits naturels</b><small>et authentiques</small></span><span>◇ <b>Paiement sécurisé</b><small>Vos données sont protégées</small></span></div>
   <div class="cart-title"><em>Prenez soin de vous<br/>avec Osrah ♡</em><div><h1>Votre panier (${count})</h1><p>Des soins naturels pour une beauté qui vous ressemble</p></div></div>
   <main class="cart-layout"><section class="cart-products-panel"><div class="cart-table-head"><span>Produit</span><span>Prix unitaire</span><span>Quantité</span><span>Total</span></div><div class="cart-product-list">${items.length?items.map((p,i)=>`<article class="cart-product-row"><div class="cart-prod-main"><div class="cart-prod-img"><img src="${p.image}" alt="${p.name}"></div><div><h3>${p.name}</h3><small>${p.category}</small><span class="stock">En stock</span></div></div><b>${money(p.price)}</b><div class="cart-qty"><button data-cart-minus="${i}">−</button><span>${p.qty}</span><button data-cart-plus="${i}">+</button></div><div class="cart-row-total"><b>${money(p.price*p.qty)}</b><button data-cart-remove="${i}">⌫</button></div></article>`).join(''):`<div class="cart-empty"><b>Votre panier est vide</b><span>Ajoutez vos produits OSRAH préférés.</span></div>`}</div><div class="cart-products-foot"><button class="cart-back">← Continuer mes achats</button>${items.length?'<button class="cart-clear">Vider le panier</button>':''}</div></section>
   <aside class="cart-summary-panel"><h2>Résumé de votre commande</h2><p><span>Sous-total (${count} article${count>1?'s':''})</span><b>${money(subtotal)}</b></p><p><span>Livraison</span><b>${shipping?money(shipping):'Gratuite'}</b></p><div class="cart-total"><span>Total TTC</span><b>${money(total)}</b></div><div class="cart-freebox"><strong>🚚 Livraison gratuite dès 249 DH au Maroc</strong><div class="cart-progress"><span style="width:${progress}%"></span></div><small>${remaining===0?'Vous avez droit à la livraison gratuite.':`Plus que ${money(remaining)} pour la livraison gratuite !`}</small></div><div class="cart-code"><input placeholder="Code de réduction"><button>Appliquer</button></div><button class="cart-checkout" ${items.length?'':'disabled'}>🔒 Passer au paiement →</button><div class="cart-trust"><span>♧ Produits de qualité</span><span>◇ Paiement sécurisé</span><span>🚚 Livraison partout au Maroc</span></div></aside></main>
 </section>`;
 document.body.appendChild(wrap);
 wrap.addEventListener('click',e=>{const t=e.target as HTMLElement;if(t===wrap||t.closest('.cart-close')||t.closest('.cart-back')){closeCart();return}if(t.closest('.cart-clear')){write([]);renderCart();return}const rem=t.closest('[data-cart-remove]') as HTMLElement|null;if(rem){const a=read();a.splice(Number(rem.dataset.cartRemove),1);write(a);renderCart();return}const minus=t.closest('[data-cart-minus]') as HTMLElement|null;if(minus){const a=read();const i=Number(minus.dataset.cartMinus);if(a[i]){a[i].qty-=1;if(a[i].qty<=0)a.splice(i,1);write(a);renderCart()}return}const plus=t.closest('[data-cart-plus]') as HTMLElement|null;if(plus){const a=read();const i=Number(plus.dataset.cartPlus);if(a[i]){a[i].qty+=1;write(a);renderCart()}return}if(t.closest('.cart-checkout')){closeCart();const bag=document.querySelector('.x-icons .bag') as HTMLButtonElement|null;if(bag){bag.dataset.cartBypass='1';bag.click();setTimeout(()=>delete bag.dataset.cartBypass,0)}}});
}

document.addEventListener('click',e=>{
 const t=e.target as HTMLElement|null;if(!t)return;
 syncMirrorFromAdd(t);
 const bag=t.closest('.x-icons .bag') as HTMLButtonElement|null;
 if(bag&&!bag.dataset.cartBypass){e.preventDefault();e.stopPropagation();renderCart();}
},true);
