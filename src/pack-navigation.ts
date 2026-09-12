const PACKS = {
  routine: {
    eyebrow: 'PACK ROUTINE BEAUTÉ',
    title: 'Une peau éclatante au quotidien',
    description: 'Le rituel idéal pour une peau nette, hydratée et lumineuse.',
    badge: '-20%',
    oldPrice: 237,
    price: 190,
    heroImage: 'https://osrahcosmetics.ma/cdn/shop/files/WhatsAppImage2026-01-27at12.32.09.jpg?v=1769610198&width=1248',
    products: ['Brume parfumée','Gel douche Fleur d\'Oranger','Gommage corps sucre rose','Écran solaire SPF 50+'],
    benefits: ['Nettoie en douceur', 'Hydrate et nourrit', 'Révèle l’éclat naturel']
  },
  wellness: {
    eyebrow: 'PACK SOIN & BIEN-ÊTRE',
    title: 'Prenez soin de vous',
    description: 'Un rituel complet pour prendre soin de la peau, des cheveux et du bien-être au quotidien.',
    badge: '-25%',
    oldPrice: 273,
    price: 205,
    heroImage: 'https://osrahcosmetics.ma/cdn/shop/files/4309dcea-8f26-4092-b7fd-a4af762f640e.png?v=1778452571&width=1122',
    products: ['Huile de bronzage','Shampooing Blond Lumière','Gommage corps sucre rose','Savon noir Eucalyptus'],
    benefits: ['Cheveux plus forts et brillants', 'Une peau douce et nourrie', 'Des soins naturels et authentiques']
  }
} as const;

type PackKey = keyof typeof PACKS;

function closePackDetail() {
  document.querySelector('.pack-detail-page')?.remove();
  document.body.classList.remove('pack-page-open');
}

function normalizeName(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase();
}

function addPackToCart(key: PackKey) {
  const pack = PACKS[key];
  const cards = Array.from(document.querySelectorAll<HTMLElement>('.x-grid article'));
  let added = 0;

  pack.products.forEach(name => {
    const wanted = normalizeName(name);
    const card = cards.find(item => normalizeName(item.querySelector('h3')?.textContent || '') === wanted);
    const button = card?.querySelector<HTMLButtonElement>('.info button');
    if (button) {
      button.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
      added += 1;
    }
  });

  const cta = document.querySelector<HTMLButtonElement>('.pack-add-cart');
  if (cta) {
    cta.textContent = added === pack.products.length
      ? `✓ Pack ajouté au panier (${added} produits)`
      : added > 0
        ? `✓ ${added} produit(s) ajouté(s) au panier`
        : 'Impossible d’ajouter le pack — réessayez';
    cta.classList.toggle('added', added > 0);
  }

  if (added > 0) {
    window.setTimeout(() => {
      closePackDetail();
      document.querySelector('.x-icons .bag')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 700);
  }
}

function openPackDetail(key: PackKey) {
  const pack = PACKS[key];
  document.querySelector('.pack-detail-page')?.remove();

  const page = document.createElement('section');
  page.className = 'pack-detail-page';
  page.innerHTML = `
    <header class="pack-detail-header">
      <button class="pack-detail-back" type="button">← Retour à la boutique</button>
      <div class="pack-mini-logo">OSRAH <span>cosmétiques</span></div>
      <span class="pack-secure">Pack exclusif OSRAH</span>
    </header>
    <div class="pack-detail-main">
      <section class="pack-detail-visual">
        <div class="pack-discount">${pack.badge}</div>
        <img class="pack-lifestyle-image" src="${pack.heroImage}" alt="${pack.eyebrow}" />
      </section>
      <section class="pack-detail-copy">
        <span class="pack-detail-eyebrow">${pack.eyebrow}</span>
        <h1>${pack.title}</h1>
        <p>${pack.description}</p>
        <div class="pack-detail-price"><strong>${pack.price} DH</strong><del>${pack.oldPrice} DH</del></div>
        <div class="pack-detail-benefits">
          ${pack.benefits.map(item => `<div>✓ <span>${item}</span></div>`).join('')}
        </div>
        <div class="pack-detail-note">Une sélection OSRAH pensée comme une routine complète.</div>
        <div class="pack-detail-actions">
          <button class="pack-add-cart" type="button">Ajouter le pack au panier — ${pack.price} DH</button>
          <button class="pack-return-cta" type="button">Continuer mes achats →</button>
        </div>
      </section>
    </div>
  `;

  document.body.appendChild(page);
  document.body.classList.add('pack-page-open');
  page.querySelector('.pack-detail-back')?.addEventListener('click', closePackDetail);
  page.querySelector('.pack-return-cta')?.addEventListener('click', closePackDetail);
  page.querySelector('.pack-add-cart')?.addEventListener('click', () => addPackToCart(key));
  window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
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
