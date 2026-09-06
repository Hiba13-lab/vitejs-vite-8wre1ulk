const PACKS = {
  routine: {
    eyebrow: 'PACK ROUTINE BEAUTÉ',
    title: 'Une peau éclatante au quotidien',
    description: 'Le rituel idéal pour une peau nette, hydratée et lumineuse.',
    badge: '-20%',
    heroImage: 'https://osrahcosmetics.ma/cdn/shop/files/WhatsAppImage2026-01-27at12.32.09.jpg?v=1769610198&width=1248',
    products: ['Brume parfumée','Gel douche Fleur d\'Oranger','Gommage corps sucre rose','Écran solaire SPF 50+'],
    benefits: ['Nettoie en douceur', 'Hydrate et nourrit', 'Révèle l’éclat naturel']
  },
  wellness: {
    eyebrow: 'PACK SOIN & BIEN-ÊTRE',
    title: 'Prenez soin de vous',
    description: 'Un rituel complet pour prendre soin de la peau, des cheveux et du bien-être au quotidien.',
    badge: '-25%',
    heroImage: 'https://osrahcosmetics.ma/cdn/shop/files/4309dcea-8f26-4092-b7fd-a4af762f640e.png?v=1778452571&width=1122',
    products: ['Huile de bronzage','Shampooing Blond Lumière','Gommage corps sucre rose','Savon noir Eucalyptus'],
    benefits: ['Cheveux plus forts et brillants', 'Une peau douce et nourrie', 'Des soins naturels et authentiques']
  }
} as const;

type PackKey = keyof typeof PACKS;

function closePackDetail() {
  document.querySelector('.pack-detail-page')?.remove();
  document.querySelector('.x-promos')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function addPackToCart(key: PackKey) {
  const pack = PACKS[key];
  const cards = Array.from(document.querySelectorAll<HTMLElement>('.x-grid article'));
  let added = 0;

  pack.products.forEach(name => {
    const wanted = name.toLocaleLowerCase('fr');
    const card = cards.find(item => (item.querySelector('h3')?.textContent || '').trim().toLocaleLowerCase('fr') === wanted);
    const button = card?.querySelector<HTMLButtonElement>('.info > button');
    if (button) {
      button.click();
      added += 1;
    }
  });

  const cta = document.querySelector<HTMLButtonElement>('.pack-add-cart');
  if (cta) {
    cta.textContent = added ? `✓ Pack ajouté au panier (${added} produits)` : 'Ajouter le pack au panier';
    cta.classList.toggle('added', added > 0);
  }
}

function openPackDetail(key: PackKey) {
  const pack = PACKS[key];
  document.querySelector('.pack-detail-page')?.remove();

  const promos = document.querySelector('.x-promos');
  if (!promos) return;

  const page = document.createElement('section');
  page.className = 'pack-detail-page';
  page.innerHTML = `
    <button class="pack-detail-close" type="button">✕</button>
    <div class="pack-detail-main">
      <section class="pack-detail-visual">
        <div class="pack-discount">${pack.badge}</div>
        <img class="pack-lifestyle-image" src="${pack.heroImage}" alt="${pack.eyebrow}" />
      </section>
      <section class="pack-detail-copy">
        <span class="pack-detail-eyebrow">${pack.eyebrow}</span>
        <h1>${pack.title}</h1>
        <p>${pack.description}</p>
        <div class="pack-detail-benefits">
          ${pack.benefits.map(item => `<div>✓ <span>${item}</span></div>`).join('')}
        </div>
        <div class="pack-detail-note">Une sélection OSRAH pensée comme une routine complète.</div>
        <div class="pack-detail-actions">
          <button class="pack-add-cart" type="button">Ajouter le pack au panier</button>
          <button class="pack-return-cta" type="button">Continuer mes achats →</button>
        </div>
      </section>
    </div>
  `;

  promos.insertAdjacentElement('afterend', page);
  page.querySelector('.pack-detail-close')?.addEventListener('click', closePackDetail);
  page.querySelector('.pack-return-cta')?.addEventListener('click', closePackDetail);
  page.querySelector('.pack-add-cart')?.addEventListener('click', () => addPackToCart(key));
  window.setTimeout(() => page.scrollIntoView({ behavior: 'smooth', block: 'start' }), 20);
}

document.addEventListener('click', event => {
  const target = event.target as HTMLElement | null;
  const promo = target?.closest('.x-promos > button');
  if (!promo) return;

  const buttons = Array.from(document.querySelectorAll('.x-promos > button'));
  const index = buttons.indexOf(promo);
  if (index !== 0 && index !== 1) return;

  event.preventDefault();
  event.stopPropagation();
  openPackDetail(index === 0 ? 'routine' : 'wellness');
}, true);
