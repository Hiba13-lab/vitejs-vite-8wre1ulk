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
  const next=String(total);
  if(badge.textContent!==next)badge.textContent=next;
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
  window.setTimeout(syncCartBadge,0);
}) as EventListener);

// Synchronisation légère sans MutationObserver pour éviter une boucle DOM
// qui pouvait figer la boutique juste après la connexion client.
document.addEventListener('click',()=>window.setTimeout(syncCartBadge,0),true);
window.addEventListener('load',()=>window.setTimeout(syncCartBadge,100));

export {};
