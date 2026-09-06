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
function closeDrawer(){document.querySelector('.cart-backdrop')?.remove()}
function renderDrawer(){
 closeDrawer();const items=read();const subtotal=items.reduce((s,p)=>s+p.price*p.qty,0);const freeAt=249;const remaining=Math.max(0,freeAt-subtotal);const progress=Math.min(100,(subtotal/freeAt)*100);
 const backdrop=document.createElement('div');backdrop.className='cart-backdrop';
 backdrop.innerHTML=`<aside class="cart-drawer"><div class="cart-drawer-head"><h2>Votre panier (${items.reduce((s,p)=>s+p.qty,0)})</h2><button class="cart-drawer-close">×</button></div><div class="cart-free">${remaining===0?'✓ Vous avez droit à la livraison gratuite.':`Plus que ${money(remaining)} pour profiter de la livraison gratuite.`}</div><div class="cart-progress"><span style="width:${progress}%"></span></div><div class="cart-items">${items.length?items.map((p,i)=>`<article class="cart-item"><div class="cart-item-img"><img src="${p.image}" alt="${p.name}"></div><div class="cart-item-info"><small>${p.category}</small><h3>${p.name}</h3><div class="cart-qty"><button data-cart-minus="${i}">−</button><span>${p.qty}</span><button data-cart-plus="${i}">+</button></div></div><div class="cart-item-side"><button data-cart-remove="${i}">×</button><b>${money(p.price*p.qty)}</b></div></article>`).join(''):`<div class="cart-empty"><b>Votre panier est vide</b><span>Ajoutez vos produits OSRAH préférés.</span></div>`}</div><div class="cart-summary"><div class="cart-summary-row"><span>Total estimé</span><b>${money(subtotal)}</b></div><small>Taxes et expédition calculées au moment du paiement.</small><div class="cart-actions"><button class="cart-view">Continuer mes achats</button><button class="cart-checkout" ${items.length?'':'disabled'}>Vérifier</button></div></div></aside>`;
 document.body.appendChild(backdrop);
 backdrop.addEventListener('click',e=>{const t=e.target as HTMLElement;if(t===backdrop||t.closest('.cart-drawer-close')||t.closest('.cart-view')){closeDrawer();return}const rem=t.closest('[data-cart-remove]') as HTMLElement|null;if(rem){const a=read();a.splice(Number(rem.dataset.cartRemove),1);write(a);renderDrawer();return}const minus=t.closest('[data-cart-minus]') as HTMLElement|null;if(minus){const a=read();const i=Number(minus.dataset.cartMinus);if(a[i]){a[i].qty-=1;if(a[i].qty<=0)a.splice(i,1);write(a);renderDrawer()}return}const plus=t.closest('[data-cart-plus]') as HTMLElement|null;if(plus){const a=read();const i=Number(plus.dataset.cartPlus);if(a[i]){a[i].qty+=1;write(a);renderDrawer()}return}if(t.closest('.cart-checkout')){closeDrawer();const bag=document.querySelector('.x-icons .bag') as HTMLButtonElement|null;if(bag){bag.dataset.cartBypass='1';bag.click();setTimeout(()=>delete bag.dataset.cartBypass,0)}}});
}

document.addEventListener('click',e=>{
 const t=e.target as HTMLElement|null;if(!t)return;
 syncMirrorFromAdd(t);
 const bag=t.closest('.x-icons .bag') as HTMLButtonElement|null;
 if(bag&&!bag.dataset.cartBypass){e.preventDefault();e.stopPropagation();renderDrawer();}
},true);
