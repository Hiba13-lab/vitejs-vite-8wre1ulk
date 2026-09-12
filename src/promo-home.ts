const HOME_PROMOS: Record<string, number> = {
  "Brume parfumée": 69,
  "Gel douche Fleur d'Oranger": 55,
  "Gommage corps sucre rose": 49,
  "Savon noir Eucalyptus": 39,
  "Huile de bronzage": 79,
  "Écran solaire SPF 50+": 129,
  "Masques Terre d'Arômes": 59,
  "Masque Blond Lumière": 160,
  "Shampooing Couleur Magnétique": 140,
  "Lotion micellaire": 72,
};

function markPromoCards() {
  document.querySelectorAll<HTMLElement>(".x-products .x-grid article").forEach((card) => {
    const name = card.querySelector<HTMLElement>(".info h3")?.textContent?.trim();
    if (!name) return;

    const oldPrice = HOME_PROMOS[name];
    if (!oldPrice) {
      card.classList.remove("home-promo-card");
      card.removeAttribute("data-old-price");
      return;
    }

    card.classList.add("home-promo-card");
    card.dataset.oldPrice = `${oldPrice} DH`;
  });
}

markPromoCards();

let scheduled = false;
const promoObserver = new MutationObserver(() => {
  if (scheduled) return;
  scheduled = true;
  window.requestAnimationFrame(() => {
    scheduled = false;
    markPromoCards();
  });
});

promoObserver.observe(document.body, { childList: true, subtree: true });
