function findReactShopHandler():null|(()=>void){
 const admin=document.querySelector('.x-admin') as any;if(!admin)return null;
 const fiberKey=Object.keys(admin).find(k=>k.startsWith('__reactFiber$'));
 let root=fiberKey?admin[fiberKey]:null;
 if(!root)return null;
 const stack=[root];
 while(stack.length){
  const f=stack.pop();if(!f)continue;
  const p=f.memoizedProps;
  if(p&&typeof p.onClick==='function'){
   const txt=typeof p.children==='string'?p.children:'';
   if(txt.includes('Voir espace client'))return ()=>p.onClick();
  }
  if(f.child)stack.push(f.child);
  if(f.sibling)stack.push(f.sibling);
 }
 return null;
}

document.addEventListener('click',e=>{
 const t=e.target as HTMLElement|null;
 const btn=t?.closest('[data-admin-client]');if(!btn)return;
 e.preventDefault();e.stopPropagation();
 const go=findReactShopHandler();
 if(go)go();
 else alert('Impossible d’ouvrir la boutique pour le moment. Rechargez la page et réessayez.');
},true);
