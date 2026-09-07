const ORDERS_API='http://localhost:5000/api/orders';
const CART_KEY='osrah_cart_preview';
const LOCAL_ORDERS_KEY='osrah_client_orders';

function num(text:string){return Number((text||'').replace(/[^0-9.,]/g,'').replace(',','.'))||0}
function readMirrorCart(){try{return JSON.parse(sessionStorage.getItem(CART_KEY)||'[]')}catch{return[]}}
function field(name:string){return (document.querySelector(`[data-pay-field="${name}"]`) as HTMLInputElement|null)?.value?.trim()||''}
function payItems(){
 const rows=Array.from(document.querySelectorAll('.x-pay main>section article'));
 return rows.map(row=>{
  const name=row.querySelector('h3')?.textContent?.trim()||'';
  const category=row.querySelector('small')?.textContent?.trim()||'';
  const price=num(row.querySelector('b')?.textContent||'');
  const image=(row.querySelector('img') as HTMLImageElement|null)?.src||'';
  return {name,category,price,image,qty:1};
 }).filter(p=>p.name&&p.price);
}
function readLocalOrders(){try{return JSON.parse(localStorage.getItem(LOCAL_ORDERS_KEY)||'[]')}catch{return[]}}
function writeLocalOrders(orders:any[]){localStorage.setItem(LOCAL_ORDERS_KEY,JSON.stringify(orders))}

let saving=false;
async function saveOrder(){
 if(saving)return false;
 const pay=document.querySelector('.x-pay');if(!pay)return false;
 const items=payItems();
 const fallback=readMirrorCart();
 const finalItems=items.length?items:fallback.map((p:any)=>({name:p.name,price:Number(p.price||0),qty:Number(p.qty||1),image:p.image||'',category:p.category||''}));
 if(!finalItems.length)return false;
 const active=document.querySelector('.x-pay aside>button.active')?.textContent?.trim()||'Carte bancaire';
 const rows=Array.from(document.querySelectorAll('.x-pay aside p'));
 const subtotal=num(rows.find(x=>x.textContent?.includes('Sous-total'))?.textContent||'');
 const shippingText=rows.find(x=>x.textContent?.includes('Livraison'))?.textContent||'';
 const shipping=shippingText.toLowerCase().includes('gratuite')?0:num(shippingText);
 const total=num(document.querySelector('.x-pay aside .total')?.textContent||'')||subtotal+shipping;
 const clientKey=`LOCAL-${Date.now()}`;
 const localOrder={
  id:Date.now(),
  reference:clientKey,
  client_key:clientKey,
  customer:{name:field('fullName')||'Client OSRAH',phone:field('phone'),address:field('address'),city:field('city'),email:'client@osrah.ma'},
  items:finalItems,
  payment_method:active,
  subtotal,shipping,total,
  status:'Nouvelle',
  created_at:new Date().toISOString(),
  local_only:true
 };
 saving=true;
 try{
  const localOrders=readLocalOrders();
  localOrders.unshift(localOrder);
  writeLocalOrders(localOrders);
  sessionStorage.removeItem(CART_KEY);
  sessionStorage.setItem('osrah_last_order_saved','1');
  // Backend sync is best-effort. The admin always sees the local copy immediately.
  fetch(ORDERS_API,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...localOrder,id:undefined,reference:undefined})})
   .then(async r=>{if(!r.ok)return;const data=await r.json();const orders=readLocalOrders();const i=orders.findIndex((o:any)=>o.client_key===clientKey);if(i>=0){orders[i]={...orders[i],...(data.order||{}),client_key:clientKey,local_only:false};writeLocalOrders(orders)}})
   .catch(()=>{});
  return true;
 }finally{saving=false}
}

// Capture phase: save before React replaces the payment page with confirmation.
document.addEventListener('click',e=>{
 const t=e.target as HTMLElement|null;
 const confirm=t?.closest('.x-pay .confirm') as HTMLButtonElement|null;
 if(!confirm||confirm.disabled)return;
 const box=document.querySelector('.pay-extra-fields');
 const missing=box?Array.from(box.querySelectorAll('input')).some(i=>!(i as HTMLInputElement).value.trim()):false;
 if(missing)return;
 void saveOrder();
},true);
