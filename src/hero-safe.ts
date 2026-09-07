const HERO='/osrah-serum-clean.svg';
function applyHero(){const img=document.querySelector<HTMLImageElement>('.x-hero .visual img');if(img&&img.getAttribute('src')!==HERO){img.src=HERO;img.alt='Sérum visage OSRAH'}}
window.addEventListener('load',applyHero);
setTimeout(applyHero,100);
setTimeout(applyHero,500);
setTimeout(applyHero,1200);
