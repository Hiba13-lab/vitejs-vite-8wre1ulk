function hideButtonByText(selector:string,label:string){
  document.querySelectorAll<HTMLElement>(selector).forEach(el=>{
    if(el.textContent?.trim()===label)el.style.display='none';
  });
}

function applyOsrahFinalFixes(){
  const hero=document.querySelector<HTMLImageElement>('.x-hero .visual img');
  if(hero){
    hero.src='/ChatGPT%20Image%2014%20sept.%202026,%2013_11_27.png?v=1';
    hero.alt='OSRAH Cosmétiques';
    hero.style.objectFit='cover';
    hero.style.objectPosition='center';
  }

  hideButtonByText('.x-nav button','Nouveautés');
  hideButtonByText('.x-nav button','Nos marques');
  hideButtonByText('.x-cats button','Nouveautés');
  hideButtonByText('.x-cats button','Nos marques');

  const categoryButtons=Array.from(document.querySelectorAll<HTMLButtonElement>('.x-cats button'));
  const promoButton=categoryButtons.find(btn=>btn.textContent?.trim()==='Promotions');
  const promoImage=promoButton?.querySelector<HTMLImageElement>('img');
  if(promoImage){
    promoImage.src='/promo-osrah.svg?v=2';
    promoImage.alt='Promotions OSRAH';
  }
}

window.addEventListener('load',()=>setTimeout(applyOsrahFinalFixes,80));
setTimeout(applyOsrahFinalFixes,300);
document.addEventListener('click',()=>setTimeout(applyOsrahFinalFixes,50));
export {};
