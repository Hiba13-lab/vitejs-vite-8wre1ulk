const HERO='/osrah-hero.jpg';

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
