type PackCartDetail={name:string;title:string;price:number;oldPrice:number;image:string;products:string[]};
type CartItem={name:string;price:number;image:string;category:string;qty:number};

const KEY='osrah_cart_preview';

function readCart():CartItem[]{
  try{return JSON.parse(sessionStorage.getItem(KEY)||'[]')}catch{return[]}
}

function writeCart(items:CartItem[]){
  sessionStorage.setItem(KEY,JSON.stringify(items));
}

function syncCartBadge(){
  const badge=document.querySelector<HTMLElement>('.x-icons .bag b');
  if(!badge)return;
  const total=readCart().reduce((sum,item)=>sum+(Number(item.qty)||0),0);
  badge.textContent=String(total);
}

window.addEventListener('osrah:add-pack',((event:Event)=>{
  const detail=(event as CustomEvent<PackCartDetail>).detail;
  if(!detail)return;

  const items=readCart();
  const name=`${detail.name} — ${detail.title}`;
  const index=items.findIndex(item=>item.name===name);
  if(index>=0)items[index].qty+=1;
  else items.push({name,price:detail.price,image:detail.image,category:'Pack OSRAH',qty:1});
  writeCart(items);
  syncCartBadge();
}) as EventListener);

// Le panier premium utilise sessionStorage : on garde le badge de l'en-tête aligné
// avec le nombre réel d'articles (produits + packs).
document.addEventListener('click',()=>window.setTimeout(syncCartBadge,0),true);
const badgeObserver=new MutationObserver(()=>syncCartBadge());
badgeObserver.observe(document.body,{childList:true,subtree:true});
window.addEventListener('load',syncCartBadge);
window.setTimeout(syncCartBadge,250);

export {};
