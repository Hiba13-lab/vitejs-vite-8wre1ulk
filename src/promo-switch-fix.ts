const PRODUCTS_API = 'http://localhost:5000/api/products';

async function toggleAdminPromotion(button: HTMLElement) {
  if (button.dataset.busy === '1') return;
  const id = Number(button.dataset.safePromo);
  if (!id) return;

  button.dataset.busy = '1';
  const wasOn = button.classList.contains('on');
  const promotion = !wasOn;
  button.classList.toggle('on', promotion);

  try {
    const get = await fetch(`${PRODUCTS_API}/${id}`);
    if (!get.ok) throw new Error('GET product failed');
    const product = await get.json();

    const response = await fetch(`${PRODUCTS_API}/${id}`, {
      method: 'PUT',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
        ...product,
        promotion,
        discount_percent: promotion ? (Number(product.discount_percent) || 10) : (Number(product.discount_percent) || 0),
        active: product.active !== false
      })
    });
    if (!response.ok) throw new Error('PUT product failed');

    const row = button.closest<HTMLElement>('[data-product-row]');
    if (row) row.dataset.promo = promotion ? 'yes' : 'no';

    const promoControl = button.closest('.promo-control');
    if (promoControl) {
      let badge = promoControl.querySelector<HTMLButtonElement>('.promo-percent');
      if (promotion && !badge) {
        badge = document.createElement('button');
        badge.type = 'button';
        badge.className = 'promo-percent';
        badge.dataset.safeDiscount = String(id);
        badge.textContent = `-${Number(product.discount_percent) || 10}%`;
        promoControl.appendChild(badge);
      }
      if (!promotion && badge) badge.remove();
    }

    const promoKpi = Array.from(document.querySelectorAll<HTMLElement>('.admin-product-kpis .admin-kpi'))[3];
    const promoNumber = promoKpi?.querySelector('b');
    if (promoNumber) {
      const current = Number(promoNumber.textContent || '0');
      promoNumber.textContent = String(Math.max(0, current + (promotion ? 1 : -1)));
    }
  } catch {
    button.classList.toggle('on', wasOn);
    alert('Impossible d’activer la promotion. Vérifiez que le backend est lancé avec: node server/server.js');
  } finally {
    delete button.dataset.busy;
  }
}

// Loaded before admin-safe.ts. Capture the click first so the older admin handler
// cannot toggle the same product a second time.
document.addEventListener('click', (event) => {
  const target = event.target as HTMLElement | null;
  const button = target?.closest('[data-safe-promo]') as HTMLElement | null;
  if (!button || !button.closest('.x-admin')) return;
  event.preventDefault();
  event.stopImmediatePropagation();
  void toggleAdminPromotion(button);
}, true);

export {};
