const REAL_SOLAR = "https://osrahcosmetics.ma/cdn/shop/files/huile-bronzage-pailletee-osrah.png?v=1780759691&width=1946";
const REAL_NEW = "https://osrahcosmetics.ma/cdn/shop/files/1-09_220c1547-762f-4587-807d-27152c74edba.webp?v=1769454500&width=1946";
const REAL_PROMO = "https://osrahcosmetics.ma/cdn/shop/files/1-05_f8e2a2a7-eb34-4404-b101-8d659973e4b0.webp?v=1769440772&width=1946";

function fixCategoryImages(){
  document.querySelectorAll<HTMLButtonElement>(".x-cats button").forEach((button)=>{
    const label=button.querySelector("b")?.textContent?.trim();
    const img=button.querySelector<HTMLImageElement>("img");
    if(!img)return;
    if(label==="Solaire") img.src=REAL_SOLAR;
    if(label==="Nouveautés") img.src=REAL_NEW;
    if(label==="Promotions") img.src=REAL_PROMO;
  });
}

function polishLogin(){
  const login=document.querySelector<HTMLElement>(".x-login");
  if(!login)return;
  const card=login.querySelector<HTMLElement>(".x-login-card");
  if(!card)return;
  const title=card.querySelector("h1");
  if(title) title.textContent="Se connecter";
  const subtitle=card.querySelector("p");
  if(subtitle) subtitle.textContent="Accédez à votre espace OSRAH";
  card.querySelectorAll("label").forEach((label)=>label.classList.add("login-field-label"));
  const form=card.querySelector("form");
  if(form && !form.querySelector(".login-extra")){
    const extra=document.createElement("div");
    extra.className="login-extra";
    extra.innerHTML='<label class="remember"><input type="checkbox"/> <span>Se souvenir de moi</span></label><button type="button" class="forgot">Mot de passe oublié ?</button>';
    const submit=form.querySelector("button[type=submit], button:not([type])");
    if(submit) form.insertBefore(extra,submit);
    const divider=document.createElement("div");
    divider.className="login-divider";
    divider.textContent="ou";
    const create=document.createElement("button");
    create.type="button";
    create.className="create-account";
    create.textContent="Créer un compte";
    form.append(divider,create);
  }
}

function applyFixes(){
  fixCategoryImages();
  polishLogin();
}

applyFixes();
const observer=new MutationObserver(applyFixes);
observer.observe(document.body,{childList:true,subtree:true});
