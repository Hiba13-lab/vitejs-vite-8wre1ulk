const PAY_PROMO_KEY='osrah-admin-promos';
type Promo={price:number;old:number};
function readPayPromos():Record<string,Promo>{try{return JSON.parse(localStorage.getItem(PAY_PROMO_KEY)||'{}')}catch{return{}}}
function applyPaymentPromos(){
 const pay=document.querySelector('.x-pay');if(!pay)return;const promos=readPayPromos();let subtotal=0;
 pay.querySelectorAll<HTMLElement>('main>section article').forEach(row=>{
  const name=row.querySelector('h3')?.textContent?.trim()||'';const promo=promos[name];
  const priceEl=row.querySelector('b') as HTMLElement|null;
  let price=Number((priceEl?.textContent||'').replace(/[^0-9.,]/g,'').replace(',','.'))||0;
  if(promo&&priceEl){price=promo.price;priceEl.innerHTML=`<span style="color:#c72f67">${promo.price.toFixed(2)} DH</span> <del style="font-weight:400;color:#9b7b87;font-size:12px">${promo.old.toFixed(0)} DH</del>`}
  subtotal+=price;
 });
 if(!pay.querySelector('main>section article'))return;
 const shipping=subtotal>=300||subtotal===0?0:30;const total=subtotal+shipping;
 const rows=Array.from(pay.querySelectorAll('aside p'));
 const sub=rows.find(x=>x.textContent?.includes('Sous-total'))?.querySelector('b');if(sub)sub.textContent=`${subtotal.toFixed(2)} DH`;
 const ship=rows.find(x=>x.textContent?.includes('Livraison'))?.querySelector('b');if(ship)ship.textContent=shipping?`${shipping} DH`:'Gratuite';
 const tot=pay.querySelector('aside .total b');if(tot)tot.textContent=`${total.toFixed(2)} DH`;
}
new MutationObserver(()=>applyPaymentPromos()).observe(document.body,{childList:true,subtree:true});window.addEventListener('load',applyPaymentPromos);setTimeout(applyPaymentPromos,300);
