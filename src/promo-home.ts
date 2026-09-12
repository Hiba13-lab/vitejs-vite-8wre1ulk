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

let applying = false;

function applyHomePromos() {
  if (applying) return;
  const store = document.querySelector(".x-store");
  if (!store) return;

  applying = true;
  document.querySelectorAll<HTMLElement>(".x-products .x-grid article").forEach((card) => {
    const name = card.querySelector<HTMLElement>(".info h3")?.textContent?.trim();
    if (!name) return;
    const oldPrice = HOME_PROMOS[name];
    if (!oldPrice) return;

    if (!card.querySelector(".promo-badge")) {
      const badge = document.createElement("span");
      badge.className = "promo-badge";
      badge.textContent = "PROMO";
      card.prepend(badge);
    }

    const info = card.querySelector<HTMLElement>(".info");
    if (!info || info.querySelector(".promo-price")) return;

    const priceNode = Array.from(info.children).find(
      (el) => el.tagName === "B" && /DH/.test(el.textContent || "")
    ) as HTMLElement | undefined;

    if (priceNode) {
      const currentPrice = priceNode.textContent || "";
      const promo = document.createElement("div");
      promo.className = "promo-price";
      promo.innerHTML = `<span>${currentPrice}</span><del>${oldPrice} DH</del>`;
      priceNode.replaceWith(promo);
    }
  });
  applying = false;
}

applyHomePromos();

const promoObserver = new MutationObserver(() => {
  window.requestAnimationFrame(applyHomePromos);
});

promoObserver.observe(document.body, { childList: true, subtree: true });
