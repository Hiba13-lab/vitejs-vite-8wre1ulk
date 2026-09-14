function applyOsrahFinalFixes(){
  const hero=document.querySelector<HTMLImageElement>('.x-hero .visual img');
  if(hero){
    hero.src='/osrah-hero.jpg';
    hero.alt='OSRAH Cosmétiques';
  }

  const categoryButtons=Array.from(document.querySelectorAll<HTMLButtonElement>('.x-cats button'));
  const promoButton=categoryButtons.find(btn=>btn.textContent?.trim()==='Promotions');
  const promoImage=promoButton?.querySelector<HTMLImageElement>('img');
  if(promoImage){
    promoImage.src='/promo-osrah.svg';
    promoImage.alt='Promotions OSRAH';
  }
}

window.addEventListener('load',applyOsrahFinalFixes);
setTimeout(applyOsrahFinalFixes,100);
setTimeout(applyOsrahFinalFixes,500);

const observer=new MutationObserver(()=>applyOsrahFinalFixes());
observer.observe(document.documentElement,{childList:true,subtree:true});
