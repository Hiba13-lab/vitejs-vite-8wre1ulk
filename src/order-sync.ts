const ORDERS_API='http://localhost:5000/api/orders';
const CART_KEY='osrah_cart_preview';

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
 const payload={customer:{name:field('fullName')||'Client OSRAH',phone:field('phone'),address:field('address'),city:field('city'),email:'client@osrah.ma'},items:finalItems,payment_method:active,subtotal,shipping,total};
 saving=true;
 try{
  const r=await fetch(ORDERS_API,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
  if(!r.ok)throw new Error('order save failed');
  sessionStorage.removeItem(CART_KEY);
  sessionStorage.setItem('osrah_last_order_saved','1');
  return true;
 }catch(err){
  console.error('Erreur enregistrement commande:',err);
  alert('La commande n’a pas pu être enregistrée. Vérifiez que le backend est lancé.');
  return false;
 }finally{saving=false}
}

document.addEventListener('click',e=>{
 const t=e.target as HTMLElement|null;
 const confirm=t?.closest('.x-pay .confirm') as HTMLButtonElement|null;
 if(!confirm||confirm.disabled)return;
 const box=document.querySelector('.pay-extra-fields');
 const missing=box?Array.from(box.querySelectorAll('input')).some(i=>!(i as HTMLInputElement).value.trim()):false;
 if(missing)return;
 // Save while the payment DOM and cart are still available; React can then switch to confirmation.
 void saveOrder();
},false);
