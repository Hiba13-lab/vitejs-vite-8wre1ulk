import './payment-extra.css';

function field(name:string,label:string,placeholder:string,type='text',extra=''){
 return `<label>${label}<input data-pay-field="${name}" type="${type}" placeholder="${placeholder}" ${extra}></label>`;
}

function deliveryFields(){
 return `<h4>Informations de livraison</h4>${field('fullName','Nom complet','Votre nom complet')}${field('phone','Numéro de téléphone','06 XX XX XX XX','tel')}${field('address','Adresse','Quartier, rue, numéro...')}${field('city','Ville','Votre ville')}`;
}

function renderExtra(){
 const aside=document.querySelector('.x-pay aside') as HTMLElement|null;
 if(!aside)return;

 const buttons=Array.from(aside.querySelectorAll(':scope > button')) as HTMLButtonElement[];
 const paypal=buttons.find(b=>b.textContent?.trim()==='PayPal');
 if(paypal)paypal.remove();

 const active=Array.from(aside.querySelectorAll(':scope > button.active'))[0] as HTMLButtonElement|undefined;
 const method=active?.textContent?.trim()||'Carte bancaire';
 const existing=aside.querySelector('.pay-extra-fields') as HTMLElement|null;
 if(existing?.dataset.method===method)return;
 if(existing)existing.remove();

 const confirm=aside.querySelector('.confirm');
 if(!confirm)return;
 const box=document.createElement('div');
 box.className='pay-extra-fields';
 box.dataset.method=method;

 if(method==='Paiement à la livraison'){
  box.innerHTML=`${deliveryFields()}<div class="pay-extra-error">Veuillez remplir toutes les informations de livraison.</div>`;
  (confirm as HTMLButtonElement).textContent='CONFIRMER LA COMMANDE';
 }else{
  box.innerHTML=`${deliveryFields()}<h4>Informations de la carte</h4>${field('cardName','Nom sur la carte','Nom et prénom')}${field('cardNumber','Numéro de carte','1234 5678 9012 3456','text','inputmode="numeric" maxlength="19"')}<div class="pay-extra-row">${field('expiry','Date d’expiration','MM/AA','text','maxlength="5"')}${field('cvv','CVV','123','password','inputmode="numeric" maxlength="4"')}</div><div class="pay-extra-note">Paiement de démonstration uniquement — aucune transaction réelle n’est effectuée.</div><div class="pay-extra-error">Veuillez remplir les informations de livraison et de carte.</div>`;
  (confirm as HTMLButtonElement).textContent='CONFIRMER LE PAIEMENT';
 }
 confirm.before(box);
}

function validateBeforeConfirm(e:Event){
 const target=e.target as HTMLElement|null;
 const confirm=target?.closest('.x-pay aside .confirm') as HTMLButtonElement|null;
 if(!confirm)return;
 const box=document.querySelector('.pay-extra-fields') as HTMLElement|null;
 if(!box)return;
 const inputs=Array.from(box.querySelectorAll('input')) as HTMLInputElement[];
 const missing=inputs.some(i=>!i.value.trim());
 const error=box.querySelector('.pay-extra-error');
 if(missing){e.preventDefault();e.stopPropagation();error?.classList.add('show');inputs.find(i=>!i.value.trim())?.focus();}
 else error?.classList.remove('show');
}

document.addEventListener('click',e=>{
 const t=e.target as HTMLElement|null;
 const method=t?.closest('.x-pay aside > button:not(.confirm)') as HTMLButtonElement|null;
 if(method)setTimeout(renderExtra,0);
 validateBeforeConfirm(e);
},true);

const observer=new MutationObserver(()=>renderExtra());
observer.observe(document.body,{childList:true,subtree:true});
window.addEventListener('load',renderExtra);
setTimeout(renderExtra,300);
