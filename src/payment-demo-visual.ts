import './payment-demo-visual.css';

function applyPaymentVisual(){
  const aside=document.querySelector<HTMLElement>('.x-pay main aside');
  if(!aside)return;

  Array.from(aside.querySelectorAll<HTMLButtonElement>('button')).forEach(btn=>{
    if(btn.textContent?.trim()==='PayPal')btn.remove();
  });

  const cardButton=Array.from(aside.querySelectorAll<HTMLButtonElement>('button')).find(btn=>btn.textContent?.trim()==='Carte bancaire');
  if(!cardButton)return;

  let demo=aside.querySelector<HTMLElement>('.payment-demo-visual');
  if(!demo){
    demo=document.createElement('div');
    demo.className='payment-demo-visual';
    demo.innerHTML=`
      <div class="payment-demo-note">Démonstration visuelle uniquement — aucune donnée bancaire enregistrée</div>
      <label>Nom sur la carte<input disabled placeholder="NOM PRÉNOM"></label>
      <label>Numéro de carte<input disabled placeholder="0000 0000 0000 0000"></label>
      <div class="payment-demo-row">
        <label>Date d’expiration<input disabled placeholder="MM/AA"></label>
        <label>CVV<input disabled placeholder="•••"></label>
      </div>`;
    cardButton.insertAdjacentElement('afterend',demo);
  }

  demo.style.display=cardButton.classList.contains('active')?'grid':'none';
}

document.addEventListener('click',()=>setTimeout(applyPaymentVisual,20),true);
window.addEventListener('load',()=>{setTimeout(applyPaymentVisual,120);setTimeout(applyPaymentVisual,500)});
setInterval(applyPaymentVisual,1200);

export {};
