const HERO='https://osrahcosmetics.ma/cdn/shop/files/WhatsAppImage2026-01-27at12.32.09.jpg?v=1769610198&width=1600';

function applyHero(){
  const img=document.querySelector<HTMLImageElement>('.x-hero .visual img');
  if(img&&img.getAttribute('src')!==HERO){
    img.src=HERO;
    img.alt='Univers beauté OSRAH';
  }
}

window.addEventListener('load',applyHero);
setTimeout(applyHero,150);
setTimeout(applyHero,700);
