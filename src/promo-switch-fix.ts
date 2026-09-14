const PRODUCTS_API = 'http://localhost:5000/api/products';

async function toggleAdminPromotion(button: HTMLElement) {
  if (button.dataset.busy === '1') return;
  const id = Number(button.dataset.safePromo);
  if (!id) return;
  button.dataset.busy = '1';
  const wasOn = button.classList.contains('on');
  button.classList.toggle('on', !wasOn);
  try {
    const get = await fetch(`${PRODUCTS_API}/${id}`);
    if (!get.ok) throw new Error('GET product failed');
    const product = await get.json();
    const promotion = !wasOn;
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
    button.classList.toggle('on', promotion);
    const row = button.closest<HTMLElement>('[data-product-row]');
    if (row) row.dataset.promo = promotion ? 'yes' : 'no';
    setTimeout(() => location.reload(), 180);
  } catch (error) {
    button.classList.toggle('on', wasOn);
    alert('Impossible d’activer la promotion. Vérifiez que le backend est lancé avec: node server/server.js');
  } finally {
    delete button.dataset.busy;
  }
}

// Dedicated handler registered after the admin script. It prevents older handlers
// from swallowing the switch click and talks directly to the product API.
document.addEventListener('pointerup', (event) => {
  const target = event.target as HTMLElement | null;
  const button = target?.closest('[data-safe-promo]') as HTMLElement | null;
  if (!button || !button.closest('.x-admin')) return;
  event.preventDefault();
  event.stopImmediatePropagation();
  void toggleAdminPromotion(button);
}, true);

export {};
