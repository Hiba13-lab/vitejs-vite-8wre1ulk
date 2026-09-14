function paymentAside(){return document.querySelector<HTMLElement>('.x-pay main aside')}

function applyPaymentDemo(){
  const aside=paymentAside();
  if(!aside)return;

  Array.from(aside.querySelectorAll<HTMLButtonElement>('button')).forEach(btn=>{
    if(btn.textContent?.trim()==='PayPal')btn.remove();
  });

  const cardButton=Array.from(aside.querySelectorAll<HTMLButtonElement>('button')).find(btn=>btn.textContent?.trim()==='Carte bancaire');
  if(!cardButton)return;

  let form=aside.querySelector<HTMLElement>('.demo-card-form');
  const cardSelected=cardButton.classList.contains('active');

  if(cardSelected&&!form){
    form=document.createElement('div');
    form.className='demo-card-form';
    form.innerHTML=`
      <div class="demo-card-note">Démonstration uniquement — aucune donnée bancaire n’est enregistrée.</div>
      <label>Nom sur la carte<input type="text" placeholder="HIBA HAMDAOUI" autocomplete="off"></label>
      <label class="full">Numéro de carte<input type="text" inputmode="numeric" placeholder="0000 0000 0000 0000" maxlength="19" autocomplete="off"></label>
      <div class="demo-card-row">
        <label>Date d’expiration<input type="text" inputmode="numeric" placeholder="MM/AA" maxlength="5" autocomplete="off"></label>
        <label>CVV<input type="password" inputmode="numeric" placeholder="•••" maxlength="3" autocomplete="off"></label>
      </div>`;
    cardButton.insertAdjacentElement('afterend',form);
  }
  if(form)form.style.display=cardSelected?'grid':'none';
}

document.addEventListener('click',()=>setTimeout(applyPaymentDemo,30),true);
window.addEventListener('load',()=>{setTimeout(applyPaymentDemo,120);setTimeout(applyPaymentDemo,500)});
setInterval(applyPaymentDemo,1200);

export {};
