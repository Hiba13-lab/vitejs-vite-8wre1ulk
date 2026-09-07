const PROMO_ART='/promo-osrah.svg';
const NEW_ART='/nouveautes-osrah.svg';

function applyCategoryArt(){
 document.querySelectorAll<HTMLButtonElement>('.x-cats button').forEach(btn=>{
  const name=btn.querySelector('b')?.textContent?.trim();
  const img=btn.querySelector('img');
  if(!img)return;
  if(name==='Promotions'&&img.getAttribute('src')!==PROMO_ART)img.src=PROMO_ART;
  if(name==='Nouveautés'&&img.getAttribute('src')!==NEW_ART)img.src=NEW_ART;
 });
 const promoCards=document.querySelectorAll<HTMLButtonElement>('.x-promos > button');
 const newImg=promoCards[0]?.querySelector('img');
 const promoImg=promoCards[1]?.querySelector('img');
 if(newImg&&newImg.getAttribute('src')!==NEW_ART)newImg.src=NEW_ART;
 if(promoImg&&promoImg.getAttribute('src')!==PROMO_ART)promoImg.src=PROMO_ART;
}

window.addEventListener('load',applyCategoryArt);
document.addEventListener('click',()=>setTimeout(applyCategoryArt,80),true);
setTimeout(applyCategoryArt,300);
setTimeout(applyCategoryArt,1000);
