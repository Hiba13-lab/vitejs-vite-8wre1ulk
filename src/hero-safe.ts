const HERO='https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=1400&q=85';
function applyHero(){const img=document.querySelector<HTMLImageElement>('.x-hero .visual img');if(img&&img.getAttribute('src')!==HERO){img.src=HERO;img.alt='Soins beauté OSRAH'}}
window.addEventListener('load',applyHero);
document.addEventListener('click',()=>setTimeout(applyHero,80),true);
setTimeout(applyHero,150);
setTimeout(applyHero,800);
setTimeout(applyHero,1800);
