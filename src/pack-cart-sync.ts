type PackCartDetail={name:string;title:string;price:number;oldPrice:number;image:string;products:string[]};
type CartItem={name:string;price:number;image:string;category:string;qty:number};

const KEY='osrah_cart_preview';

function readCart():CartItem[]{
  try{return JSON.parse(sessionStorage.getItem(KEY)||'[]')}catch{return[]}
}

function writeCart(items:CartItem[]){
  sessionStorage.setItem(KEY,JSON.stringify(items));
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
}) as EventListener);

export {};
