const REAL_SOLAR = "https://osrahcosmetics.ma/cdn/shop/files/huile-bronzage-pailletee-osrah.png?v=1780759691&width=1946";
const REAL_NEW = "https://osrahcosmetics.ma/cdn/shop/files/1-09_220c1547-762f-4587-807d-27152c74edba.webp?v=1769454500&width=1946";
const REAL_PROMO = "https://osrahcosmetics.ma/cdn/shop/files/1-05_f8e2a2a7-eb34-4404-b101-8d659973e4b0.webp?v=1769440772&width=1946";

function fixCategoryImages(){
  document.querySelectorAll<HTMLButtonElement>(".x-cats button").forEach((button)=>{
    const label=button.querySelector("b")?.textContent?.trim();
    const img=button.querySelector<HTMLImageElement>("img");
    if(!img)return;
    if(label==="Solaire" && img.src!==REAL_SOLAR) img.src=REAL_SOLAR;
    if(label==="Nouveautés" && img.src!==REAL_NEW) img.src=REAL_NEW;
    if(label==="Promotions" && img.src!==REAL_PROMO) img.src=REAL_PROMO;
  });
}

window.addEventListener("load",()=>{
  fixCategoryImages();
  window.setTimeout(fixCategoryImages,300);
  window.setTimeout(fixCategoryImages,900);
});
