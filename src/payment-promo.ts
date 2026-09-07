const PAY_PROMO_KEY='osrah-admin-promos';
type Promo={price:number;old:number};
function readPayPromos():Record<string,Promo>{try{return JSON.parse(localStorage.getItem(PAY_PROMO_KEY)||'{}')}catch{return{}}}
function setText(el:Element|null,value:string){if(el&&el.textContent!==value)el.textContent=value}
function applyPaymentPromos(){
 const pay=document.querySelector('.x-pay');if(!pay)return;const promos=readPayPromos();let subtotal=0;
 pay.querySelectorAll<HTMLElement>('main>section article').forEach(row=>{
  const name=row.querySelector('h3')?.textContent?.trim()||'';const promo=promos[name];
  const priceEl=row.querySelector('b') as HTMLElement|null;
  let price=Number((priceEl?.textContent||'').replace(/[^0-9.,]/g,'').replace(',','.'))||0;
  if(promo&&priceEl){price=promo.price;const html=`<span style="color:#c72f67">${promo.price.toFixed(2)} DH</span> <del style="font-weight:400;color:#9b7b87;font-size:12px">${promo.old.toFixed(0)} DH</del>`;if(priceEl.innerHTML!==html)priceEl.innerHTML=html}
  subtotal+=price;
 });
 const items=pay.querySelectorAll('main>section article');if(!items.length)return;
 const shipping=subtotal>=300||subtotal===0?0:30;const total=subtotal+shipping;
 const rows=Array.from(pay.querySelectorAll('aside p'));
 setText(rows.find(x=>x.textContent?.includes('Sous-total'))?.querySelector('b')||null,`${subtotal.toFixed(2)} DH`);
 setText(rows.find(x=>x.textContent?.includes('Livraison'))?.querySelector('b')||null,shipping?`${shipping} DH`:'Gratuite');
 setText(pay.querySelector('aside .total b'),`${total.toFixed(2)} DH`);
}
function refreshSoon(){setTimeout(applyPaymentPromos,40)}
window.addEventListener('load',refreshSoon);
window.addEventListener('osrah-promos-changed',refreshSoon);
document.addEventListener('click',refreshSoon);
setTimeout(applyPaymentPromos,300);
setTimeout(applyPaymentPromos,900);
