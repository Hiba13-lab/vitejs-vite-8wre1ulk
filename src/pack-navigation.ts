const PACKS = {
  routine: {
    eyebrow: 'PACK ROUTINE BEAUTÉ',
    title: 'Une peau éclatante au quotidien',
    description: 'Le rituel idéal pour une peau nette, hydratée et lumineuse.',
    badge: '-20%',
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
    description: 'Un rituel complet pour les cheveux, la peau et le bien-être au naturel.',
    badge: '-25%',
    images: [
      'https://osrahcosmetics.ma/cdn/shop/files/huile-bronzage-pailletee-osrah.png?v=1780759691&width=1946',
      'https://osrahcosmetics.ma/cdn/shop/files/1-10_d0a1dd97-a339-415a-bf3f-1a555c52d7c1.webp?v=1769279715&width=1946',
      'https://osrahcosmetics.ma/cdn/shop/files/1-05_f8e2a2a7-eb34-4404-b101-8d659973e4b0.webp?v=1769440772&width=1946',
      'https://osrahcosmetics.ma/cdn/shop/files/1-20_03d27d7c-53c6-4fe8-8a4e-ef19a78db909.webp?v=1769275507&width=1946'
    ],
    benefits: ['Cheveux plus forts et brillants', 'Une peau douce et nourrie', 'Des soins naturels et authentiques']
  }
} as const;

type PackKey = keyof typeof PACKS;

function closePackPage() {
  document.querySelector('.pack-detail-page')?.remove();
  const store = document.querySelector<HTMLElement>('.x-store');
  if (store) store.style.display = '';
  window.history.pushState({}, '', window.location.pathname + window.location.search);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function openPackPage(key: PackKey) {
  const pack = PACKS[key];
  document.querySelector('.pack-detail-page')?.remove();
  const store = document.querySelector<HTMLElement>('.x-store');
  if (store) store.style.display = 'none';

  const page = document.createElement('div');
  page.className = 'pack-detail-page';
  page.innerHTML = `
    <header class="pack-detail-header">
      <button class="pack-back">← Retour à la boutique</button>
      <div class="pack-detail-logo">OSRAH <small>cosmétiques</small></div>
      <span>Beauté naturelle, confiance réelle</span>
    </header>
    <main class="pack-detail-main">
      <section class="pack-detail-visual">
        <div class="pack-discount">${pack.badge}</div>
        <div class="pack-products-collage">
          ${pack.images.map((src, i) => `<img src="${src}" alt="Produit du pack" class="p${i + 1}"/>`).join('')}
        </div>
      </section>
      <section class="pack-detail-copy">
        <span class="pack-detail-eyebrow">${pack.eyebrow}</span>
        <h1>${pack.title}</h1>
        <p>${pack.description}</p>
        <div class="pack-detail-benefits">
          ${pack.benefits.map(item => `<div>✓ <span>${item}</span></div>`).join('')}
        </div>
        <div class="pack-detail-note">Une sélection OSRAH pensée comme une routine complète.</div>
        <button class="pack-back pack-return-cta">Continuer mes achats →</button>
      </section>
    </main>
  `;
  document.body.appendChild(page);
  page.querySelectorAll('.pack-back').forEach(btn => btn.addEventListener('click', closePackPage));
  window.history.pushState({ pack: key }, '', `#pack-${key}`);
  window.scrollTo(0, 0);
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
  event.stopImmediatePropagation();
  openPackPage(index === 0 ? 'routine' : 'wellness');
}, true);

window.addEventListener('popstate', () => {
  if (!location.hash.startsWith('#pack-')) closePackPage();
});
