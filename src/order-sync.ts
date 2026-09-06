const ORDERS_API='http://localhost:5000/api/orders';
const CART_KEY='osrah_cart_preview';

function num(text:string){return Number((text||'').replace(/[^0-9.,]/g,'').replace(',','.'))||0}
function readCart(){try{return JSON.parse(sessionStorage.getItem(CART_KEY)||'[]')}catch{return[]}}
function field(name:string){return (document.querySelector(`[data-pay-field="${name}"]`) as HTMLInputElement|null)?.value?.trim()||''}

async function saveOrder(){
 const pay=document.querySelector('.x-pay'); if(!pay)return;
 const items=readCart(); if(!items.length)return;
 const active=document.querySelector('.x-pay aside>button.active')?.textContent?.trim()||'Carte bancaire';
 const rows=Array.from(document.querySelectorAll('.x-pay aside p'));
 const subtotal=num(rows.find(x=>x.textContent?.includes('Sous-total'))?.textContent||'');
 const shippingText=rows.find(x=>x.textContent?.includes('Livraison'))?.textContent||'';
 const shipping=shippingText.toLowerCase().includes('gratuite')?0:num(shippingText);
 const total=num(document.querySelector('.x-pay aside .total')?.textContent||'');
 const payload={
  customer:{name:field('fullName')||'Client OSRAH',phone:field('phone'),address:field('address'),city:field('city'),email:'client@osrah.ma'},
  items:items.map((p:any)=>({name:p.name,price:Number(p.price||0),qty:Number(p.qty||1),image:p.image||'',category:p.category||''})),
  payment_method:active,subtotal,shipping,total
 };
 try{const r=await fetch(ORDERS_API,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});if(r.ok){sessionStorage.removeItem(CART_KEY);sessionStorage.setItem('osrah_last_order_saved','1')}}catch{}
}

document.addEventListener('click',e=>{
 const t=e.target as HTMLElement|null;
 if(!t?.closest('.x-pay .confirm'))return;
 setTimeout(()=>{if(document.querySelector('.x-confirm'))saveOrder()},30);
});
