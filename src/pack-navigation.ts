const PACKS = {
  routine: {
    eyebrow: 'PACK ROUTINE BEAUTÉ',
    title: 'Une peau éclatante au quotidien',
    description: 'Le rituel idéal pour une peau nette, hydratée et lumineuse.',
    badge: '-20%',
    heroImage: '',
    images: [
      'https://osrahcosmetics.ma/cdn/shop/files/1-20_e3d23aa1-331c-4276-953b-556d8f34d7a7.webp?v=1769432013&width=1946',
      'https://osrahcosmetics.ma/cdn/shop/files/GelDoucheFleurd_Oranger1000ml.webp?v=1769518316&width=1946',
      'https://osrahcosmetics.ma/cdn/shop/files/1-05_f8e2a2a7-eb34-4404-b101-8d659973e4b0.webp?v=1769440772&width=1946',
      'https://osrahcosmetics.ma/cdn/shop/files/ecran_solaire_teinte_spf50_osrah.png?v=1780759520&width=1946'
    ],
    benefits: ['Nettoie en douceur', 'Hydrate et nourrit', 'Révèle l’éclat naturel']
  },
  wellness: {
    eyebrow: 'PACK SOIN & BIEN-ÊTRE',
    title: 'Prenez soin de vous',
    description: 'Un rituel complet pour prendre soin de la peau, des cheveux et du bien-être au quotidien.',
    badge: '-25%',
    heroImage: 'https://osrahcosmetics.ma/cdn/shop/files/4309dcea-8f26-4092-b7fd-a4af762f640e.png?v=1778452571&width=1122',
    images: [],
    benefits: ['Cheveux plus forts et brillants', 'Une peau douce et nourrie', 'Des soins naturels et authentiques']
  }
} as const;

type PackKey = keyof typeof PACKS;

function closePackDetail() {
  document.querySelector('.pack-detail-page')?.remove();
  document.querySelector('.x-promos')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function openPackDetail(key: PackKey) {
  const pack = PACKS[key];
  document.querySelector('.pack-detail-page')?.remove();

  const promos = document.querySelector('.x-promos');
  if (!promos) return;

  const page = document.createElement('section');
  page.className = 'pack-detail-page';
  const visual = pack.heroImage
    ? `<img class="pack-lifestyle-image" src="${pack.heroImage}" alt="${pack.eyebrow}"/>`
    : `<div class="pack-products-collage">${pack.images.map((src, i) => `<img src="${src}" alt="Produit du pack" class="p${i + 1}"/>`).join('')}</div>`;

  page.innerHTML = `
    <button class="pack-detail-close" type="button">✕</button>
    <div class="pack-detail-main">
      <section class="pack-detail-visual">
        <div class="pack-discount">${pack.badge}</div>
        ${visual}
      </section>
      <section class="pack-detail-copy">
        <span class="pack-detail-eyebrow">${pack.eyebrow}</span>
        <h1>${pack.title}</h1>
        <p>${pack.description}</p>
        <div class="pack-detail-benefits">
          ${pack.benefits.map(item => `<div>✓ <span>${item}</span></div>`).join('')}
        </div>
        <div class="pack-detail-note">Une sélection OSRAH pensée comme une routine complète.</div>
        <button class="pack-return-cta" type="button">Continuer mes achats →</button>
      </section>
    </div>
  `;

  promos.insertAdjacentElement('afterend', page);
  page.querySelector('.pack-detail-close')?.addEventListener('click', closePackDetail);
  page.querySelector('.pack-return-cta')?.addEventListener('click', closePackDetail);
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
