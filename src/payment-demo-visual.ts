import './payment-demo-visual.css';

function applyPaymentVisual(){
  const aside=document.querySelector<HTMLElement>('.x-pay main aside');
  if(!aside)return;

  Array.from(aside.querySelectorAll<HTMLButtonElement>('button')).forEach(btn=>{
    if(btn.textContent?.trim()==='PayPal')btn.remove();
  });

  const buttons=Array.from(aside.querySelectorAll<HTMLButtonElement>('button'));
  const cardButton=buttons.find(btn=>btn.textContent?.trim()==='Carte bancaire');
  const deliveryButton=buttons.find(btn=>btn.textContent?.trim()==='Paiement à la livraison');
  if(!cardButton||!deliveryButton)return;

  let cardForm=aside.querySelector<HTMLElement>('.payment-demo-visual.card-fields');
  if(!cardForm){
    cardForm=document.createElement('div');
    cardForm.className='payment-demo-visual card-fields';
    cardForm.innerHTML=`
      <div class="payment-demo-note">Démonstration uniquement — aucune transaction réelle</div>
      <label>Nom sur la carte<input type="text" placeholder="Nom et prénom" autocomplete="off"></label>
      <label>Numéro de carte<input type="text" inputmode="numeric" placeholder="0000 0000 0000 0000" maxlength="19" autocomplete="off"></label>
      <div class="payment-demo-row">
        <label>Date d’expiration<input type="text" inputmode="numeric" placeholder="MM/AA" maxlength="5" autocomplete="off"></label>
        <label>CVV<input type="password" inputmode="numeric" placeholder="123" maxlength="4" autocomplete="off"></label>
      </div>`;
    cardButton.insertAdjacentElement('afterend',cardForm);
  }

  let deliveryForm=aside.querySelector<HTMLElement>('.payment-demo-visual.delivery-fields');
  if(!deliveryForm){
    deliveryForm=document.createElement('div');
    deliveryForm.className='payment-demo-visual delivery-fields';
    deliveryForm.innerHTML=`
      <div class="payment-demo-note delivery-note">Informations de livraison</div>
      <label>Nom complet<input type="text" placeholder="Votre nom complet" autocomplete="off"></label>
      <label>Numéro de téléphone<input type="tel" placeholder="06 XX XX XX XX" autocomplete="off"></label>
      <label>Adresse de livraison<input type="text" placeholder="Quartier, rue, numéro..." autocomplete="off"></label>
      <label>Ville<input type="text" placeholder="Votre ville" autocomplete="off"></label>`;
    deliveryButton.insertAdjacentElement('afterend',deliveryForm);
  }

  cardForm.style.display=cardButton.classList.contains('active')?'grid':'none';
  deliveryForm.style.display=deliveryButton.classList.contains('active')?'grid':'none';

  const confirm=aside.querySelector<HTMLButtonElement>('.confirm');
  if(confirm){
    confirm.textContent=deliveryButton.classList.contains('active')?'CONFIRMER LA COMMANDE':'CONFIRMER LE PAIEMENT';
  }
}

document.addEventListener('click',()=>setTimeout(applyPaymentVisual,20),true);
window.addEventListener('load',()=>{setTimeout(applyPaymentVisual,120);setTimeout(applyPaymentVisual,500)});
setInterval(applyPaymentVisual,1200);

export {};
